"use client";

import { useEffect, useState } from "react";
import { formatUsdInputValue, parseUsdInputValue } from "@/lib/currency-input";

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  projectValue: string;
  nextFollowUpAt: string;
};

type AddLeadModalProps = {
  open: boolean;
  serviceName?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onSubmit?: (payload: LeadForm) => Promise<void> | void;
};

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

const AddLeadModal = ({
  open,
  serviceName,
  confirmText = "Create Lead",
  cancelText = "Cancel",
  onClose,
  onSubmit,
}: AddLeadModalProps) => {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
    projectValue: "",
    nextFollowUpAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setForm({
      name: "",
      email: "",
      phone: "",
      projectValue: "",
      nextFollowUpAt: "",
    });
    setIsSubmitting(false);
  }, [open]);

  const handleChange =
    (field: keyof LeadForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      projectValue: parseUsdInputValue(event.target.value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit?.(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Add New lead{serviceName ? ` (${serviceName})` : ""}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill out the form below to create a new lead.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close add lead modal"
          >
            ×
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Lead Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange("name")}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange("email")}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone No.
            </label>
            <input
              type="tel"
              placeholder="+65-1234-5678"
              value={form.phone}
              onChange={handleChange("phone")}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Project Value
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="$ 5,000"
              value={formatUsdInputValue(form.projectValue)}
              onChange={handleCurrencyChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Next Follow-up
            </label>
            <input
              type="datetime-local"
              value={form.nextFollowUpAt}
              onChange={handleChange("nextFollowUpAt")}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#E30613] hover:text-[#E30613] sm:w-auto"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? "Creating..." : confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
