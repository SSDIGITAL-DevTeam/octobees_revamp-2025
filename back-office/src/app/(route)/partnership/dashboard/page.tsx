"use client"

import Header from "@/components/layout/header/Header"
import {
  DashboardPanel,
  PerformanceBar,
  StatCard,
  StatusBadge,
} from "@/components/partials/partnership/PartnershipDashboardWidgets"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  commissionPayments,
  recentLeads,
  statHighlights,
  topPartners,
} from "@/data/partnership/dashboard"
import { leadStatusTone, paymentStatusTone } from "@/constrant/partnership"

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

        <DashboardPanel title="Recent Leads" actionHref="/partnership/leads-management" actionLabel="View All">
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
                  <TableCell className="text-black">{lead.remark}</TableCell>
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

        <DashboardPanel title="Top Performing Partners" actionHref="/partnership/partners" actionLabel="View All">
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
