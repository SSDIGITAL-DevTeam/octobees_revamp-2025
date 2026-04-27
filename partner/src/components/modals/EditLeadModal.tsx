"use client";

import { useEffect, useState } from "react";

import {
  normalizePartnerLeadStatus,
  PARTNER_LEAD_PIPELINE_STATUSES,
  type PartnerLeadPipelineStatus,
} from "@/lib/partner-portal";
import {
  formatUsdInputValue,
  parseUsdInputValue,
} from "@/lib/currency-input";
import { getCurrencySymbol, useCurrency } from "@/store/currency";

type LeadFields = {
  name: string;
  email: string;
  phone: string;
  serviceId?: string;
  serviceType?: string;
  projectValue?: string;
  status?: string;
  nextFollowUpAt?: string;
};

type ServiceOption = {
  id: string;
  name: string;
};

type EditLeadModalProps = {
  open: boolean;
  lead: LeadFields;
  services?: ServiceOption[];
  pipelineStatuses?: PartnerLeadPipelineStatus[];
  onClose: () => void;
  onSubmit?: (payload: LeadFields) => Promise<void> | void;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FFC72C] focus:outline-none transition";

const EditLeadModal = ({
  open,
  lead,
  services = [],
  pipelineStatuses = [],
  onClose,
  onSubmit,
}: EditLeadModalProps) => {
  const currency = useCurrency();
  const currencySymbol = getCurrencySymbol(currency);
  const [form, setForm] = useState<LeadFields>(lead);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...lead,
        status: normalizePartnerLeadStatus(lead.status),
      });
      setIsSubmitting(false);
    }
  }, [lead, open]);

  const handleChange =
    (field: keyof LeadFields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Service
            </label>
            <select
              value={form.serviceId || ""}
              onChange={handleChange("serviceId")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#FFC72C] focus:outline-none transition"
            >
              <option value="">Select service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Project Value
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder={`${currencySymbol} 5,000`}
              value={formatUsdInputValue(form.projectValue || "")}
              onChange={handleCurrencyChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Pipeline Status
            </label>
            <select
              value={form.status || "New Leads"}
              onChange={handleChange("status")}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#FFC72C] focus:outline-none transition"
            >
              {(pipelineStatuses.length
                ? pipelineStatuses.map((status) => status.value)
                : [...PARTNER_LEAD_PIPELINE_STATUSES]
              ).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Next Follow-up
            </label>
            <input
              type="datetime-local"
              value={form.nextFollowUpAt || ""}
              onChange={handleChange("nextFollowUpAt")}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-[#FFC72C] hover:text-[#4B0005] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#FFC72C] px-6 py-3 text-sm font-semibold text-[#4B0005] transition hover:bg-[#f3b40b] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
