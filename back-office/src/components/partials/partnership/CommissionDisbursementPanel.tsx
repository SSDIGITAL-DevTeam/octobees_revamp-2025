"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Landmark,
  UploadCloud,
  CheckCircle2,
  RefreshCcw,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listPartnerCommissions,
  uploadCommissionProof,
  markCommissionAsPaid,
  revertCommission,
  rejectCommission,
  type CommissionRecord,
  type CommissionStatusApi,
  type CommissionTypeApi,
} from "@/lib/api/partnership/dashboardPartnership";
import { formatWithCurrency, useCurrencyStore } from "@/app/store/currency";

const commissionTypeBadge: Record<
  CommissionTypeApi,
  { label: string; className: string }
> = {
  sales: {
    label: "Sales",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  initial: {
    label: "Initial",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  basic_salary: {
    label: "Basic Salary",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
};

const statusBadge: Record<
  CommissionStatusApi,
  { label: string; className: string }
> = {
  "Pending Transfer": {
    label: "Pending",
    className: "bg-slate-50 text-slate-700 border border-slate-200",
  },
  Paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

type PayDialogState = {
  open: boolean;
  commission: CommissionRecord | null;
  file: File | null;
  transactionReference: string;
  uploading: boolean;
  submitting: boolean;
};

type RejectDialogState = {
  open: boolean;
  commission: CommissionRecord | null;
  reason: string;
  submitting: boolean;
};

const initialPayState: PayDialogState = {
  open: false,
  commission: null,
  file: null,
  transactionReference: "",
  uploading: false,
  submitting: false,
};

const initialRejectState: RejectDialogState = {
  open: false,
  commission: null,
  reason: "",
  submitting: false,
};

const buildProofAbsoluteUrl = (proofUrl: string) => {
  if (!proofUrl) return "";
  if (proofUrl.startsWith("http")) return proofUrl;
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  // NEXT_PUBLIC_API_URL typically ends with /api/v1 -> strip it so static
  // /upload/... files resolve correctly.
  const origin = base.replace(/\/api\/v\d+\/?$/, "");
  return `${origin}${proofUrl}`;
};

export const CommissionDisbursementPanel = () => {
  const { currency } = useCurrencyStore();
  const formatCurrency = (value: number | null | undefined) =>
    formatWithCurrency(Number(value || 0), currency);
  const [rows, setRows] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<CommissionTypeApi | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    CommissionStatusApi | "all"
  >("all");
  const [periodFilter, setPeriodFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [payState, setPayState] = useState<PayDialogState>(initialPayState);
  const [rejectState, setRejectState] =
    useState<RejectDialogState>(initialRejectState);
  const [proofPreview, setProofPreview] =
    useState<CommissionRecord | null>(null);
  const [bankInfoTarget, setBankInfoTarget] =
    useState<CommissionRecord | null>(null);

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listPartnerCommissions({
        page: 1,
        limit: 100,
        type: typeFilter === "all" ? undefined : typeFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        period: periodFilter || undefined,
        search: searchFilter || undefined,
      });
      setRows(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, periodFilter, searchFilter]);

  useEffect(() => {
    void fetchCommissions();
  }, [fetchCommissions]);

  const openPayDialog = (commission: CommissionRecord) => {
    setPayState({
      open: true,
      commission,
      file: null,
      transactionReference: commission.transactionReference || "",
      uploading: false,
      submitting: false,
    });
  };

  const closePayDialog = () => setPayState(initialPayState);

  const handlePaySubmit = async () => {
    if (!payState.commission) return;
    if (!payState.file) {
      toast.error("Please attach a proof file before marking as paid.");
      return;
    }
    try {
      setPayState((prev) => ({ ...prev, uploading: true }));
      const uploadRes = await uploadCommissionProof(payState.file);
      const proofUrl = uploadRes.data.data.proofUrl;

      setPayState((prev) => ({
        ...prev,
        uploading: false,
        submitting: true,
      }));
      await markCommissionAsPaid(payState.commission.id, {
        proofUrl,
        transactionReference: payState.transactionReference.trim() || null,
      });
      toast.success("Commission marked as paid.");
      closePayDialog();
      await fetchCommissions();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to mark as paid";
      toast.error(message);
      setPayState((prev) => ({
        ...prev,
        uploading: false,
        submitting: false,
      }));
    }
  };

  const handleRevert = async (commission: CommissionRecord) => {
    const confirmed = window.confirm(
      `Revert commission for ${commission.partnerName || "partner"} to Pending? This will clear the proof and transaction info.`,
    );
    if (!confirmed) return;
    try {
      await revertCommission(commission.id);
      toast.success("Commission reverted to pending.");
      await fetchCommissions();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to revert";
      toast.error(message);
    }
  };

  const openRejectDialog = (commission: CommissionRecord) => {
    setRejectState({
      open: true,
      commission,
      reason: "",
      submitting: false,
    });
  };

  const closeRejectDialog = () => setRejectState(initialRejectState);

  const handleRejectSubmit = async () => {
    if (!rejectState.commission) return;
    if (!rejectState.reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      setRejectState((prev) => ({ ...prev, submitting: true }));
      await rejectCommission(
        rejectState.commission.id,
        rejectState.reason.trim(),
      );
      toast.success("Commission rejected.");
      closeRejectDialog();
      await fetchCommissions();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reject";
      toast.error(message);
      setRejectState((prev) => ({ ...prev, submitting: false }));
    }
  };

  const summary = useMemo(() => {
    const counts = {
      total: rows.length,
      pending: 0,
      paid: 0,
      rejected: 0,
      totalPending: 0,
    };
    for (const row of rows) {
      if (row.status === "Pending Transfer") {
        counts.pending += 1;
        counts.totalPending += Number(row.amount || 0);
      } else if (row.status === "Paid") counts.paid += 1;
      else if (row.status === "Rejected") counts.rejected += 1;
    }
    return counts;
  }, [rows]);

  return (
    <>
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Records</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {summary.total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {summary.pending}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(summary.totalPending)} owed
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Paid</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {summary.paid}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">
            {summary.rejected}
          </p>
        </div>
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Commission Records
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Each row represents a single commission obligation (sales,
              initial, or basic salary). Upload proof to mark as paid.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search partner name"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchFilter(searchInput.trim());
              }}
              className="h-10 w-52 bg-white border-slate-200 rounded-xl"
            />
            <Select
              value={typeFilter}
              onValueChange={(v) =>
                setTypeFilter(v as CommissionTypeApi | "all")
              }
            >
              <SelectTrigger className="h-10 w-40 bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="initial">Initial</SelectItem>
                <SelectItem value="basic_salary">Basic Salary</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as CommissionStatusApi | "all")
              }
            >
              <SelectTrigger className="h-10 w-40 bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending Transfer">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="YYYY-MM"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="h-10 w-36 pl-9 bg-white border-slate-200 rounded-xl font-mono text-sm"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100/50 hover:bg-slate-100/50 text-slate-600">
                <TableHead className="font-semibold px-6 py-4">
                  Partner
                </TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Context</TableHead>
                <TableHead className="font-semibold">Period</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Proof</TableHead>
                <TableHead className="font-semibold text-right px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-slate-500"
                  >
                    Loading commissions...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-slate-500"
                  >
                    No commission records match the filter.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const typeMeta = commissionTypeBadge[row.commissionType];
                  const statusMeta = statusBadge[row.status];
                  const isPending = row.status === "Pending Transfer";
                  const isPaid = row.status === "Paid";
                  const isRejected = row.status === "Rejected";

                  return (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {row.partnerName || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {row.partnerEmail}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => setBankInfoTarget(row)}
                          >
                            <Landmark className="h-4 w-4" />
                            <span className="sr-only">Bank Info</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${typeMeta.className}`}
                        >
                          {typeMeta.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {row.commissionType === "sales" ? (
                          <div className="text-sm">
                            <p className="font-medium text-slate-800 truncate max-w-[200px]">
                              {row.leadName || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {row.serviceName || "—"}
                            </p>
                          </div>
                        ) : row.commissionType === "initial" ? (
                          <span className="text-xs text-slate-500">
                            Welcome bonus
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Monthly basic salary
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">
                        {row.period || "—"}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600">
                        {formatCurrency(row.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${statusMeta.className}`}
                        >
                          {statusMeta.label}
                        </span>
                        {isRejected && row.rejectionReason && (
                          <p
                            className="text-[11px] text-rose-600 mt-1 max-w-[180px] truncate"
                            title={row.rejectionReason}
                          >
                            {row.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.proofUrl ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => setProofPreview(row)}
                          >
                            <FileText className="h-3.5 w-3.5" /> View
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {isPending && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                onClick={() => openPayDialog(row)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Mark Paid
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => openRejectDialog(row)}
                              >
                                <X className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {(isPaid || isRejected) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 rounded-lg text-slate-600 hover:bg-slate-100"
                              onClick={() => handleRevert(row)}
                            >
                              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                              Revert
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pay Dialog */}
      <Dialog
        open={payState.open}
        onOpenChange={(open) => (open ? null : closePayDialog())}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Mark Commission as Paid</DialogTitle>
            <DialogDescription>
              {payState.commission?.partnerName} &mdash;{" "}
              {formatCurrency(payState.commission?.amount)} (
              {
                commissionTypeBadge[
                  payState.commission?.commissionType || "sales"
                ].label
              }
              )
            </DialogDescription>
          </DialogHeader>

          {payState.commission && (
            <div className="py-4 space-y-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank</span>
                  <span className="font-semibold text-slate-900">
                    {payState.commission.bankName || "Not configured"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-mono font-bold tracking-wider">
                    {payState.commission.bankAccountNumber || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Holder</span>
                  <span className="font-semibold text-slate-900">
                    {payState.commission.bankAccountHolder || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Transaction Reference (optional)</Label>
                <Input
                  placeholder="Bank transfer reference / receipt no."
                  value={payState.transactionReference}
                  onChange={(e) =>
                    setPayState((prev) => ({
                      ...prev,
                      transactionReference: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>
                  Proof of Payment <span className="text-rose-500">*</span>
                </Label>
                <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <UploadCloud className="h-7 w-7 text-slate-400 mb-2" />
                  {payState.file ? (
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-xs text-center px-4">
                      {payState.file.name}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-600">
                        Click to upload proof
                      </p>
                      <p className="text-xs text-slate-400">
                        JPG, PNG, or PDF (max 10MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={(e) =>
                      setPayState((prev) => ({
                        ...prev,
                        file: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closePayDialog}
              disabled={payState.uploading || payState.submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaySubmit}
              disabled={
                !payState.file || payState.uploading || payState.submitting
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {payState.uploading
                ? "Uploading..."
                : payState.submitting
                  ? "Saving..."
                  : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectState.open}
        onOpenChange={(open) => (open ? null : closeRejectDialog())}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Commission</DialogTitle>
            <DialogDescription>
              This will mark the commission as Rejected and requires a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-1.5">
            <Label>Reason</Label>
            <textarea
              className="w-full min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
              placeholder="Reason for rejection..."
              value={rejectState.reason}
              onChange={(e) =>
                setRejectState((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeRejectDialog}
              disabled={rejectState.submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              disabled={!rejectState.reason.trim() || rejectState.submitting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {rejectState.submitting ? "Rejecting..." : "Reject Commission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Preview Dialog */}
      <Dialog
        open={!!proofPreview}
        onOpenChange={(open) => (open ? null : setProofPreview(null))}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Transfer Proof</DialogTitle>
            <DialogDescription>
              {proofPreview?.partnerName} &mdash;{" "}
              {formatCurrency(proofPreview?.amount)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
            {proofPreview?.proofUrl ? (
              /\.(png|jpg|jpeg|gif|webp)$/i.test(proofPreview.proofUrl) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={buildProofAbsoluteUrl(proofPreview.proofUrl)}
                  alt="Proof"
                  className="max-h-[60vh] object-contain rounded-lg"
                />
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <p>This document format cannot be previewed.</p>
                  <a
                    href={buildProofAbsoluteUrl(proofPreview.proofUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-blue-600 hover:underline text-sm font-medium"
                  >
                    Open in new tab
                  </a>
                </div>
              )
            ) : null}
          </div>
          {proofPreview?.transactionReference && (
            <div className="text-sm text-slate-600 text-center">
              Transaction ref:{" "}
              <span className="font-mono font-semibold">
                {proofPreview.transactionReference}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bank Info Dialog */}
      <Dialog
        open={!!bankInfoTarget}
        onOpenChange={(open) => (open ? null : setBankInfoTarget(null))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bank Information</DialogTitle>
            <DialogDescription>
              Transfer destination for {bankInfoTarget?.partnerName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">
                Bank Name
              </span>
              <span className="col-span-2 text-sm font-semibold text-slate-900">
                {bankInfoTarget?.bankName || "Not configured"}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 border-b border-slate-100 pb-3">
              <span className="text-sm font-medium text-slate-500">
                Account Number
              </span>
              <span className="col-span-2 text-sm font-mono font-bold tracking-wider text-slate-900">
                {bankInfoTarget?.bankAccountNumber || "—"}
              </span>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="text-sm font-medium text-slate-500">
                Account Holder
              </span>
              <span className="col-span-2 text-sm font-semibold text-slate-900">
                {bankInfoTarget?.bankAccountHolder || "—"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommissionDisbursementPanel;
