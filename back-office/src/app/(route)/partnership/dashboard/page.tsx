"use client"

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LucideIcon } from "lucide-react"
import { BadgeCheck, CircleDollarSign, Handshake, UsersRound } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import ImgSingleIcon from "@/asset/card/svg/single-icon.svg"
import ImgDealIcon from "@/asset/card/svg/deal-icon.svg"
import ImgGroupIcon from "@/asset/card/svg/group-icon.svg"
import ImgStopwatchIcon from "@/asset/card/svg/stopwatch-icon.svg"
import Image, { StaticImageData } from "next/image"

type StatHighlight = {
  title: string
  value: string
  helper: string
  accent: string
  image: StaticImageData
}

type LeadStatus = "Proposal Sent" | "Follow-up" | "Lead Created" | "Closed"

type LeadEntry = {
  leadName: string
  partnerName: string
  serviceType: string
  status: LeadStatus
  remark: string
  actionLabel: string
}

type PaymentStatus = "Pending Transfer"

type CommissionPayment = {
  partnerName: string
  service: string
  leadName: string
  amount: string
  status: PaymentStatus
}

type TopPartner = {
  name: string
  totalLeads: number
  closedLeads: number
  totalCommission: string
  performance: number
}

type DashboardPanelProps = {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  children: ReactNode
}

type StatusTone = "default" | "success" | "warning" | "info" | "danger"

const statHighlights: StatHighlight[] = [
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

const recentLeads: LeadEntry[] = [
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

const commissionPayments: CommissionPayment[] = [
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

const topPartners: TopPartner[] = [
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

const leadStatusTone: Record<LeadStatus, StatusTone> = {
  "Proposal Sent": "warning",
  "Follow-up": "info",
  "Lead Created": "info",
  Closed: "success",
}

const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  "Pending Transfer": "warning",
}

const statusToneStyles: Record<StatusTone, string> = {
  default: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
}

const StatusBadge = ({ label, tone = "default" }: { label: string; tone?: StatusTone }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusToneStyles[tone]}`}
  >
    {label}
  </span>
)

const DashboardPanel = ({ title, description, actionHref, actionLabel, children }: DashboardPanelProps) => (
  <div className="space-y-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-sm font-semibold text-red-700 transition-colors hover:text-red-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
    {children}
  </div>
)

const StatCard = ({ highlight }: { highlight: StatHighlight }) => {

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-900">{highlight.title}</p>
        <p className="text-4xl font-semibold text-slate-950 leading-none">
          {highlight.value}
        </p>
        {highlight.helper && (
          <p className="mt-1 text-sm font-medium text-red-500">
            {highlight.helper}
          </p>
        )}
      </div>
      <div className="pointer-events-none absolute -bottom-10 -right-10">
        <div
          className={`flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br`}
        >
          <Image src={highlight.image} alt={highlight.title} className="h-40 w-40" />
        </div>
      </div>
    </div>
  )
}


const PerformanceBar = ({ value }: { value: number }) => (
  <div className="flex min-w-[140px] items-center gap-3">
    <div className="h-2 flex-1 rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-emerald-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="text-sm font-semibold text-slate-900">{value}%</span>
  </div>
)

export default function PartnershipDashboardPage() {
  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header title="Partnership Dashboard" label="Partnership Program" />

      <section className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statHighlights.map((highlight) => (
            <StatCard key={highlight.title} highlight={highlight} />
          ))}
        </div>

        <DashboardPanel
          title="Recent Leads"
          actionHref="/partnership/leads-management"
          actionLabel="View All"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Lead Name</TableHead>
                <TableHead>Partner Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.map((lead) => (
                <TableRow key={`${lead.leadName}-${lead.status}-${lead.remark}`}>
                  <TableCell className="font-semibold text-slate-900">{lead.leadName}</TableCell>
                  <TableCell>{lead.partnerName}</TableCell>
                  <TableCell>{lead.serviceType}</TableCell>
                  <TableCell>
                    <StatusBadge label={lead.status} tone={leadStatusTone[lead.status]} />
                  </TableCell>
                  <TableCell className="text-slate-500">{lead.remark}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-10 rounded-full px-5 text-sm">
                      {lead.actionLabel}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardPanel>

        <DashboardPanel
          title="Pending Commission Payments"
          actionHref="/partnership/commission-control"
          actionLabel="View All"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Partner Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Lead Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissionPayments.map((payment) => (
                <TableRow key={`${payment.partnerName}-${payment.leadName}`}>
                  <TableCell className="font-semibold text-slate-900">{payment.partnerName}</TableCell>
                  <TableCell>{payment.service}</TableCell>
                  <TableCell>{payment.leadName}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{payment.amount}</TableCell>
                  <TableCell>
                    <StatusBadge label={payment.status} tone={paymentStatusTone[payment.status]} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="addData" className="h-10 rounded-full px-5 text-sm">
                      Mark as Paid
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardPanel>

        <DashboardPanel
          title="Top Performing Partners"
          actionHref="/partnership/partners"
          actionLabel="View All"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Partner Name</TableHead>
                <TableHead>Total Leads</TableHead>
                <TableHead>Closed Leads</TableHead>
                <TableHead>Total Commission</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topPartners.map((partner) => (
                <TableRow key={partner.name}>
                  <TableCell className="font-semibold text-slate-900">{partner.name}</TableCell>
                  <TableCell>{partner.totalLeads}</TableCell>
                  <TableCell>{partner.closedLeads}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{partner.totalCommission}</TableCell>
                  <TableCell>
                    <PerformanceBar value={partner.performance} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardPanel>
      </section>
    </main>
  )
}
