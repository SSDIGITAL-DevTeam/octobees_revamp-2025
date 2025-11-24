import type {
  CommissionPayment,
  LeadEntry,
  StatHighlight,
  TopPartner,
} from "@/constrant/partnership"
import ImgSingleIcon from "@/asset/card/svg/single-icon.svg"
import ImgDealIcon from "@/asset/card/svg/deal-icon.svg"
import ImgGroupIcon from "@/asset/card/svg/group-icon.svg"
import ImgStopwatchIcon from "@/asset/card/svg/stopwatch-icon.svg"

export const statHighlights: StatHighlight[] = [
  {
    title: "Total Leads",
    value: "48",
    helper: "+3 this month",
    accent: "from-amber-400 to-rose-500",
    image: ImgGroupIcon,
  },
  {
    title: "Active Partners",
    value: "12",
    helper: "All verified",
    accent: "from-sky-400 to-blue-600",
    image: ImgSingleIcon,
  },
  {
    title: "Closed Leads",
    value: "8",
    helper: "32% conversion",
    accent: "from-emerald-400 to-emerald-600",
    image: ImgDealIcon,
  },
  {
    title: "Pending Commission",
    value: "IDR 7.5M",
    helper: "2 pending",
    accent: "from-rose-500 to-orange-500",
    image: ImgStopwatchIcon,
  },
]

export const recentLeads: LeadEntry[] = [
  {
    leadName: "PT Tech Solutions1",
    partnerName: "Ahmad Rizki",
    serviceType: "Web Development",
    status: "Proposal Sent",
    remark: "Initial contact made",
    actionLabel: "Proposal Sent",
  },
  {
    leadName: "PT Tech Solutions2",
    partnerName: "Ahmad Rizki",
    serviceType: "Web Development",
    status: "Follow-up",
    remark: "Initial contact made",
    actionLabel: "Follow-up",
  },
  {
    leadName: "PT Tech Solutions3",
    partnerName: "Ahmad Rizki",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
    actionLabel: "Lead Created",
  },
  {
    leadName: "PT Tech Solutions4",
    partnerName: "Ahmad Rizki",
    serviceType: "Web Development",
    status: "Closed",
    remark: "Initial contact made",
    actionLabel: "Closed",
  },
  {
    leadName: "PT Tech Solutions5",
    partnerName: "Ahmad Rizki",
    serviceType: "Web Development",
    status: "Lead Created",
    remark: "Initial contact made",
    actionLabel: "Lead Created",
  },
]

export const commissionPayments: CommissionPayment[] = [
  {
    partnerName: "Ahmad Rizki",
    service: "Digital Marketing",
    leadName: "CV Digital Media",
    amount: "IDR 4,000,000",
    status: "Pending Transfer",
  },
  {
    partnerName: "Sarah Putri",
    service: "Digital Marketing",
    leadName: "PT Satu Nusa",
    amount: "IDR 3,500,000",
    status: "Pending Transfer",
  },
]

export const topPartners: TopPartner[] = [
  {
    name: "Ahmad Rizki",
    totalLeads: 12,
    closedLeads: 5,
    totalCommission: "IDR 35,000,000",
    performance: 97,
  },
  {
    name: "Sarah Putri",
    totalLeads: 8,
    closedLeads: 3,
    totalCommission: "IDR 22,500,000",
    performance: 80,
  },
  {
    name: "Abdillah",
    totalLeads: 8,
    closedLeads: 3,
    totalCommission: "IDR 22,500,000",
    performance: 76,
  },
]
