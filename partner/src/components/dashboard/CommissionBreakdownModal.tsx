"use client";

import { formatCurrencyIdr } from "@/lib/partner-portal";

type CommissionBreakdownModalProps = {
  open: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    label: string;
    amount: number;
    description: string;
  }>;
  totalAmount: number;
};

const formatUsd = (value?: number | null) => `$${formatCurrencyIdr(value)}`;

const CommissionBreakdownModal = ({
  open,
  onClose,
  items,
  totalAmount,
}: CommissionBreakdownModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E30613]">
              Commission Detail
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Total Commission Breakdown
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Breakdown of the current recorded commission total by commission
              type.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[#E30613] hover:text-[#E30613]"
            aria-label="Close commission detail"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm font-semibold text-slate-950">
                  {formatUsd(item.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-[#E30613] px-4 py-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-white/80">
              Total recorded commission
            </p>
            <p className="text-xl font-semibold">{formatUsd(totalAmount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionBreakdownModal;
