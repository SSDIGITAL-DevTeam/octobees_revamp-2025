import type { BadgeVariant } from "@/components/ui/Badge";
import type { Lead } from "@/data/leads";

export type DashboardStat = {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  images: string;
  accentColor?: string;
};

export const dashboardStats: DashboardStat[] = [
  {
    id: "total-commission",
    title: "Total Commission",
    value: "IDR 42.5M",
    subtitle: "+12% from last month",
    accentColor: "#E30613",
    images: "/assets/icons/coin-icon.svg",
  },
  {
    id: "pending-commission",
    title: "Pending Commission",
    value: "IDR 3.5M",
    subtitle: "1 pending",
    images: "/assets/icons/stopwatch-icon.svg",
  },
  {
    id: "total-leads",
    title: "Total Leads",
    value: "24",
    subtitle: "+3 this month",
    images: "/assets/icons/group-icon.svg",
  },
  {
    id: "closed-leads",
    title: "Closed Leads",
    value: "8",
    subtitle: "32% conversion",
    images: "/assets/icons/deal-icon.svg",
  },
];

export type ServiceOffering = {
  id: string;
  name: string;
  commission: string;
  description: string;
};

export const availableServices: ServiceOffering[] = [
  {
    id: "web-development",
    name: "Web Development",
    commission: "15%",
    description: "Custom website & web application development",
  },
  {
    id: "marketing-automation",
    name: "Marketing Automation",
    commission: "12%",
    description: "Workflow setup, CRM integration, and optimization",
  },
  {
    id: "cloud-migration",
    name: "Cloud Migration",
    commission: "18%",
    description: "Full assessment and migration to scalable cloud infra",
  },
];

export type CommissionStatus = "Paid" | "Pending Transfer";

export type CommissionHistoryEntry = {
  id: string;
  date: string;
  service: string;
  amount: string;
  status: CommissionStatus;
};

export const commissionHistoryEntries: CommissionHistoryEntry[] = [
  {
    id: "ch-20251110",
    date: "10 Nov 2025",
    service: "Web Development - PT Lintas",
    amount: "IDR 12.000.000",
    status: "Paid",
  },
  {
    id: "ch-20251106",
    date: "06 Nov 2025",
    service: "Marketing Automation - Luminate SG",
    amount: "IDR 8.500.000",
    status: "Pending Transfer",
  },
  {
    id: "ch-20251102",
    date: "02 Nov 2025",
    service: "Cloud Migration - Archipelago Group",
    amount: "IDR 6.000.000",
    status: "Paid",
  },
];

export const commissionStatusVariantMap: Record<
  CommissionStatus,
  BadgeVariant
> = {
  Paid: "paid",
  "Pending Transfer": "unpaid",
};

export type DashboardLead = Lead & {
  lastUpdate: string;
};

export const currentDashboardLeads: DashboardLead[] = [
  {
    id: "aria-putri",
    name: "Aria Putri",
    email: "aria.putri@client.id",
    phone: "+62 812 8899 1234",
    serviceType: "Web Development",
    status: "Proposal Sent",
    remark: "Waiting for procurement sign-off",
    lastUpdate: "12 Nov 2025",
  },
  {
    id: "michael-lau",
    name: "Michael Lau",
    email: "michael.lau@luminate.sg",
    phone: "+65 8134 4592",
    serviceType: "Marketing Automation",
    status: "Follow-up",
    remark: "Demo scheduled on 15 Nov",
    lastUpdate: "11 Nov 2025",
  },
  {
    id: "sari-wulandari",
    name: "Sari Wulandari",
    email: "sari.w@archipelago.id",
    phone: "+62 878 9944 2233",
    serviceType: "Cloud Migration",
    status: "Lead Created",
    remark: "Needs discovery call",
    lastUpdate: "10 Nov 2025",
  },
];
