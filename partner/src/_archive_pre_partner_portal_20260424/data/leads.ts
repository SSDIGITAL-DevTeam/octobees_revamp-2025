import { BadgeVariant } from "@/components/ui/Badge";

export type LeadStatus = "Proposal Sent" | "Follow-up" | "Lead Created";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  status: LeadStatus;
  remark: string;
  source?: string;
};

export type LeadDetail = Lead & {
  projectValue: string;
  amount: string;
  lastUpdate: string;
};

export const leadStatusVariantMap: Record<LeadStatus, BadgeVariant> = {
  "Proposal Sent": "proposal_sent",
  "Follow-up": "follow_up",
  "Lead Created": "lead_created",
};

const baseLeadDetails: LeadDetail[] = [
  {
    id: "pt-tech-solutions",
    name: "PT Tech Solutions",
    email: "john@gmail.com",
    phone: "+62-534-2960-0495",
    serviceType: "Web Development",
    projectValue: "$45.000.000",
    amount: "$5.000.000",
    status: "Proposal Sent",
    remark: "Initial contact made",
    lastUpdate: "12 Oct 2025",
    source: "Website",
  },
  {
    id: "nusantara-creative-labs",
    name: "Nusantara Creative Labs",
    email: "nusa.creative@gmail.com",
    phone: "+62-812-9900-1201",
    serviceType: "Mobile App",
    projectValue: "$60.000.000",
    amount: "$12.000.000",
    status: "Follow-up",
    remark: "Waiting for technical doc",
    lastUpdate: "15 Oct 2025",
    source: "Referral",
  },
  {
    id: "sinergi-data-prima",
    name: "Sinergi Data Prima",
    email: "contact@sinergidata.com",
    phone: "+62-21-9876-5432",
    serviceType: "Data Integration",
    projectValue: "$85.000.000",
    amount: "$20.000.000",
    status: "Lead Created",
    remark: "Need pricing breakdown",
    lastUpdate: "9 Oct 2025",
    source: "Email Campaign",
  },
  {
    id: "alpha-digital-studio",
    name: "Alpha Digital Studio",
    email: "hello@alphadigital.com",
    phone: "+62-812-5555-1337",
    serviceType: "UI/UX Design",
    projectValue: "$30.000.000",
    amount: "$4.500.000",
    status: "Lead Created",
    remark: "Proposal under review",
    lastUpdate: "18 Oct 2025",
    source: "Direct",
  },
];

export const leadDetails: Record<string, LeadDetail> = baseLeadDetails.reduce(
  (acc, lead) => {
    acc[lead.id] = lead;
    return acc;
  },
  {} as Record<string, LeadDetail>,
);

export const defaultLeadId = baseLeadDetails[0]?.id ?? "pt-tech-solutions";

export const leads: Lead[] = baseLeadDetails.map(
  ({ id, name, email, phone, serviceType, status, remark, source }) => ({
    id,
    name,
    email,
    phone,
    serviceType,
    status,
    remark,
    source,
  }),
);

export const getLeadDetailById = (id: string): LeadDetail => {
  return leadDetails[id] ?? leadDetails[defaultLeadId];
};
