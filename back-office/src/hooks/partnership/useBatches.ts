import { useState, useCallback, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const batchEventsUrl = apiBaseUrl
  ? `${apiBaseUrl}/back-office/batch/events`
  : "/api/v1/back-office/batch/events";
const ACTIVE_BATCH_REFRESH_INTERVAL_MS = 3000;

export interface AffiliateBatch {
  id: string;
  name: string;
  role?: string;
  landingPageLink?: string;
  trainingMaterialIds?: string[];
  initialCommissionTiers?: Array<{
    closedClients: number;
    amount: number;
    conditions?: unknown;
  }>;
  startDate: string;
  endDate: string;
  status: "draft" | "open" | "closed";
  effectiveStatus?: "draft" | "open" | "closed";
  closureReason?: "manually_closed" | "quota_full" | "date_passed" | null;
  applicationCount?: number;
  isQuotaFull?: boolean;
  isExpired?: boolean;
  initialCommissionAmount: number;
  examPassingScore: number;
  trainingPdfUrl: string | null;
  trainingVideoUrl: string | null;
  interviewQuestionIds?: string[];
  examQuestionIds?: string[];
  registrationQuota: number;
  autoCurateOnQuotaReached: boolean;
  autoCurateOnBatchClose: boolean;
  initialCommissionEnabled?: boolean;
  initialCommissionFullClientThreshold?: number;
  aiScreeningSummary?: string | null;
  aiScreeningDecisionRationale?: string | null;
  aiScreeningTopSignals?: string[];
  aiScreeningRiskSignals?: string[];
  aiScreeningRankedCandidates?: Array<{
    affiliateId: string;
    fullName: string;
    email: string;
    rank: number;
    score: number;
    passingThreshold: number;
    status: string;
    label: "Qualified" | "Unqualified";
    reason?: string | null;
  }>;
  aiScreeningTrigger?: string | null;
  aiScreeningStatus?:
    | "idle"
    | "queued"
    | "running"
    | "completed"
    | "failed"
    | null;
  aiScreeningTaskId?: string | null;
  aiScreeningQueuedAt?: string | null;
  aiScreeningStartedAt?: string | null;
  aiScreeningCompletedAt?: string | null;
  aiScreeningFailedAt?: string | null;
  aiScreeningError?: string | null;
  createdAt?: string;
}

export const useBatches = () => {
  const [batches, setBatches] = useState<AffiliateBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingBatchId, setSubmittingBatchId] = useState<string | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "open" | "closed">(
    "all",
  );

  const fetchBatches = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }
        const res = await axiosInstance.get("/back-office/batch");
        const data = res.data;
        if (data.statusCode === 200 || data.message === "Success") {
          setBatches(data.data);
        } else if (!silent) {
          toast.error("Failed to load batches");
        }
      } catch (err) {
        console.error(err);
        if (!silent) {
          toast.error("Error connecting to server");
        }
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(batchEventsUrl, { withCredentials: true });
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type !== "backoffice_batch_update" || !payload.data?.id)
            return;

          setBatches((prev) => {
            const existingIndex = prev.findIndex(
              (batch) => batch.id === payload.data.id,
            );
            if (existingIndex === -1) {
              return [payload.data, ...prev];
            }

            const next = [...prev];
            next[existingIndex] = {
              ...next[existingIndex],
              ...payload.data,
            };
            return next;
          });
        } catch {
          // Ignore malformed SSE payloads
        }
      };
      eventSource.onerror = () => {
        void fetchBatches({ silent: true });
      };
    } catch {
      // Silent fallback to manual refresh
    }

    return () => {
      eventSource?.close();
    };
  }, [fetchBatches]);

  useEffect(() => {
    const hasActiveBatchScreening = batches.some(
      (batch) =>
        batch.aiScreeningStatus === "queued" ||
        batch.aiScreeningStatus === "running",
    );

    if (!hasActiveBatchScreening) return;

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchBatches({ silent: true });
      }
    };

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchBatches({ silent: true });
      }
    }, ACTIVE_BATCH_REFRESH_INTERVAL_MS);

    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [batches, fetchBatches]);

  const createBatch = async (batchData: Partial<AffiliateBatch>) => {
    try {
      const res = await axiosInstance.post("/back-office/batch", batchData);
      const data = res.data;
      if (
        data.statusCode === 201 ||
        data.message === "Batch created successfully"
      ) {
        toast.success("Batch created successfully");
        fetchBatches();
        return true;
      }
      toast.error(data.message || "Failed to create batch");
      return false;
    } catch (err) {
      toast.error("Error creating batch");
      return false;
    }
  };

  const updateBatch = async (
    id: string,
    batchData: Partial<AffiliateBatch>,
  ) => {
    try {
      const res = await axiosInstance.put(
        `/back-office/batch/${id}`,
        batchData,
      );
      const data = res.data;
      if (
        data.statusCode === 200 ||
        data.message === "Batch updated successfully"
      ) {
        toast.success("Batch updated successfully");
        fetchBatches();
        return true;
      }
      toast.error(data.message || "Failed to update batch");
      return false;
    } catch (err) {
      toast.error("Error updating batch");
      return false;
    }
  };

  const deleteBatch = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this batch?"))
      return false;

    try {
      const res = await axiosInstance.delete(`/back-office/batch/${id}`);
      const data = res.data;
      if (
        data.statusCode === 200 ||
        data.message === "Batch deleted successfully"
      ) {
        toast.success("Batch deleted");
        fetchBatches();
        return true;
      }
      toast.error("Failed to delete batch");
      return false;
    } catch (err) {
      toast.error("Error deleting batch");
      return false;
    }
  };

  const curateBatch = async (id: string) => {
    const loadingToastId = toast.loading(
      "Queueing AI curation for this batch...",
    );
    setSubmittingBatchId(id);

    try {
      const res = await axiosInstance.post(`/back-office/screening/batch`, {
        batchId: id,
      });
      const data = res.data;
      if (data.status === "success") {
        toast.success(
          data.data?.message ||
            "AI curation has been queued and is now running in the background.",
          { id: loadingToastId },
        );
        await fetchBatches({ silent: true });
        return true;
      }
      toast.error("Failed to run curation", { id: loadingToastId });
      return false;
    } catch (err) {
      toast.error("Error running curation", { id: loadingToastId });
      return false;
    } finally {
      setSubmittingBatchId(null);
    }
  };

  const isBatchAiScreeningActive = useCallback(
    (batchId: string) => {
      const batch = batches.find((item) => item.id === batchId);
      return (
        batch?.aiScreeningStatus === "queued" ||
        batch?.aiScreeningStatus === "running"
      );
    },
    [batches],
  );

  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "all" || (b.effectiveStatus || b.status) === status;
    return matchesSearch && matchesStatus;
  });

  return {
    batches: filteredBatches,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    curatingBatchId: submittingBatchId,
    submittingBatchId,
    isBatchAiScreeningActive,
    createBatch,
    updateBatch,
    deleteBatch,
    curateBatch,
    refresh: fetchBatches,
  };
};
