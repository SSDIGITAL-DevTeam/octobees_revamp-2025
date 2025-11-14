"use client";

import Badge from "@/components/ui/Badge";
import { useCurrentDashboardLeads } from "@/hooks/useDashboardData";
import { useLeadStatusVariant } from "@/hooks/useLeads";

const CurrentLeadsTable = () => {
  const leads = useCurrentDashboardLeads();
  const getStatusVariant = useLeadStatusVariant();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Current Leads</h2>
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
              <th className="pb-3">Lead Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Service Type</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remark</th>
              <th className="pb-3">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="py-4 font-semibold text-slate-900">
                  {lead.name}
                </td>
                <td className="py-4 text-black">{lead.email}</td>
                <td className="py-4 text-black">{lead.phone}</td>
                <td className="py-4 text-black">{lead.serviceType}</td>
                <td className="py-4">
                  <Badge
                    category="status"
                    variant={getStatusVariant(lead.status)}
                  >
                    {lead.status}
                  </Badge>
                </td>
                <td className="py-4 text-black">{lead.remark}</td>
                <td className="py-4 text-black">{lead.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CurrentLeadsTable;
