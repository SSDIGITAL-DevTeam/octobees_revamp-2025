"use client"

import { ChevronDown, Eye } from "lucide-react"
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
import type { LeadEntry } from "@/constrant/partnership"
import { leadStatusStyles } from "@/constrant/partnership"
import { StatusBadge } from "./PartnershipDashboardWidgets"
import { slugify } from "@/utils/slugify"

type PartnerLeadTableProps = {
  leads: LeadEntry[]
}

export const PartnerLeadTable = ({ leads }: PartnerLeadTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Lead Name</TableHead>
            <TableHead>Affiliator</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead className="text-right">Action</TableHead>
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
                  <Button
                    variant="outline"
                    className="h-10 rounded-full border-slate-200 px-4 text-sm font-semibold text-slate-600"
                  >
                    {lead.actionLabel}
                    <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-10 w-10 rounded-full border border-red-600 text-red-600 hover:bg-red-50"
                  >
                    <Link href={`/partnership/leads-management/${slugify(lead.leadName)}`}>
                      <Eye className="h-5 w-5" />
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

export default PartnerLeadTable
