"use client"

import { Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { LeadEntry, LeadStatus } from "@/constrant/partnership"
import { leadStatusStyles } from "@/constrant/partnership"
import { StatusBadge } from "./PartnershipDashboardWidgets"
import { slugify } from "@/utils/slugify"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type LeadsTableProps = {
  leads: LeadEntry[]
  onStatusChange: (leadName: string, status: LeadStatus) => void
}

export const LeadsTable = ({ leads, onStatusChange }: LeadsTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-sm px-8 py-5">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Lead Name</TableHead>
            <TableHead>Partner Name</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <TableRow key={`${lead.leadName}-${index}`}>
              <TableCell className="font-semibold text-slate-900">{lead.leadName}</TableCell>
              <TableCell>{lead.partnerName}</TableCell>
              <TableCell>{lead.serviceType}</TableCell>
              <TableCell>
                <StatusBadge label={lead.status} className={leadStatusStyles[lead.status]} />
              </TableCell>
              <TableCell className="text-slate-500">{lead.remark}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Select
                    value={lead.status}
                    onValueChange={(value) => onStatusChange(lead.leadName, value as LeadStatus)}
                  >
                    <SelectTrigger className="h-10 w-[150px] rounded-full border-slate-200 px-4 text-sm font-semibold text-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Proposal Sent", "Follow-up", "Lead Created", "Closed"] as LeadStatus[]).map(
                        (statusOption) => (
                          <SelectItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-15 w-15 rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Link href={`/partnership/leads-management/${slugify(lead.leadName)}`}>
                      <Eye className="h-30 w-30" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
