"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { GripVertical, Loader2, Pencil, Plus } from "lucide-react";

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
  getPartnerVerticalMarkets,
  updatePartnerVerticalMarkets,
  type PartnerVerticalMarket,
} from "@/lib/api/partnership/dashboardPartnership";
import { cn } from "@/lib/utils";

type VerticalMarketRow = PartnerVerticalMarket & { isNew?: boolean };

const normalizeOrders = (items: VerticalMarketRow[]) =>
  items.map((item, index) => ({ ...item, sortOrder: index + 1 }));

const createDraft = (existing: VerticalMarketRow[]): VerticalMarketRow => {
  let next = existing.length + 1;
  let name = `Custom Market ${next}`;
  const names = new Set(existing.map((item) => item.name.toLowerCase()));
  while (names.has(name.toLowerCase())) {
    next += 1;
    name = `Custom Market ${next}`;
  }
  return {
    name,
    sortOrder: existing.length + 1,
    isActive: true,
    isSystem: false,
    isNew: true,
  };
};

export const PartnerRecruitmentVerticalMarketContent = () => {
  const [markets, setMarkets] = useState<VerticalMarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<VerticalMarketRow | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const reorderSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await getPartnerVerticalMarkets({ includeInactive: true });
        if (mounted) setMarkets(normalizeOrders(response.data.data || []));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load vertical markets");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const activeCount = useMemo(
    () => markets.filter((market) => market.isActive).length,
    [markets],
  );

  const persistMarkets = useCallback(
    async (nextMarkets: VerticalMarketRow[], opts: { silent?: boolean } = {}) => {
      const payload = normalizeOrders(nextMarkets);
      if (payload.some((market) => !market.name.trim())) {
        toast.error("Vertical market name is required.");
        return false;
      }
      const names = payload.map((market) => market.name.trim().toLowerCase());
      if (new Set(names).size !== names.length) {
        toast.error("Vertical market name must be unique.");
        return false;
      }
      if (payload.filter((market) => market.isActive).length === 0) {
        toast.error("At least one vertical market must remain active.");
        return false;
      }

      try {
        const response = await updatePartnerVerticalMarkets(
          payload.map(({ isNew: _isNew, ...market }) => market),
        );
        setMarkets(normalizeOrders(response.data.data || []));
        if (!opts.silent) toast.success("Vertical markets saved.");
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to save vertical markets.");
        return false;
      }
    },
    [],
  );

  const openAddDialog = () => {
    setEditingIndex(null);
    setDraft(createDraft(markets));
    setDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setDraft({ ...markets[index] });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingIndex(null);
    setDraft(null);
  };

  const handleApplyDialog = async () => {
    if (!draft) return;
    const normalizedDraft = { ...draft, name: draft.name.trim() };
    const nextMarkets =
      editingIndex === null
        ? normalizeOrders([...markets, normalizedDraft])
        : normalizeOrders(
            markets.map((market, index) =>
              index === editingIndex ? normalizedDraft : market,
            ),
          );

    closeDialog();
    setMarkets(nextMarkets);
    setDialogSaving(true);
    await persistMarkets(nextMarkets);
    setDialogSaving(false);
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const next = markets.slice();
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(targetIndex, 0, moved);
    const nextMarkets = normalizeOrders(next);
    setMarkets(nextMarkets);
    setDraggedIndex(null);

    if (reorderSaveTimer.current) clearTimeout(reorderSaveTimer.current);
    reorderSaveTimer.current = setTimeout(() => {
      setSaving(true);
      persistMarkets(nextMarkets, { silent: true })
        .then(() => toast.success("Order saved."))
        .finally(() => setSaving(false));
    }, 600);
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <Header
        title="Vertical Market"
        label="Partner Recruitment System / Master Data"
        breadcrumbs={[
          { label: "Partner Recruitment System", href: "/partner-recruitment-system" },
          { label: "Master" },
          { label: "Vertical Market" },
        ]}
      />

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Commission Condition Master
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Manage vertical markets
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Partners select this business market when creating leads. Commission
              rules can use it to reward the first sale in a new market.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={openAddDialog} disabled={saving || loading || dialogSaving}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vertical Market
          </Button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center text-slate-500">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading vertical markets...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[72px] pl-6">Order</TableHead>
                <TableHead>Market</TableHead>
                <TableHead className="w-[120px]">State</TableHead>
                <TableHead className="w-[140px] pr-5 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((market, index) => (
                <TableRow
                  key={`${market.id || market.name}-${index}`}
                  draggable
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => setDraggedIndex(null)}
                  className={cn("transition-colors", draggedIndex === index && "bg-slate-50 opacity-60")}
                >
                  <TableCell>
                    <button
                      type="button"
                      className="ml-5 inline-flex cursor-grab items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-600 active:cursor-grabbing"
                      aria-label={`Drag ${market.name}`}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400" />
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900">{market.name}</span>
                    {market.isSystem ? (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                        Default
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      market.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    )}>
                      {market.isActive ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" variant="ghost" size="sm" onClick={() => openEditDialog(index)}>
                      <Pencil className="mr-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {saving ? (
          <div className="flex items-center gap-2 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving order...
          </div>
        ) : null}
      </section>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingIndex === null ? "Add Vertical Market" : "Edit Vertical Market"}
            </DialogTitle>
            <DialogDescription>
              Set the market name and whether partners can select it in lead forms.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Market Name</label>
                <Input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, name: event.target.value } : current,
                    )
                  }
                  placeholder="e.g. Education"
                  disabled={dialogSaving}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">State</label>
                <select
                  value={draft.isActive ? "enabled" : "disabled"}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, isActive: event.target.value === "enabled" }
                        : current,
                    )
                  }
                  disabled={dialogSaving || (activeCount <= 1 && draft.isActive)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:opacity-60"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={dialogSaving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleApplyDialog} disabled={dialogSaving}>
              {dialogSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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

export default PartnerRecruitmentVerticalMarketContent;
