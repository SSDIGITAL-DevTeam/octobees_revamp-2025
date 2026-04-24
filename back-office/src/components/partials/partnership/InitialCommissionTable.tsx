"use client";

import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AffiliateBatch } from "@/hooks/partnership/useBatches";

type InitialCommissionTableProps = {
  batches: AffiliateBatch[];
  onEdit: (batch: AffiliateBatch) => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const InitialCommissionTable = ({
  batches,
  onEdit,
}: InitialCommissionTableProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Batch</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Initial Commission</TableHead>
            <TableHead>Target Closed Clients</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-slate-500"
              >
                No batches found.
              </TableCell>
            </TableRow>
          ) : (
            batches.map((batch) => {
              const tiers =
                Array.isArray(batch.initialCommissionTiers) &&
                batch.initialCommissionTiers.length > 0
                  ? batch.initialCommissionTiers
                  : [
                      {
                        closedClients:
                          batch.initialCommissionFullClientThreshold ?? 2,
                        amount: Number(batch.initialCommissionAmount || 0),
                      },
                    ];
              const topTier = tiers[tiers.length - 1];

              return (
              <TableRow key={batch.id}>
                <TableCell className="font-semibold text-slate-900">
                  {batch.name}
                </TableCell>
                <TableCell>
                  {dayjs(batch.startDate).format("MMM DD, YYYY")} -{" "}
                  {dayjs(batch.endDate).format("MMM DD, YYYY")}
                </TableCell>
                <TableCell className="font-medium text-slate-900">
                  <div className="space-y-1">
                    <div>{currencyFormatter.format(Number(topTier?.amount || 0))}</div>
                    <div className="text-xs text-slate-500">
                      {tiers.length} tier{tiers.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {topTier?.closedClients ?? batch.initialCommissionFullClientThreshold ?? 2} client(s)
                </TableCell>
              <TableCell>
                  {(() => {
                    let label = "Closed";
                    if (batch.effectiveStatus === "open") label = "Open";
                    else if (batch.effectiveStatus === "draft") label = "Draft";

                    return (
                  <StatusBadge
                    label={label}
                    tone={
                      batch.effectiveStatus === "open" ? "success" : "default"
                    }
                  />
                    );
                  })()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(batch)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
