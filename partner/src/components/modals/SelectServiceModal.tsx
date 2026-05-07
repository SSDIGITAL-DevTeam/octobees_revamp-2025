"use client";

import { useEffect, useState } from "react";

export type ServiceOption = {
  id: string;
  label: string;
};

type SelectServiceModalProps = {
  open: boolean;
  services: ServiceOption[];
  selectedServiceIds?: string[];
  title?: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: (serviceIds: string[]) => void;
};

const SelectServiceModal = ({
  open,
  services,
  selectedServiceIds = [],
  title = "Select Services",
  confirmText = "Continue",
  onClose,
  onConfirm,
}: SelectServiceModalProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) return;
    setSelected(
      selectedServiceIds.length > 0
        ? new Set(selectedServiceIds)
        : new Set(),
    );
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    if (!selected.size) return;
    onConfirm?.([...selected]);
  };

  if (!open) return null;

  const hasServices = services.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select one or more services for this lead
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

        <div className="mt-6 space-y-3">
          {!hasServices ? (
            <p className="rounded-2xl border border-dashed border-slate-200 px-5 py-6 text-center text-sm text-slate-500">
              No services available.
            </p>
          ) : (
            services.map((service) => {
              const checked = selected.has(service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => toggle(service.id)}
                  className={`flex w-full items-center gap-3 rounded-[18px] border px-5 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613] ${
                    checked
                      ? "border-[#E30613] bg-[#E30613] text-white shadow"
                      : "border-[#E30613] text-[#E30613] hover:bg-[#fff5f5]"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
                      checked
                        ? "border-white bg-white"
                        : "border-[#E30613] bg-transparent"
                    }`}
                  >
                    {checked && (
                      <svg
                        className="h-3 w-3 text-[#E30613]"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {service.label}
                </button>
              );
            })
          )}
        </div>

        {selected.size > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500">
            {selected.size} service{selected.size > 1 ? "s" : ""} selected
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#E30613] hover:text-[#E30613] sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected.size}
            onClick={handleConfirm}
            className="w-full rounded-full bg-[#E30613] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectServiceModal;
