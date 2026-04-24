"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { CommissionHistoryEntry } from "@/data/dashboard";
import { getCommissionStatusVariant } from "@/lib/partner-portal";

const CommissionHistoryTable = ({ history }: { history: CommissionHistoryEntry[] }) => {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Commission History
          </h2>
        </div>
        <Link
          href="/my-commissions"
          className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4 md:hidden">
        {history.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{item.service}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.date}</p>
              </div>
              <Badge category="payment" variant={getCommissionStatusVariant(item.status)}>
                {item.status}
              </Badge>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-900">{item.amount}</p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
              <th className="pb-3">Date</th>
              <th className="pb-3">Service</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr key={item.id}>
                <td className="py-4 font-semibold text-slate-900">
                  {item.date}
                </td>
                <td className="py-4 text-black">{item.service}</td>
                <td className="py-4 font-semibold text-slate-900">
                  {item.amount}
                </td>
                <td className="py-4">
                  <Badge
                    category="payment"
                    variant={getCommissionStatusVariant(item.status)}
                  >
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CommissionHistoryTable;
