"use client";

import Link from "next/link";
import { useState } from "react";

import Topbar from "@/components/layout/Topbar";
import EditLeadModal from "@/components/modals/EditLeadModal";
import Badge from "@/components/ui/Badge";
import { useLeadDetail, useLeadStatusVariant } from "@/hooks/useLeads";

type LeadDetailPageProps = {
  params: {
    id: string;
  };
};

const LeadDetailPage = ({ params }: LeadDetailPageProps) => {
  const lead = useLeadDetail(params.id);
  const getStatusVariant = useLeadStatusVariant();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateLead = async (payload: {
    name: string;
    email: string;
    phone: string;
    serviceType?: string;
  }) => {
    console.info("Updated lead payload", payload);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Topbar title="Leads Detail" />

      <section className="rounded-2xl px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <nav className="mt-1 text-sm text-slate-500">
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/my-leads"
                    className="font-medium text-[#E30613] hover:text-[#b1050f]"
                  >
                    My Leads
                  </Link>
                </li>
                <li className="text-slate-300">/</li>
                <li className="text-slate-700">Leads Detail ({lead.name})</li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-[#FFC72C] px-5 py-3 text-sm font-semibold text-[#4B0005] transition hover:bg-[#f3b40b]"
            >
              Edit Lead
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[#E30613] px-5 py-3 text-sm font-semibold text-[#E30613] transition hover:bg-[#fff1f2]"
            >
              Delete Lead
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-card">
        <h3 className="text-xl font-semibold text-slate-900">
          Detail : {lead.name}
        </h3>

        {/* Isi tetap seperti semula namun lebih rapi */}
        <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Lead Name</p>
            <p className="mt-1 font-semibold text-slate-900">{lead.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email Address</p>
            <p className="mt-1 text-slate-900">{lead.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone No.</p>
            <p className="mt-1 text-slate-900">{lead.phone}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Service Type</p>
            <p className="mt-1 font-semibold text-[#E30613]">
              {lead.serviceType}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Project Value</p>
            <p className="mt-1 text-slate-900">{lead.projectValue}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2">
              <Badge
                category="status"
                variant={getStatusVariant(lead.status)}
              >
                {lead.status}
              </Badge>
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Amount</p>
            <p className="mt-1 text-slate-900">{lead.amount}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Remark</p>
            <p className="mt-1 text-slate-900">{lead.remark}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last update</p>
            <p className="mt-1 text-slate-900">{lead.lastUpdate}</p>
          </div>
        </div>
      </section>
      <EditLeadModal
        open={isEditModalOpen}
        lead={{
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          serviceType: lead.serviceType,
        }}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateLead}
      />
    </div>
  );
};

export default LeadDetailPage;
