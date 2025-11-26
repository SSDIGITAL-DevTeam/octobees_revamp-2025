"use client"

import { useEffect, useState } from "react"

import { DashboardPanel, StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import {
  getPartnerPendingCommissions,
  type PendingCommission,
} from "@/lib/api/partnership/dashboardPartnership"
import { commissionPayments as commissionPaymentsMock } from "@/data/partnership/dashboard"
import { paymentStatusTone } from "@/constrant/partnership"

// row type mengikuti dummy yang sudah ada
type PendingCommissionRow = (typeof commissionPaymentsMock)[number]

export function PendingCommissionPaymentsPanel() {
  const [rows, setRows] = useState<PendingCommissionRow[]>(commissionPaymentsMock)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getPartnerPendingCommissions()
        const apiData = res.data.data

        // mapping dari API ke shape dummy yang dipakai tabel
        const mapped: PendingCommissionRow[] = apiData.map((item: PendingCommission) => ({
          partnerName: item.partnerName,
          service: item.service,
          leadName: item.leadName,
          amount: item.amount,
          status: item.status as PendingCommissionRow["status"],
        }))

        setRows(mapped)
      } catch (err: any) {
        console.error("Failed to fetch pending commissions:", err)
        setError(err?.message || "Failed to load pending commissions")
        // kalau error, biarkan rows tetap pakai dummy commissionPaymentsMock
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <DashboardPanel
      title="Pending Commission Payments"
      actionHref="/partnership/dashboard/pending-commission-payment"
      actionLabel="View All"
    >
      {loading && (
        <p className="mb-4 text-sm text-slate-500">
          Loading pending commissions...
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

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
          {rows.map((payment) => (
            <TableRow key={`${payment.partnerName}-${payment.leadName}`}>
              <TableCell className="font-semibold text-slate-900">
                {payment.partnerName}
              </TableCell>
              <TableCell>{payment.service}</TableCell>
              <TableCell>{payment.leadName}</TableCell>
              <TableCell className="font-semibold text-slate-900">
                {payment.amount}
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={payment.status}
                  tone={paymentStatusTone[payment.status]}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="addData"
                  className="h-10 rounded-full px-5 text-sm"
                  onClick={() => {
                    // TODO: nanti kalau ada endpoint "mark as paid" bisa dipasang di sini
                    console.log("Mark as paid:", payment)
                  }}
                >
                  Mark as Paid
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  )
}
