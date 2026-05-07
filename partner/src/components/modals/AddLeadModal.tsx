"use client";

import { useEffect, useState } from "react";
import { formatUsdInputValue, parseUsdInputValue } from "@/lib/currency-input";
import { getCurrencySymbol, useCurrency } from "@/store/currency";
import type { PartnerServiceItem } from "@/lib/partner-portal";

type ServiceFormEntry = {
  serviceId: string;
  serviceName: string;
  baseProjectValue: number;
  isCustomProjectValue: boolean;
  projectValue: string;
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  verticalMarketId: string;
  verticalMarketName: string;
  nextFollowUpAt: string;
};

type VerticalMarketOption = {
  id: string;
  name: string;
};

type AddLeadModalProps = {
  open: boolean;
  services?: PartnerServiceItem[];
  verticalMarkets?: VerticalMarketOption[];
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onSubmit?: (payload: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    verticalMarketId: string;
    verticalMarketName: string;
    nextFollowUpAt: string;
    services: { serviceId: string; projectValue: number; isCustomProjectValue: boolean }[];
  }) => Promise<void> | void;
};

const inputClass =
  "w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none transition";

const AddLeadModal = ({
  open,
  services = [],
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
    nextFollowUpAt: "",
  });

  const [serviceEntries, setServiceEntries] = useState<ServiceFormEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: "",
      email: "",
      phone: "",
      notes: "",
      verticalMarketId: verticalMarkets[0]?.id ?? "",
      verticalMarketName: "",
      nextFollowUpAt: "",
    });
    setServiceEntries(
      services.map((s) => ({
        serviceId: s.id,
        serviceName: s.name,
        baseProjectValue: Number(s.projectValue || 0),
        isCustomProjectValue: false,
        projectValue: String(s.projectValue || 0),
      })),
    );
    setIsSubmitting(false);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange =
    (field: keyof LeadForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const selectedMarketIsCustom = form.verticalMarketId === "__custom__";

  const updateServiceEntry = (idx: number, patch: Partial<ServiceFormEntry>) => {
    setServiceEntries((prev) =>
      prev.map((entry, i) => (i === idx ? { ...entry, ...patch } : entry)),
    );
  };

  const hasServiceError = serviceEntries.some(
    (e) => e.isCustomProjectValue && Number(e.projectValue || 0) < e.baseProjectValue,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || hasServiceError) return;
    if (!form.verticalMarketId) return;
    if (selectedMarketIsCustom && !form.verticalMarketName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        ...form,
        services: serviceEntries.map((e) => ({
          serviceId: e.serviceId,
          projectValue: Number(e.projectValue || e.baseProjectValue),
          isCustomProjectValue: e.isCustomProjectValue,
        })),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Add New Lead</h2>
            <p className="mt-1 text-sm text-slate-500">
              {services.length > 1
                ? `${services.length} services selected`
                : services[0]?.name
                ? `Service: ${services[0].name}`
                : "Fill out the form below."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          {/* Lead info */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Lead Name</label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">Phone No.</label>
            <input
              type="tel"
              placeholder="+65-1234-5678"
              value={form.phone}
              onChange={handleChange("phone")}
              className={inputClass}
              required
            />
          </div>

          {/* Per-service project values */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project Value per Service
            </label>
            <div className="space-y-3">
              {serviceEntries.map((entry, idx) => (
                <div
                  key={entry.serviceId}
                  className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">
                      {entry.serviceName}
                    </span>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                      <input
                        type="checkbox"
                        checked={entry.isCustomProjectValue}
                        onChange={(e) =>
                          updateServiceEntry(idx, {
                            isCustomProjectValue: e.target.checked,
                            projectValue: e.target.checked
                              ? entry.projectValue
                              : String(entry.baseProjectValue || ""),
                          })
                        }
                        className="h-3.5 w-3.5 accent-[#E30613]"
                      />
                      Custom value
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Base: {currencySymbol} {formatUsdInputValue(String(entry.baseProjectValue))}
                  </p>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder={`${currencySymbol} 5,000`}
                    value={formatUsdInputValue(entry.projectValue)}
                    onChange={(e) =>
                      updateServiceEntry(idx, {
                        projectValue: parseUsdInputValue(e.target.value),
                      })
                    }
                    disabled={!entry.isCustomProjectValue}
                    className={`${inputClass} mt-3 disabled:bg-slate-100 disabled:text-slate-500`}
                    required
                  />
                  {entry.isCustomProjectValue &&
                  Number(entry.projectValue || 0) < entry.baseProjectValue ? (
                    <p className="mt-1.5 text-xs font-medium text-[#E30613]">
                      Value cannot be below the service base value.
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Business type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Business Type
            </label>
            <select
              value={form.verticalMarketId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  verticalMarketId: e.target.value,
                  verticalMarketName:
                    e.target.value === "__custom__" ? prev.verticalMarketName : "",
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
          </div>

          {/* Follow-up */}
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

          {/* Notes */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              placeholder="Add context about this lead, request, or discussion."
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
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
                hasServiceError ||
                !form.verticalMarketId ||
                (selectedMarketIsCustom && !form.verticalMarketName.trim())
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
