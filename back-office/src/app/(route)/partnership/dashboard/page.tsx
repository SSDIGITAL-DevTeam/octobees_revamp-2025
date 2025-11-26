"use client";

import Header from "@/components/layout/header/Header";
import {
  DashboardPanel,
  StatCard,
  StatusBadge,
  PartnershipStatCards,
} from "@/components/partials/partnership/PartnershipDashboardWidgets";
import Badge from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  recentLeads,
  topPartners,
} from "@/data/partnership/dashboard";
import { RecentLeadsPanel } from "@/components/partials/partnership/RecentLeadsPanel";
import { PendingCommissionPaymentsPanel } from "@/components/partials/partnership/PendingCommissionPaymentPanel";

export default function PartnershipDashboardPage() {

  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header title="Partnership Dashboard" label="Partnership Program" />
      <section className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <PartnershipStatCards />
        </div>

        <RecentLeadsPanel />

        <PendingCommissionPaymentsPanel />

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
                  <TableCell className="font-semibold text-slate-900">
                    {partner.name}
                  </TableCell>
                  <TableCell>{partner.totalLeads}</TableCell>
                  <TableCell>{partner.closedLeads}</TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {partner.totalCommission}
                  </TableCell>
                  <TableCell>
                    <Badge category="status" variant="closed">
                      {partner.performance}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DashboardPanel>
      </section>
    </main>
  );
}
