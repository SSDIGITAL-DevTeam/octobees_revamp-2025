import Link from "next/link";
import Topbar from "@/components/layout/Topbar";
import Badge, { BadgeVariant } from "@/components/ui/Badge";

type LeadStatus = "Proposal Sent" | "Follow-up" | "Lead Created";

type LeadDetail = {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  projectValue: string;
  amount: string;
  status: LeadStatus;
  remark: string;
  lastUpdate: string;
};

const statusVariant: Record<LeadStatus, BadgeVariant> = {
  "Proposal Sent": "proposal_sent",
  "Follow-up": "follow_up",
  "Lead Created": "lead_created",
};

const leadDetails: Record<string, LeadDetail> = {
  "pt-tech-solution": {
    name: "PT Tech Solution",
    email: "john@gmail.com",
    phone: "+62 3234-2345-232",
    serviceType: "Web Development",
    projectValue: "IDR 45,000,000",
    amount: "IDR 5,000,000",
    status: "Follow-up",
    remark: "Initial contact made",
    lastUpdate: "Oct 15, 2025",
  },
};

const fallbackLead: LeadDetail = {
  name: "PT Tech Solutions",
  email: "john@gmail.com",
  phone: "+62 534-2960-0495",
  serviceType: "Web Development",
  projectValue: "IDR 45,000,000",
  amount: "IDR 5,000,000",
  status: "Proposal Sent",
  remark: "Initial contact made",
  lastUpdate: "Oct 12, 2025",
};

type LeadDetailPageProps = {
  params: {
    id: string;
  };
};

const LeadDetailPage = ({ params }: LeadDetailPageProps) => {
  const lead = leadDetails[params.id] ?? fallbackLead;

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
              <Badge category="status" variant={statusVariant[lead.status]}>
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
    </div>
  );
};

export default LeadDetailPage;
