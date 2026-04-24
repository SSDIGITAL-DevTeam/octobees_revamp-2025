"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { type AffiliateRow } from "@/constrant/affiliate";
import { cn } from "@/lib/utils";

type AffiliateTableProps = {
  data: AffiliateRow[];
  isLoading: boolean;
  emptyMessage?: string;
  queryString?: string;
  detailBasePath?: string;
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  qualified: "bg-sky-100 text-sky-700 border-sky-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const assessmentStyles = {
  not_started: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  submitted: "bg-amber-100 text-amber-700 border-amber-200",
  scored: "bg-purple-100 text-purple-700 border-purple-200",
  passed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
} as const;

const assessmentLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  submitted: "Submitted",
  scored: "Scored",
  passed: "Passed",
  failed: "Failed",
} as const;

const getDisplayStatus = (row: AffiliateRow) => {
  if (
    (row.status === "approved" || row.status === "rejected") &&
    !row.reviewed_at &&
    row.assessment_session_id
  ) {
    return "qualified";
  }

  return row.status;
};

const renderAssessmentCell = (row: AffiliateRow) => {
  if (row.assessment_status) {
    return (
      <div className="space-y-1">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
            assessmentStyles[row.assessment_status],
          )}
        >
          {assessmentLabels[row.assessment_status]}
        </span>
        {typeof row.assessment_score_percentage === "number" &&
        row.assessment_score_percentage > 0 ? (
          <p
            className={cn(
              "text-xs font-semibold",
              row.assessment_is_passed ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {row.assessment_score_percentage.toFixed(1)}%
          </p>
        ) : null}
      </div>
    );
  }

  if (row.status === "qualified") {
    return <span className="text-xs text-slate-500">Waiting to start</span>;
  }

  return <span className="text-xs text-slate-400">Not in assessment flow</span>;
};

const renderLoadingRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-16 ml-auto" />
      </TableCell>
    </TableRow>
  ));

const renderEmptyRow = (emptyMessage: string) => (
  <TableRow>
    <TableCell colSpan={9} className="h-24 text-center text-slate-500">
      {emptyMessage}
    </TableCell>
  </TableRow>
);

const renderAffiliateRow = (row: AffiliateRow, queryString?: string, detailBasePath?: string) => {
  const displayStatus = getDisplayStatus(row);
  const basePath = detailBasePath || "/affiliate-program";

  return (
    <TableRow key={row.id}>
      <TableCell className="font-semibold text-slate-900">
        {row.full_name}
      </TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{row.phone || "-"}</TableCell>
      <TableCell>{row.country}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
            statusStyles[displayStatus],
          )}
        >
          {displayStatus === "qualified"
            ? "awaiting final review"
            : displayStatus}
        </span>
      </TableCell>
      <TableCell>{renderAssessmentCell(row)}</TableCell>
      <TableCell>
        <p className="font-medium text-slate-800">{row.batch_name || "-"}</p>
      </TableCell>
      <TableCell className="text-slate-500">
        {new Date(row.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-slate-600 hover:bg-slate-100"
          >
            <Link
              href={`${basePath}/${row.id}${queryString ? `?${queryString}` : ""}`}
            >
              <Eye className="mr-1 h-4 w-4" />
              View
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const renderRows = (
  data: AffiliateRow[],
  isLoading: boolean,
  emptyMessage: string,
  queryString?: string,
  detailBasePath?: string,
) => {
  if (isLoading) return renderLoadingRows();
  if (data.length === 0) return renderEmptyRow(emptyMessage);
  return data.map((row) => renderAffiliateRow(row, queryString, detailBasePath));
};

const AffiliateTable = ({
  data,
  isLoading,
  emptyMessage = "No data available.",
  queryString,
  detailBasePath,
}: AffiliateTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Application</TableHead>
            <TableHead>Assessment</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Applied At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderRows(data, isLoading, emptyMessage, queryString, detailBasePath)}
        </TableBody>
      </Table>
    </div>
  );
};

export { AffiliateTable };
