"use client";
/* eslint-disable no-nested-ternary */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import Header from "@/components/layout/header/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getPartnerLeadPipelineStatuses,
  updatePartnerLeadPipelineStatuses,
  type PartnerLeadPipelineStatus,
} from "@/lib/api/partnership/dashboardPartnership";
import { cn } from "@/lib/utils";

const colorPreviewClass: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  red: "bg-red-100 text-red-700 border-red-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

const defaultColorByValue: Record<string, string> = {
  "New Leads": "blue",
  Contacted: "purple",
  Won: "green",
  Lost: "red",
};

type PipelineStatusRow = PartnerLeadPipelineStatus & {
  isNew?: boolean;
};

const getDefaultStatusColor = (labelOrValue: string) =>
  defaultColorByValue[labelOrValue.trim()] || "slate";

const createEmptyDraft = (
  existingStatuses: PipelineStatusRow[],
): PipelineStatusRow => {
  let nextNumber = existingStatuses.length + 1;
  let nextValue = `Custom Status ${nextNumber}`;
  const existingValues = new Set(
    existingStatuses.map((status) => status.value),
  );

  while (existingValues.has(nextValue)) {
    nextNumber += 1;
    nextValue = `Custom Status ${nextNumber}`;
  }

  return {
    value: nextValue,
    label: nextValue,
    color: getDefaultStatusColor(nextValue),
    isActive: true,
    sortOrder:
      Math.max(
        0,
        ...existingStatuses.map((status) => Number(status.sortOrder || 0)),
      ) + 1,
    isSystem: false,
    isNew: true,
  };
};

const normalizeOrders = (items: PipelineStatusRow[]) =>
  items.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

export const PartnerRecruitmentPipelineStatusContent = () => {
  const [statuses, setStatuses] = useState<PipelineStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<PipelineStatusRow | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Debounce ref so rapid drag-drops don't fire concurrent saves
  const reorderSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadStatuses = async () => {
      try {
        const response = await getPartnerLeadPipelineStatuses({
          includeInactive: true,
        });
        if (!mounted) return;
        const loadedStatuses = normalizeOrders(response.data.data || []);
        setStatuses(loadedStatuses);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load pipeline statuses",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadStatuses();

    return () => {
      mounted = false;
    };
  }, []);

  // ── Core persist helper ────────────────────────────────────────────
  const persistStatuses = useCallback(
    async (
      nextStatuses: PipelineStatusRow[],
      opts: { silent?: boolean } = {},
    ) => {
      const payload = normalizeOrders(nextStatuses);

      // Validate before sending
      if (payload.some((s) => !s.value || !s.label)) {
        toast.error("Status name is required.");
        return false;
      }
      if (payload.filter((s) => s.isActive).length === 0) {
        toast.error("At least one pipeline status must remain active.");
        return false;
      }

      try {
        const response = await updatePartnerLeadPipelineStatuses(
          payload.map(({ isNew: _isNew, ...status }) => status),
        );
        const savedStatuses = normalizeOrders(response.data.data || []);
        setStatuses(savedStatuses);
        if (!opts.silent) toast.success("Pipeline statuses saved.");
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to save pipeline statuses",
        );
        return false;
      }
    },
    [],
  );

  const activeCount = useMemo(
    () => statuses.filter((status) => status.isActive).length,
    [statuses],
  );

  const openAddDialog = () => {
    setEditingIndex(null);
    setDraft(createEmptyDraft(statuses));
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setDraft({ ...statuses[index] });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingIndex(null);
    setDraft(null);
  };

  // ── Dialog confirm — applies AND immediately saves ────────────────
  const handleApplyDialog = async () => {
    if (!draft) return;

    const normalizedDraft = {
      ...draft,
      label: draft.label.trim(),
      value:
        draft.isNew && editingIndex === null
          ? draft.label.trim()
          : draft.value.trim(),
      color:
        draft.isNew && editingIndex === null
          ? getDefaultStatusColor(draft.label)
          : draft.color || getDefaultStatusColor(draft.value),
    };

    if (!normalizedDraft.value || !normalizedDraft.label) {
      toast.error("Status name is required.");
      return;
    }

    const duplicateIndex = statuses.findIndex(
      (status, index) =>
        status.label.trim().toLowerCase() ===
          normalizedDraft.label.toLowerCase() && index !== editingIndex,
    );

    if (duplicateIndex >= 0) {
      toast.error("Pipeline status name must be unique.");
      return;
    }

    const nextStatuses =
      editingIndex === null
        ? normalizeOrders([...statuses, normalizedDraft])
        : normalizeOrders(
            statuses.map((status, index) =>
              index === editingIndex ? normalizedDraft : status,
            ),
          );

    // Close dialog immediately (optimistic), then save
    closeDialog();
    setStatuses(nextStatuses);

    setDialogSaving(true);
    await persistStatuses(nextStatuses);
    setDialogSaving(false);
  };

  const handleDiscardUnsaved = (index: number) => {
    setStatuses((current) =>
      normalizeOrders(
        current.filter((_, statusIndex) => statusIndex !== index),
      ),
    );
  };

  // ── Drag reorder — auto-saves with a short debounce ───────────────
  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const next = statuses.slice();
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, moved);
    const nextStatuses = normalizeOrders(next);

    setStatuses(nextStatuses);
    setDraggedIndex(null);

    // Debounce: if the user drags multiple rows quickly, only save once
    if (reorderSaveTimer.current) clearTimeout(reorderSaveTimer.current);
    reorderSaveTimer.current = setTimeout(() => {
      setSaving(true);
      persistStatuses(nextStatuses, { silent: true })
        .then(() => toast.success("Order saved."))
        .finally(() => setSaving(false));
    }, 600);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <Header
        title="Pipeline Status"
        label="Partner Recruitment System / Master Data"
        breadcrumbItems={[
          {
            label: "Partner Recruitment System",
            href: "/partner-recruitment-system",
          },
          { label: "Master" },
          { label: "Pipeline Status" },
        ]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Lead Pipeline Master
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Manage shared pipeline statuses
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              The list below is the selectable pipeline source for back-office
              and partner portal. Changes are saved automatically.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={openAddDialog}
              disabled={saving || loading || dialogSaving}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Pipeline Status
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading pipeline statuses...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[72px] pl-6">Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">State</TableHead>
                <TableHead className="w-[140px] text-right pr-5">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statuses.map((status, index) => (
                <TableRow
                  key={`${status.value}-${index}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={cn(
                    "transition-colors",
                    draggedIndex === index && "bg-slate-50 opacity-60",
                  )}
                >
                  <TableCell>
                    <button
                      type="button"
                      className="inline-flex ml-5 cursor-grab items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-600 active:cursor-grabbing"
                      aria-label={`Drag ${status.label}`}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                          colorPreviewClass[status.color] ||
                            colorPreviewClass.slate,
                        )}
                      >
                        {status.label || status.value}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        status.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {status.isActive ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(index)}
                        disabled={saving || dialogSaving}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {saving && (
          <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving order…
          </div>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingIndex === null
                ? "Add Pipeline Status"
                : "Edit Pipeline Status"}
            </DialogTitle>
            <DialogDescription>
              Set the status name and whether it can be selected for new lead
              updates. Changes are saved immediately.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status Name
                </label>
                <Input
                  value={draft.label}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            label: event.target.value,
                            value:
                              current.isNew && editingIndex === null
                                ? event.target.value
                                : current.value,
                            color:
                              current.isNew && editingIndex === null
                                ? getDefaultStatusColor(event.target.value)
                                : current.color,
                          }
                        : current,
                    )
                  }
                  placeholder="e.g. Negotiation"
                  disabled={dialogSaving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  State
                </label>
                <select
                  value={draft.isActive ? "enabled" : "disabled"}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            isActive: event.target.value === "enabled",
                          }
                        : current,
                    )
                  }
                  disabled={dialogSaving}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-60"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Preview
                </p>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                    colorPreviewClass[draft.color] || colorPreviewClass.slate,
                  )}
                >
                  {draft.label || draft.value || "Pipeline Status"}
                </span>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={dialogSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApplyDialog}
              disabled={dialogSaving}
            >
              {dialogSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingIndex === null ? (
                "Add & Save"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerRecruitmentPipelineStatusContent;
