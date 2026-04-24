"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createPartnerService,
  type PartnerServiceApiItem,
  updatePartnerService,
} from "@/lib/api/partnership/dashboardPartnership";

type CommissionServiceModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PartnerServiceApiItem | null;
};

export const CommissionServiceModal = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: CommissionServiceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    projectValue: "",
    description: "",
    isActive: true,
  });

  const isEditMode = Boolean(initialData?.id);

  const initialForm = useMemo(
    () => ({
      name: initialData?.name || "",
      projectValue:
        initialData?.projectValue !== undefined && initialData?.projectValue !== null
          ? String(initialData.projectValue)
          : "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    }),
    [initialData]
  );

  useEffect(() => {
    if (!open) return;
    setForm(initialForm);
  }, [initialForm, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const payload = {
        name: form.name,
        projectValue: parseFloat(form.projectValue),
        description: form.description,
        isActive: form.isActive,
      };

      if (isEditMode && initialData?.id) {
        await updatePartnerService(initialData.id, payload);
      } else {
        await createPartnerService(payload);
      }
      onSuccess();
      onClose();
      setForm({
        name: "",
        projectValue: "",
        description: "",
        isActive: true,
      });
    } catch (error) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} service:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} service`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrencyInput = (value: string) => {
    const numeric = String(value || "").replace(/[^\d.]/g, "");
    if (!numeric) return "";

    const [integerPart = "", decimalPart = ""] = numeric.split(".");
    const formattedInteger = Number(integerPart || 0).toLocaleString("en-US");

    if (numeric.endsWith(".")) return `$ ${formattedInteger}.`;
    if (decimalPart) return `$ ${formattedInteger}.${decimalPart.slice(0, 2)}`;
    return `$ ${formattedInteger}`;
  };

  const parseCurrencyInput = (value: string) =>
    String(value || "").replace(/[^\d.]/g, "");
  let submitLabel = "Create Service";
  if (loading && isEditMode) submitLabel = "Saving...";
  else if (loading) submitLabel = "Creating...";
  else if (isEditMode) submitLabel = "Save Changes";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-xl font-semibold">
          {isEditMode ? "Edit Service" : "Add New Service"}
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Commission is configured separately in the <strong>Sales Commission</strong> menu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Service Name
            </label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Web Development"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Project Value ($)
            </label>
            <Input
              required
              type="text"
              inputMode="decimal"
              value={formatCurrencyInput(form.projectValue)}
              onChange={(e) =>
                setForm({ ...form, projectValue: parseCurrencyInput(e.target.value) })
              }
              placeholder="$ 5,000"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <Textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the service..."
              rows={3}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <label className="inline-flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="text-sm text-slate-700">Active service</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white"
              disabled={loading}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
