import Topbar from "@/components/layout/Topbar";
import Badge, { BadgeVariant } from "@/components/ui/Badge";
import Link from "next/dist/client/link";

type LeadStatus = "Proposal Sent" | "Follow-up" | "Lead Created";

type Lead = {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: LeadStatus;
  remark: string;
};

const leads: Lead[] = [
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Proposal Sent",
    remark: "Initial contact made",
  },
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Follow-up",
    remark: "Initial contact made",
  },
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
  },
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
  },
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
  },
  {
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
  },
];

const statusVariant: Record<LeadStatus, BadgeVariant> = {
  "Proposal Sent": "proposal_sent",
  "Follow-up": "follow_up",
  "Lead Created": "lead_created",
};

const MyLeadsPage = () => {
  return (
    <div className="space-y-6">
      <Topbar title="My Leads" />

      <section>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L16.65 16.65M19 11.5C19 15.6421 15.6421 19 11.5 19C7.35786 19 4 15.6421 4 11.5C4 7.35786 7.35786 4 11.5 4C15.6421 4 19 7.35786 19 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search leads"
                className="w-full rounded-full border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none"
              />
            </div>

            <select
              className="rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none"
              defaultValue=""
            >
              <option value="">All Status</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="follow_up">Follow-up</option>
              <option value="lead_created">Lead Created</option>
            </select>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f]"
          >
            Add New Lead
          </button>
        </div>
      </section>
      <section className="rounded-2xl bg-white p-6 shadow-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
                <th className="pb-3">Lead Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone No.</th>
                <th className="pb-3">Service Type</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Remark</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {leads.map((lead, index) => (
                <tr key={`${lead.email}-${index}`}>
                  <td className="py-4 font-semibold">{lead.name}</td>
                  <td className="py-4">{lead.email}</td>
                  <td className="py-4">{lead.phone}</td>
                  <td className="py-4">{lead.serviceType}</td>
                  <td className="py-4">
                    <Badge category="status" variant={statusVariant[lead.status]}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-slate-600">{lead.remark}</td>
                  <td className="py-4 text-right">
                    <Link href={`/my-leads/${index}`} className="mr-4">
                    
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
                    >
                      View Detail
                    </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyLeadsPage;
