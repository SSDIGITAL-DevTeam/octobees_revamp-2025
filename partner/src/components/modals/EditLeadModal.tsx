"use client";

import { useEffect, useState } from "react";

type LeadFields = {
  name: string;
  email: string;
  phone: string;
  serviceType?: string;
};

type EditLeadModalProps = {
  open: boolean;
  lead: LeadFields;
  onClose: () => void;
  onSubmit?: (payload: LeadFields) => Promise<void> | void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FFC72C] focus:outline-none transition";

const EditLeadModal = ({
  open,
  lead,
  onClose,
  onSubmit,
}: EditLeadModalProps) => {
  const [form, setForm] = useState<LeadFields>(lead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(lead);
      setIsSubmitting(false);
    }
  }, [lead, open]);

  const handleChange =
    (field: keyof LeadFields) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onSubmit?.(form);
    setIsSubmitting(false);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Edit lead{form.serviceType ? ` (${form.serviceType})` : ""}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the latest contact information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close edit lead modal"
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
              placeholder="+62 3234-2345-232"
              value={form.phone}
              onChange={handleChange("phone")}
              className={inputClass}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#FFC72C] hover:text-[#4B0005]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#FFC72C] px-6 py-3 text-sm font-semibold text-[#4B0005] transition hover:bg-[#f3b40b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
