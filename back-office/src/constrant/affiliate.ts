export type AffiliateRow = {
  id: string
  batch_id?: string | null
  full_name: string
  email: string
  phone: string | null
  country: string
  status: "pending" | "qualified" | "approved" | "rejected"
  created_at: string
  reviewed_at?: string | null
  reviewer_id?: string | null
  batch_name?: string | null
  batch_ai_screening_summary?: string | null
  batch_ai_screening_completed_at?: string | null
  initial_commission_amount?: number | null
  assessment_session_id?: string | null
  assessment_status?: "not_started" | "in_progress" | "submitted" | "scored" | "passed" | "failed" | null
  assessment_interview_status?: string | null
  assessment_training_status?: string | null
  assessment_submitted_at?: string | null
  assessment_score_percentage?: number | null
  assessment_is_passed?: boolean | null
}

export type AffiliateDetail = {
  id: string
  fullName: string
  email: string
  phone: string | null
  city?: string | null
  country: string
  occupation?: string | null
  salesExperience?: string | null
  hasSoldSaaS?: string | null
  salesStyle?: string | null
  incomeGoal?: string | null
  hearAboutUs?: string | null
  whyChoose?: string | null
  videoUrl?: string | null
  resumeUrl?: string | null
  govOrBusinessId: string | null
  strategy: string
  portfolioLinks: string | null
  motivation: string | null
  otherPrograms: string | null
  status: "pending" | "qualified" | "approved" | "rejected"
  notes?: string | null
  screeningScore?: number | null
  screeningPassingScore?: number | null
  screeningRecommendation?: string | null
  screeningSummary?: string | null
  screeningStrengths?: string | null
  screeningWeaknesses?: string | null
  screeningAnalysisJson?: string | null
  screeningCompletedAt?: string | null
  reviewedAt?: string | null
  reviewerId?: string | null
  reviewerName?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
  updatedAt: string
  batchName?: string | null
  initialCommissionAmount?: number | null
  assessmentSessionId?: string | null
  assessmentStatus?: "not_started" | "in_progress" | "submitted" | "scored" | "passed" | "failed" | null
  assessmentInterviewStatus?: string | null
  assessmentInterviewReviewedAt?: string | null
  assessmentInterviewReviewNotes?: string | null
  assessmentInterviewSubmittedLink?: string | null
  assessmentInterviewSubmittedAt?: string | null
  assessmentTrainingStatus?: string | null
  assessmentExamInvitationSentAt?: string | null
  assessmentExamAttemptCount?: number | null
  assessmentMaxExamAttempts?: number | null
  assessmentStartedAt?: string | null
  assessmentSubmittedAt?: string | null
  assessmentScoredAt?: string | null
  assessmentScorePercentage?: number | null
  assessmentIsPassed?: boolean | null
  assessmentTotalScore?: number | null
  assessmentMaxScore?: number | null
  assessmentExamMustCompleteBy?: string | null
  assessmentAiExamRecommendation?: string | null
  assessmentAiExamSummary?: string | null
  assessmentAiExamStrengths?: string | null
  assessmentAiExamWeaknesses?: string | null
  assessmentAiExamDecisionRationale?: string | null
  assessmentAiExamAnalysisJson?: string | null
  assessmentAiExamCompletedAt?: string | null
  assessmentAiFinalRecommendation?: string | null
  assessmentAiFinalSummary?: string | null
  assessmentAiFinalStrengths?: string | null
  assessmentAiFinalWeaknesses?: string | null
  assessmentAiFinalDecisionRationale?: string | null
  assessmentAiFinalAnalysisJson?: string | null
  assessmentAiFinalCompletedAt?: string | null
  assessmentSubmitIpAddress?: string | null
  assessmentSubmitUserAgent?: string | null
  assessmentSecurityRiskScore?: number | null
  assessmentSecurityRiskLevel?: string | null
  assessmentSecuritySummary?: string | null
  assessmentSecurityAnalysisJson?: string | null
  assessmentSecurityReviewRequired?: boolean | null
}

export type AffiliateStats = {
  total: number
  pending: number
  qualified: number
  approved: number
  rejected: number
  totalCandidates: number
  qualifiedCandidates: number
  interviewSession: number
  trainingSession: number
  certification: number
  onboarded: number
}

export type PaginationMeta = {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}
