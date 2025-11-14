import Badge, { BadgeVariant } from "@/components/ui/Badge";

type Lead = {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: "Proposal Sent" | "Follow-up" | "Lead Created";
  remark: string;
  lastUpdate: string;
};

const leads: Lead[] = [
  {
    name: "Aria Putri",
    email: "aria.putri@client.id",
    phone: "+62 812 8899 1234",
    serviceType: "Web Development",
    status: "Proposal Sent",
    remark: "Waiting for procurement sign-off",
    lastUpdate: "12 Nov 2025",
  },
  {
    name: "Michael Lau",
    email: "michael.lau@luminate.sg",
    phone: "+65 8134 4592",
    serviceType: "Marketing Automation",
    status: "Follow-up",
    remark: "Demo scheduled on 15 Nov",
    lastUpdate: "11 Nov 2025",
  },
  {
    name: "Sari Wulandari",
    email: "sari.w@archipelago.id",
    phone: "+62 878 9944 2233",
    serviceType: "Cloud Migration",
    status: "Lead Created",
    remark: "Needs discovery call",
    lastUpdate: "10 Nov 2025",
  },
];

const statusVariant: Record<Lead["status"], BadgeVariant> = {
  "Proposal Sent": "proposal_sent",
  "Follow-up": "follow_up",
  "Lead Created": "lead_created",
};

const CurrentLeadsTable = () => {
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
              <tr key={lead.email}>
                <td className="py-4 font-semibold text-slate-900">
                  {lead.name}
                </td>
                <td className="py-4 text-black">{lead.email}</td>
                <td className="py-4 text-black">{lead.phone}</td>
                <td className="py-4 text-black">{lead.serviceType}</td>
                <td className="py-4">
                  <Badge category="status" variant={statusVariant[lead.status]}>
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
