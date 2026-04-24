import { axiosInstance } from '@/lib/axios';

const BASE_URL = '/assessment';

export type AssessmentQuestion = {
  id: string;
  type: 'video_introduction' | 'multiple_choice' | 'essay';
  question: string;
  options?: { label: string; value: string }[];
  correctAnswer?: string;
  points: number;
  orderIndex: number;
  isRequired: boolean;
  videoInstructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionPayload = {
  type: AssessmentQuestion['type'];
  question: string;
  options?: { label: string; value: string }[];
  correctAnswer?: string;
  points?: number;
  orderIndex?: number;
  isRequired?: boolean;
  videoInstructions?: string;
  isActive?: boolean;
};

export const getQuestions = async (params?: { type?: string; isActive?: boolean }) => {
  const response = await axiosInstance.get(`${BASE_URL}/questions`, { params });
  return response.data;
};

export const getQuestion = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/questions/${id}`);
  return response.data;
};

export const createQuestion = async (data: QuestionPayload) => {
  const response = await axiosInstance.post(`${BASE_URL}/questions`, data);
  return response.data;
};

export const updateQuestion = async (id: string, data: QuestionPayload) => {
  const response = await axiosInstance.put(`${BASE_URL}/questions/${id}`, data);
  return response.data;
};

export const deleteQuestion = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/questions/${id}`);
  return response.data;
};

export const reorderQuestions = async (orders: { id: string; orderIndex: number }[]) => {
  const response = await axiosInstance.post(`${BASE_URL}/questions/reorder`, { orders });
  return response.data;
};

// Sessions
export type AssessmentSession = {
  id: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'scored' | 'passed' | 'failed';
  totalScore: number;
  maxScore: number;
  percentage: number;
  isPassed?: boolean;
  passingPercentage: number;
  startedAt: string;
  submittedAt?: string;
  scoredAt?: string;
  reviewerNotes?: string;
  affiliateId: string;
  affiliateFullName: string;
  affiliateEmail: string;
  affiliatePhone?: string;
  affiliateCountry: string;
  affiliateStatus: string;
  affiliateBatchName?: string;
  // Security fields
  totalDurationSeconds?: number;
  ipAddress?: string;
  userAgent?: string;
  submitIpAddress?: string;
  submitUserAgent?: string;
  browserFingerprint?: string;
  tabSwitchCount?: number;
  securityFlags?: string;
  securityRiskScore?: number;
  securityRiskLevel?: string;
  securitySummary?: string;
  securityAnalysisJson?: string;
  securityReviewRequired?: boolean;
  answerIntegrityVerified?: boolean;
};

export type SessionListResponse = {
  data: AssessmentSession[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const getSessions = async (params?: { page?: number; limit?: number; status?: string }) => {
  const response = await axiosInstance.get(`${BASE_URL}/sessions`, { params });
  return response.data;
};

export const getSession = async (id: string) => {
  const response = await axiosInstance.get(`${BASE_URL}/sessions/${id}`);
  return response.data;
};

export const deleteSession = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/sessions/${id}`);
  return response.data;
};

export const resetSession = async (id: string) => {
  const response = await axiosInstance.post(`${BASE_URL}/sessions/${id}/reset`);
  return response.data;
};

export const regenerateAiReview = async (
  affiliateId: string,
  phase: "initial" | "exam" | "final" | "all"
) => {
  const response = await axiosInstance.post(`${BASE_URL}/ai-review/${affiliateId}/regenerate`, { phase });
  return response.data;
};

export type AnswerScore = {
  answerId: string;
  score: number;
  feedback?: string;
};

export const scoreSession = async (
  sessionId: string, 
  data: { 
    scores: AnswerScore[]; 
    reviewerNotes?: string 
  }
) => {
  const response = await axiosInstance.post(`${BASE_URL}/sessions/${sessionId}/score`, data);
  return response.data;
};

// Settings
export type AssessmentSettings = {
  id: string;
  examWaitHours: number;
  examDurationMinutes: number;
  screeningPassingScore: number;
  maxExamAttempts: number;
  updatedAt: string;
};

export const getAssessmentSettings = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/settings`);
  return response.data;
};

export const updateAssessmentSettings = async (id: string, payload: Partial<AssessmentSettings>) => {
  const response = await axiosInstance.put(`${BASE_URL}/settings/${id}`, payload);
  return response.data;
};
