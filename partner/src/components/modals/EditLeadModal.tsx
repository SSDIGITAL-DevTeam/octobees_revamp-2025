"use client";

import { useEffect, useState } from "react";
import {
  normalizePartnerLeadStatus,
  PARTNER_LEAD_PIPELINE_STATUSES,
  type PartnerLeadPipelineStatus,
  type LeadServiceEntry,
} from "@/lib/partner-portal";
import { formatUsdInputValue, parseUsdInputValue } from "@/lib/currency-input";
import { getCurrencySymbol, useCurrency } from "@/store/currency";

type ServiceOption = {
  id: string;
  name: string;
  projectValue?: number;
};

type ServiceFormEntry = {
  serviceId: string;
  serviceName: string;
  baseProjectValue: number;
  isCustomProjectValue: boolean;
  projectValue: string;
};

type LeadFields = {
  name: string;
  email: string;
  phone: string;
  status?: string;
  nextFollowUpAt?: string;
};

type EditLeadSubmitPayload = LeadFields & {
  services: { serviceId: string; projectValue: number; isCustomProjectValue: boolean }[];
};

type EditLeadModalProps = {
  open: boolean;
  lead: LeadFields & {
    services?: LeadServiceEntry[];
    /** @deprecated */
    serviceId?: string;
    /** @deprecated */
    projectValue?: number;
  };
  services?: ServiceOption[];
  pipelineStatuses?: PartnerLeadPipelineStatus[];
  onClose: () => void;
  onSubmit?: (payload: EditLeadSubmitPayload) => Promise<void> | void;
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

  const [form, setForm] = useState<LeadFields>({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    status: lead.status,
    nextFollowUpAt: lead.nextFollowUpAt,
  });
  const [serviceEntries, setServiceEntries] = useState<ServiceFormEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      status: normalizePartnerLeadStatus(lead.status),
      nextFollowUpAt: lead.nextFollowUpAt ?? "",
    });

    // Build service entries from lead.services (new) or legacy serviceId
    const existingServices: LeadServiceEntry[] =
      Array.isArray(lead.services) && lead.services.length > 0
        ? lead.services
        : lead.serviceId
        ? [
            {
              serviceId: lead.serviceId,
              serviceName:
                services.find((s) => s.id === lead.serviceId)?.name ?? "",
              projectValue: lead.projectValue ?? 0,
              isCustomProjectValue: false,
            },
          ]
        : [];

    const serviceMap = new Map(services.map((s) => [s.id, s]));

    setServiceEntries(
      existingServices.map((es) => {
        const svc = serviceMap.get(es.serviceId);
        return {
          serviceId: es.serviceId,
          serviceName: es.serviceName || svc?.name || es.serviceId,
          baseProjectValue: Number(svc?.projectValue ?? 0),
          isCustomProjectValue: es.isCustomProjectValue,
          projectValue: String(es.projectValue ?? svc?.projectValue ?? 0),
        };
      }),
    );

    setIsSubmitting(false);
  }, [lead, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange =
    (field: keyof LeadFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const updateServiceEntry = (idx: number, patch: Partial<ServiceFormEntry>) => {
    setServiceEntries((prev) =>
      prev.map((entry, i) => (i === idx ? { ...entry, ...patch } : entry)),
    );
  };

  const toggleService = (svc: ServiceOption) => {
    setServiceEntries((prev) => {
      const exists = prev.find((e) => e.serviceId === svc.id);
      if (exists) {
        if (prev.length === 1) return prev; // must keep at least 1
        return prev.filter((e) => e.serviceId !== svc.id);
      }
      return [
        ...prev,
        {
          serviceId: svc.id,
          serviceName: svc.name,
          baseProjectValue: Number(svc.projectValue ?? 0),
          isCustomProjectValue: false,
          projectValue: String(svc.projectValue ?? 0),
        },
      ];
    });
  };

  const hasServiceError = serviceEntries.some(
    (e) => e.isCustomProjectValue && Number(e.projectValue || 0) < e.baseProjectValue,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || hasServiceError || !serviceEntries.length) return;
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

  const selectedServiceIds = new Set(serviceEntries.map((e) => e.serviceId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Lead</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update contact info and services.
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
          {/* Contact fields */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Lead Name</label>
            <input
              type="text"
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
              value={form.phone}
              onChange={handleChange("phone")}
              className={inputClass}
              required
            />
          </div>

          {/* Services multi-select */}
          {services.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Services
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map((svc) => {
                  const active = selectedServiceIds.has(svc.id);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc)}
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-[#E30613] bg-[#E30613] text-white"
                          : "border-slate-300 text-slate-600 hover:border-[#E30613] hover:text-[#E30613]"
                      }`}
                    >
                      {svc.name}
                    </button>
                  );
                })}
              </div>
              {serviceEntries.length === 0 && (
                <p className="mt-1 text-xs text-[#E30613]">
                  Select at least 1 service.
                </p>
              )}
            </div>
          )}

          {/* Per-service project values */}
          {serviceEntries.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Project Value per Service
              </label>
              <div className="space-y-3">
                {serviceEntries.map((entry, idx) => (
                  <div
                    key={entry.serviceId}
                    className="rounded-[18px] border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-800">
                        {entry.serviceName}
                      </span>
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
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
                          className="h-3 w-3 accent-[#E30613]"
                        />
                        Custom
                      </label>
                    </div>
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
                      className={`${inputClass} mt-2 disabled:bg-slate-100 disabled:text-slate-500`}
                    />
                    {entry.isCustomProjectValue &&
                    Number(entry.projectValue || 0) < entry.baseProjectValue ? (
                      <p className="mt-1 text-xs text-[#E30613]">
                        Minimum {currencySymbol}{" "}
                        {formatUsdInputValue(String(entry.baseProjectValue))}.
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline status */}
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
                ? pipelineStatuses.map((s) => s.value)
                : [...PARTNER_LEAD_PIPELINE_STATUSES]
              ).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Follow-up */}
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
              disabled={isSubmitting || hasServiceError || !serviceEntries.length}
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
