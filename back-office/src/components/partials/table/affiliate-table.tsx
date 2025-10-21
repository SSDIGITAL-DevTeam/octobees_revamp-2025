import Link from "next/link"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AffiliateRow } from "@/constrant/affiliate"
import { cn } from "@/lib/utils"

type AffiliateTableProps = {
  data: AffiliateRow[]
  isLoading?: boolean
  emptyMessage?: string
  queryString?: string
}

const statusStyles: Record<AffiliateRow["status"], string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
}

const statusDotStyles: Record<AffiliateRow["status"], string> = {
  pending: "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
}

const formatSubmitted = (value: string) => {
  try {
    return format(new Date(value), "dd MMM yyyy HH:mm")
  } catch {
    return "-"
  }
}

const AffiliateTable = ({
  data,
  isLoading = false,
  emptyMessage = "No applications found.",
  queryString,
}: AffiliateTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {["Full Name", "Email", "Phone", "Country", "Status", "Submitted", "Actions"].map(
                (header) => (
                  <TableHead key={header}>{header}</TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-slate-50/60 p-16 text-center">
        <p className="text-lg font-semibold text-slate-800">Nothing to show yet</p>
        <p className="text-sm text-slate-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((application) => {
            const detailHref = queryString
              ? `/affiliate-program/${application.id}?${queryString}`
              : `/affiliate-program/${application.id}`

            return (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.full_name}</TableCell>
                <TableCell className="text-slate-600">{application.email}</TableCell>
                <TableCell className="text-slate-600">
                  {application.phone ? (
                    <span className="font-medium text-slate-700">{application.phone}</span>
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-slate-600">{application.country}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                      statusStyles[application.status]
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", statusDotStyles[application.status])} />
                    {application.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">
                  {formatSubmitted(application.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm" className="h-8 rounded-full px-4 text-sm">
                    <Link href={detailHref}>See Details</Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default AffiliateTable
