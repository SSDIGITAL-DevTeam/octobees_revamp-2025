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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getPartnerRecentLeads, type RecentLead } from "@/lib/api/partnership/dashboardPartnership"
import { leadStatusTone, type LeadStatus } from "@/constrant/partnership"
import { recentLeads as recentLeadsMock } from "@/data/partnership/dashboard"

type RecentLeadRow = (typeof recentLeadsMock)[number]

const LEAD_ACTION_OPTIONS: LeadStatus[] = [
  "New Leads",
  "Contacted",
  "Follow-up Day-1",
  "Closed Won",
  "Closed Lost",
]

export function RecentLeadsPanel() {  
  const [rows, setRows] = useState<RecentLeadRow[]>(recentLeadsMock)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLeadActionChange = (leadName: string, nextStatus: LeadStatus) => {
    setRows((prev) =>
      prev.map((lead) =>
        lead.leadName === leadName
          ? { ...lead, status: nextStatus, actionLabel: nextStatus }
          : lead
      )
    )
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getPartnerRecentLeads()
        const apiData = res.data.data

        // kalau shape API sudah sama dengan RecentLeadRow,
        // ini bisa langsung cast. Kalau berbeda, mapping di sini.
        const mapped: RecentLeadRow[] = apiData.map((item: RecentLead) => ({
          leadName: item.leadName,
          partnerName: item.partnerName,
          serviceType: item.serviceType,
          status: item.status as LeadStatus,
          remark: item.remark,
          // default actionLabel = status
          actionLabel: item.status as LeadStatus,
        }))

        setRows(mapped)
      } catch (err: any) {
        console.error("Failed to fetch recent leads:", err)
        setError(err?.message || "Failed to load recent leads")
        // kalau error, biarkan pakai dummy recentLeadsMock
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <DashboardPanel
      title="Recent Leads"
      actionHref="/partnership/leads-management"
      actionLabel="View All"
    >
      {loading && (
        <p className="mb-4 text-sm text-slate-500">Loading recent leads...</p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Lead Name</TableHead>
            <TableHead>Partner Name</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Remark</TableHead>
            <TableHead className="text-left">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((lead) => (
            <TableRow
              key={`${lead.leadName}-${lead.status}-${lead.remark}`}
            >
              <TableCell className="font-semibold text-slate-900">
                {lead.leadName}
              </TableCell>
              <TableCell>{lead.partnerName}</TableCell>
              <TableCell>{lead.serviceType}</TableCell>
              <TableCell>
                <StatusBadge
                  label={lead.status}
                  tone={leadStatusTone[lead.status]}
                />
              </TableCell>
              <TableCell className="text-black">
                {lead.remark}
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={lead.status}
                  onValueChange={(value) =>
                    handleLeadActionChange(
                      lead.leadName,
                      value as LeadStatus
                    )
                  }
                >
                  <SelectTrigger className="h-10 w-[150px] rounded-full border-slate-200 px-4 text-sm font-semibold text-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_ACTION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPanel>
  )
}
