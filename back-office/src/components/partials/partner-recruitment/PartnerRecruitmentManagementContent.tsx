"use client"

import React, { useEffect, useMemo, useState } from "react"
import { CheckCircle2, GripVertical, Lock, Plus, Trash2, UploadCloud, Pencil } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const CKEditorComponent = dynamic(
  () => import("@/components/partials/form/CKEditorComponent"),
  { ssr: false }
)

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useBatches, type AffiliateBatch } from "@/hooks/partnership/useBatches"
import { axiosInstance } from "@/lib/axios"
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  type AssessmentQuestion,
  updateQuestion,
} from "@/lib/api/assessment"
import {
  createTrainingContent,
  deleteTrainingContent,
  getTrainingContent,
  updateTrainingContent,
  uploadTrainingPdf,
  type TrainingContent,
} from "@/lib/api/training-content"

type WizardStepId =
  | "open-new-batch"
  | "landing-page-link"
  | "setup-interview"
  | "add-training-material"
  | "setup-exam"
  | "review"

const wizardSteps: Array<{ id: WizardStepId; label: string }> = [
  { id: "open-new-batch", label: "Open New Batch" },
  { id: "landing-page-link", label: "Input Landing Page Link" },
  { id: "setup-interview", label: "Setup Interview Guidelines" },
  { id: "add-training-material", label: "Add Training Material" },
  { id: "setup-exam", label: "Setup Exam" },
  { id: "review", label: "Review Before Publish" },
]

const trainingTypeOptions = [
  { label: "PDF", value: "pdf_file" },
  { label: "Video", value: "video_url" },
  { label: "Text-based", value: "embed_code" },
  { label: "Embedded Code", value: "embed_script" },
  { label: "Widget", value: "widget_id" },
  { label: "Live Experience Apps", value: "credentials" },
] as const

const questionTypeOptions = [
  { label: "Multiple Choice", value: "multiple_choice" },
  { label: "Essay", value: "essay" },
  { label: "Video Interview", value: "video_introduction" },
] as const

const RECRUITMENT_WIZARD_BATCH_ID_KEY = "partner-recruitment-wizard-batch-id"
const MULTIPLE_CHOICE_OPTION_LIMIT = {
  min: 2,
  max: 6,
} as const
const MULTIPLE_CHOICE_OPTION_VALUES = ["a", "b", "c", "d", "e", "f"] as const

type ExamOptionDraft = {
  id: string
  label: string
}

const createExamOptionDraft = (id: string, label = ""): ExamOptionDraft => ({
  id,
  label,
})

const createDefaultExamOptions = () => [
  createExamOptionDraft("option-1"),
  createExamOptionDraft("option-2"),
]

const getStepButtonStateClass = (isActive: boolean, isEnabled: boolean) => {
  if (isActive) return "bg-red-700 text-white shadow-sm"
  if (isEnabled) return "bg-slate-100 text-slate-700 hover:bg-slate-200"
  return "cursor-not-allowed bg-slate-50 text-slate-400"
}

const getTrainingValueLabel = (contentType: string) => {
  if (contentType === "pdf_file") return "Upload PDF"
  if (contentType === "video_url") return "Video URL"
  if (contentType === "embed_code") return "Text Content"
  if (contentType === "credentials") return "Credentials Content"
  if (contentType === "widget_id") return "Widget ID"
  return "Embedded Code"
}

const getTrainingValuePlaceholder = (contentType: string) => {
  if (contentType === "video_url") return "https://youtube.com/..."
  if (contentType === "embed_code") return "Paste the text-based training content here"
  if (contentType === "credentials")
    return "Add the sample login details, app links, notes, and usage guidance here"
  if (contentType === "widget_id") return "69cc86067061130e2304adaa"
  if (contentType === "embed_script")
    return "<script>...</script>, <iframe ...>, or any embedded HTML/JS code"
  return ""
}

const getTrainingTypeLabel = (contentType: string) =>
  trainingTypeOptions.find((option) => option.value === contentType)?.label || contentType

const getDialogSubmitLabel = (
  isSaving: boolean,
  isEditing: boolean,
  createLabel: string,
  updateLabel: string,
) => {
  if (isSaving) return "Saving..."
  if (isEditing) return updateLabel
  return createLabel
}

const getQuestionMode = (questionType: string) => {
  if (questionType === "multiple_choice") return "multiple_choice"
  if (questionType === "video_introduction") return "video_introduction"
  return "essay"
}

const formatEnglishDate = (value?: string) => {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

const toExamOptionDrafts = (
  options?: { label: string; value: string }[] | null,
): ExamOptionDraft[] => {
  if (!options?.length) return createDefaultExamOptions()

  return options
    .slice(0, MULTIPLE_CHOICE_OPTION_LIMIT.max)
    .map((option, index) =>
      createExamOptionDraft(option.value || `option-${index + 1}`, option.label || ""),
    )
}

export const PartnerRecruitmentManagementContent = () => {
  const router = useRouter()
  const { batches, refresh, updateBatch } = useBatches()

  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeStep, setActiveStep] = useState<WizardStepId>("open-new-batch")
  const [trainingItems, setTrainingItems] = useState<TrainingContent[]>([])
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState("")
  const [savingBatch, setSavingBatch] = useState(false)
  const [savingLandingLink, setSavingLandingLink] = useState(false)
  const [savingExamConfig, setSavingExamConfig] = useState(false)
  const [trainingForm, setTrainingForm] = useState({
    title: "",
    description: "",
    contentType: "pdf_file",
    contentValue: "",
    pdfFile: null as File | null,
  })
  const [savingTraining, setSavingTraining] = useState(false)
  const [addTrainingDialogOpen, setAddTrainingDialogOpen] = useState(false)
  const [editingTrainingId, setEditingTrainingId] = useState<string | null>(null)
  const [examForm, setExamForm] = useState({
    type: "multiple_choice",
    question: "",
    options: createDefaultExamOptions(),
    correctOptionId: "option-1",
    points: "1",
  })
  const [editingExamQuestionId, setEditingExamQuestionId] = useState<string | null>(null)
  const [addExamDialogOpen, setAddExamDialogOpen] = useState(false)
  const [interviewForm, setInterviewForm] = useState({
    videoInstructions: "",
    points: "1",
  })
  const [savingQuestion, setSavingQuestion] = useState(false)
  const [addInterviewDialogOpen, setAddInterviewDialogOpen] = useState(false)
  const [editingInterviewQuestionId, setEditingInterviewQuestionId] = useState<string | null>(null)
  const [draggingOptionId, setDraggingOptionId] = useState<string | null>(null)
  const [batchDraft, setBatchDraft] = useState({
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    registrationQuota: "",
    autoCurateOnQuotaReached: false,
    autoCurateOnBatchClose: true,
  })
  const [landingPageLink, setLandingPageLink] = useState("")
  const [selectedExamQuestionIds, setSelectedExamQuestionIds] = useState<string[]>([])
  const [selectedInterviewQuestionIds, setSelectedInterviewQuestionIds] = useState<string[]>([])
  const [passingThreshold, setPassingThreshold] = useState("70")
  const examQuestionMode = getQuestionMode(examForm.type)
  const trainingDialogSubmitLabel = getDialogSubmitLabel(
    savingTraining,
    Boolean(editingTrainingId),
    "Save Material",
    "Update Material",
  )
  const interviewDialogSubmitLabel = getDialogSubmitLabel(
    savingQuestion,
    Boolean(editingInterviewQuestionId),
    "Save Guideline",
    "Update Guideline",
  )
  const examDialogSubmitLabel = getDialogSubmitLabel(
    savingQuestion,
    Boolean(editingExamQuestionId),
    "Save Question",
    "Update Question",
  )

  const currentBatch = useMemo(
    () => batches.find((item) => item.id === selectedBatchId) || null,
    [batches, selectedBatchId],
  )

  const renderTrainingFormValueInput = () => {
    if (trainingForm.contentType === "pdf_file") {
      return (
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group relative overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
            <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
            {trainingForm.pdfFile ? (
              <p className="text-sm font-semibold text-slate-700 px-4 line-clamp-1">
                {trainingForm.pdfFile.name}
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold text-slate-700">Click or drag file to upload</p>
                <p className="text-xs text-slate-500 mt-1 px-4">PDF Documents only</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={(e) =>
              setTrainingForm((current) => ({ ...current, pdfFile: e.target.files?.[0] || null }))
            }
          />
        </label>
      )
    }

    if (
      trainingForm.contentType === "embed_code" ||
      trainingForm.contentType === "credentials"
    ) {
      return (
        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
          <CKEditorComponent
            value={trainingForm.contentValue}
            uploadUrl="/back-office/partner/upload-content-image"
            onChange={(value) => setTrainingForm((current) => ({ ...current, contentValue: value }))}
          />
        </div>
      )
    }

    if (trainingForm.contentType === "widget_id" || trainingForm.contentType === "video_url") {
      return (
        <Input
          value={trainingForm.contentValue}
          placeholder={getTrainingValuePlaceholder(trainingForm.contentType)}
          onChange={(event) =>
            setTrainingForm((current) => ({ ...current, contentValue: event.target.value }))
          }
          className="h-12 rounded-2xl border-slate-200 bg-slate-50"
        />
      )
    }

    return (
      <Textarea
        value={trainingForm.contentValue}
        placeholder={getTrainingValuePlaceholder(trainingForm.contentType)}
        onChange={(event) =>
          setTrainingForm((current) => ({ ...current, contentValue: event.target.value }))
        }
        className="min-h-32 rounded-2xl border-slate-200 bg-slate-50"
      />
    )
  }

  const addExamOption = () => {
    setExamForm((current) => {
      if (current.options.length >= MULTIPLE_CHOICE_OPTION_LIMIT.max) return current

      return {
        ...current,
        options: [
          ...current.options,
          createExamOptionDraft(`option-${Date.now()}-${current.options.length + 1}`),
        ],
      }
    })
  }

  const updateExamOption = (optionId: string, label: string) => {
    setExamForm((current) => ({
      ...current,
      options: current.options.map((option) =>
        option.id === optionId ? { ...option, label } : option,
      ),
    }))
  }

  const removeExamOption = (optionId: string) => {
    setExamForm((current) => {
      if (current.options.length <= MULTIPLE_CHOICE_OPTION_LIMIT.min) return current

      const nextOptions = current.options.filter((option) => option.id !== optionId)
      const nextCorrectOptionId =
        current.correctOptionId === optionId
          ? nextOptions[0]?.id || ""
          : current.correctOptionId

      return {
        ...current,
        options: nextOptions,
        correctOptionId: nextCorrectOptionId,
      }
    })
  }

  const moveExamOption = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return

    setExamForm((current) => {
      const nextOptions = [...current.options]
      const fromIndex = nextOptions.findIndex((option) => option.id === draggedId)
      const toIndex = nextOptions.findIndex((option) => option.id === targetId)

      if (fromIndex < 0 || toIndex < 0) return current

      const [movedOption] = nextOptions.splice(fromIndex, 1)
      nextOptions.splice(toIndex, 0, movedOption)

      return {
        ...current,
        options: nextOptions,
      }
    })
  }

  const persistWizardBatchId = (batchId: string) => {
    if (typeof window === "undefined") return
    if (!batchId) {
      window.sessionStorage.removeItem(RECRUITMENT_WIZARD_BATCH_ID_KEY)
      return
    }
    window.sessionStorage.setItem(RECRUITMENT_WIZARD_BATCH_ID_KEY, batchId)
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    const persistedBatchId = window.sessionStorage.getItem(
      RECRUITMENT_WIZARD_BATCH_ID_KEY,
    )
    if (persistedBatchId) {
      setSelectedBatchId(persistedBatchId)
    }
  }, [])

  useEffect(() => {
    if (!currentBatch) return

    const load = async () => {
      try {
        const [trainingRes, questionRes] = await Promise.all([
          getTrainingContent(),
          getQuestions({ isActive: true }),
        ])

        setTrainingItems(
          (trainingRes.data || []).filter((item: TrainingContent) =>
            (currentBatch.trainingMaterialIds || []).includes(item.id),
          ),
        )
        setQuestions(
          (questionRes.data || []).filter((item: AssessmentQuestion) =>
            (currentBatch.examQuestionIds || []).includes(item.id) ||
            (currentBatch.interviewQuestionIds || []).includes(item.id),
          ),
        )
      } catch {
        toast.error("Failed to load recruitment dependencies")
      }
    }

    void load()
  }, [currentBatch])

  useEffect(() => {
    if (!currentBatch) return

    setBatchDraft({
      name: currentBatch.name || "",
      role: currentBatch.role || "",
      startDate: currentBatch.startDate ? new Date(currentBatch.startDate).toISOString().slice(0, 10) : "",
      endDate: currentBatch.endDate ? new Date(currentBatch.endDate).toISOString().slice(0, 10) : "",
      registrationQuota:
        Number(currentBatch.registrationQuota || 0) > 0
          ? String(currentBatch.registrationQuota)
          : "",
      autoCurateOnQuotaReached: Boolean(currentBatch.autoCurateOnQuotaReached),
      autoCurateOnBatchClose:
        currentBatch.autoCurateOnBatchClose === undefined
          ? true
          : Boolean(currentBatch.autoCurateOnBatchClose),
    })
    setLandingPageLink(currentBatch.landingPageLink || "")
    setSelectedExamQuestionIds(currentBatch.examQuestionIds || [])
    setSelectedInterviewQuestionIds(currentBatch.interviewQuestionIds || [])
    setPassingThreshold(String(currentBatch.examPassingScore || 70))
  }, [currentBatch])

  const completion = useMemo(() => {
    const batchComplete = Boolean(
      currentBatch &&
        batchDraft.name.trim() &&
        batchDraft.role.trim() &&
        batchDraft.startDate &&
        batchDraft.endDate,
    )
    const landingComplete = batchComplete && Boolean(landingPageLink.trim())
    const interviewComplete = landingComplete && selectedInterviewQuestionIds.length >= 1
    const trainingComplete = interviewComplete && trainingItems.length >= 1
    const examComplete =
      landingComplete && trainingComplete && Number(passingThreshold || 0) > 0 && selectedExamQuestionIds.length >= 5

    return {
      "open-new-batch": batchComplete,
      "landing-page-link": landingComplete,
      "setup-interview": interviewComplete,
      "add-training-material": trainingComplete,
      "setup-exam": examComplete,
      review: examComplete,
    } satisfies Record<WizardStepId, boolean>
  }, [
    batchDraft.endDate,
    batchDraft.name,
    batchDraft.registrationQuota,
    batchDraft.role,
    batchDraft.startDate,
    currentBatch,
    landingPageLink,
    passingThreshold,
    selectedExamQuestionIds.length,
    selectedInterviewQuestionIds.length,
    trainingItems.length,
  ])

  const canAccessStep = (stepId: WizardStepId) => {
    const stepIndex = wizardSteps.findIndex((step) => step.id === stepId)
    if (stepIndex <= 0) return true

    return wizardSteps
      .slice(0, stepIndex)
      .every((step) => completion[step.id])
  }

  const isBatchStepValid = Boolean(
    batchDraft.name.trim() &&
      batchDraft.role.trim() &&
      batchDraft.startDate &&
      batchDraft.endDate,
  )
  const isLandingPageStepValid = Boolean(currentBatch && landingPageLink.trim())
  const isInterviewStepValid = Boolean(
    currentBatch && selectedInterviewQuestionIds.length >= 1,
  )
  const isTrainingStepValid = Boolean(trainingItems.length >= 1)
  const isExamStepValid = Boolean(
    currentBatch &&
      Number(passingThreshold || 0) > 0 &&
      selectedExamQuestionIds.length >= 5,
  )
  const reviewDateRangeLabel =
    batchDraft.startDate && batchDraft.endDate
      ? `${formatEnglishDate(batchDraft.startDate)} - ${formatEnglishDate(batchDraft.endDate)}`
      : "Unscheduled"

  const saveBatchStep = async () => {
    if (!batchDraft.name.trim() || !batchDraft.role.trim() || !batchDraft.startDate || !batchDraft.endDate) {
      toast.error("Batch no, role, start date, and end date are required")
      return
    }

    try {
      setSavingBatch(true)
      const normalizedRegistrationQuota = Math.max(
        0,
        Number(batchDraft.registrationQuota || 0),
      )

      let nextBatchId = selectedBatchId

      if (currentBatch) {
        await updateBatch(currentBatch.id, {
          name: batchDraft.name,
          role: batchDraft.role,
          startDate: batchDraft.startDate,
          endDate: batchDraft.endDate,
          registrationQuota: normalizedRegistrationQuota,
          autoCurateOnQuotaReached: batchDraft.autoCurateOnQuotaReached,
          autoCurateOnBatchClose: batchDraft.autoCurateOnBatchClose,
        })
      } else {
        const response = await axiosInstance.post("/back-office/batch", {
          name: batchDraft.name,
          role: batchDraft.role,
          startDate: batchDraft.startDate,
          endDate: batchDraft.endDate,
          registrationQuota: normalizedRegistrationQuota,
          autoCurateOnQuotaReached: batchDraft.autoCurateOnQuotaReached,
          autoCurateOnBatchClose: batchDraft.autoCurateOnBatchClose,
          status: "draft",
        })
        nextBatchId = response.data.data.id
      }

      await refresh()
      setSelectedBatchId(nextBatchId)
      persistWizardBatchId(nextBatchId)
      toast.success("Batch information saved")
      setActiveStep("landing-page-link")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save batch")
    } finally {
      setSavingBatch(false)
    }
  }

  const saveLandingPageStep = async () => {
    if (!currentBatch) {
      toast.error("Create the new batch first")
      return
    }
    if (!landingPageLink.trim()) {
      toast.error("Landing page link is required")
      return
    }

    setSavingLandingLink(true)
    try {
      await updateBatch(currentBatch.id, {
        role: batchDraft.role,
        landingPageLink,
      })
      await refresh()
      toast.success("Landing page link saved")
      setActiveStep("setup-interview")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save landing page link")
    } finally {
      setSavingLandingLink(false)
    }
  }

  const saveTrainingMaterial = async () => {
    if (!currentBatch) {
      toast.error("Create the new batch first")
      return
    }
    if (!trainingForm.title.trim()) {
      toast.error("Material title is required")
      return
    }

    try {
      setSavingTraining(true)
      let contentValue = trainingForm.contentValue

      if (trainingForm.contentType === "pdf_file") {
        if (trainingForm.pdfFile) {
          const uploadResult = await uploadTrainingPdf(trainingForm.pdfFile)
          contentValue = uploadResult.data.url
        } else if (!editingTrainingId) {
          toast.error("PDF file is required")
          return
        }
      } else {
        contentValue = trainingForm.contentValue.trim()
        if (!contentValue) {
          toast.error(`${getTrainingValueLabel(trainingForm.contentType)} is required`)
          return
        }
      }

      const payload = {
        title: trainingForm.title,
        description: trainingForm.description,
        contentType: trainingForm.contentType,
        contentValue,
      }

      if (editingTrainingId) {
        const updatedResponse = await updateTrainingContent(editingTrainingId, payload)
        const updatedItem = updatedResponse.data
        setTrainingItems((current) =>
          current.map((item) => (item.id === editingTrainingId ? updatedItem : item))
        )
        toast.success("Training material updated")
      } else {
        const createdResponse = await createTrainingContent({
          ...payload,
          orderIndex: trainingItems.length + 1,
        })

        const createdTrainingItem = createdResponse.data
        setTrainingItems((current) => [...current, createdTrainingItem])
        await updateBatch(currentBatch.id, {
          trainingMaterialIds: [
            ...Array.from(
              new Set([
                ...(currentBatch.trainingMaterialIds || []),
                createdTrainingItem.id,
              ]),
            ),
          ],
        })
        await refresh()
        toast.success("Training material added")
      }

      setTrainingForm({
        title: "",
        description: "",
        contentType: "pdf_file",
        contentValue: "",
        pdfFile: null,
      })
      setEditingTrainingId(null)
      setAddTrainingDialogOpen(false)
    } catch {
      toast.error("Failed to save training material")
    } finally {
      setSavingTraining(false)
    }
  }

  const removeTrainingMaterial = async (id: string) => {
    try {
      await deleteTrainingContent(id)
      setTrainingItems((current) => current.filter((item) => item.id !== id))
      if (currentBatch) {
        await updateBatch(currentBatch.id, {
          trainingMaterialIds: (currentBatch.trainingMaterialIds || []).filter(
            (itemId) => itemId !== id,
          ),
        })
        await refresh()
      }
      toast.success("Training material deleted")
    } catch {
      toast.error("Failed to delete training material")
    }
  }

  const saveExamQuestion = async () => {
    if (!examForm.question.trim()) {
      toast.error("Question text is required")
      return
    }

    if (examForm.type === "multiple_choice") {
      if (examForm.options.length < MULTIPLE_CHOICE_OPTION_LIMIT.min) {
        toast.error(`At least ${MULTIPLE_CHOICE_OPTION_LIMIT.min} options are required`)
        return
      }
      if (examForm.options.length > MULTIPLE_CHOICE_OPTION_LIMIT.max) {
        toast.error(`Maximum ${MULTIPLE_CHOICE_OPTION_LIMIT.max} options are allowed`)
        return
      }
      if (examForm.options.some((option) => !option.label.trim())) {
        toast.error("All multiple choice options are required")
        return
      }
      if (!examForm.options.some((option) => option.id === examForm.correctOptionId)) {
        toast.error("Select the correct answer")
        return
      }
    }

    const normalizedOptions =
      examForm.type === "multiple_choice"
        ? examForm.options.map((option, index) => ({
            label: option.label.trim(),
            value: MULTIPLE_CHOICE_OPTION_VALUES[index],
          }))
        : undefined

    const normalizedCorrectAnswer =
      examForm.type === "multiple_choice"
        ? normalizedOptions?.find(
            (_, index) => examForm.options[index]?.id === examForm.correctOptionId,
          )?.value
        : undefined

    if (examForm.type === "multiple_choice" && !normalizedCorrectAnswer) {
      toast.error("Select the correct answer")
      return
    }

    try {
      setSavingQuestion(true)
      const payload = {
        type: examForm.type as "multiple_choice" | "essay",
        question: examForm.question,
        options: normalizedOptions,
        correctAnswer: normalizedCorrectAnswer,
        points: Number(examForm.points || 1),
        isActive: true,
      }

      if (editingExamQuestionId) {
        const updatedResponse = await updateQuestion(editingExamQuestionId, payload)
        const updatedQuestion = updatedResponse.data
        setQuestions((current) =>
          current.map((q) => (q.id === editingExamQuestionId ? updatedQuestion : q))
        )
        toast.success("Exam question updated")
      } else {
        const createdResponse = await createQuestion(payload)
        const createdQuestion = createdResponse.data
        setQuestions((current) => [...current, createdQuestion])
        setSelectedExamQuestionIds((current) =>
          Array.from(new Set([...current, createdQuestion.id])),
        )
        toast.success("Exam question added")
      }

      setExamForm({
        type: "multiple_choice",
        question: "",
        options: createDefaultExamOptions(),
        correctOptionId: "option-1",
        points: "1",
      })
      setEditingExamQuestionId(null)
      setAddExamDialogOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save exam question")
    } finally {
      setSavingQuestion(false)
    }
  }

  const saveInterviewQuestion = async () => {
    if (!interviewForm.videoInstructions.trim()) {
      toast.error("Interview instructions are required")
      return
    }

    try {
      setSavingQuestion(true)
      const payload = {
        type: "video_introduction" as const,
        question: interviewForm.videoInstructions.substring(0, 100),
        points: Number(interviewForm.points || 1),
        videoInstructions: interviewForm.videoInstructions,
        isActive: true,
      }

      if (editingInterviewQuestionId) {
        const updatedResponse = await updateQuestion(editingInterviewQuestionId, payload)
        const updatedQuestion = updatedResponse.data
        setQuestions((current) =>
          current.map((q) => (q.id === editingInterviewQuestionId ? updatedQuestion : q))
        )
        toast.success("Interview guideline updated")
      } else {
        const createdResponse = await createQuestion(payload)
        const createdQuestion = createdResponse.data
        setQuestions((current) => [...current, createdQuestion])
        setSelectedInterviewQuestionIds((current) =>
          Array.from(new Set([...current, createdQuestion.id])),
        )
        toast.success("Interview guideline added")
      }

      setInterviewForm({
        videoInstructions: "",
        points: "1",
      })
      setEditingInterviewQuestionId(null)
      setAddInterviewDialogOpen(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save guideline")
    } finally {
      setSavingQuestion(false)
    }
  }

  const saveInterviewStep = async () => {
    if (!currentBatch) {
      toast.error("Create the new batch first")
      return
    }

    try {
      setSavingExamConfig(true)
      await updateBatch(currentBatch.id, {
        interviewQuestionIds: selectedInterviewQuestionIds,
      })
      await refresh()
      toast.success("Interview setup saved")
      setActiveStep("add-training-material")
    } catch {
      toast.error("Failed to save interview setup")
    } finally {
      setSavingExamConfig(false)
    }
  }

  const saveExamStep = async () => {
    if (!currentBatch) {
      toast.error("Create the new batch first")
      return
    }
    if (selectedExamQuestionIds.length < 5) {
      toast.error("At least 5 exam questions are required")
      return
    }

    try {
      setSavingExamConfig(true)
      await updateBatch(currentBatch.id, {
        examPassingScore: Number(passingThreshold || 70),
        examQuestionIds: selectedExamQuestionIds,
      })
      await refresh()
      toast.success("Exam setup saved")
      setActiveStep("review")
    } catch {
      toast.error("Failed to save exam setup")
    } finally {
      setSavingExamConfig(false)
    }
  }

  const confirmPublishBatch = async () => {
    if (!currentBatch) return
    if (!completion["setup-exam"]) {
      toast.error("Complete all required steps before publish")
      return
    }

    try {
      setIsPublishing(true)
      await updateBatch(currentBatch.id, { status: "open" })
      await refresh()
      setSelectedBatchId("")
      persistWizardBatchId("")
      setShowPublishDialog(false)
      toast.success("Batch published successfully")
      router.push("/partner-recruitment-system")
    } catch {
      toast.error("Failed to publish batch")
    } finally {
      setIsPublishing(false)
    }
  }



  return (
    <React.Fragment>
      <main className="flex w-full flex-col gap-5 pb-12">
      <Header
        title="Recruitment Management"
        label="Partner Recruitment System"
        breadcrumbs={[
          { label: "Partner Recruitment System", href: "/partner-recruitment-system" },
          { label: "Recruitment Management" },
        ]}
      />

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-border bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <div className="space-y-2">
            {wizardSteps.map((step) => {
              const enabled = canAccessStep(step.id)
              const completed = completion[step.id]
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (!enabled) return
                    setActiveStep(step.id)
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                    getStepButtonStateClass(activeStep === step.id, enabled),
                  )}
                >
                  <span>{step.label}</span>
                  {completed && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {!completed && !enabled && <Lock className="h-4 w-4" />}
                </button>
              )
            })}
          </div>
        </aside>

        <section className="space-y-5">
          <section
            id="open-new-batch"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "open-new-batch" && "hidden",
            )}
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Recruitment Management is a wizard for creating a new batch. This page does not load existing batch records for manual editing.
            </div>

            {currentBatch ? (
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span>
                  Draft batch in progress: <strong>{currentBatch.name}</strong>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  className="border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-100"
                  onClick={() => {
                    setSelectedBatchId("")
                    persistWizardBatchId("")
                    setBatchDraft({
                      name: "",
                      role: "",
                      startDate: "",
                      endDate: "",
                      registrationQuota: "",
                      autoCurateOnQuotaReached: false,
                      autoCurateOnBatchClose: true,
                    })
                    setLandingPageLink("")
                    setSelectedExamQuestionIds([])
                    setSelectedInterviewQuestionIds([])
                    setPassingThreshold("70")
                    setActiveStep("open-new-batch")
                  }}
                >
                  Start Another New Batch
                </Button>
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Batch No.</Label>
                <Input
                  value={batchDraft.name}
                  onChange={(event) =>
                    setBatchDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={batchDraft.role}
                  onChange={(event) =>
                    setBatchDraft((current) => ({ ...current, role: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={batchDraft.startDate}
                  onChange={(event) =>
                    setBatchDraft((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={batchDraft.endDate}
                  onChange={(event) =>
                    setBatchDraft((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Limit</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0 = unlimited"
                  value={batchDraft.registrationQuota}
                  onChange={(event) =>
                    setBatchDraft((current) => ({
                      ...current,
                      registrationQuota: event.target.value,
                    }))
                  }
                />
                <p className="text-xs text-slate-500">
                  Leave as 0 to keep registration open without a hard limit.
                </p>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="auto-curate-quota"
                    checked={batchDraft.autoCurateOnQuotaReached}
                    onCheckedChange={(checked) =>
                      setBatchDraft((current) => ({
                        ...current,
                        autoCurateOnQuotaReached: checked === true,
                      }))
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="auto-curate-quota" className="cursor-pointer">
                      Automatically review candidates when the registration limit is reached
                    </Label>
                    <p className="text-xs leading-5 text-slate-500">
                      As soon as the batch is full, the system will start the AI review process.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="auto-curate-close"
                    checked={batchDraft.autoCurateOnBatchClose}
                    onCheckedChange={(checked) =>
                      setBatchDraft((current) => ({
                        ...current,
                        autoCurateOnBatchClose: checked === true,
                      }))
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="auto-curate-close" className="cursor-pointer">
                      Automatically review candidates when the batch ends
                    </Label>
                    <p className="text-xs leading-5 text-slate-500">
                      The system will start the AI review process when the end date passes or the batch is marked as closed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={saveBatchStep}
                disabled={savingBatch || !isBatchStepValid}
              >
                {savingBatch ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </section>

          <section
            id="landing-page-link"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "landing-page-link" && "hidden",
            )}
          >
            <div className="space-y-2">
              <Label>Input Landing Page Link</Label>
              <Input
                value={landingPageLink}
                onChange={(event) => setLandingPageLink(event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={saveLandingPageStep}
                disabled={savingLandingLink || !isLandingPageStepValid}
              >
                {savingLandingLink ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </section>

          <section
            id="setup-interview"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "setup-interview" && "hidden",
            )}
          >
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Video Interview Setup</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Configure video interview guidelines and prompts. Candidates will record a video response.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setEditingInterviewQuestionId(null)
                    setInterviewForm({ videoInstructions: "", points: "1" })
                    setAddInterviewDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Guideline
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-14">Use</TableHead>
                    <TableHead>Interview Instructions</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.filter(q => q.type === "video_introduction").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                        No video interview guidelines added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.filter(q => q.type === "video_introduction").map((question) => {
                      const checked = selectedInterviewQuestionIds.includes(question.id)
                      return (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                setSelectedInterviewQuestionIds((current) => {
                                  if (value === true) return Array.from(new Set([...current, question.id]))
                                  return current.filter((id) => id !== question.id)
                                })
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900 whitespace-pre-wrap">{question.videoInstructions || question.question}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingInterviewQuestionId(question.id)
                                  setInterviewForm({
                                    videoInstructions: question.videoInstructions || question.question,
                                    points: String(question.points || 1),
                                  })
                                  setAddInterviewDialogOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this guideline?")) {
                                    await deleteQuestion(question.id)
                                    setQuestions((current) => current.filter((item) => item.id !== question.id))
                                    setSelectedInterviewQuestionIds((current) =>
                                      current.filter((id) => id !== question.id)
                                    )
                                    toast.success("Guideline deleted")
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-rose-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={saveInterviewStep}
                disabled={savingExamConfig || !isInterviewStepValid}
              >
                {savingExamConfig ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </section>

          <section
            id="add-training-material"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "add-training-material" && "hidden",
            )}
          >
            <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Training Material Setup</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add at least one training material before continuing. You can mix PDF, video, text-based content, embedded code, widget IDs, and live experience app credentials.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setEditingTrainingId(null)
                    setTrainingForm({
                      title: "",
                      description: "",
                      contentType: "pdf_file",
                      contentValue: "",
                      pdfFile: null,
                    })
                    setAddTrainingDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Title</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainingItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                        No training material configured yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    trainingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold text-slate-900">{item.title}</TableCell>
                        <TableCell>{getTrainingTypeLabel(item.contentType)}</TableCell>
                        <TableCell>{item.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingTrainingId(item.id)
                                setTrainingForm({
                                  title: item.title,
                                  description: item.description || "",
                                  contentType: item.contentType,
                                  contentValue: item.contentValue,
                                  pdfFile: null,
                                })
                                setAddTrainingDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTrainingMaterial(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveStep("setup-exam")}
                disabled={!isTrainingStepValid}
              >
                Continue to Setup Exam
              </Button>
            </div>
          </section>

          <section
            id="setup-exam"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "setup-exam" && "hidden",
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Assessment Setup</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Configure exam questions for the candidate assessment. At least 5 exam questions are required.
                </p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Note: On the candidate side, questions will be shown in a shuffled order, but
                  multiple choice questions will always appear first before essay.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[240px_minmax(0,1fr)]">
              <div className="space-y-2">
                <Label>Minimal Passing Threshold</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={passingThreshold}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                  onChange={(event) => setPassingThreshold(event.target.value)}
                />
              </div>

              <div className="flex items-end justify-start md:justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setEditingExamQuestionId(null)
                    setExamForm({
                      type: "multiple_choice",
                      question: "",
                      options: createDefaultExamOptions(),
                      correctOptionId: "option-1",
                      points: "1",
                    })
                    setAddExamDialogOpen(true)
                  }}
                >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-14">Use</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.filter(q => q.type !== "video_introduction").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        No exam questions added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.filter(q => q.type !== "video_introduction").map((question) => {
                      const checked = selectedExamQuestionIds.includes(question.id)
                      return (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                setSelectedExamQuestionIds((current) => {
                                  if (value === true) return Array.from(new Set([...current, question.id]))
                                  return current.filter((id) => id !== question.id)
                                })
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">{question.question}</TableCell>
                          <TableCell>{question.type}</TableCell>
                          <TableCell>{question.points}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingExamQuestionId(question.id)
                                  const optionDrafts = toExamOptionDrafts(question.options)
                                  const matchedCorrectOption =
                                    optionDrafts.find(
                                      (option) => option.id === question.correctAnswer,
                                    )?.id || optionDrafts[0]?.id || "option-1"
                                  setExamForm({
                                    type: question.type,
                                    question: question.question,
                                    options: optionDrafts,
                                    correctOptionId: matchedCorrectOption,
                                    points: String(question.points || 1),
                                  })
                                  setAddExamDialogOpen(true)
                                }}
                              >
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={async () => {
                                  if (confirm("Are you sure you want to delete this question?")) {
                                    await deleteQuestion(question.id)
                                    setQuestions((current) => current.filter((item) => item.id !== question.id))
                                    setSelectedExamQuestionIds((current) =>
                                      current.filter((id) => id !== question.id)
                                    )
                                    toast.success("Question deleted")
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-rose-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                Selected: {selectedExamQuestionIds.length} exam questions (min 5)
              </p>
              <Button
                type="button"
                onClick={saveExamStep}
                disabled={savingExamConfig || !isExamStepValid}
              >
                {savingExamConfig ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </section>

          <section
            id="review"
            className={cn(
              "rounded-3xl border border-border bg-white p-6 shadow-sm",
              activeStep !== "review" && "hidden",
            )}
          >
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4 rounded-t-2xl flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Batch Configuration</h3>
                  <span className="text-xs font-medium text-slate-500">{reviewDateRangeLabel}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 p-5 gap-y-6 gap-x-6">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Batch No.</span>
                    <span className="block text-sm font-medium text-slate-900 truncate" title={batchDraft.name}>{batchDraft.name || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Role</span>
                    <span className="block text-sm font-medium text-slate-900 truncate" title={batchDraft.role}>{batchDraft.role || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Landing Page</span>
                    <span className="block text-sm font-medium text-slate-900 truncate text-blue-600" title={landingPageLink}>{landingPageLink || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Registration Limit</span>
                    <span className="block text-sm font-medium text-slate-900">
                      {Number(batchDraft.registrationQuota || 0) > 0
                        ? batchDraft.registrationQuota
                        : "Unlimited"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Auto Review on Limit</span>
                    <span className="block text-sm font-medium text-slate-900">
                      {batchDraft.autoCurateOnQuotaReached ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Auto Review on Batch End</span>
                    <span className="block text-sm font-medium text-slate-900">
                      {batchDraft.autoCurateOnBatchClose ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4 rounded-t-2xl flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Training Materials</h3>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{trainingItems.length} items</span>
                </div>
                <div className="p-0">
                  {trainingItems.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">No training material configured.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {trainingItems.map((item) => (
                        <li key={item.id} className="flex flex-col gap-1.5 p-5 text-sm hover:bg-slate-50/50 transition-colors">
                          <div className="font-semibold text-slate-900">{item.title}</div>
                          <div className="text-slate-500 flex gap-2 items-center">
                            <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">{item.contentType}</span>
                            <span className="truncate">{item.description || "No description"}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4 rounded-t-2xl flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Interview questions</h3>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{selectedInterviewQuestionIds.length} question(s)</span>
                </div>
                <div className="p-0">
                  {selectedInterviewQuestionIds.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">No interview questions configured.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {questions
                        .filter(q => selectedInterviewQuestionIds.includes(q.id))
                        .map((q) => (
                          <li key={q.id} className="flex flex-col gap-1 p-5 text-sm hover:bg-slate-50/50 transition-colors">
                            <div className="font-semibold text-slate-900">{q.videoInstructions || q.question}</div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-4 rounded-t-2xl flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900">Exam Questions</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-200">
                      Passing threshold: {passingThreshold}%
                    </span>
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs font-medium">{selectedExamQuestionIds.length} items</span>
                  </div>
                </div>
                <div className="p-0">
                  {selectedExamQuestionIds.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">No exam questions configured.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {questions
                        .filter(q => selectedExamQuestionIds.includes(q.id))
                        .map((q) => (
                          <li key={q.id} className="flex flex-col gap-1.5 p-5 text-sm hover:bg-slate-50/50 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div className="font-semibold text-slate-900 leading-snug">{q.question}</div>
                              <div className="flex-shrink-0 text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-md">{q.points} pt(s)</div>
                            </div>
                            <div className="text-slate-500 text-xs flex gap-2 mt-1">
                              {q.type === 'multiple_choice' ? (
                                <span className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 font-medium text-blue-600">Multiple Choice</span>
                              ) : (
                                <span className="rounded-md bg-purple-50 border border-purple-100 px-2 py-0.5 font-medium text-purple-600">Essay (Manual Review)</span>
                              )}
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={() => setShowPublishDialog(true)}
                disabled={!isExamStepValid}
              >
                Publish Batch
              </Button>
            </div>
          </section>
        </section>
      </div>

      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Publication</DialogTitle>
            <DialogDescription>
              Are you sure all the configured batch data, training materials, interview questions, and exam questions are correct? After publishing, the batch will become active and applications can be started.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              disabled={isPublishing}
            >
              Review Again
            </Button>
            <Button onClick={confirmPublishBatch} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Yes, Publish Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addTrainingDialogOpen} onOpenChange={setAddTrainingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTrainingId ? "Edit" : "Add"} Training Material</DialogTitle>
            <DialogDescription>
              {editingTrainingId ? "Update" : "Add"} learning resources for the sales orientation stage.
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
                  placeholder="Introduction to partner onboarding"
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
                placeholder="Short explanation shown to the candidate before opening this material."
                onChange={(event) =>
                  setTrainingForm((current) => ({ ...current, description: event.target.value }))
                }
                className="min-h-20 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label>{getTrainingValueLabel(trainingForm.contentType)}</Label>
              {renderTrainingFormValueInput()}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setAddTrainingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveTrainingMaterial} disabled={savingTraining}>
                {trainingDialogSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addInterviewDialogOpen} onOpenChange={setAddInterviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInterviewQuestionId ? "Edit" : "Add"} Interview Guideline</DialogTitle>
            <DialogDescription>
              {editingInterviewQuestionId ? "Update" : "Add"} a video interview prompt for candidates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            <div className="space-y-2">
              <Label>Interview Instructions</Label>
              <Textarea
                value={interviewForm.videoInstructions}
                placeholder="Explain what the candidate should cover in the recorded response."
                onChange={(event) =>
                  setInterviewForm((current) => ({ ...current, videoInstructions: event.target.value }))
                }
                className="min-h-32 rounded-2xl border-slate-200 bg-slate-50"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setAddInterviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveInterviewQuestion} disabled={savingQuestion}>
                {interviewDialogSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={addExamDialogOpen} onOpenChange={setAddExamDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExamQuestionId ? "Edit" : "Add"} Exam Question</DialogTitle>
            <DialogDescription>
              {editingExamQuestionId ? "Update" : "Add"} a question for the candidate assessment.
            </DialogDescription>
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
                placeholder="Write the question shown to the candidate"
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
                          if (draggingOptionId) {
                            moveExamOption(draggingOptionId, option.id)
                          }
                          setDraggingOptionId(null)
                        }}
                        onDragEnd={() => setDraggingOptionId(null)}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <button
                          type="button"
                          className="cursor-grab text-slate-400 hover:text-slate-600"
                          aria-label={`Drag option ${index + 1}`}
                        >
                          <GripVertical className="h-5 w-5" />
                        </button>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-600">
                          {MULTIPLE_CHOICE_OPTION_VALUES[index]}
                        </div>
                        <Input
                          value={option.label}
                          placeholder={`Option ${index + 1}`}
                          onChange={(event) => updateExamOption(option.id, event.target.value)}
                          className="h-12 rounded-2xl border-slate-200 bg-white"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            {MULTIPLE_CHOICE_OPTION_VALUES[index].toUpperCase()} - {option.label || `Option ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min="1"
                      value={examForm.points}
                      onChange={(event) => setExamForm((current) => ({ ...current, points: event.target.value }))}
                      className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  min="1"
                  value={examForm.points}
                  onChange={(event) => setExamForm((current) => ({ ...current, points: event.target.value }))}
                  className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => setAddExamDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveExamQuestion} disabled={savingQuestion}>
                {examDialogSubmitLabel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
    </React.Fragment>
  )
}

export default PartnerRecruitmentManagementContent
