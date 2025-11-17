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
    projectValue: "IDR 45,000,000",
    amount: "IDR 5,000,000",
    status: "Proposal Sent",
    remark: "Initial contact made",
    lastUpdate: "Oct 12, 2025",
  },
  {
    id: "nusantara-creative-labs",
    name: "Nusantara Creative Labs",
    email: "nusa.creative@gmail.com",
    phone: "+62-812-9900-1201",
    serviceType: "Mobile App",
    projectValue: "IDR 60,000,000",
    amount: "IDR 12,000,000",
    status: "Follow-up",
    remark: "Waiting for technical doc",
    lastUpdate: "Oct 15, 2025",
  },
  {
    id: "sinergi-data-prima",
    name: "Sinergi Data Prima",
    email: "contact@sinergidata.com",
    phone: "+62-21-9876-5432",
    serviceType: "Data Integration",
    projectValue: "IDR 85,000,000",
    amount: "IDR 20,000,000",
    status: "Lead Created",
    remark: "Need pricing breakdown",
    lastUpdate: "Oct 9, 2025",
  },
  {
    id: "alpha-digital-studio",
    name: "Alpha Digital Studio",
    email: "hello@alphadigital.com",
    phone: "+62-812-5555-1337",
    serviceType: "UI/UX Design",
    projectValue: "IDR 30,000,000",
    amount: "IDR 4,500,000",
    status: "Lead Created",
    remark: "Proposal under review",
    lastUpdate: "Oct 18, 2025",
  },
];

export const leadDetails: Record<string, LeadDetail> = baseLeadDetails.reduce(
  (acc, lead) => {
    acc[lead.id] = lead;
    return acc;
  },
  {} as Record<string, LeadDetail>
);

export const defaultLeadId = baseLeadDetails[0]?.id ?? "pt-tech-solutions";

export const leads: Lead[] = baseLeadDetails.map(
  ({ id, name, email, phone, serviceType, status, remark }) => ({
    id,
    name,
    email,
    phone,
    serviceType,
    status,
    remark,
  })
);

export const getLeadDetailById = (id: string): LeadDetail => {
  return leadDetails[id] ?? leadDetails[defaultLeadId];
};
