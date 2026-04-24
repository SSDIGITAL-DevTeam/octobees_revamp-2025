"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Brain,
  Copy,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useBatches } from "@/hooks/partnership/useBatches";
import { cn } from "@/lib/utils";

import Header from "@/components/layout/header/Header";
import AffiliateFilters, {
  type FilterValue,
} from "@/components/partials/form/AffiliateFilters";
import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets";
import { AffiliateTable } from "@/components/partials/table/AffiliateTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import { type AffiliateRow } from "@/constrant/affiliate";
import { listApplications } from "@/lib/api/affiliate";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  getSessions,
  type AssessmentQuestion,
  type AssessmentSession,
  updateQuestion,
} from "@/lib/api/assessment";
import {
  createTrainingContent,
  deleteTrainingContent,
  getTrainingContent,
  type TrainingContent,
  updateTrainingContent,
  uploadTrainingPdf,
} from "@/lib/api/training-content";
import { axiosInstance } from "@/lib/axios";
import type { AffiliateBatch } from "@/hooks/partnership/useBatches";

const CKEditorComponent = dynamic(
  () => import("@/components/partials/form/CKEditorComponent"),
  { ssr: false },
);

const DEFAULT_FILTERS: FilterValue = {
  search: "",
  status: "",
  stage: "",
  sorts: "applied_newest,score_highest",
  limit: "100",
};

const trainingTypeOptions = [
  { label: "PDF", value: "pdf_file" },
  { label: "Video", value: "video_url" },
  { label: "Text-based", value: "embed_code" },
  { label: "Embedded Code", value: "embed_script" },
  { label: "Widget", value: "widget_id" },
  { label: "Live Experience Apps", value: "credentials" },
] as const;

const MULTIPLE_CHOICE_OPTION_LIMIT = {
  min: 2,
  max: 6,
} as const;

const MULTIPLE_CHOICE_OPTION_VALUES = ["a", "b", "c", "d", "e", "f"] as const;

type ExamOptionDraft = {
  id: string;
  label: string;
};

const createExamOptionDraft = (id: string, label = ""): ExamOptionDraft => ({
  id,
  label,
});

const createDefaultExamOptions = () => [
  createExamOptionDraft("option-1"),
  createExamOptionDraft("option-2"),
];

const getTrainingValueLabel = (contentType: string) => {
  if (contentType === "pdf_file") return "Upload PDF";
  if (contentType === "video_url") return "Video URL";
  if (contentType === "embed_code") return "Text Content";
  if (contentType === "credentials") return "Credentials Content";
  if (contentType === "widget_id") return "Widget ID";
  return "Embedded Code";
};

const getTrainingValuePlaceholder = (contentType: string) => {
  if (contentType === "video_url") return "https://youtube.com/...";
  if (contentType === "credentials") {
    return "Add the sample login details, app links, notes, and usage guidance here";
  }
  if (contentType === "widget_id") return "69cc86067061130e2304adaa";
  if (contentType === "embed_script") {
    return "<script>...</script>, <iframe ...>, or any embedded HTML/JS code";
  }
  return "";
};

const getTrainingTypeLabel = (contentType: string) =>
  trainingTypeOptions.find((option) => option.value === contentType)?.label ||
  contentType;

const toExamOptionDrafts = (
  options?: { label: string; value: string }[] | null,
): ExamOptionDraft[] => {
  if (!options?.length) return createDefaultExamOptions();

  return options
    .slice(0, MULTIPLE_CHOICE_OPTION_LIMIT.max)
    .map((option, index) =>
      createExamOptionDraft(
        option.value || `option-${index + 1}`,
        option.label || "",
      ),
    );
};

const getFilteredBatchApplications = (
  applications: AffiliateRow[],
  filters: FilterValue,
) => {
  const searchValue = filters.search.trim().toLowerCase();

  const filtered = applications.filter((application) => {
    if (
      searchValue &&
      ![
        application.full_name,
        application.email,
        application.phone || "",
        application.country || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchValue)
    ) {
      return false;
    }

    if (filters.status && application.status !== filters.status) {
      return false;
    }

    if (!filters.stage || filters.stage === "total") {
      return true;
    }

    const effectiveStatus =
      (application.status === "approved" ||
        application.status === "rejected") &&
      !application.reviewed_at
        ? "qualified"
        : application.status;

    if (filters.stage === "qualified") {
      return (
        effectiveStatus === "qualified" &&
        !application.assessment_session_id &&
        (application.assessment_training_status || "not_started") ===
          "not_started"
      );
    }

    if (filters.stage === "interview") {
      return (
        effectiveStatus === "qualified" &&
        !!application.assessment_session_id &&
        ["not_started", "submitted"].includes(
          application.assessment_interview_status || "not_started",
        ) &&
        (application.assessment_training_status || "not_started") ===
          "not_started"
      );
    }

    if (filters.stage === "training") {
      return (
        effectiveStatus === "qualified" &&
        !!application.assessment_session_id &&
        (application.assessment_interview_status || "not_started") ===
          "approved" &&
        ["not_started", "in_progress"].includes(
          application.assessment_training_status || "not_started",
        )
      );
    }

    if (filters.stage === "certification") {
      return (
        (application.assessment_training_status || "not_started") ===
          "completed" &&
        !(application.status === "approved" && application.reviewed_at) &&
        !(application.status === "rejected" && application.reviewed_at)
      );
    }

    if (filters.stage === "onboarded") {
      return application.status === "approved" && !!application.reviewed_at;
    }

    if (filters.stage === "rejected") {
      return application.status === "rejected" && !!application.reviewed_at;
    }

    return true;
  });

  const sortValues = filters.sorts
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const sorted = [...filtered];

  sortValues.forEach((sortValue) => {
    sorted.sort((left, right) => {
      if (sortValue === "applied_newest") {
        return (
          new Date(right.created_at).getTime() -
          new Date(left.created_at).getTime()
        );
      }

      if (sortValue === "applied_oldest") {
        return (
          new Date(left.created_at).getTime() -
          new Date(right.created_at).getTime()
        );
      }

      if (sortValue === "score_highest") {
        return (
          Number(right.assessment_score_percentage || 0) -
          Number(left.assessment_score_percentage || 0)
        );
      }

      if (sortValue === "score_lowest") {
        return (
          Number(left.assessment_score_percentage || 0) -
          Number(right.assessment_score_percentage || 0)
        );
      }

      return 0;
    });
  });

  return sorted;
};

export const PartnerRecruitmentBatchDetailContent = ({
  batchId,
}: {
  batchId: string;
}) => {
  const [batch, setBatch] = useState<AffiliateBatch | null>(null);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [trainingContent, setTrainingContent] = useState<TrainingContent[]>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [applications, setApplications] = useState<AffiliateRow[]>([]);
  const [extendedDate, setExtendedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [forceCloseDialogOpen, setForceCloseDialogOpen] = useState(false);
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [trainingMaterialDialogOpen, setTrainingMaterialDialogOpen] =
    useState(false);
  const [examQuestionsDialogOpen, setExamQuestionsDialogOpen] = useState(false);
  const [interviewQuestionsDialogOpen, setInterviewQuestionsDialogOpen] =
    useState(false);
  const [trainingEditorOpen, setTrainingEditorOpen] = useState(false);
  const [interviewEditorOpen, setInterviewEditorOpen] = useState(false);
  const [examEditorOpen, setExamEditorOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValue>(DEFAULT_FILTERS);
  const [batchConfigDraft, setBatchConfigDraft] = useState({
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    registrationQuota: "",
    landingPageLink: "",
    passingThreshold: "70",
    autoCurateOnQuotaReached: false,
    autoCurateOnBatchClose: true,
  });
  const [trainingForm, setTrainingForm] = useState({
    title: "",
    description: "",
    contentType: "pdf_file",
    contentValue: "",
    pdfFile: null as File | null,
  });
  const [examForm, setExamForm] = useState({
    type: "multiple_choice",
    question: "",
    options: createDefaultExamOptions(),
    correctOptionId: "option-1",
    points: "1",
  });
  const [interviewForm, setInterviewForm] = useState({
    videoInstructions: "",
    points: "1",
  });
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(
    null,
  );
  const [editingExamQuestionId, setEditingExamQuestionId] = useState<
    string | null
  >(null);
  const [editingInterviewQuestionId, setEditingInterviewQuestionId] = useState<
    string | null
  >(null);
  const [savingTraining, setSavingTraining] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [draggingOptionId, setDraggingOptionId] = useState<string | null>(null);

  const {
    batches: allBatches,
    curatingBatchId,
    isBatchAiScreeningActive,
    curateBatch,
  } = useBatches();

  const liveBatch = useMemo(
    () => allBatches.find((b) => b.id === batchId) || null,
    [allBatches, batchId],
  );
  const aiSource = liveBatch || batch;
  const isRecurating = !!aiSource && curatingBatchId === aiSource.id;
  const isAiRunning = !!aiSource && isBatchAiScreeningActive(aiSource.id);
  const aiStatus = aiSource?.aiScreeningStatus || "idle";
  const aiStatusLabel = aiStatus.charAt(0).toUpperCase() + aiStatus.slice(1);
  const aiStatusClass = (() => {
    if (isAiRunning) return "border-sky-200 bg-sky-50 text-sky-700";
    if (aiStatus === "failed")
      return "border-rose-200 bg-rose-50 text-rose-700";
    if (aiStatus === "completed")
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    return "border-slate-200 bg-slate-50 text-slate-600";
  })();
  const aiUpdatedLabel = (() => {
    const fmt = (v: string) =>
      new Date(v).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    if (
      aiSource?.aiScreeningStatus === "running" &&
      aiSource.aiScreeningStartedAt
    )
      return `AI curation started ${fmt(aiSource.aiScreeningStartedAt)}`;
    if (
      aiSource?.aiScreeningStatus === "queued" &&
      aiSource.aiScreeningQueuedAt
    )
      return `AI curation queued ${fmt(aiSource.aiScreeningQueuedAt)}`;
    if (aiSource?.aiScreeningCompletedAt)
      return `Updated ${fmt(aiSource.aiScreeningCompletedAt)}`;
    return "AI summary has not been generated yet";
  })();
  let aiActionLabel = "Curate AI Summary Again";
  if (isAiRunning) aiActionLabel = "AI Summary Is Running...";
  else if (isRecurating) aiActionLabel = "Curating AI Summary...";
  const hasTopSignals = (aiSource?.aiScreeningTopSignals || []).length > 0;
  const hasRiskSignals = (aiSource?.aiScreeningRiskSignals || []).length > 0;
  const aiCandidateCount = aiSource
    ? Math.max(
        Number(aiSource.applicationCount || 0),
        Array.isArray(aiSource.aiScreeningRankedCandidates)
          ? aiSource.aiScreeningRankedCandidates.length
          : 0,
      )
    : 0;

  const handleRecurate = async () => {
    if (!aiSource || isRecurating) return;
    await curateBatch(aiSource.id);
  };
  const trainingEditorTitle = `${editingTrainingId ? "Edit" : "Add"} Training Material`;
  let trainingEditorSubmitLabel = "Save Material";
  if (editingTrainingId) trainingEditorSubmitLabel = "Update Material";
  if (savingTraining) trainingEditorSubmitLabel = "Saving...";
  const interviewEditorTitle = `${editingInterviewQuestionId ? "Edit" : "Add"} Interview Guideline`;
  let interviewEditorSubmitLabel = "Save Guideline";
  if (editingInterviewQuestionId) interviewEditorSubmitLabel = "Update Guideline";
  if (savingQuestion) interviewEditorSubmitLabel = "Saving...";
  const examEditorTitle = `${editingExamQuestionId ? "Edit" : "Add"} Exam Question`;
  let examEditorSubmitLabel = "Save Question";
  if (editingExamQuestionId) examEditorSubmitLabel = "Update Question";
  if (savingQuestion) examEditorSubmitLabel = "Saving...";

  const renderTrainingValueInput = () => {
    if (trainingForm.contentType === "pdf_file") {
      return (
        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-blue-300 hover:bg-blue-50">
          <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
          {trainingForm.pdfFile ? (
            <p className="px-4 text-center text-sm font-semibold text-slate-700">
              {trainingForm.pdfFile.name}
            </p>
          ) : (
            <p className="px-4 text-center text-sm font-semibold text-slate-700">
              Click to upload PDF
            </p>
          )}
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={(e) =>
              setTrainingForm((current) => ({
                ...current,
                pdfFile: e.target.files?.[0] || null,
              }))
            }
          />
        </label>
      );
    }

    if (
      trainingForm.contentType === "embed_code" ||
      trainingForm.contentType === "credentials"
    ) {
      return (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <CKEditorComponent
            value={trainingForm.contentValue}
            uploadUrl="/back-office/partner/upload-content-image"
            onChange={(value) =>
              setTrainingForm((current) => ({ ...current, contentValue: value }))
            }
          />
        </div>
      );
    }

    if (trainingForm.contentType === "widget_id") {
      return (
        <Input
          value={trainingForm.contentValue}
          placeholder={getTrainingValuePlaceholder(trainingForm.contentType)}
          onChange={(event) =>
            setTrainingForm((current) => ({
              ...current,
              contentValue: event.target.value,
            }))
          }
          className="h-12 rounded-2xl border-slate-200 bg-slate-50"
        />
      );
    }

    if (trainingForm.contentType === "video_url") {
      return (
        <Input
          value={trainingForm.contentValue}
          onChange={(event) =>
            setTrainingForm((current) => ({ ...current, contentValue: event.target.value }))
          }
          placeholder={getTrainingValuePlaceholder(trainingForm.contentType)}
          className="h-12 rounded-2xl border-slate-200 bg-slate-50"
        />
      );
    }

    return (
      <Textarea
        value={trainingForm.contentValue}
        onChange={(event) =>
          setTrainingForm((current) => ({ ...current, contentValue: event.target.value }))
        }
        placeholder={getTrainingValuePlaceholder(trainingForm.contentType)}
        className="min-h-32 rounded-2xl border-slate-200 bg-slate-50"
      />
    );
  };

  const addExamOption = () => {
    setExamForm((current) => {
      if (current.options.length >= MULTIPLE_CHOICE_OPTION_LIMIT.max) {
        return current;
      }

      return {
        ...current,
        options: [
          ...current.options,
          createExamOptionDraft(
            `option-${Date.now()}-${current.options.length + 1}`,
          ),
        ],
      };
    });
  };

  const updateExamOption = (optionId: string, label: string) => {
    setExamForm((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? { ...option, label } : option,
      ),
    }));
  };

  const removeExamOption = (optionId: string) => {
    setExamForm((current) => {
      if (current.options.length <= MULTIPLE_CHOICE_OPTION_LIMIT.min) {
        return current;
      }

      const nextOptions = current.options.filter(
        (option) => option.id !== optionId,
      );
      const nextCorrectOptionId =
        current.correctOptionId === optionId
          ? nextOptions[0]?.id || ""
          : current.correctOptionId;

      return {
        ...current,
        options: nextOptions,
        correctOptionId: nextCorrectOptionId,
      };
    });
  };

  const moveExamOption = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;

    setExamForm((current) => {
      const nextOptions = [...current.options];
      const fromIndex = nextOptions.findIndex(
        (option) => option.id === draggedId,
      );
      const toIndex = nextOptions.findIndex((option) => option.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;

      const [movedOption] = nextOptions.splice(fromIndex, 1);
      nextOptions.splice(toIndex, 0, movedOption);

      return {
        ...current,
        options: nextOptions,
      };
    });
  };

  const detailBasePath = `/partner-recruitment-system/batches/${batchId}/applicants`;

  const loadBatch = async () => {
    const [batchRes, sessionRes, trainingRes, questionsRes, applicationsRes] =
      await Promise.all([
        axiosInstance.get(`/back-office/batch/${batchId}`),
        getSessions({ limit: 200 }),
        getTrainingContent(),
        getQuestions({ isActive: true }),
        listApplications({
          page: "1",
          limit: "200",
          sort: DEFAULT_FILTERS.sorts,
        }),
      ]);

    const batchData = batchRes.data.data;
    const assignedTrainingMaterialIds = Array.isArray(
      batchData.trainingMaterialIds,
    )
      ? batchData.trainingMaterialIds
      : [];
    setBatch(batchData);
    setExtendedDate(dayjs(batchData.endDate).format("YYYY-MM-DD"));
    setBatchConfigDraft({
      name: batchData.name || "",
      role: batchData.role || "",
      startDate: batchData.startDate
        ? dayjs(batchData.startDate).format("YYYY-MM-DD")
        : "",
      endDate: batchData.endDate
        ? dayjs(batchData.endDate).format("YYYY-MM-DD")
        : "",
      registrationQuota:
        Number(batchData.registrationQuota || 0) > 0
          ? String(batchData.registrationQuota)
          : "",
      landingPageLink: batchData.landingPageLink || "",
      passingThreshold: String(batchData.examPassingScore || 70),
      autoCurateOnQuotaReached: Boolean(batchData.autoCurateOnQuotaReached),
      autoCurateOnBatchClose:
        batchData.autoCurateOnBatchClose === undefined
          ? true
          : Boolean(batchData.autoCurateOnBatchClose),
    });
    setSessions(
      (sessionRes.data || []).filter(
        (item: AssessmentSession) => item.affiliateBatchName === batchData.name,
      ),
    );
    setTrainingContent(
      (trainingRes.data || []).filter((item: TrainingContent) =>
        assignedTrainingMaterialIds.includes(item.id),
      ),
    );
    setQuestions(questionsRes.data || []);
    setApplications(
      (applicationsRes.data.data || []).filter(
        (item: AffiliateRow) =>
          item.batch_id === batchData.id || item.batch_name === batchData.name,
      ),
    );
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        await loadBatch();
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load batch detail.",
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [batchId]);

  const selectedQuestions = useMemo(() => {
    if (!batch?.examQuestionIds?.length)
      return questions
        .filter((q) => q.type !== "video_introduction")
        .slice(0, 5);
    return questions.filter((question) =>
      batch.examQuestionIds?.includes(question.id),
    );
  }, [batch, questions]);

  const selectedInterviewQuestions = useMemo(() => {
    if (!batch?.interviewQuestionIds?.length)
      return questions
        .filter((q) => q.type === "video_introduction")
        .slice(0, 5);
    return questions.filter((question) =>
      batch.interviewQuestionIds?.includes(question.id),
    );
  }, [batch, questions]);

  const filteredApplications = useMemo(
    () => getFilteredBatchApplications(applications, filters),
    [applications, filters],
  );
  const appliedCount = useMemo(
    () =>
      Math.max(
        Number(batch?.applicationCount || 0),
        applications.length,
        Array.isArray(aiSource?.aiScreeningRankedCandidates)
          ? aiSource.aiScreeningRankedCandidates.length
          : 0,
      ),
    [
      aiSource?.aiScreeningRankedCandidates,
      applications.length,
      batch?.applicationCount,
    ],
  );

  const statsItems = useMemo(
    () => [
      {
        key: "total",
        label: "Total Candidates",
        value: applications.length,
        description: "All candidates registered in this batch.",
        accent: "border-slate-200 bg-white text-slate-900",
      },
      {
        key: "qualified",
        label: "Passed Qualification",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "qualified",
        }).length,
        description: "Candidates ready to enter the interview stage.",
        accent: "border-sky-200 bg-sky-50 text-sky-800",
      },
      {
        key: "interview",
        label: "In Interview",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "interview",
        }).length,
        description: "Candidates currently in the interview stage.",
        accent: "border-amber-200 bg-amber-50 text-amber-800",
      },
      {
        key: "training",
        label: "In Training",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "training",
        }).length,
        description: "Candidates progressing through training.",
        accent: "border-violet-200 bg-violet-50 text-violet-800",
      },
      {
        key: "certification",
        label: "In Certification",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "certification",
        }).length,
        description: "Candidates currently in the certification stage.",
        accent: "border-blue-200 bg-blue-50 text-blue-800",
      },
      {
        key: "onboarded",
        label: "Approved & Onboarded",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "onboarded",
        }).length,
        description: "Candidates fully approved and onboarded.",
        accent: "border-emerald-200 bg-emerald-50 text-emerald-800",
      },
      {
        key: "rejected",
        label: "Rejected",
        value: getFilteredBatchApplications(applications, {
          ...DEFAULT_FILTERS,
          stage: "rejected",
        }).length,
        description: "Candidates with a rejected outcome.",
        accent: "border-rose-200 bg-rose-50 text-rose-800",
      },
    ],
    [applications],
  );

  const handleExtendDate = async () => {
    if (!batch) return;

    try {
      setSaving(true);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        endDate: extendedDate,
      });
      await loadBatch();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to extend batch date.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBatchConfig = async () => {
    if (!batch) return;
    if (
      !batchConfigDraft.name.trim() ||
      !batchConfigDraft.role.trim() ||
      !batchConfigDraft.startDate ||
      !batchConfigDraft.endDate
    ) {
      setError("Batch name, role, start date, and end date are required.");
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        name: batchConfigDraft.name,
        role: batchConfigDraft.role,
        startDate: batchConfigDraft.startDate,
        endDate: batchConfigDraft.endDate,
        landingPageLink: batchConfigDraft.landingPageLink,
        examPassingScore: Math.min(
          100,
          Math.max(1, Number(batchConfigDraft.passingThreshold || 70)),
        ),
        registrationQuota: Math.max(
          0,
          Number(batchConfigDraft.registrationQuota || 0),
        ),
        autoCurateOnQuotaReached: batchConfigDraft.autoCurateOnQuotaReached,
        autoCurateOnBatchClose: batchConfigDraft.autoCurateOnBatchClose,
      });
      setConfigDialogOpen(false);
      await loadBatch();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update batch configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveTrainingMaterial = async () => {
    if (!batch) return;
    if (!trainingForm.title.trim()) {
      toast.error("Material title is required");
      return;
    }

    try {
      setSavingTraining(true);
      let contentValue = trainingForm.contentValue;

      if (trainingForm.contentType === "pdf_file") {
        if (trainingForm.pdfFile) {
          const uploadResult = await uploadTrainingPdf(trainingForm.pdfFile);
          contentValue = uploadResult.data.url;
        } else if (!editingTrainingId) {
          toast.error("PDF file is required");
          return;
        }
      } else {
        contentValue = trainingForm.contentValue.trim();
        if (!contentValue) {
          toast.error(
            `${getTrainingValueLabel(trainingForm.contentType)} is required`,
          );
          return;
        }
      }

      const payload = {
        title: trainingForm.title,
        description: trainingForm.description,
        contentType: trainingForm.contentType,
        contentValue,
      };

      if (editingTrainingId) {
        await updateTrainingContent(editingTrainingId, payload);
        toast.success("Training material updated");
      } else {
        const createdResponse = await createTrainingContent({
          ...payload,
          orderIndex: trainingContent.length + 1,
        });
        const createdTrainingItem = createdResponse.data;
        await axiosInstance.put(`/back-office/batch/${batch.id}`, {
          trainingMaterialIds: [
            ...Array.from(
              new Set([
              ...(batch.trainingMaterialIds || []),
              createdTrainingItem.id,
              ]),
            ),
          ],
        });
        toast.success("Training material added");
      }

      setTrainingForm({
        title: "",
        description: "",
        contentType: "pdf_file",
        contentValue: "",
        pdfFile: null,
      });
      setEditingTrainingId(null);
      setTrainingEditorOpen(false);
      await loadBatch();
    } catch {
      toast.error("Failed to save training material");
    } finally {
      setSavingTraining(false);
    }
  };

  const removeTrainingMaterial = async (id: string) => {
    if (!batch) return;
    try {
      await deleteTrainingContent(id);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        trainingMaterialIds: (batch.trainingMaterialIds || []).filter(
          (itemId) => itemId !== id,
        ),
      });
      toast.success("Training material deleted");
      await loadBatch();
    } catch {
      toast.error("Failed to delete training material");
    }
  };

  const saveInterviewQuestion = async () => {
    if (!batch) return;
    if (!interviewForm.videoInstructions.trim()) {
      toast.error("Interview instructions are required");
      return;
    }

    try {
      setSavingQuestion(true);
      const payload = {
        type: "video_introduction" as const,
        question: interviewForm.videoInstructions.substring(0, 100),
        points: Number(interviewForm.points || 1),
        videoInstructions: interviewForm.videoInstructions,
        isActive: true,
      };

      if (editingInterviewQuestionId) {
        await updateQuestion(editingInterviewQuestionId, payload);
        toast.success("Interview guideline updated");
      } else {
        const createdResponse = await createQuestion(payload);
        const createdQuestion = createdResponse.data;
        await axiosInstance.put(`/back-office/batch/${batch.id}`, {
          interviewQuestionIds: [
            ...Array.from(
              new Set([
              ...(batch.interviewQuestionIds || []),
              createdQuestion.id,
              ]),
            ),
          ],
        });
        toast.success("Interview guideline added");
      }

      setInterviewForm({
        videoInstructions: "",
        points: "1",
      });
      setEditingInterviewQuestionId(null);
      setInterviewEditorOpen(false);
      await loadBatch();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save guideline");
    } finally {
      setSavingQuestion(false);
    }
  };

  const removeInterviewQuestion = async (id: string) => {
    if (!batch) return;
    try {
      await deleteQuestion(id);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        interviewQuestionIds: (batch.interviewQuestionIds || []).filter(
          (itemId) => itemId !== id,
        ),
      });
      toast.success("Guideline deleted");
      await loadBatch();
    } catch {
      toast.error("Failed to delete guideline");
    }
  };

  const saveExamQuestion = async () => {
    if (!batch) return;
    if (!examForm.question.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (examForm.type === "multiple_choice") {
      if (examForm.options.length < MULTIPLE_CHOICE_OPTION_LIMIT.min) {
        toast.error(
          `At least ${MULTIPLE_CHOICE_OPTION_LIMIT.min} options are required`,
        );
        return;
      }
      if (examForm.options.length > MULTIPLE_CHOICE_OPTION_LIMIT.max) {
        toast.error(
          `Maximum ${MULTIPLE_CHOICE_OPTION_LIMIT.max} options are allowed`,
        );
        return;
      }
      if (examForm.options.some((option) => !option.label.trim())) {
        toast.error("All multiple choice options are required");
        return;
      }
      if (
        !examForm.options.some(
          (option) => option.id === examForm.correctOptionId,
        )
      ) {
        toast.error("Select the correct answer");
        return;
      }
    }

    const normalizedOptions =
      examForm.type === "multiple_choice"
        ? examForm.options.map((option, index) => ({
            label: option.label.trim(),
            value: MULTIPLE_CHOICE_OPTION_VALUES[index],
          }))
        : undefined;

    const normalizedCorrectAnswer =
      examForm.type === "multiple_choice"
        ? normalizedOptions?.find(
            (_, index) =>
              examForm.options[index]?.id === examForm.correctOptionId,
          )?.value
        : undefined;

    if (examForm.type === "multiple_choice" && !normalizedCorrectAnswer) {
      toast.error("Select the correct answer");
      return;
    }

    try {
      setSavingQuestion(true);
      const payload = {
        type: examForm.type as "multiple_choice" | "essay",
        question: examForm.question,
        options: normalizedOptions,
        correctAnswer: normalizedCorrectAnswer,
        points: Number(examForm.points || 1),
        isActive: true,
      };

      if (editingExamQuestionId) {
        await updateQuestion(editingExamQuestionId, payload);
        toast.success("Exam question updated");
      } else {
        const createdResponse = await createQuestion(payload);
        const createdQuestion = createdResponse.data;
        await axiosInstance.put(`/back-office/batch/${batch.id}`, {
          examQuestionIds: [
            ...Array.from(
              new Set([...(batch.examQuestionIds || []), createdQuestion.id]),
            ),
          ],
        });
        toast.success("Exam question added");
      }

      setExamForm({
        type: "multiple_choice",
        question: "",
        options: createDefaultExamOptions(),
        correctOptionId: "option-1",
        points: "1",
      });
      setEditingExamQuestionId(null);
      setExamEditorOpen(false);
      await loadBatch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to save exam question",
      );
    } finally {
      setSavingQuestion(false);
    }
  };

  const removeExamQuestion = async (id: string) => {
    if (!batch) return;
    try {
      await deleteQuestion(id);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        examQuestionIds: (batch.examQuestionIds || []).filter(
          (itemId) => itemId !== id,
        ),
      });
      toast.success("Question deleted");
      await loadBatch();
    } catch {
      toast.error("Failed to delete question");
    }
  };

  const handleForceClose = async () => {
    if (!batch) return;

    try {
      setSaving(true);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        status: "closed",
      });
      await loadBatch();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to close batch.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReopenBatch = async () => {
    if (!batch) return;

    try {
      setSaving(true);
      await axiosInstance.put(`/back-office/batch/${batch.id}`, {
        status: "open",
      });
      await loadBatch();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reopen batch.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLandingPageLink = async () => {
    if (!batch?.landingPageLink || typeof window === "undefined") return;

    try {
      await window.navigator.clipboard.writeText(batch.landingPageLink);
    } catch {
      setError("Failed to copy landing page link.");
    }
  };

  let detailContent: React.ReactNode = null;

  if (loading) {
    detailContent = (
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading batch detail...</p>
      </section>
    );
  } else if (batch) {
    detailContent = (
      <>
        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[
              { label: "Batch No.", value: batch.name },
              { label: "Partner Role", value: batch.role || "-" },
              { label: "Applied", value: String(appliedCount) },
              {
                label: "Start From",
                value: dayjs(batch.startDate).format("DD MMM YYYY"),
              },
              {
                label: "Expire On",
                value: dayjs(batch.endDate).format("DD MMM YYYY"),
              },
              {
                label: "Status",
                value:
                  (batch.effectiveStatus || batch.status) === "open"
                    ? "Open"
                    : "Closed",
              },
              {
                label: "Passing Threshold",
                value: `${batch.examPassingScore || 0}%`,
              },
              { label: "Training", value: `${trainingContent.length} item(s)` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-center rounded-2xl bg-slate-50 px-4 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-1 flex-1 break-words text-sm font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}

            <div className="flex flex-col justify-center rounded-2xl bg-slate-50 px-4 py-3 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Landing Page Link
              </p>
              <div className="mt-1 flex flex-1 items-center gap-2">
                <p className="min-w-0 break-words text-sm font-semibold text-slate-900">
                  {batch.landingPageLink || "-"}
                </p>
                {batch.landingPageLink ? (
                  <button
                    type="button"
                    onClick={() => void handleCopyLandingPageLink()}
                    className="shrink-0 text-slate-400 transition hover:text-slate-600"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Candidate Stepper from Admin PoV
              </p>
              <h3 className="text-2xl font-semibold text-slate-900">
                Batch Candidate Statistics
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                A clean summary of the current recruitment funnel for this
                batch, with the same stage-oriented admin view used in the
                affiliate program workspace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-12">
              {statsItems.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setFilters((current) => ({
                      ...current,
                      stage: item.key === "total" ? "" : item.key,
                    }))
                  }
                  className={`group relative overflow-hidden rounded-[24px] border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md xl:col-span-3 ${
                    index >= 4 ? "xl:col-span-4" : ""
                  } ${item.accent} ${
                    filters.stage === item.key ||
                    (!filters.stage && item.key === "total")
                      ? "ring-2 ring-slate-900/10"
                      : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="max-w-[12rem] text-sm font-semibold leading-5">
                        {item.label}
                      </p>
                      <span className="rounded-full border border-current/10 bg-white/70 px-2 py-1 text-[10px] font-semibold opacity-70">
                        {item.key === "total" ? "All" : "Stage"}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="text-3xl font-bold tracking-tight">
                        {item.value}
                      </p>
                      <p className="max-w-[9rem] text-right text-[11px] leading-4 opacity-75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <AffiliateFilters
              values={filters}
              onChange={(key, value) =>
                setFilters((current) => ({
                  ...current,
                  [key]: value === "all" ? "" : value,
                }))
              }
              onExport={() =>
                setError("Export is not available from batch detail yet.")
              }
              onReset={() => setFilters(DEFAULT_FILTERS)}
            />

            <AffiliateTable
              data={filteredApplications}
              isLoading={false}
              emptyMessage="No candidates match the current batch filters."
              detailBasePath={detailBasePath}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Batch AI Summary
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Whole-batch conclusion
              </h3>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                Review the AI conclusion for this batch, including top signals,
                risk signals, and the overall recommendation for all candidates.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {aiSource?.name || batch?.name || "—"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {aiUpdatedLabel}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    <Users className="h-3.5 w-3.5" />
                    {aiCandidateCount} candidate(s)
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                      aiStatusClass,
                    )}
                  >
                    {isAiRunning ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {aiStatusLabel}
                  </span>
                </div>
              </div>

              {isAiRunning ? (
                <div className="mt-4 rounded-[20px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                  AI is still curating this batch in the background. This panel
                  will update automatically.
                </div>
              ) : null}

              {aiStatus === "failed" && aiSource?.aiScreeningError ? (
                <div className="mt-4 rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {aiSource.aiScreeningError}
                </div>
              ) : null}

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-slate-200 px-4 text-slate-700 hover:bg-slate-100 hidden"
                  onClick={handleRecurate}
                  disabled={isRecurating || isAiRunning}
                >
                  {isRecurating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {aiActionLabel}
                </Button>
              </div>

              <div className="mt-5 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Brain className="h-4 w-4 text-[#E30613]" />
                  <span>AI conclusion</span>
                </div>
                {isAiRunning ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-11/12 rounded-full" />
                    <Skeleton className="h-4 w-9/12 rounded-full" />
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    {aiSource?.aiScreeningSummary ||
                      "No AI batch summary generated yet for this batch."}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Decision rationale</span>
                </div>
                {isAiRunning ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-10/12 rounded-full" />
                    <Skeleton className="h-4 w-8/12 rounded-full" />
                  </div>
                ) : (
                  <p className="text-sm leading-7 text-slate-600">
                    {aiSource?.aiScreeningDecisionRationale ||
                      "No AI rationale generated yet for this batch."}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Top signals</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isAiRunning ? (
                    <>
                      <Skeleton className="h-7 w-28 rounded-full" />
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </>
                  ) : null}
                  {!isAiRunning && hasTopSignals
                    ? aiSource?.aiScreeningTopSignals?.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        >
                          {signal}
                        </span>
                      ))
                    : null}
                  {!isAiRunning && !hasTopSignals ? (
                    <p className="text-sm text-slate-500">
                      No top signals recorded yet.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Risk signals</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isAiRunning ? (
                    <>
                      <Skeleton className="h-7 w-28 rounded-full" />
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </>
                  ) : null}
                  {!isAiRunning && hasRiskSignals
                    ? aiSource?.aiScreeningRiskSignals?.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                        >
                          {signal}
                        </span>
                      ))
                    : null}
                  {!isAiRunning && !hasRiskSignals ? (
                    <p className="text-sm text-slate-500">
                      No risk signals recorded yet.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-3">
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Interview Questions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {selectedInterviewQuestions.length} question(s) linked to this
              batch.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setInterviewQuestionsDialogOpen(true)}
            >
              Manage Questions
            </Button>
          </section>
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Training Material
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {trainingContent.length} material(s) linked to this batch.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setTrainingMaterialDialogOpen(true)}
            >
              Manage Material
            </Button>
          </section>

          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">
              Exam Questions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {selectedQuestions.length} question(s) linked to this batch.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setExamQuestionsDialogOpen(true)}
            >
              Manage Questions
            </Button>
          </section>
        </div>
      </>
    );
  }

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header
        title="Batch Details"
        label="Partner Recruitment System"
        breadcrumbs={[
          {
            label: "Partner Recruitment System",
            href: "/partner-recruitment-system",
          },
          { label: batch?.name || "Batch Details" },
        ]}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/partner-recruitment-system"
              className="text-sm font-semibold text-[#2A399D] transition hover:text-[#1d2971]"
            >
              Back to Dashboard
            </Link>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              {loading ? "Loading batch..." : batch?.name || "Batch detail"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review the candidate pipeline, inspect linked material references,
              and manage admin actions from the action menu.
            </p>
          </div>

          {!loading && batch ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem
                  onClick={handleRecurate}
                  disabled={isRecurating || isAiRunning}
                >
                  {isRecurating || isAiRunning ? (
                    <span>Processing...</span>
                  ) : (
                    <span>Execute Manual Review AI</span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfigDialogOpen(true)}>
                  Edit Batch Configuration
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setExtendDialogOpen(true)}>
                  Extend Batch
                </DropdownMenuItem>

                {(batch.effectiveStatus || batch.status) === "open" ? (
                  <DropdownMenuItem
                    onClick={() => setForceCloseDialogOpen(true)}
                    className="text-rose-600 focus:text-rose-600"
                  >
                    Force Close Batch
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => setReopenDialogOpen(true)}
                    className="text-emerald-600 focus:text-emerald-600"
                  >
                    Re-open Batch
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </section>

      {detailContent}

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Batch Configuration</DialogTitle>
            <DialogDescription>
              Update the core registration settings for this batch.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Batch Name</Label>
              <Input
                value={batchConfigDraft.name}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={batchConfigDraft.role}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Registration Start Date</Label>
              <Input
                type="date"
                value={batchConfigDraft.startDate}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Registration End Date</Label>
              <Input
                type="date"
                value={batchConfigDraft.endDate}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Landing Page Link</Label>
              <Input
                value={batchConfigDraft.landingPageLink}
                placeholder="https://..."
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    landingPageLink: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Registration Limit</Label>
              <Input
                type="number"
                min="0"
                placeholder="0 = unlimited"
                value={batchConfigDraft.registrationQuota}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    registrationQuota: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Passing Threshold</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={batchConfigDraft.passingThreshold}
                onChange={(event) =>
                  setBatchConfigDraft((current) => ({
                    ...current,
                    passingThreshold: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="detail-auto-curate-quota"
                  checked={batchConfigDraft.autoCurateOnQuotaReached}
                  onCheckedChange={(checked) =>
                    setBatchConfigDraft((current) => ({
                      ...current,
                      autoCurateOnQuotaReached: checked === true,
                    }))
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="detail-auto-curate-quota"
                    className="cursor-pointer"
                  >
                    Automatically review candidates when the registration limit
                    is reached
                  </Label>
                  <p className="text-xs leading-5 text-slate-500">
                    As soon as the batch is full, the system will start the AI
                    review process.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="detail-auto-curate-close"
                  checked={batchConfigDraft.autoCurateOnBatchClose}
                  onCheckedChange={(checked) =>
                    setBatchConfigDraft((current) => ({
                      ...current,
                      autoCurateOnBatchClose: checked === true,
                    }))
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="detail-auto-curate-close"
                    className="cursor-pointer"
                  >
                    Automatically review candidates when the batch ends
                  </Label>
                  <p className="text-xs leading-5 text-slate-500">
                    The system will start the AI review process when the end
                    date passes or the batch is marked as closed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfigDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveBatchConfig}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Batch</DialogTitle>
            <DialogDescription>
              Set a new expiry date for this batch. The updated date will be
              applied immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              New Expire Date
            </label>
            <Input
              type="date"
              value={extendedDate}
              onChange={(event) => setExtendedDate(event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setExtendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await handleExtendDate();
                setExtendDialogOpen(false);
              }}
              disabled={saving || !extendedDate}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={forceCloseDialogOpen}
        onOpenChange={setForceCloseDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close This Batch?</DialogTitle>
            <DialogDescription>
              Are you sure you want to close <strong>{batch?.name}</strong>?
              This will stop new candidate registrations for this batch.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setForceCloseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                await handleForceClose();
                setForceCloseDialogOpen(false);
              }}
              disabled={saving}
            >
              {saving ? "Closing..." : "Yes, Close Batch"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={reopenDialogOpen} onOpenChange={setReopenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Re-open This Batch?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reopen <strong>{batch?.name}</strong>?
              New candidates will be able to register again as long as the end
              date is valid.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReopenDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                await handleReopenBatch();
                setReopenDialogOpen(false);
              }}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {saving ? "Re-opening..." : "Yes, Re-open Batch"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={trainingMaterialDialogOpen}
        onOpenChange={setTrainingMaterialDialogOpen}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Training Material</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setEditingTrainingId(null);
                  setTrainingForm({
                    title: "",
                    description: "",
                    contentType: "pdf_file",
                    contentValue: "",
                    pdfFile: null,
                  });
                  setTrainingEditorOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </div>
            {trainingContent.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No training material configured.
              </div>
            ) : (
              trainingContent.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {getTrainingTypeLabel(item.contentType)}
                      </p>
                      <p className="mt-2 break-words text-sm text-slate-600">
                        {item.description || item.contentValue}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTrainingId(item.id);
                          setTrainingForm({
                            title: item.title,
                            description: item.description || "",
                            contentType: item.contentType,
                            contentValue: item.contentValue,
                            pdfFile: null,
                          });
                          setTrainingEditorOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void removeTrainingMaterial(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={interviewQuestionsDialogOpen}
        onOpenChange={setInterviewQuestionsDialogOpen}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Questions</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setEditingInterviewQuestionId(null);
                  setInterviewForm({
                    videoInstructions: "",
                    points: "1",
                  });
                  setInterviewEditorOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Guideline
              </Button>
            </div>
            {selectedInterviewQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No interview guidelines linked to this batch.
              </div>
            ) : (
              selectedInterviewQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Interview Prompt {index + 1}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-900">
                        {question.videoInstructions || question.question}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingInterviewQuestionId(question.id);
                          setInterviewForm({
                            videoInstructions:
                              question.videoInstructions || question.question || "",
                            points: String(question.points || 1),
                          });
                          setInterviewEditorOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void removeInterviewQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={examQuestionsDialogOpen}
        onOpenChange={setExamQuestionsDialogOpen}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exam Questions</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setEditingExamQuestionId(null);
                  setExamForm({
                    type: "multiple_choice",
                    question: "",
                    options: createDefaultExamOptions(),
                    correctOptionId: "option-1",
                    points: "1",
                  });
                  setExamEditorOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
            {selectedQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No exam questions linked to this batch.
              </div>
            ) : (
              selectedQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Question {index + 1}
                      </p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {question.question}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {question.type} • {question.points} point(s)
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingExamQuestionId(question.id);
                          const optionDrafts = toExamOptionDrafts(question.options);
                          const matchedCorrectOption =
                            optionDrafts.find(
                              (option) => option.id === question.correctAnswer,
                            )?.id ||
                            optionDrafts[0]?.id ||
                            "option-1";
                          setExamForm({
                            type: question.type,
                            question: question.question,
                            options: optionDrafts,
                            correctOptionId: matchedCorrectOption,
                            points: String(question.points || 1),
                          });
                          setExamEditorOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => void removeExamQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={trainingEditorOpen} onOpenChange={setTrainingEditorOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{trainingEditorTitle}</DialogTitle>
            <DialogDescription>
              {editingTrainingId ? "Update" : "Add"} learning resources for this batch.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Choose Format</Label>
                <Select
                  value={trainingForm.contentType}
                  onValueChange={(value) =>
                    setTrainingForm((current) => ({ ...current, contentType: value }))
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {trainingTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Material Title</Label>
                <Input
                  value={trainingForm.title}
                  onChange={(event) =>
                    setTrainingForm((current) => ({ ...current, title: event.target.value }))
                  }
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={trainingForm.description}
                onChange={(event) =>
                  setTrainingForm((current) => ({ ...current, description: event.target.value }))
                }
                className="min-h-20 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label>{getTrainingValueLabel(trainingForm.contentType)}</Label>
              {renderTrainingValueInput()}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setTrainingEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveTrainingMaterial} disabled={savingTraining}>
                {trainingEditorSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={interviewEditorOpen} onOpenChange={setInterviewEditorOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{interviewEditorTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="space-y-2">
              <Label>Interview Instructions</Label>
              <Textarea
                value={interviewForm.videoInstructions}
                onChange={(event) =>
                  setInterviewForm((current) => ({ ...current, videoInstructions: event.target.value }))
                }
                className="min-h-32 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setInterviewEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveInterviewQuestion} disabled={savingQuestion}>
                {interviewEditorSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={examEditorOpen} onOpenChange={setExamEditorOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{examEditorTitle}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select
                value={examForm.type}
                onValueChange={(value) => setExamForm((current) => ({ ...current, type: value }))}
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={examForm.question}
                onChange={(event) => setExamForm((current) => ({ ...current, question: event.target.value }))}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>
            {examForm.type === "multiple_choice" ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Label>Answer Options</Label>
                      <p className="mt-1 text-xs text-slate-500">
                        Minimum {MULTIPLE_CHOICE_OPTION_LIMIT.min}, maximum {MULTIPLE_CHOICE_OPTION_LIMIT.max}. Drag to reorder.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addExamOption}
                      disabled={examForm.options.length >= MULTIPLE_CHOICE_OPTION_LIMIT.max}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {examForm.options.map((option, index) => (
                      <div
                        key={option.id}
                        draggable
                        onDragStart={() => setDraggingOptionId(option.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (draggingOptionId) moveExamOption(draggingOptionId, option.id);
                          setDraggingOptionId(null);
                        }}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3"
                      >
                        <button type="button" className="cursor-grab text-slate-400">
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          value={option.label}
                          onChange={(event) => updateExamOption(option.id, event.target.value)}
                          className="h-11 rounded-xl border-slate-200 bg-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExamOption(option.id)}
                          disabled={examForm.options.length <= MULTIPLE_CHOICE_OPTION_LIMIT.min}
                        >
                          <Trash2 className="h-4 w-4 text-rose-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Select
                    value={examForm.correctOptionId}
                    onValueChange={(value) =>
                      setExamForm((current) => ({ ...current, correctOptionId: value }))
                    }
                  >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {examForm.options.map((option, index) => (
                        <SelectItem key={option.id} value={option.id}>
                          {String.fromCharCode(65 + index)}. {option.label || `Option ${index + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : null}
            <div className="space-y-2">
              <Label>Weight</Label>
              <Input
                type="number"
                min="1"
                value={examForm.points}
                onChange={(event) => setExamForm((current) => ({ ...current, points: event.target.value }))}
                className="h-12 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setExamEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveExamQuestion} disabled={savingQuestion}>
                {examEditorSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default PartnerRecruitmentBatchDetailContent;
