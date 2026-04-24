"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { DashboardLead } from "@/data/dashboard";
import { getLeadStatusVariant } from "@/lib/partner-portal";

interface CurrentLeadsTableProps {
  leads: DashboardLead[];
  sourceFilter?: string;
}

const CurrentLeadsTable = ({ leads, sourceFilter }: CurrentLeadsTableProps) => {
  const filteredLeads = sourceFilter
    ? leads.filter((lead) => lead.source === sourceFilter)
    : leads;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Current Leads
          </h2>
        </div>
        <Link
          href="/my-leads"
          className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4 md:hidden">
        {filteredLeads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {lead.name}
                </h3>
                <p className="truncate text-sm text-slate-600">{lead.email}</p>
              </div>
              <Badge
                category="status"
                variant={getLeadStatusVariant(lead.status)}
              >
                {lead.statusLabel || lead.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">Phone:</span>{" "}
                {lead.phone}
              </p>
              <p>
                <span className="font-medium text-slate-800">Service:</span>{" "}
                {lead.serviceType}
              </p>
              {lead.source && (
                <p>
                  <span className="font-medium text-slate-800">Source:</span>{" "}
                  {lead.source}
                </p>
              )}
              <p>
                <span className="font-medium text-slate-800">Remark:</span>{" "}
                {lead.remark}
              </p>
              <p>
                <span className="font-medium text-slate-800">Last Update:</span>{" "}
                {lead.lastUpdate}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
              <th className="pb-3">Lead Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3">Service Type</th>
              <th className="pb-3">Source</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Remark</th>
              <th className="pb-3">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td className="py-4 font-semibold text-slate-900">
                  {lead.name}
                </td>
                <td className="py-4 text-black">{lead.email}</td>
                <td className="py-4 text-black">{lead.phone}</td>
                <td className="py-4 text-black">{lead.serviceType}</td>
                <td className="py-4 text-black">{lead.source || "-"}</td>
                <td className="py-4">
                  <Badge
                    category="status"
                    variant={getLeadStatusVariant(lead.status)}
                  >
                    {lead.statusLabel || lead.status}
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
