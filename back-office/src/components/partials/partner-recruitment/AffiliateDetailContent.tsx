"use client";
/* eslint-disable no-nested-ternary */

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Loader2,
  Mail,
  Monitor,
  RotateCcw,
  Save,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import Header from "@/components/layout/header/Header";
import AffiliateDeleteDialog from "@/components/partials/dialog/AffiliateDeleteDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AffiliateDetail } from "@/constrant/affiliate";
import {
  approveInterviewApplication,
  getApplication,
  resendApplicationEmail,
  revertFinalDecision,
} from "@/lib/api/affiliate";
import {
  deleteSession,
  getSession,
  regenerateAiReview,
  resetSession,
  scoreSession,
  type AnswerScore,
} from "@/lib/api/assessment";
import { failedToast, successToast } from "@/utils/toast";
import { cn } from "@/lib/utils";

type FetchOptions = {
  silent?: boolean;
};

type SessionDetail = {
  affiliate?: Record<string, any>;
  registration?: Record<string, any> | null;
  session?: Record<string, any>;
  answers?: Record<string, any>[];
};

type SubmissionActionDialog = { mode: "delete" } | { mode: "reset" } | null;

type FinalDecisionDialog = { mode: "revert" } | null;

type DetailSection = "overview" | "ai" | "assessment" | "security";

type EmailResendStep =
  | "interview_invitation"
  | "training_invitation"
  | "exam_invitation"
  | "assessment_result"
  | "approval"
  | "rejection";

type EmailFlowItem = {
  step: EmailResendStep;
  title: string;
  description: string;
  lastSentLabel: string;
  caution?: string;
};

const statusStyles: Record<AffiliateDetail["status"], string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  qualified: "bg-sky-100 text-sky-700 border-sky-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
};

const statusDotStyles: Record<AffiliateDetail["status"], string> = {
  pending: "bg-amber-500",
  qualified: "bg-sky-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
};

const assessmentStatusStyles: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-700 border-slate-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  submitted: "bg-amber-100 text-amber-700 border-amber-200",
  scored: "bg-purple-100 text-purple-700 border-purple-200",
  passed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
};

const assessmentStatusLabels: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  submitted: "Submitted",
  scored: "Scored",
  passed: "Passed",
  failed: "Failed",
};

const securityRiskStyles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-rose-100 text-rose-700 border-rose-200",
};

const hasFinalDecision = (application?: AffiliateDetail | null) =>
  !!application &&
  ["approved", "rejected"].includes(application.status) &&
  Boolean(application.reviewedAt);

const hasStartedCertification = (application?: AffiliateDetail | null) =>
  !!application &&
  (application.assessmentTrainingStatus === "completed" ||
    ["in_progress", "submitted", "scored", "passed", "failed"].includes(
      String(application.assessmentStatus || ""),
    ));

const hasReachedTrainingStage = (application?: AffiliateDetail | null) =>
  !!application &&
  (application.assessmentInterviewStatus === "approved" ||
    application.assessmentTrainingStatus === "in_progress" ||
    application.assessmentTrainingStatus === "completed" ||
    hasStartedCertification(application));

const getEffectiveApplicationStatus = (application?: AffiliateDetail | null) =>
  application?.status || null;

const getEligibilityLabel = (value?: string | null) => {
  if (!value) return "Pending";

  const normalized = String(value).trim().toLowerCase();

  if (
    [
      "strong_candidate",
      "qualified_candidate",
      "recommended",
      "eligible",
      "pass",
      "passed",
      "approve",
      "approved",
    ].includes(normalized)
  ) {
    return "Eligible";
  }

  if (
    [
      "borderline_candidate",
      "not_recommended",
      "not eligible",
      "not_eligible",
      "fail",
      "failed",
      "reject",
      "rejected",
    ].includes(normalized)
  ) {
    return "Not Eligible";
  }

  return "Pending";
};

const isNotEligibleRecommendation = (value?: string | null) =>
  getEligibilityLabel(value) === "Not Eligible";

function InfoCard({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "N/A"
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      {typeof displayValue === "string" && isLinkValue(displayValue) ? (
        <a
          href={displayValue}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 break-all text-sm font-semibold text-blue-600 hover:underline"
        >
          {displayValue}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <p className="mt-2 break-words text-sm font-semibold text-slate-900">
          {displayValue}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {meta ? <p className="text-sm text-slate-500">{meta}</p> : null}
    </div>
  );
}

function StatChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value?: string | number | null;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "warning"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : tone === "danger"
          ? "bg-rose-50 text-rose-700 border-rose-100"
          : tone === "info"
            ? "bg-sky-50 text-sky-700 border-sky-100"
            : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div
      className={cn("min-w-[140px] rounded-2xl border px-4 py-3", toneClasses)}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] opacity-80">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold">{value || "N/A"}</p>
    </div>
  );
}

function DetailList({
  items,
}: {
  items: {
    label: string;
    value?: string | number | boolean | null;
    multiline?: boolean;
    href?: string | null;
    linkLabel?: string;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const displayValue =
          item.value === null || item.value === undefined || item.value === ""
            ? "N/A"
            : typeof item.value === "boolean"
              ? item.value
                ? "Yes"
                : "No"
              : String(item.value);

        return (
          <div
            key={item.label}
            className={cn(
              "grid gap-2 px-5 py-4 md:grid-cols-[220px_minmax(0,1fr)]",
              index !== items.length - 1 ? "border-b border-slate-100" : "",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-sm font-semibold text-blue-600 hover:underline"
              >
                {item.linkLabel || displayValue}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : typeof displayValue === "string" &&
              isLinkValue(displayValue) ? (
              <a
                href={displayValue}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-sm font-semibold text-blue-600 hover:underline"
              >
                {displayValue}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p
                className={cn(
                  "text-sm text-slate-800",
                  item.multiline
                    ? "whitespace-pre-line leading-7"
                    : "font-medium",
                )}
              >
                {displayValue}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const buildResumePreviewHref = (
  applicationId: string,
  batchId: string,
  candidateName?: string | null,
  resumeUrl?: string | null,
) => {
  if (!resumeUrl) return null;
  const params = new URLSearchParams();
  params.set("url", resumeUrl);
  if (candidateName) {
    params.set("name", candidateName);
  }
  return `/partner-recruitment-system/batches/${batchId}/applicants/${applicationId}/resume-preview?${params.toString()}`;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value ?? "N/A";
  }
};

const formatDuration = (seconds?: number | null) => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

const getJourneyStage = (application?: AffiliateDetail | null) => {
  if (!application) {
    return {
      label: "Unknown",
      description: "Candidate data is not available yet.",
      tone: "default" as const,
    };
  }

  if (application.status === "approved" && hasFinalDecision(application)) {
    return {
      label: "Onboarded",
      description:
        "Candidate has completed the journey and is already approved.",
      tone: "success" as const,
    };
  }

  if (application.status === "rejected" && hasFinalDecision(application)) {
    return {
      label: "Rejected",
      description: "Candidate has reached a final rejected outcome.",
      tone: "danger" as const,
    };
  }

  if (hasStartedCertification(application)) {
    return {
      label: "Certification",
      description: "Candidate is in the certification and assessment stage.",
      tone: "info" as const,
    };
  }

  if (hasReachedTrainingStage(application)) {
    return {
      label: "Training Session",
      description: "Candidate is progressing through the training stage.",
      tone: "warning" as const,
    };
  }

  if (application.status === "qualified") {
    return {
      label: "Qualification",
      description:
        "Candidate passed screening and is progressing through qualification checks.",
      tone: "info" as const,
    };
  }

  return {
    label: "New Application",
    description: "Candidate is still in the initial application review stage.",
    tone: "default" as const,
  };
};

const getNextActionSummary = (
  application?: AffiliateDetail | null,
  interviewReviewPending?: boolean,
) => {
  if (!application) {
    return {
      title: "Loading candidate context",
      description: "Please wait while the latest application data is loaded.",
    };
  }

  if (application.status === "approved" && hasFinalDecision(application)) {
    return {
      title: "No action needed",
      description: "This candidate is already approved and onboarded.",
    };
  }

  if (application.status === "rejected" && hasFinalDecision(application)) {
    return {
      title: "No action needed",
      description: "This candidate already has a final rejected decision.",
    };
  }

  if (application.assessmentInterviewStatus === "submitted") {
    return {
      title: "Interview approval needed",
      description:
        "Review the submitted video interview. If approved, the remaining steps continue automatically.",
    };
  }

  if (application.assessmentStatus === "passed") {
    return {
      title: "Automatic onboarding in progress",
      description:
        "The candidate passed certification. The system will onboard them automatically and send the account email.",
    };
  }

  if (application.assessmentStatus === "failed") {
    const attemptCount = Number(application.assessmentExamAttemptCount || 0);
    const maxAttempts = Number(application.assessmentMaxExamAttempts || 2);
    const canRetry = attemptCount < maxAttempts;

    return {
      title: canRetry ? "Retry path available" : "Final failed outcome",
      description: canRetry
        ? "The candidate can return to training and retry the certification exam."
        : "The candidate has reached the maximum exam attempts and has been disqualified.",
    };
  }

  if (interviewReviewPending) {
    return {
      title: "Interview approval needed",
      description:
        "Only the submitted interview requires admin approval. After that, AI handles scoring, retry, and the final outcome.",
    };
  }

  if (application.assessmentStatus === "submitted") {
    return {
      title: "Assessment review pending",
      description:
        "The candidate has submitted the exam and is waiting for scoring or final review.",
    };
  }

  if (application.assessmentStatus === "in_progress") {
    return {
      title: "Candidate still working",
      description:
        "The candidate is still inside the certification stage and has not submitted yet.",
    };
  }

  if (application.assessmentTrainingStatus === "in_progress") {
    return {
      title: "Training in progress",
      description:
        "The candidate is still completing the training session before certification.",
    };
  }

  return {
    title: "Waiting for candidate progression",
    description:
      "The candidate has moved forward, but the next candidate-side step is not completed yet.",
  };
};

const normalizeLink = (value: string) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
};

const splitLinks = (value?: string | null) => {
  if (!value) return [];
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseSecurityFlags = (securityFlags?: string | null) => {
  if (!securityFlags) return [];
  try {
    const parsed = JSON.parse(securityFlags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [securityFlags];
  }
};

const parseJsonStringList = (value?: string | null) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
};

const parseJsonObject = (value?: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const parseQuestionOptions = (questionOptions?: string | any[]) => {
  if (!questionOptions) return [];
  if (Array.isArray(questionOptions)) return questionOptions;
  try {
    const parsed = JSON.parse(questionOptions);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "string") {
      const reparsed = JSON.parse(parsed);
      return Array.isArray(reparsed) ? reparsed : [];
    }
    return [];
  } catch {
    if (typeof questionOptions === "string") {
      try {
        const normalized = questionOptions.replace(/\\"/g, '"');
        const reparsed = JSON.parse(normalized);
        return Array.isArray(reparsed) ? reparsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
};

const prettifyLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const isLinkValue = (value: string) => /^https?:\/\//i.test(value);

const emailStepLabels: Record<EmailResendStep, string> = {
  interview_invitation: "Video Interview Invitation",
  training_invitation: "AI Training Invitation",
  exam_invitation: "Certification Invitation",
  assessment_result: "Assessment Result",
  approval: "Approval / Account Access",
  rejection: "Rejection Notice",
};

const AffiliateDetailContent = ({
  applicationId,
  batchId,
}: {
  applicationId: string;
  batchId: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [application, setApplication] = useState<AffiliateDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionDetail, setSubmissionDetail] =
    useState<SessionDetail | null>(null);
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
  const [isSubmissionSaving, setIsSubmissionSaving] = useState(false);
  const [scores, setScores] = useState<AnswerScore[]>([]);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [submissionActionDialog, setSubmissionActionDialog] =
    useState<SubmissionActionDialog>(null);
  const [isSubmissionActionLoading, setIsSubmissionActionLoading] =
    useState(false);
  const [finalDecisionDialog, setFinalDecisionDialog] =
    useState<FinalDecisionDialog>(null);
  const [isFinalDecisionLoading, setIsFinalDecisionLoading] = useState(false);
  const [regeneratingPhase, setRegeneratingPhase] = useState<string | null>(
    null,
  );
  const [activeSection, setActiveSection] = useState<DetailSection>("overview");
  const [emailResendDialog, setEmailResendDialog] =
    useState<EmailFlowItem | null>(null);
  const [isEmailResending, setIsEmailResending] = useState(false);
  const [isApprovingInterview, setIsApprovingInterview] = useState(false);

  const backHref = useMemo(() => {
    const query = searchParams.toString();
    const basePath = `/partner-recruitment-system/batches/${batchId}`;
    return query ? `${basePath}?${query}` : basePath;
  }, [searchParams, batchId]);

  const fetchApplication = useCallback(
    async (options?: FetchOptions) => {
      if (!applicationId) return;
      if (options?.silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
        setError(null);
      }
      try {
        const response = await getApplication(applicationId);
        setApplication(response.data?.data as AffiliateDetail);
        setError(null);
      } catch (err: any) {
        const status = err?.response?.status;
        const message =
          status === 404
            ? "Application not found."
            : "Failed to load affiliate application.";
        setError(message);
        failedToast(message);
      } finally {
        if (options?.silent) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [applicationId],
  );

  const fetchSubmissionDetail = useCallback(
    async (sessionId: string, options?: FetchOptions) => {
      try {
        if (!options?.silent) {
          setIsSubmissionLoading(true);
        }
        const response = await getSession(sessionId);
        const data = response.data as SessionDetail;
        setSubmissionDetail(data);
        setReviewerNotes(data.session?.reviewerNotes || "");

        const initialScores = (data.answers || [])
          .filter(
            (answer) =>
              answer.questionType === "essay" ||
              answer.questionType === "video_introduction",
          )
          .map((answer) => ({
            answerId: answer.id,
            score: Number(answer.reviewerScore ?? answer.score ?? 0),
            feedback: answer.reviewerFeedback || "",
          }));

        setScores(initialScores);
      } catch (err: any) {
        failedToast(
          "Failed to load assessment detail",
          err.response?.data?.error || err.message,
        );
      } finally {
        setIsSubmissionLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  useEffect(() => {
    if (application?.assessmentSessionId) {
      fetchSubmissionDetail(application.assessmentSessionId);
    } else {
      setSubmissionDetail(null);
      setScores([]);
      setReviewerNotes("");
    }
  }, [application?.assessmentSessionId, fetchSubmissionDetail]);

  const handleDeleted = async () => {
    const destination = backHref;
    router.push(destination);
  };

  const getManualScore = (answerId: string) =>
    scores.find((item) => item.answerId === answerId);

  const updateManualScore = (
    answerId: string,
    field: "score" | "feedback",
    value: string | number,
  ) => {
    setScores((prev) =>
      prev.map((item) =>
        item.answerId === answerId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSaveSubmissionReview = async () => {
    if (!application?.assessmentSessionId) return;

    try {
      setIsSubmissionSaving(true);
      await scoreSession(application.assessmentSessionId, {
        scores,
        reviewerNotes,
      });
      successToast("Success", "Assessment review saved successfully");
      await fetchApplication({ silent: true });
      await fetchSubmissionDetail(application.assessmentSessionId, {
        silent: true,
      });
    } catch (err: any) {
      failedToast(
        "Failed to save assessment review",
        err.response?.data?.error || err.message,
      );
    } finally {
      setIsSubmissionSaving(false);
    }
  };

  const handleSubmissionAction = async () => {
    if (!application?.assessmentSessionId || !submissionActionDialog) return;

    try {
      setIsSubmissionActionLoading(true);

      if (submissionActionDialog.mode === "delete") {
        await deleteSession(application.assessmentSessionId);
        successToast("Success", "Assessment submission deleted successfully");
      } else {
        await resetSession(application.assessmentSessionId);
        successToast("Success", "Assessment submission reset successfully");
      }

      setSubmissionActionDialog(null);
      await fetchApplication({ silent: true });
    } catch (err: any) {
      failedToast(
        submissionActionDialog.mode === "delete"
          ? "Failed to delete submission"
          : "Failed to reset submission",
        err.response?.data?.error || err.message,
      );
    } finally {
      setIsSubmissionActionLoading(false);
    }
  };

  const handleRevertFinalDecision = async () => {
    if (!application || !finalDecisionDialog) return;

    try {
      setIsFinalDecisionLoading(true);
      await revertFinalDecision(application.id);
      successToast("Success", "Final decision returned to review state");
      setFinalDecisionDialog(null);
      await fetchApplication({ silent: true });
    } catch (err: any) {
      failedToast(
        "Failed to return candidate to review",
        err.response?.data?.message || err.message,
      );
    } finally {
      setIsFinalDecisionLoading(false);
    }
  };

  const handleRegenerateAiReview = async (
    phase: "initial" | "exam" | "final" | "all",
  ) => {
    if (!application) return;

    try {
      setRegeneratingPhase(phase);
      await regenerateAiReview(application.id, phase);
      successToast(
        "Success",
        `AI ${phase} review has been queued and will continue in the background`,
      );
    } catch (err: any) {
      failedToast(
        "Failed to regenerate AI review",
        err.response?.data?.error || err.message,
      );
    } finally {
      setRegeneratingPhase(null);
    }
  };

  const handleResendEmail = async () => {
    if (!application || !emailResendDialog) return;

    try {
      setIsEmailResending(true);
      const response = await resendApplicationEmail(
        application.id,
        emailResendDialog.step,
      );
      successToast(
        "Success",
        response.data?.data?.message ||
          `${emailStepLabels[emailResendDialog.step]} resent successfully`,
      );
      setEmailResendDialog(null);
      await fetchApplication({ silent: true });
      if (application.assessmentSessionId) {
        await fetchSubmissionDetail(application.assessmentSessionId, {
          silent: true,
        });
      }
    } catch (err: any) {
      failedToast(
        "Failed to resend email",
        err.response?.data?.message || err.response?.data?.error || err.message,
      );
    } finally {
      setIsEmailResending(false);
    }
  };

  const handleApproveInterview = async () => {
    if (!application) return;

    try {
      setIsApprovingInterview(true);
      const response = await approveInterviewApplication(application.id);
      successToast(
        "Success",
        response.data?.data?.message ||
          "Interview approved and training email sent",
      );
      await fetchApplication({ silent: true });
      if (application.assessmentSessionId) {
        await fetchSubmissionDetail(application.assessmentSessionId, {
          silent: true,
        });
      }
    } catch (err: any) {
      failedToast(
        "Failed to approve interview",
        err.response?.data?.message || err.message,
      );
    } finally {
      setIsApprovingInterview(false);
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-8">
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );

  const renderBadge = (status: AffiliateDetail["status"]) => (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
      )}
    >
      <span
        className={cn("h-2.5 w-2.5 rounded-full", statusDotStyles[status])}
      />
      {status}
    </span>
  );

  const renderSectionButton = (section: DetailSection, label: string) => (
    <button
      type="button"
      onClick={() => setActiveSection(section)}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        activeSection === section
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      )}
    >
      {label}
    </button>
  );

  const infoItems = [
    { label: "Full name", value: application?.fullName },
    { label: "Email", value: application?.email },
    { label: "Phone", value: application?.phone ?? "N/A" },
    { label: "Country", value: application?.country },
  ];

  const detailItems = [
    { label: "Current Occupation", value: application?.occupation ?? "N/A" },
    { label: "Sales Experience", value: application?.salesExperience ?? "N/A" },
    { label: "Has Sold SaaS", value: application?.hasSoldSaaS ?? "N/A" },
    { label: "Sales Style", value: application?.salesStyle ?? "N/A" },
    { label: "Income Goal", value: application?.incomeGoal ?? "N/A" },
    {
      label: "How They Heard About Us",
      value: application?.hearAboutUs ?? "N/A",
    },
    {
      label: "Why Choose",
      value: application?.whyChoose ?? "N/A",
      multiline: true,
    },
    application?.resumeUrl
      ? {
          label: "Resume / CV",
          value: application.resumeUrl,
          href: buildResumePreviewHref(
            application.id,
            batchId,
            application.fullName,
            application.resumeUrl,
          ),
          linkLabel: "Open resume preview",
        }
      : { label: "Resume / CV", value: "No resume uploaded." },
  ];

  const technicalItems = [
    { label: "IP Address", value: application?.ipAddress ?? "N/A" },
    { label: "User Agent", value: application?.userAgent ?? "N/A" },
  ];

  const session = submissionDetail?.session || {};
  const registration = submissionDetail?.registration || {};
  const answers = submissionDetail?.answers || [];
  const securityFlags = parseSecurityFlags(session.securityFlags);
  const aiScreeningScore =
    typeof application?.screeningScore === "number"
      ? application.screeningScore.toFixed(1)
      : application?.notes?.match(/AI Screening Score: ([\d.]+)%/)?.[1] || null;
  const screeningStrengths = parseJsonStringList(
    application?.screeningStrengths,
  );
  const screeningWeaknesses = parseJsonStringList(
    application?.screeningWeaknesses,
  );
  const screeningRecommendationLabel = getEligibilityLabel(
    application?.screeningRecommendation,
  );
  const screeningSummary =
    application?.screeningSummary ||
    application?.notes ||
    "No screening notes were recorded for this candidate.";
  const screeningGeneratedAt = formatDateTime(
    application?.screeningCompletedAt ?? undefined,
  );
  const examAiStrengths = parseJsonStringList(
    application?.assessmentAiExamStrengths ||
      submissionDetail?.session?.aiExamStrengths,
  );
  const examAiWeaknesses = parseJsonStringList(
    application?.assessmentAiExamWeaknesses ||
      submissionDetail?.session?.aiExamWeaknesses,
  );
  const examRecommendationValue =
    application?.assessmentAiExamRecommendation ||
    submissionDetail?.session?.aiExamRecommendation;
  const examRecommendationLabel = getEligibilityLabel(examRecommendationValue);
  const examSummary =
    application?.assessmentAiExamSummary ||
    submissionDetail?.session?.aiExamSummary ||
    "Exam AI summary is not available yet.";
  const examRationale =
    application?.assessmentAiExamDecisionRationale ||
    submissionDetail?.session?.aiExamDecisionRationale ||
    "No AI rationale generated yet.";
  const examGeneratedAt = formatDateTime(
    application?.assessmentAiExamCompletedAt ||
      submissionDetail?.session?.aiExamCompletedAt,
  );
  const finalAiStrengths = parseJsonStringList(
    application?.assessmentAiFinalStrengths ||
      submissionDetail?.session?.aiFinalStrengths,
  );
  const finalAiWeaknesses = parseJsonStringList(
    application?.assessmentAiFinalWeaknesses ||
      submissionDetail?.session?.aiFinalWeaknesses,
  );
  const finalAiAnalysis = useMemo(() => {
    const raw =
      application?.assessmentAiFinalAnalysisJson ||
      submissionDetail?.session?.aiFinalAnalysisJson;
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [
    application?.assessmentAiFinalAnalysisJson,
    submissionDetail?.session?.aiFinalAnalysisJson,
  ]);
  const finalRecommendationValue =
    application?.assessmentAiFinalRecommendation ||
    submissionDetail?.session?.aiFinalRecommendation;
  const finalRecommendationLabel = getEligibilityLabel(
    finalRecommendationValue,
  );
  const finalSummary =
    application?.assessmentAiFinalSummary ||
    submissionDetail?.session?.aiFinalSummary ||
    "Final AI summary is not available yet.";
  const finalRationale =
    application?.assessmentAiFinalDecisionRationale ||
    submissionDetail?.session?.aiFinalDecisionRationale ||
    "No final AI rationale generated yet.";
  const finalGeneratedAt = formatDateTime(
    application?.assessmentAiFinalCompletedAt ||
      submissionDetail?.session?.aiFinalCompletedAt,
  );
  const finalDecisionHighlights = [
    {
      label: "Initial screening",
      value: finalAiAnalysis?.phaseSummary?.initialScreening,
    },
    {
      label: "Exam performance",
      value: finalAiAnalysis?.phaseSummary?.examPhase,
    },
    {
      label: "Overall view",
      value: finalAiAnalysis?.phaseSummary?.combinedView,
    },
    {
      label: "Exam attempts",
      value: finalAiAnalysis?.phaseSummary?.examAttempts,
    },
  ].filter((item) => item.value);
  const securityAnalysis = useMemo(
    () =>
      parseJsonObject(
        session.securityAnalysisJson ||
          application?.assessmentSecurityAnalysisJson ||
          null,
      ),
    [session.securityAnalysisJson, application?.assessmentSecurityAnalysisJson],
  );
  const securityReasons = Array.isArray(securityAnalysis?.reasons)
    ? securityAnalysis.reasons
    : [];
  const securityStrengths = Array.isArray(securityAnalysis?.strengths)
    ? securityAnalysis.strengths
    : [];
  const securityRiskLevel = String(
    session.securityRiskLevel ||
      application?.assessmentSecurityRiskLevel ||
      "low",
  ).toLowerCase();
  const securityRiskScore = Number(
    session.securityRiskScore ?? application?.assessmentSecurityRiskScore ?? 0,
  );
  const securityReviewRequired = Boolean(
    session.securityReviewRequired ??
    application?.assessmentSecurityReviewRequired ??
    false,
  );
  const effectiveApplicationStatus = getEffectiveApplicationStatus(application);
  const interviewReviewPending =
    !!application &&
    effectiveApplicationStatus === "qualified" &&
    application.assessmentInterviewStatus === "submitted";
  const summaryChips: Array<{
    label: string;
    value: string;
    tone: "default" | "success" | "warning" | "danger" | "info";
  }> = application
    ? [
        {
          label: "Status",
          value: String(
            effectiveApplicationStatus || application.status || "N/A",
          ),
          tone:
            effectiveApplicationStatus === "approved"
              ? "success"
              : effectiveApplicationStatus === "rejected"
                ? "danger"
                : effectiveApplicationStatus === "qualified"
                  ? "info"
                  : "warning",
        },
        {
          label: "Batch",
          value: String(application.batchName || "N/A"),
          tone: "default",
        },
        {
          label: "Screening",
          value: aiScreeningScore ? `${aiScreeningScore}%` : "Pending",
          tone: "info",
        },
        {
          label: "Assessment",
          value: application.assessmentStatus
            ? String(
                assessmentStatusLabels[application.assessmentStatus] ||
                  application.assessmentStatus,
              )
            : "Not started",
          tone: application.assessmentIsPassed
            ? "success"
            : application.assessmentStatus === "failed"
              ? "danger"
              : "default",
        },
        {
          label: "Automation",
          value: interviewReviewPending
            ? "Waiting for interview approval"
            : "Automatic after interview approval",
          tone: interviewReviewPending ? "warning" : "default",
        },
      ]
    : [];
  const journeyStage = getJourneyStage(application);
  const nextActionSummary = getNextActionSummary(
    application,
    interviewReviewPending,
  );
  const canRevertFinalDecision =
    process.env.NODE_ENV === "development" &&
    !!application &&
    ["approved", "rejected"].includes(application.status);
  const canApproveInterview =
    !!application &&
    effectiveApplicationStatus === "qualified" &&
    application.assessmentInterviewStatus === "submitted";
  const emailFlowItems: EmailFlowItem[] = useMemo(() => {
    if (!application) return [];

    const items: EmailFlowItem[] = [
      {
        step: "interview_invitation",
        title: "Video Interview Invitation",
        description:
          "Sent after AI screening qualifies the candidate and unlocks the video interview stage.",
        lastSentLabel: session.interviewInvitationSentAt
          ? formatDateTime(session.interviewInvitationSentAt)
          : "Not recorded yet",
      },
    ];

    if (
      session.interviewStatus === "approved" ||
      session.trainingInvitationSentAt
    ) {
      items.push({
        step: "training_invitation",
        title: "AI Training Invitation",
        description:
          "Sent after the admin approves the submitted video interview.",
        lastSentLabel: session.trainingInvitationSentAt
          ? formatDateTime(session.trainingInvitationSentAt)
          : "Not recorded yet",
      });
    }

    if (
      session.trainingStatus === "completed" ||
      session.examInvitationSentAt
    ) {
      items.push({
        step: "exam_invitation",
        title: "Certification Invitation",
        description:
          "Sent when training is completed so the candidate can continue straight away or reopen the exam later from email.",
        lastSentLabel: session.examInvitationSentAt
          ? formatDateTime(session.examInvitationSentAt)
          : "Not recorded yet",
      });
    }

    const attemptCount = Number(application.assessmentExamAttemptCount || 0);
    const maxAttempts = Number(application.assessmentMaxExamAttempts || 2);
    const hasFinalAssessmentEmail =
      String(application.assessmentStatus || "") === "passed" ||
      (String(application.assessmentStatus || "") === "failed" &&
        attemptCount >= maxAttempts);

    if (hasFinalAssessmentEmail) {
      items.push({
        step: "assessment_result",
        title: "Assessment Result",
        description:
          "Pass result email or final failed outcome email, depending on the candidate's certification result.",
        lastSentLabel: application.assessmentScoredAt
          ? `${formatDateTime(application.assessmentScoredAt)} (score completed)`
          : "Ready but send timestamp is not tracked",
      });
    }

    if (application.status === "approved") {
      items.push({
        step: "approval",
        title: "Approval / Account Access",
        description:
          "Final approval email for partner portal access, including password reset access and a temporary password.",
        lastSentLabel: application.reviewedAt
          ? `${formatDateTime(application.reviewedAt)} (decision recorded)`
          : "Ready but send timestamp is not tracked",
        caution:
          "Resending approval will generate a new temporary password and require the candidate to reset it again.",
      });
    }

    if (application.status === "rejected") {
      items.push({
        step: "rejection",
        title: "Rejection Notice",
        description:
          "Final rejection email that informs the candidate of the admin decision.",
        lastSentLabel: application.reviewedAt
          ? `${formatDateTime(application.reviewedAt)} (decision recorded)`
          : "Ready but send timestamp is not tracked",
      });
    }

    return items;
  }, [
    application,
    session.examInvitationSentAt,
    session.interviewInvitationSentAt,
    session.interviewStatus,
    session.trainingStatus,
    session.trainingInvitationSentAt,
  ]);

  if (!applicationId) {
    return null;
  }

  let content: ReactNode = null;

  if (isLoading) {
    content = renderSkeleton();
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-rose-200 bg-rose-50/40 p-16 text-center">
        <div>
          <p className="text-lg font-semibold text-rose-700">
            We couldn&apos;t load this application
          </p>
          <p className="text-sm text-rose-600">{error}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-gray-300 px-5 text-sm text-slate-600"
            onClick={() => fetchApplication()}
          >
            Try again
          </Button>
          <Button
            asChild
            variant="addData"
            className="rounded-full px-5 text-sm"
          >
            <Link href={backHref}>Go to list</Link>
          </Button>
        </div>
      </div>
    );
  } else if (application) {
    content = (
      <div className="flex flex-col gap-10">
        <div className="sticky top-20 z-10 bg-background/95 pb-2 pt-1 backdrop-blur">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm">
            {renderSectionButton("overview", "Candidate Summary")}
            {renderSectionButton("ai", "AI Decisions")}
            {renderSectionButton("assessment", "Assessment Review")}
            {renderSectionButton("security", "Security")}
          </div>
        </div>

        {activeSection === "overview" ? (
          <>
            <div className="overflow-hidden rounded-[28px] border border-border bg-white">
              <div className="border-b border-slate-100 px-6 py-6">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {renderBadge(
                        (effectiveApplicationStatus ||
                          "pending") as AffiliateDetail["status"],
                      )}
                      <span className="text-sm text-slate-500">
                        Reviewed at{" "}
                        {formatDateTime(application.reviewedAt ?? undefined)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                        {application.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {application.email} • {application.phone || "No phone"}{" "}
                        • {application.country}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Decision Snapshot
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {nextActionSummary.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {nextActionSummary.description}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <StatChip
                          label="Stage"
                          value={journeyStage.label}
                          tone={journeyStage.tone}
                        />
                        <StatChip
                          label="Batch"
                          value={String(application.batchName || "N/A")}
                        />
                        <StatChip
                          label="Interview Review"
                          value={
                            application.assessmentInterviewStatus
                              ? prettifyLabel(
                                  application.assessmentInterviewStatus,
                                )
                              : "Pending"
                          }
                          tone={
                            application.assessmentInterviewStatus === "approved"
                              ? "success"
                              : application.assessmentInterviewStatus ===
                                  "submitted"
                                ? "warning"
                                : "default"
                          }
                        />
                        <StatChip
                          label="Owner"
                          value={
                            application.reviewerName ||
                            application.reviewerId ||
                            (interviewReviewPending ? "Pending" : "N/A")
                          }
                        />
                        <StatChip
                          label="Applied"
                          value={formatDateTime(
                            application.createdAt ?? undefined,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto px-6 py-5">
                {summaryChips.map((chip) => (
                  <StatChip
                    key={chip.label}
                    label={chip.label}
                    value={chip.value}
                    tone={chip.tone}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6 rounded-[28px] border border-border bg-white p-6">
              <SectionHeader title="Candidate Profile" />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {infoItems.map((item) => (
                  <InfoCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
              <DetailList items={detailItems} />
              <div className="grid gap-6 xl:grid-cols-2">
                <div className="space-y-4">
                  <SectionHeader title="Submitted Materials" />
                  <DetailList
                    items={[
                      {
                        label: "Video Interview URL",
                        value:
                          application.assessmentInterviewSubmittedLink ||
                          application.videoUrl ||
                          "No video interview URL submitted.",
                      },
                      {
                        label: "Resume Status",
                        value: application.resumeUrl
                          ? "Resume uploaded"
                          : "No resume uploaded",
                      },
                    ]}
                  />
                </div>
                <div className="space-y-4">
                  <SectionHeader title="System Metadata" />
                  <DetailList
                    items={[
                      { label: "City", value: application.city || "N/A" },
                      ...technicalItems,
                    ]}
                  />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeSection === "ai" && application.assessmentSessionId ? (
          <>
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <SectionHeader title="Initial Qualification" />
                <div className="flex flex-wrap gap-3">
                  <StatChip
                    label="Application Status"
                    value={effectiveApplicationStatus || application.status}
                    tone="info"
                  />
                  <StatChip
                    label="Screening Score"
                    value={aiScreeningScore ? `${aiScreeningScore}%` : "N/A"}
                    tone="info"
                  />
                  <StatChip
                    label="Threshold"
                    value={
                      application.screeningPassingScore
                        ? `${application.screeningPassingScore}%`
                        : "N/A"
                    }
                  />
                  <StatChip
                    label="Submitted"
                    value={formatDateTime(application.createdAt ?? undefined)}
                  />
                </div>
              </div>
              <div
                className={cn(
                  "rounded-[28px] border p-5",
                  isNotEligibleRecommendation(
                    application.screeningRecommendation,
                  )
                    ? "border-rose-200 bg-[linear-gradient(180deg,#fff8f8_0%,#ffffff_100%)]"
                    : "border-sky-200 bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)]",
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Decision
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
                          isNotEligibleRecommendation(
                            application.screeningRecommendation,
                          )
                            ? "bg-rose-100 text-rose-700"
                            : "bg-sky-100 text-sky-700",
                        )}
                      >
                        {screeningRecommendationLabel}
                      </span>
                      <span className="text-sm text-slate-500">
                        Generated {screeningGeneratedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Executive Summary
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {screeningSummary}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Decision Highlights
                    </p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          AI recommendation
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {screeningRecommendationLabel}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Screening score
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {aiScreeningScore ? `${aiScreeningScore}%` : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-emerald-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                      What Supports This Decision
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {screeningStrengths.length > 0 ? (
                        screeningStrengths.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No strengths captured yet.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-rose-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-rose-700">
                      What Needs Attention
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {screeningWeaknesses.length > 0 ? (
                        screeningWeaknesses.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No concerns captured yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleRegenerateAiReview("initial")}
                    disabled={regeneratingPhase !== null}
                  >
                    {regeneratingPhase === "initial" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Regenerate Phase 1 AI
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
              <div
                className={cn(
                  "rounded-[28px] border p-5",
                  isNotEligibleRecommendation(examRecommendationValue)
                    ? "border-rose-200 bg-[linear-gradient(180deg,#fff8f8_0%,#ffffff_100%)]"
                    : "border-violet-200 bg-[linear-gradient(180deg,#faf7ff_0%,#ffffff_100%)]",
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <SectionHeader title="Exam Review" />
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
                          isNotEligibleRecommendation(examRecommendationValue)
                            ? "bg-rose-100 text-rose-700"
                            : "bg-violet-100 text-violet-700",
                        )}
                      >
                        {examRecommendationLabel}
                      </span>
                      <span className="text-sm text-slate-500">
                        Generated {examGeneratedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Executive Summary
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {examSummary}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Decision Notes
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {examRationale}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-3xl border border-emerald-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                      What Supports This Decision
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {examAiStrengths.length > 0 ? (
                        examAiStrengths.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No strengths captured yet.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-rose-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-rose-700">
                      What Needs Attention
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {examAiWeaknesses.length > 0 ? (
                        examAiWeaknesses.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No concerns captured yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleRegenerateAiReview("exam")}
                    disabled={regeneratingPhase !== null}
                  >
                    {regeneratingPhase === "exam" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Regenerate Exam AI
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "rounded-[28px] border p-6",
                  isNotEligibleRecommendation(finalRecommendationValue)
                    ? "border-rose-200 bg-[linear-gradient(180deg,#fff8f8_0%,#ffffff_100%)]"
                    : "border-emerald-200 bg-[linear-gradient(180deg,#f4fffa_0%,#ffffff_100%)]",
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <SectionHeader title="Final Recommendation" />
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
                          isNotEligibleRecommendation(finalRecommendationValue)
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {finalRecommendationLabel}
                      </span>
                      <span className="text-sm text-slate-500">
                        Generated {finalGeneratedAt}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600 backdrop-blur">
                    {finalAiAnalysis?.phaseSummary?.examAttempts ||
                      "No attempt signal generated yet."}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Executive Summary
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {finalSummary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {finalDecisionHighlights.length > 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          Decision Factors
                        </p>
                        <div className="mt-4 space-y-3">
                          {finalDecisionHighlights.map((item) => (
                            <div
                              key={item.label}
                              className="rounded-2xl bg-slate-50 px-4 py-3"
                            >
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {item.label}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
                  <div className="rounded-3xl border border-emerald-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
                      What Supports This Decision
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {finalAiStrengths.length > 0 ? (
                        finalAiStrengths.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No strengths captured yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-rose-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-rose-700">
                      What Needs Attention
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {finalAiWeaknesses.length > 0 ? (
                        finalAiWeaknesses.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800"
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">
                          No concerns captured yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Decision Notes
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {finalRationale}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => handleRegenerateAiReview("final")}
                    disabled={regeneratingPhase !== null}
                  >
                    {regeneratingPhase === "final" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Regenerate Final AI
                  </Button>
                  <Button
                    className="rounded-full"
                    onClick={() => handleRegenerateAiReview("all")}
                    disabled={regeneratingPhase !== null}
                  >
                    {regeneratingPhase === "all" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Regenerate All AI Reviews
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeSection === "assessment" ? (
          <div className="space-y-6 rounded-3xl border border-border bg-white p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <SectionHeader title="Assessment Review" />
              {application.assessmentSessionId ? (
                <div className="flex flex-wrap gap-2">
                  {process.env.NODE_ENV === "development" ? (
                    <Button
                      variant="outline"
                      className="rounded-full border-amber-200 text-amber-700"
                      onClick={() =>
                        setSubmissionActionDialog({ mode: "reset" })
                      }
                    >
                      Reset Submission
                    </Button>
                  ) : null}
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() =>
                      setSubmissionActionDialog({ mode: "delete" })
                    }
                  >
                    Delete Submission
                  </Button>
                </div>
              ) : null}
            </div>

            {!application.assessmentStatus ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                This candidate does not have an assessment session yet. Only the
                initial application data is available.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3">
                  <StatChip
                    label="Assessment Status"
                    value={
                      assessmentStatusLabels[application.assessmentStatus] ||
                      application.assessmentStatus
                    }
                    tone="info"
                  />
                  <StatChip
                    label="Training Status"
                    value={application.assessmentTrainingStatus || "N/A"}
                  />
                  <StatChip
                    label="Result"
                    value={
                      application.assessmentIsPassed == null
                        ? "Pending"
                        : application.assessmentIsPassed
                          ? "Passed"
                          : "Failed"
                    }
                    tone={
                      application.assessmentIsPassed == null
                        ? "default"
                        : application.assessmentIsPassed
                          ? "success"
                          : "danger"
                    }
                  />
                  <StatChip
                    label="Score"
                    value={
                      typeof application.assessmentScorePercentage === "number"
                        ? `${application.assessmentScorePercentage.toFixed(1)}%`
                        : "Not scored"
                    }
                    tone={
                      application.assessmentIsPassed ? "success" : "default"
                    }
                  />
                  <StatChip
                    label="Started"
                    value={formatDateTime(
                      application.assessmentStartedAt ?? undefined,
                    )}
                  />
                  <StatChip
                    label="Submitted"
                    value={formatDateTime(
                      application.assessmentSubmittedAt ?? undefined,
                    )}
                  />
                  <StatChip
                    label="Scored"
                    value={formatDateTime(
                      application.assessmentScoredAt ?? undefined,
                    )}
                  />
                  <StatChip
                    label="Attempts"
                    value={
                      typeof application.assessmentExamAttemptCount === "number"
                        ? `${application.assessmentExamAttemptCount} / ${application.assessmentMaxExamAttempts || 2}`
                        : "N/A"
                    }
                  />
                  <StatChip
                    label="Deadline"
                    value={formatDateTime(
                      application.assessmentExamMustCompleteBy ?? undefined,
                    )}
                    tone="warning"
                  />
                </div>

                {isSubmissionLoading ? (
                  <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading assessment submission...</span>
                    </div>
                  </div>
                ) : null}

                {!isSubmissionLoading && submissionDetail ? (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <SectionHeader title="Session Snapshot" />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <StatChip
                          label="Duration"
                          value={formatDuration(session.totalDurationSeconds)}
                        />
                        <StatChip
                          label="Passing Percentage"
                          value={
                            session.passingPercentage
                              ? `${session.passingPercentage}%`
                              : "N/A"
                          }
                        />
                        <StatChip
                          label="Attempt Count"
                          value={
                            typeof session.examAttemptCount === "number"
                              ? `${session.examAttemptCount} / ${session.maxExamAttempts || 2}`
                              : "N/A"
                          }
                        />
                        <StatChip
                          label="Current Review Score"
                          value={
                            session.maxScore
                              ? `${session.totalScore || 0} / ${session.maxScore} (${Number(session.percentage || 0).toFixed(1)}%)`
                              : "N/A"
                          }
                        />
                        <StatChip
                          label="Session Status"
                          value={prettifyLabel(session.status || "unknown")}
                          tone="info"
                        />
                        <StatChip
                          label="Interview Reviewed"
                          value={formatDateTime(
                            application.assessmentInterviewReviewedAt ??
                              undefined,
                          )}
                        />
                        <StatChip
                          label="Exam Email Sent"
                          value={formatDateTime(
                            application.assessmentExamInvitationSentAt ??
                              undefined,
                          )}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <SectionHeader title="Email Actions" />
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-slate-500">
                          <Mail className="h-4 w-4" />
                          {emailFlowItems.length} available
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 xl:grid-cols-2">
                        {emailFlowItems.map((item) => (
                          <div
                            key={item.step}
                            className="rounded-2xl border border-slate-200 bg-white p-5"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-slate-900">
                                  {item.title}
                                </p>
                                <p className="text-sm leading-6 text-slate-600">
                                  {item.description}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Last sent info: {item.lastSentLabel}
                                </p>
                                {item.caution ? (
                                  <p className="text-xs text-amber-700">
                                    {item.caution}
                                  </p>
                                ) : null}
                              </div>
                              <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setEmailResendDialog(item)}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Resend
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {submissionDetail.registration ? (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <SectionHeader title="Partner Registration" />
                        <div className="mt-4">
                          <DetailList
                            items={[
                              { label: "Gender", value: registration.gender },
                              {
                                label: "Date of Birth",
                                value: registration.dateOfBirth,
                              },
                              {
                                label: "Address",
                                value: registration.address,
                                multiline: true,
                              },
                              { label: "City", value: registration.city },
                              {
                                label: "Postal Code",
                                value: registration.postalCode,
                              },
                              {
                                label: "ID Card Number",
                                value: registration.idCardNumber,
                              },
                              {
                                label: "ID Card URL",
                                value: registration.idCardUrl,
                              },
                              {
                                label: "Selfie With ID URL",
                                value: registration.selfieWithIdUrl,
                              },
                              {
                                label: "Emergency Contact Name",
                                value: registration.emergencyContactName,
                              },
                              {
                                label: "Emergency Contact Phone",
                                value: registration.emergencyContactPhone,
                              },
                              {
                                label: "Emergency Contact Relation",
                                value: registration.emergencyContactRelation,
                              },
                              {
                                label: "Bank Name",
                                value: registration.bankName,
                              },
                              {
                                label: "Bank Account Number",
                                value: registration.bankAccountNumber,
                              },
                              {
                                label: "Bank Account Holder",
                                value: registration.bankAccountHolder,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <div className="mb-4">
                        <SectionHeader title="Answers" />
                      </div>

                      {answers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm text-slate-500">
                          No answers found for this submission.
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {answers.map((answer, index) => {
                            const options = parseQuestionOptions(
                              answer.questionOptions,
                            );
                            const manualScore = getManualScore(answer.id);
                            const maxScore =
                              answer.questionPoints || answer.maxScore || 0;

                            return (
                              <article
                                key={answer.id}
                                className="rounded-3xl border border-slate-200 bg-white p-6"
                              >
                                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      Question {index + 1}
                                    </p>
                                    <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                      {answer.question}
                                    </h3>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                      {prettifyLabel(
                                        answer.questionType || "unknown",
                                      )}
                                    </span>
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                      Score: {answer.score ?? 0} / {maxScore}
                                    </span>
                                  </div>
                                </div>

                                {answer.questionType === "multiple_choice" ? (
                                  <div className="space-y-3">
                                    {options.length > 0 ? (
                                      options.map((option: any) => {
                                        const isSelected =
                                          option.value ===
                                          answer.selectedOption;
                                        const isCorrect =
                                          option.value === answer.correctAnswer;
                                        return (
                                          <div
                                            key={option.value}
                                            className={cn(
                                              "rounded-2xl border p-4",
                                              isCorrect
                                                ? "border-green-300 bg-green-50"
                                                : isSelected
                                                  ? "border-amber-300 bg-amber-50"
                                                  : "border-slate-200 bg-slate-50",
                                            )}
                                          >
                                            <div className="flex items-start gap-3">
                                              {isCorrect ? (
                                                <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                                              ) : isSelected ? (
                                                <XCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                                              ) : (
                                                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />
                                              )}
                                              <div className="space-y-1">
                                                <p className="text-sm font-medium text-slate-900">
                                                  {option.value}) {option.label}
                                                </p>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                  {isSelected ? (
                                                    <span className="text-amber-700">
                                                      Selected by applicant
                                                    </span>
                                                  ) : null}
                                                  {isCorrect ? (
                                                    <span className="text-green-700">
                                                      Correct answer
                                                    </span>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <p className="text-sm text-slate-500">
                                        No options available.
                                      </p>
                                    )}
                                  </div>
                                ) : null}

                                {answer.questionType === "essay" ? (
                                  <div className="space-y-4">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Applicant Answer
                                      </p>
                                      <p className="whitespace-pre-wrap text-sm text-slate-800">
                                        {answer.essayAnswer || "-"}
                                      </p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Answer Guide
                                      </p>
                                      <p className="whitespace-pre-wrap text-sm text-slate-800">
                                        {answer.correctAnswer || "-"}
                                      </p>
                                    </div>
                                  </div>
                                ) : null}

                                {(answer.questionType === "essay" ||
                                  answer.questionType ===
                                    "video_introduction") &&
                                manualScore ? (
                                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900">
                                        Manual Review
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        Max score: {maxScore}
                                      </p>
                                    </div>
                                    <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                          Score
                                        </label>
                                        <Input
                                          type="number"
                                          min={0}
                                          max={maxScore}
                                          value={manualScore.score}
                                          onChange={(event) =>
                                            updateManualScore(
                                              answer.id,
                                              "score",
                                              Number(event.target.value || 0),
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">
                                          Reviewer Feedback
                                        </label>
                                        <Textarea
                                          rows={4}
                                          value={manualScore.feedback || ""}
                                          onChange={(event) =>
                                            updateManualScore(
                                              answer.id,
                                              "feedback",
                                              event.target.value,
                                            )
                                          }
                                          placeholder="Add reviewer notes or scoring rationale..."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : null}
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                      <SectionHeader title="Reviewer Notes" />
                      <div className="mt-4 space-y-4">
                        <Textarea
                          rows={6}
                          value={reviewerNotes}
                          onChange={(event) =>
                            setReviewerNotes(event.target.value)
                          }
                          placeholder="Write final reviewer notes for the assessment..."
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={handleSaveSubmissionReview}
                            disabled={
                              isSubmissionSaving ||
                              session.status !== "submitted"
                            }
                          >
                            {isSubmissionSaving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Assessment Review
                          </Button>
                        </div>
                        {session.status !== "submitted" ? (
                          <p className="text-xs text-slate-500">
                            Assessment scoring can be edited while the session
                            is in the submitted state. The final approve or
                            reject action is still handled separately from the
                            top action button.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {activeSection === "security" && application.assessmentSessionId ? (
          <div className="space-y-6 rounded-3xl border border-border bg-white p-6">
            <SectionHeader title="Security Review" />
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-wrap gap-3">
                <StatChip label="Start IP" value={session.ipAddress} />
                <StatChip label="Submit IP" value={session.submitIpAddress} />
                <StatChip
                  label="Fingerprint"
                  value={session.browserFingerprint ? "Recorded" : "N/A"}
                />
                <StatChip
                  label="Tab Switch"
                  value={session.tabSwitchCount ?? 0}
                  tone={
                    Number(session.tabSwitchCount ?? 0) > 0
                      ? "warning"
                      : "success"
                  }
                />
                <StatChip
                  label="Risk Score"
                  value={`${securityRiskScore}/100`}
                  tone={
                    securityRiskLevel === "critical" ||
                    securityRiskLevel === "high"
                      ? "danger"
                      : securityRiskLevel === "medium"
                        ? "warning"
                        : "success"
                  }
                />
                <StatChip
                  label="Integrity"
                  value={
                    session.answerIntegrityVerified
                      ? "Verified"
                      : "Not verified"
                  }
                  tone={session.answerIntegrityVerified ? "success" : "warning"}
                />
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    {securityRiskLevel === "high" ||
                    securityRiskLevel === "critical" ? (
                      <ShieldAlert className="h-4 w-4 text-rose-600" />
                    ) : securityRiskLevel === "medium" ? (
                      <Shield className="h-4 w-4 text-amber-600" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    )}
                    Security Review
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                      securityRiskStyles[securityRiskLevel] ||
                        securityRiskStyles.low,
                    )}
                  >
                    {securityRiskLevel}
                  </span>
                  {securityReviewRequired ? (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                      Manual review recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {session.securitySummary ||
                    application?.assessmentSecuritySummary ||
                    "No structured security summary generated yet."}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  {securityFlags.length > 0 ? (
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                  ) : session.answerIntegrityVerified ? (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Shield className="h-4 w-4 text-slate-500" />
                  )}
                  Security Flags
                </div>
                {securityFlags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {securityFlags.map((flag, index) => (
                      <span
                        key={`${flag}-${index}`}
                        className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No security flags recorded.
                  </p>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Security Positives
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    {securityStrengths.length > 0 ? (
                      securityStrengths.map((item: string) => (
                        <p key={item}>• {item}</p>
                      ))
                    ) : (
                      <p>No positive stability markers were captured.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Security Concerns
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    {securityReasons.length > 0 ? (
                      securityReasons.map((item: string) => (
                        <p key={item}>• {item}</p>
                      ))
                    ) : (
                      <p>No significant concerns were generated.</p>
                    )}
                  </div>
                </div>
              </div>
              {securityAnalysis ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Network Assessment
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Network Pattern:
                        </span>{" "}
                        {prettifyLabel(
                          securityAnalysis.networkAssessment || "unavailable",
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          IP Family:
                        </span>{" "}
                        {(
                          securityAnalysis.startFamily || "unknown"
                        ).toUpperCase()}{" "}
                        →{" "}
                        {(
                          securityAnalysis.submitFamily || "unknown"
                        ).toUpperCase()}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Network Signature:
                        </span>{" "}
                        {securityAnalysis.startNetwork || "N/A"} →{" "}
                        {securityAnalysis.submitNetwork || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Device Assessment
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Device Class:
                        </span>{" "}
                        {prettifyLabel(
                          securityAnalysis.startDeviceClass || "unknown",
                        )}{" "}
                        →{" "}
                        {prettifyLabel(
                          securityAnalysis.submitDeviceClass || "unknown",
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Device Signal:
                        </span>{" "}
                        {prettifyLabel(
                          securityAnalysis.deviceAssessment || "unavailable",
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-900">
                          Fingerprint Changed:
                        </span>{" "}
                        {securityAnalysis.fingerprintChanged ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Monitor className="h-4 w-4 text-slate-500" />
                  User Agent
                </div>
                <p className="break-all text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Start:</span>{" "}
                  {session.userAgent || "N/A"}
                </p>
                <p className="mt-3 break-all text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Submit:</span>{" "}
                  {session.submitUserAgent || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <main className="flex w-full flex-col gap-12 pb-12">
        <Header
          title="Application Detail"
          breadcrumbs={[
            { label: "Partner Recruitment System", href: "/partner-recruitment-system" },
            { label: "Batch Detail", href: `/partner-recruitment-system/batches/${batchId}` },
            { label: "Application Detail" },
          ]}
        />
        <section className="flex min-h-[50vh] w-full flex-col gap-10 rounded-3xl border border-border bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-slate-50 p-6 md:flex-row md:items-center">
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-fit rounded-full border-gray-300 px-4 text-sm text-slate-600"
              >
                <Link href={backHref}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to list
                </Link>
              </Button>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {application?.fullName ?? "Affiliate application"}
                </h2>
                <p className="text-sm text-slate-500">
                  Submitted{" "}
                  {formatDateTime(application?.createdAt ?? undefined)} | Last
                  updated {formatDateTime(application?.updatedAt ?? undefined)}
                </p>
              </div>
              {isRefreshing && (
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing latest data...
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {canApproveInterview && (
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-sky-200 px-6 text-sm font-semibold text-sky-700"
                  onClick={handleApproveInterview}
                  disabled={isApprovingInterview}
                >
                  {isApprovingInterview ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Approve to Training
                </Button>
              )}
              {canRevertFinalDecision && application && (
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-amber-200 px-6 text-sm font-semibold text-amber-700"
                  onClick={() => setFinalDecisionDialog({ mode: "revert" })}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Return to Review
                </Button>
              )}
              {application && (
                <AffiliateDeleteDialog
                  applicationId={application.id}
                  onDeleted={handleDeleted}
                >
                  <Button
                    variant="destructive"
                    className="h-11 rounded-full px-6 text-sm"
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete
                  </Button>
                </AffiliateDeleteDialog>
              )}
            </div>
          </div>

          {content}
        </section>
      </main>

      <Dialog
        open={!!submissionActionDialog}
        onOpenChange={(open) => !open && setSubmissionActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {submissionActionDialog?.mode === "delete"
                ? "Delete Submission"
                : "Reset Submission"}
            </DialogTitle>
            <DialogDescription>
              {submissionActionDialog?.mode === "delete"
                ? "Delete this assessment submission and all related answer records? This action cannot be undone."
                : "Reset this assessment submission to its initial state? This action is only available in development mode."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubmissionActionDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                submissionActionDialog?.mode === "delete"
                  ? "destructive"
                  : "default"
              }
              onClick={handleSubmissionAction}
              disabled={isSubmissionActionLoading}
            >
              {isSubmissionActionLoading
                ? "Processing..."
                : submissionActionDialog?.mode === "delete"
                  ? "Delete Submission"
                  : "Reset Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!finalDecisionDialog}
        onOpenChange={(open) => !open && setFinalDecisionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Candidate to Review</DialogTitle>
            <DialogDescription>
              Return this candidate from the current final decision back to the
              manual review state? This action is only available in development
              mode and will disable affiliate access again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinalDecisionDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleRevertFinalDecision}
              disabled={isFinalDecisionLoading}
            >
              {isFinalDecisionLoading ? "Processing..." : "Return to Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!emailResendDialog}
        onOpenChange={(open) => !open && setEmailResendDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Resend {emailResendDialog?.title}</DialogTitle>
            <DialogDescription>
              {emailResendDialog?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>
              The email will be resent to{" "}
              <span className="font-semibold text-slate-900">
                {application?.email || "candidate email"}
              </span>
              .
            </p>
            <p className="mt-2">
              Last sent info:{" "}
              <span className="font-medium text-slate-900">
                {emailResendDialog?.lastSentLabel || "N/A"}
              </span>
            </p>
            {emailResendDialog?.caution ? (
              <p className="mt-3 text-amber-700">{emailResendDialog.caution}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEmailResendDialog(null)}
              disabled={isEmailResending}
            >
              Cancel
            </Button>
            <Button onClick={handleResendEmail} disabled={isEmailResending}>
              {isEmailResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AffiliateDetailContent;
