"use client";

import { useEffect, useState } from "react";
import { formatUsdInputValue, parseUsdInputValue } from "@/lib/currency-input";
import { getCurrencySymbol, useCurrency } from "@/store/currency";

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  verticalMarketId: string;
  verticalMarketName: string;
  isCustomProjectValue: boolean;
  projectValue: string;
  nextFollowUpAt: string;
};

type VerticalMarketOption = {
  id: string;
  name: string;
};

type AddLeadModalProps = {
  open: boolean;
  serviceName?: string;
  baseProjectValue?: number;
  verticalMarkets?: VerticalMarketOption[];
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
  baseProjectValue = 0,
  verticalMarkets = [],
  confirmText = "Create Lead",
  cancelText = "Cancel",
  onClose,
  onSubmit,
}: AddLeadModalProps) => {
  const currency = useCurrency();
  const currencySymbol = getCurrencySymbol(currency);
  const [form, setForm] = useState<LeadForm>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    verticalMarketId: "",
    verticalMarketName: "",
    isCustomProjectValue: false,
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
      notes: "",
      verticalMarketId: verticalMarkets[0]?.id ?? "",
      verticalMarketName: "",
      isCustomProjectValue: false,
      projectValue: String(baseProjectValue || ""),
      nextFollowUpAt: "",
    });
    setIsSubmitting(false);
  }, [baseProjectValue, open, verticalMarkets]);

  const handleChange =
    (field: keyof LeadForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleTextAreaChange =
    (field: keyof LeadForm) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const selectedMarketIsCustom = form.verticalMarketId === "__custom__";

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      projectValue: parseUsdInputValue(event.target.value),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    const numericProjectValue = Number(form.projectValue || 0);
    if (form.isCustomProjectValue && numericProjectValue < baseProjectValue) {
      return;
    }
    if (!form.verticalMarketId) return;
    if (selectedMarketIsCustom && !form.verticalMarketName.trim()) return;
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
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Service base value
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {formatUsdInputValue(String(baseProjectValue || 0))}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Minimum value is locked from back-office service setup.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <input
                    type="checkbox"
                    checked={form.isCustomProjectValue}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        isCustomProjectValue: event.target.checked,
                        projectValue: event.target.checked
                          ? prev.projectValue
                          : String(baseProjectValue || ""),
                      }))
                    }
                    className="h-4 w-4 accent-[#E30613]"
                  />
                  Custom value
                </label>
              </div>
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder={`${currencySymbol} 5,000`}
              value={formatUsdInputValue(form.projectValue)}
              onChange={handleCurrencyChange}
              disabled={!form.isCustomProjectValue}
              min={baseProjectValue}
              className={`${inputClass} mt-3 disabled:bg-slate-100 disabled:text-slate-500`}
              required
            />
            {form.isCustomProjectValue &&
            Number(form.projectValue || 0) < baseProjectValue ? (
              <p className="mt-2 text-xs font-medium text-[#E30613]">
                Custom value cannot be below the service base value.
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Businees Type
            </label>
            <select
              value={form.verticalMarketId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  verticalMarketId: event.target.value,
                  verticalMarketName:
                    event.target.value === "__custom__"
                      ? prev.verticalMarketName
                      : "",
                }))
              }
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select business type
              </option>
              {verticalMarkets.map((market) => (
                <option key={market.id} value={market.id}>
                  {market.name}
                </option>
              ))}
              <option value="__custom__">Other / custom market</option>
            </select>
            {selectedMarketIsCustom ? (
              <input
                type="text"
                placeholder="e.g. Construction, Legal Services"
                value={form.verticalMarketName}
                onChange={handleChange("verticalMarketName")}
                className={`${inputClass} mt-3`}
                required
              />
            ) : null}
            {/* <p className="mt-2 text-xs text-slate-500">
              This helps detect sales into new business markets for commission
              conditions.
            </p> */}
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

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              placeholder="Add context about this lead, request, or discussion."
              value={form.notes}
              onChange={handleTextAreaChange("notes")}
              className="min-h-24 w-full rounded-[22px] border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[#E30613] focus:outline-none"
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
              disabled={
                isSubmitting ||
                !form.verticalMarketId ||
                (selectedMarketIsCustom && !form.verticalMarketName.trim()) ||
                (form.isCustomProjectValue &&
                  Number(form.projectValue || 0) < baseProjectValue)
              }
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
