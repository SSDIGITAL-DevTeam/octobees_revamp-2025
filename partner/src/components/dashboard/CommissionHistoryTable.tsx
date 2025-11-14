import Badge, { BadgeVariant } from "@/components/ui/Badge";

type Commission = {
  date: string;
  service: string;
  amount: string;
  status: "Paid" | "Pending Transfer";
};

const history: Commission[] = [
  {
    date: "10 Nov 2025",
    service: "Web Development - PT Lintas",
    amount: "IDR 12.000.000",
    status: "Paid",
  },
  {
    date: "06 Nov 2025",
    service: "Marketing Automation - Luminate SG",
    amount: "IDR 8.500.000",
    status: "Pending Transfer",
  },
  {
    date: "02 Nov 2025",
    service: "Cloud Migration - Archipelago Group",
    amount: "IDR 6.000.000",
    status: "Paid",
  },
];

const statusVariant: Record<Commission["status"], BadgeVariant> = {
  Paid: "paid",
  "Pending Transfer": "unpaid",
};

const CommissionHistoryTable = () => {
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
              <tr key={`${item.date}-${item.service}`}>
                <td className="py-4 font-semibold text-slate-900">
                  {item.date}
                </td>
                <td className="py-4 text-black">{item.service}</td>
                <td className="py-4 font-semibold text-slate-900">
                  {item.amount}
                </td>
                <td className="py-4">
                  <Badge category="payment" variant={statusVariant[item.status]}>
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
