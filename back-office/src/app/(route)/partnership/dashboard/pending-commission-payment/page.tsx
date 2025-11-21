"use client"

import Header from "@/components/layout/header/Header"
import { LeadsPagination } from "@/components/partials/partnership/LeadsPagination"
import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { paymentStatusTone } from "@/constrant/partnership"
import { usePendingCommissionPayments } from "@/hooks/partnership/usePendingCommissionPayments"

export default function PendingCommissionPaymentPage() {
  const { payments, page, setPage, totalPages, totalData, pageSize } = usePendingCommissionPayments()

  const rangeStart = totalData ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = totalData ? Math.min(page * pageSize, totalData) : 0

  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header
        title="Pending Commission Payments"
        breadcrumbs={[
          { label: "Partnership Dashboard", href: "/partnership/dashboard" },
          { label: "Pending Commission Payments" },
        ]}
      />

      <section className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
        <div className="px-6 pb-6 pt-8">
          <h2 className="text-left text-3xl font-semibold text-slate-950">
            Pending Commission Payments
          </h2>
        </div>

        <div className="px-4 pb-6 sm:px-6">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 text-sm text-slate-600">
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Lead Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-semibold text-slate-900">{payment.partnerName}</TableCell>
                    <TableCell>{payment.service}</TableCell>
                    <TableCell>{payment.leadName}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{payment.amount}</TableCell>
                    <TableCell>
                      <StatusBadge label={payment.status} tone={paymentStatusTone[payment.status]} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="addData" className="h-10 rounded-full px-5 text-sm">
                        Mark as Paid
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing {rangeStart}-{rangeEnd} of {totalData} payments
            </p>
            <LeadsPagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </section>
    </main>
  )
}
