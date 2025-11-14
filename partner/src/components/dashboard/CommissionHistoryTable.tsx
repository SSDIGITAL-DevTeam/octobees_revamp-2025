"use client";

import Badge from "@/components/ui/Badge";
import {
  useCommissionHistory,
  useCommissionStatusVariant,
} from "@/hooks/useDashboardData";

const CommissionHistoryTable = () => {
  const history = useCommissionHistory();
  const getStatusVariant = useCommissionStatusVariant();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Commission History
          </h2>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
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
                    variant={getStatusVariant(item.status)}
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
