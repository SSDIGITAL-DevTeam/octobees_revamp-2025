"use client"

import { useMemo, useState } from "react"
import { Pencil } from "lucide-react"

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLeadDetail, leadStatusOptions } from "@/hooks/partnership/useLeadDetail"
import type { LeadStatus } from "@/constrant/partnership"

type LeadDetailPageProps = {
  params: { slug: string }
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const slug = decodeURIComponent(params.slug)
  const lead = useLeadDetail(slug)
  const [status, setStatus] = useState<LeadStatus>(lead?.status ?? "Follow-up")
  const [projectValue, setProjectValue] = useState(lead?.projectValue ?? "")
  const [remark, setRemark] = useState(lead?.remark ?? "")
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectDraft, setProjectDraft] = useState(projectValue)

  const infoRows = useMemo(
    () => [
      {
        label: "Lead Name",
        value: lead?.leadName ?? "-",
      },
      {
        label: "Email Address",
        value: lead?.email ?? "-",
      },
      {
        label: "Phone No.",
        value: lead?.phone ?? "-",
      },
      {
        label: "Service Type",
        value: lead?.serviceType ?? "-",
        highlight: true,
      },
      {
        label: "Last update",
        value: lead?.lastUpdate ?? "-",
      },
      {
        label: "Partner Allotment",
        value: lead?.partnerAllotment ?? "-",
      },
    ],
    [lead]
  )

  if (!lead) {
    return (
      <main className="flex w-full flex-col gap-6 pb-12">
        <Header title="Lead Detail" breadcrumbs={[{ label: "Lead Management", href: "/partnership/leads-management" }]} />
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <p className="text-slate-600">Lead tidak ditemukan.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex w-full flex-col gap-8 pb-12">
      <Header
        title="Lead Detail"
        breadcrumbs={[
          { label: "Lead Management", href: "/partnership/leads-management" },
          { label: "Lead Detail" },
        ]}
      />

      <section className="space-y-6">
        <div className="rounded-[26px] border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-950">Lead Detail : {lead.leadName}</p>
              <p className="text-lg font-semibold text-red-700">Partner Name : {lead.partnerName}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Status</span>
              <Select value={status} onValueChange={(value) => setStatus(value as LeadStatus)}>
                <SelectTrigger className="h-10 w-[160px] rounded-full border border-slate-300 px-4 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadStatusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 px-6 pb-8 pt-4">
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-slate-700">Project Value (IDR)</div>
              <div className="flex items-center gap-2">
                <Input
                  value={projectValue}
                  readOnly
                  className="h-10 w-56 rounded-md border-slate-300 px-3 text-sm bg-slate-50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-amber-300 text-amber-600 hover:bg-amber-50"
                  onClick={() => {
                    setProjectDraft(projectValue)
                    setIsProjectModalOpen(true)
                  }}
                  title="Edit project value"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {infoRows.map((row) => (
                <div key={row.label} className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700">{row.label}</p>
                  <p className={`text-base font-medium ${row.highlight ? "text-red-700" : "text-slate-900"}`}>
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-[18px] border border-border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Remark</p>
          <Textarea
            value={remark}
            onChange={(event) => setRemark(event.target.value)}
            placeholder="Enter your remark here (Optional)"
            className="min-h-[140px] rounded-2xl border-slate-300 text-sm"
          />

          <div className="flex justify-end">
            <Button variant="addData" className="h-11 rounded-full px-6">
              Save Changes
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isProjectModalOpen} onOpenChange={(open) => (!open ? setIsProjectModalOpen(false) : null)}>
        <DialogContent className="max-w-xl rounded-[20px] px-8 py-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-semibold text-slate-900">Edit Project Value</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-slate-800">Project Value (IDR)</p>
            <Input
              value={projectDraft}
              onChange={(event) => setProjectDraft(event.target.value)}
              placeholder="Enter project value"
              className="h-11 rounded-lg border-slate-200 text-sm"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-slate-300 px-4 text-sm font-semibold text-slate-600"
              onClick={() => setIsProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 rounded-full bg-amber-400 px-5 text-sm font-semibold text-white hover:bg-amber-500"
              onClick={() => {
                setProjectValue(projectDraft)
                setIsProjectModalOpen(false)
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
