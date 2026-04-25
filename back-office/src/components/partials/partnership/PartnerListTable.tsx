"use client"

import Link from "next/link"

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
import {
  formatCurrency,
  type PartnerPaymentStatus,
} from "@/lib/partnership/partnerList"
import { useCurrencyStore } from "@/app/store/currency"

export type PartnerListRow = {
  id: string
  fullName: string
  email: string
  joinedDate: string
  salesThisMonth: number
  commissionThisMonth: number
  paymentStatus: PartnerPaymentStatus
}

type PartnerListTableProps = {
  rows: PartnerListRow[]
}

export const PartnerListTable = ({ rows }: PartnerListTableProps) => {
  const { currency } = useCurrencyStore()

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Partner Name</TableHead>
            <TableHead>Partner Sales</TableHead>
            <TableHead>Partner Commission</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                No approved partners found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{partner.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">{partner.email}</p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {formatCurrency(partner.salesThisMonth, currency)}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {formatCurrency(partner.commissionThisMonth, currency)}
                </TableCell>
                <TableCell>
                  <StatusBadge label={partner.paymentStatus} tone="warning" />
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/partnership/partner-list/${partner.id}`}>
                      View Details
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
