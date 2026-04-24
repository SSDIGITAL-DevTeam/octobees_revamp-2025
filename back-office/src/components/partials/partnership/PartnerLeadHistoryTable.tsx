"use client"

import { ArrowUpDown } from "lucide-react"

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
import { leadStatusTone, type LeadStatus } from "@/constrant/partnership"
import { formatDate } from "@/lib/partnership/partnerList"

type PartnerLeadHistoryTableProps = {
  leads: {
    id: string
    createdAt: string
    serviceName: string
    name: string
    email: string
    phone: string
    status: string
  }[]
  sortLabel: string
  onToggleDateSort: () => void
}

export const PartnerLeadHistoryTable = ({
  leads,
  sortLabel,
  onToggleDateSort,
}: PartnerLeadHistoryTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>
              <Button
                type="button"
                variant="ghost"
                className="-ml-3 h-auto px-3 py-1 text-left font-semibold text-slate-700"
                onClick={onToggleDateSort}
              >
                Added On
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-xs font-medium text-slate-400">{sortLabel}</span>
              </Button>
            </TableHead>
            <TableHead>Product / Service</TableHead>
            <TableHead>Lead Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Lead Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                No leads match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>{lead.serviceName || "-"}</TableCell>
                <TableCell className="font-semibold text-slate-900">{lead.name}</TableCell>
                <TableCell>{lead.email || "-"}</TableCell>
                <TableCell>{lead.phone || "-"}</TableCell>
                <TableCell>
                  <StatusBadge
                    label={lead.status || "-"}
                    tone={leadStatusTone[lead.status as LeadStatus] || "default"}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
