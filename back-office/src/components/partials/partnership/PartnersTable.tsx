"use client"

import { ArrowUpRight, Eye } from "lucide-react"
import Link from "next/link"

import Badge from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PartnerEntry } from "@/constrant/partnership"

type PartnersTableProps = {
  partners: PartnerEntry[]
}

const badgeVariantMap: Record<PartnerEntry["status"], "active" | "inactive"> = {
  Active: "active",
  "Non Active": "inactive",
}

export const PartnersTable = ({ partners }: PartnersTableProps) => {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white shadow-sm px-5 py-2">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 text-sm text-slate-500">
            <TableHead>Full Name</TableHead>
            <TableHead>Email Address</TableHead>
            <TableHead>Phone / WhatsApp Number</TableHead>
            <TableHead>Country of Residence</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id}>
              <TableCell className="font-semibold text-slate-900">{partner.fullName}</TableCell>
              <TableCell>{partner.email}</TableCell>
              <TableCell>{partner.phone}</TableCell>
              <TableCell>{partner.country}</TableCell>
              <TableCell>
                <Badge category="status" variant={badgeVariantMap[partner.status]}>
                  {partner.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button asChild variant="ghost" className="text-red-600 hover:text-red-700">
                    <Link href={`/partnership/partners/${partner.id}`}>
                    <Eye className="h-5 w-5" />
                      See Details
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

export default PartnersTable
