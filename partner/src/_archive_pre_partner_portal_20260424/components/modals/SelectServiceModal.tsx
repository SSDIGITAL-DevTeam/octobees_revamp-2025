"use client";

import { useEffect, useState } from "react";

export type ServiceOption = {
  id: string;
  label: string;
};

type SelectServiceModalProps = {
  open: boolean;
  services: ServiceOption[];
  selectedServiceId?: string | null;
  title?: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: (serviceId: string) => void;
  onSelectionChange?: (serviceId: string) => void;
};

const buttonBaseClass =
  "w-full rounded-[18px] border px-5 py-3 text-left text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E30613]";

const SelectServiceModal = ({
  open,
  services,
  selectedServiceId = null,
  title = "Select Services",
  confirmText = "Select Services",
  onClose,
  onConfirm,
  onSelectionChange,
}: SelectServiceModalProps) => {
  const [activeService, setActiveService] = useState<string | null>(null);

  const hasServices = services.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedServiceId) {
      setActiveService(selectedServiceId);
      return;
    }

    setActiveService((prev) => prev ?? services[0]?.id ?? null);
  }, [open, selectedServiceId, services]);

  const handleSelect = (serviceId: string) => {
    setActiveService(serviceId);
    onSelectionChange?.(serviceId);
  };

  const handleConfirm = () => {
    if (!activeService) return;
    onConfirm?.(activeService);
  };

  const renderServiceButtons = () => {
    if (!hasServices) {
      return (
        <p className="rounded-2xl border border-dashed border-slate-200 px-5 py-6 text-center text-sm text-slate-500">
          No services available.
        </p>
      );
    }

    return services.map((service) => {
      const isActive = service.id === activeService;
      return (
        <button
          type="button"
          key={service.id}
          onClick={() => handleSelect(service.id)}
          className={`${buttonBaseClass} ${
            isActive
              ? "border-[#E30613] bg-[#E30613] text-white shadow"
              : "border-[#E30613] text-[#E30613] hover:bg-[#fff5f5]"
          }`}
        >
          {service.label}
        </button>
      );
    });
  };

  const disableConfirm = !activeService;

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:rounded-[32px] sm:p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose one service to continue
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close select service modal"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">{renderServiceButtons()}</div>

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
            disabled={disableConfirm}
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
