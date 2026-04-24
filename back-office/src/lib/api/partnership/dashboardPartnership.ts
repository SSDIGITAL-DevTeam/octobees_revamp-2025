import { axiosInstance } from "@/lib/axios";

export type DashboardMetric<T = number | string> = {
  value: T;
  subtext: string;
};

export type PartnerStatusApi = "approved" | "pending" | "rejected" | string;

export type PartnerLeadPipelineStatus = {
  value: string;
  label: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  isSystem?: boolean;
};

export type PartnershipStatsResponse = {
  status: string;
  data: {
    totalLeads: DashboardMetric<number>;
    activePartners: DashboardMetric<number>;
    closedLeads: DashboardMetric<number>;
    pendingCommission: DashboardMetric<string>;
  };
};

export type RecentLead = {
  id: string;
  leadName: string;
  partnerName: string;
  serviceType: string;
  status: string;
  remark: string;
};

export type RecentLeadsResponse = {
  status: string;
  data: RecentLead[];
};

export type PendingCommission = {
  partnerName: string;
  service: string;
  leadName: string;
  amount: string;
  status: string;
};

export type PendingCommissionsResponse = {
  status: string;
  data: PendingCommission[];
};

export type PartnerListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type PartnerApiEntry = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerListResponse = {
  status: string;
  data: PartnerApiEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getPartnerDashboardStats = () =>
  axiosInstance.get<PartnershipStatsResponse>(
    "/back-office/partner/dashboard/stats",
  );

export const getPartnerRecentLeads = () =>
  axiosInstance.get<RecentLeadsResponse>(
    "/back-office/partner/dashboard/recent-leads",
  );

export const getPartnerPendingCommissions = () =>
  axiosInstance.get<PendingCommissionsResponse>(
    "/back-office/partner/dashboard/pending-commissions",
  );

export const getPartnerLeadPipelineStatuses = (params: { includeInactive?: boolean } = {}) =>
  axiosInstance.get<{ status: string; data: PartnerLeadPipelineStatus[] }>(
    "/back-office/partner/pipeline-statuses",
    { params },
  );

export const updatePartnerLeadPipelineStatuses = (
  statuses: PartnerLeadPipelineStatus[],
) =>
  axiosInstance.put<{ status: string; data: PartnerLeadPipelineStatus[] }>(
    "/back-office/partner/pipeline-statuses",
    { statuses },
  );

export const getPartnerList = (params: PartnerListParams = {}) =>
  axiosInstance.get<PartnerListResponse>("/back-office/partner/partners", {
    params,
  });

export type PartnerLeadsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  affiliateId?: string;
};

export type PartnerLeadApiItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId?: string | null;
  serviceName: string;
  status: string;
  remark: string;
  affiliateId?: string;
  partnerName: string;
  partnerEmail?: string;
  projectValue: number;
  nextFollowUpAt?: string | null;
  lastContactAt?: string | null;
  lastStatusChangedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PartnerLeadsResponse = {
  status: string;
  data: PartnerLeadApiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getPartnerLeads = (params: PartnerLeadsParams) =>
  axiosInstance.get<PartnerLeadsResponse>("/back-office/partner/leads", {
    params,
  });

export type PartnerLeadDetailApiItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  projectValue: number;
  status: string;
  remark: string;
  nextFollowUpAt?: string | null;
  lastContactAt?: string | null;
  lastStatusChangedAt?: string | null;
  affiliateId: string;
  partnerName: string;
  partnerEmail: string;
  partnerCountry: string;
  createdAt: string;
  updatedAt: string;
};

export type PartnerLeadDetailResponse = {
  status: string;
  data: PartnerLeadDetailApiItem;
};

export const getPartnerLeadDetail = (id: string) =>
  axiosInstance.get<PartnerLeadDetailResponse>(
    `/back-office/partner/leads/${id}`,
  );

export type PartnerLeadActivityApiItem = {
  id: string;
  actorType: string;
  actorId?: string | null;
  actionType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  note?: string | null;
  metadata?: string | null;
  createdAt?: string | null;
};

export type PartnerLeadActivitiesResponse = {
  status: string;
  data: PartnerLeadActivityApiItem[];
};

export const getPartnerLeadActivities = (id: string) =>
  axiosInstance.get<PartnerLeadActivitiesResponse>(
    `/back-office/partner/leads/${id}/activities`,
  );

export const updatePartnerLead = (
  id: string,
  data: { status?: string; remark?: string; nextFollowUpAt?: string | null },
) => axiosInstance.patch(`/back-office/partner/leads/${id}`, data);

export const deletePartnerLead = (id: string) =>
  axiosInstance.delete(`/back-office/partner/leads/${id}`);

export type PartnerDetailResponse = {
  status: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    countryCode: string;
    phone: string;
    phoneE164?: string | null;
    country: string;
    strategy: string;
    motivation: string;
    status: string;
    isActive?: boolean | null;
    address?: string | null;
    city?: string | null;
    postalCode?: string | null;
    bankName?: string | null;
    bankAccountNumber?: string | null;
    bankAccountHolder?: string | null;
    createdAt: string;
  };
};

export const getPartnerDetail = (id: string) =>
  axiosInstance.get<PartnerDetailResponse>(
    `/back-office/partner/partners/${id}`,
  );

export const updatePartner = (id: string, data: any) =>
  axiosInstance.patch(`/back-office/partner/partners/${id}`, data);

export const deactivatePartner = (id: string) =>
  axiosInstance.post(`/back-office/partner/partners/${id}/deactivate`);

export const sendPartnerResetPasswordEmail = (id: string) =>
  axiosInstance.post(`/back-office/partner/partners/${id}/reset-password`);

export const deletePartner = (id: string) =>
  axiosInstance.delete(`/back-office/partner/partners/${id}`);

export type PartnerPerformanceSettings = {
  id: string;
  basicSalaryAmount: number;
  basicSalarySalesThreshold: number;
  firstMonthMinimumClosedClients: number;
  initialCommissionFullClientThreshold: number;
  terminationGraceDays: number;
  monthlyPayoutDate: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerPerformanceSettingsResponse = {
  status: string;
  data: PartnerPerformanceSettings;
};

export const getPartnerPerformanceSettings = () =>
  axiosInstance.get<PartnerPerformanceSettingsResponse>(
    "/back-office/partner/performance-settings",
  );

export const updatePartnerPerformanceSettings = (
  data: Partial<PartnerPerformanceSettings>,
) =>
  axiosInstance.patch<PartnerPerformanceSettingsResponse>(
    "/back-office/partner/performance-settings",
    data,
  );

export type PartnerServiceApiItem = {
  id: string;
  name: string;
  projectValue: number;
  commissionPercentage: number;
  commissionMode?: "percentage" | "fixed";
  commissionValue?: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PartnerServicesResponse = {
  status: string;
  data: PartnerServiceApiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PartnerServiceParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const getPartnerServices = (params: PartnerServiceParams = {}) =>
  axiosInstance.get<PartnerServicesResponse>("/back-office/partner/services", {
    params,
  });

export const getPartnerServiceDetail = (id: string) =>
  axiosInstance.get(`/back-office/partner/services/${id}`);

export const createPartnerService = (data: {
  name: string;
  projectValue: number;
  commissionPercentage?: number;
  description: string;
}) => axiosInstance.post("/back-office/partner/services", data);

export const updatePartnerService = (id: string, data: any) =>
  axiosInstance.patch(`/back-office/partner/services/${id}`, data);

export const updatePartnerServiceCommissionSetting = (
  id: string,
  data: { mode: "percentage" | "fixed"; value: number },
) =>
  axiosInstance.patch(`/back-office/partner/services/${id}/commission-setting`, data);

export const deletePartnerService = (id: string) =>
  axiosInstance.delete(`/back-office/partner/services/${id}`);

export type SalesMaterialApiItem = {
  id: string;
  title: string;
  summary?: string | null;
  materialType: "rich_text" | "file" | "video" | "link";
  content?: string | null;
  externalUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SalesMaterialsResponse = {
  status: string;
  data: SalesMaterialApiItem[];
};

export const getSalesMaterials = () =>
  axiosInstance.get<SalesMaterialsResponse>("/back-office/partner/materials");

export const createSalesMaterial = (data: FormData) =>
  axiosInstance.post("/back-office/partner/materials", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateSalesMaterial = (id: string, data: FormData) =>
  axiosInstance.patch(`/back-office/partner/materials/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteSalesMaterial = (id: string) =>
  axiosInstance.delete(`/back-office/partner/materials/${id}`);

export type PartnerTermsAndConditionsResponse = {
  status: string;
  data: {
    html: string;
  };
};

export const getPartnerTermsAndConditions = () =>
  axiosInstance.get<PartnerTermsAndConditionsResponse>(
    "/back-office/partner/terms-and-conditions",
  );

export const updatePartnerTermsAndConditions = (html: string) =>
  axiosInstance.put<PartnerTermsAndConditionsResponse>(
    "/back-office/partner/terms-and-conditions",
    { html },
  );

// ==================== COMMISSION RULE ENGINE ====================

export type RuleTriggerType = "lead_won" | "daily_cron" | "monthly_cron" | "manual";
export type RuleScope = "per_lead" | "per_period";
export type RulePeriodScope = "first_month" | "current_month" | "any_month";
export type RuleOutcome = "skipped" | "created" | "updated" | "error";

export type RuleCondition = {
  field: string;
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in";
  value: string | number | boolean | string[] | number[];
};

export type RuleConditionGroup = {
  operator: "AND" | "OR";
  conditions: RuleCondition[];
};

export type RuleConditionTree = {
  operator: "AND" | "OR";
  groups: RuleConditionGroup[];
};

export type RuleRewardFixed = { type: "fixed"; value: number };
export type RuleRewardPercentage = { type: "percentage"; value: number };
export type RuleRewardPercentageOfRevenue = { type: "percentage_of_revenue"; value: number };
export type RuleRewardTiered = {
  type: "tiered";
  /** closedClients is the welcome-bonus threshold (deals needed to unlock).
   *  min/max is kept for optional range-based tiers. Engine supports both. */
  tiers: {
    closedClients: number;
    amount: number;
    min?: number;
    max?: number;
    conditions?: RuleConditionTree | null;
  }[];
};
export type RuleRewardServiceConfig = { type: "service_config" };
export type RuleRewardBatchInitialConfig = { type: "batch_initial_config" };
export type RuleReward =
  | RuleRewardFixed
  | RuleRewardPercentage
  | RuleRewardPercentageOfRevenue
  | RuleRewardTiered
  | RuleRewardServiceConfig
  | RuleRewardBatchInitialConfig;

export type CommissionRule = {
  id: string;
  name: string;
  description: string | null;
  triggerType: RuleTriggerType;
  commissionType: string;
  scope: RuleScope;
  periodScope: RulePeriodScope;
  conditions: RuleConditionTree | null;
  reward: RuleReward | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type CommissionRuleLog = {
  id: string;
  ruleId: string;
  affiliateId: string;
  leadId: string | null;
  period: string | null;
  outcome: RuleOutcome;
  reason: string | null;
  amount: number | null;
  evaluatedAt: string;
};

export type CommissionRuleListResponse = {
  status: string;
  data: CommissionRule[];
};

export type CommissionRuleResponse = {
  status: string;
  data: CommissionRule;
};

export type CommissionRuleLogResponse = {
  status: string;
  data: CommissionRuleLog[];
};

export const listCommissionRules = (includeInactive = false) =>
  axiosInstance.get<CommissionRuleListResponse>(
    "/back-office/partner/commission-rules",
    { params: { includeInactive } },
  );

export const getCommissionRule = (id: string) =>
  axiosInstance.get<CommissionRuleResponse>(
    `/back-office/partner/commission-rules/${id}`,
  );

export const createCommissionRule = (
  data: Omit<CommissionRule, "id" | "createdAt" | "updatedAt">,
) =>
  axiosInstance.post<CommissionRuleResponse>(
    "/back-office/partner/commission-rules",
    data,
  );

export const updateCommissionRule = (
  id: string,
  data: Partial<Omit<CommissionRule, "id" | "createdAt" | "updatedAt">>,
) =>
  axiosInstance.patch<CommissionRuleResponse>(
    `/back-office/partner/commission-rules/${id}`,
    data,
  );

export const deleteCommissionRule = (id: string) =>
  axiosInstance.delete(`/back-office/partner/commission-rules/${id}`);

export const getCommissionRuleLogs = (
  id: string,
  params: { limit?: number; offset?: number } = {},
) =>
  axiosInstance.get<CommissionRuleLogResponse>(
    `/back-office/partner/commission-rules/${id}/logs`,
    { params },
  );

// ==================== COMMISSION DISBURSEMENT ====================

export type CommissionTypeApi = "sales" | "initial" | "basic_salary";
export type CommissionStatusApi = "Pending Transfer" | "Paid" | "Rejected";

export type CommissionRecord = {
  id: string;
  affiliateId: string;
  partnerName: string | null;
  partnerEmail: string | null;
  leadId: string | null;
  leadName: string | null;
  serviceId: string | null;
  serviceName: string | null;
  projectValue: number | null;
  amount: number;
  commissionType: CommissionTypeApi;
  period: string | null;
  status: CommissionStatusApi;
  paidAt: string | null;
  paidById: string | null;
  proofUrl: string | null;
  transactionReference: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountHolder: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CommissionListParams = {
  page?: number;
  limit?: number;
  type?: CommissionTypeApi;
  status?: CommissionStatusApi;
  period?: string;
  affiliateId?: string;
  search?: string;
};

export type CommissionListResponse = {
  status: string;
  data: CommissionRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const listPartnerCommissions = (params: CommissionListParams = {}) =>
  axiosInstance.get<CommissionListResponse>(
    "/back-office/partner/commissions",
    { params },
  );

export type CommissionProofUploadResponse = {
  status: string;
  data: {
    proofUrl: string;
    fileName: string;
    mimeType: string;
    size: number;
  };
};

export const uploadCommissionProof = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return axiosInstance.post<CommissionProofUploadResponse>(
    "/back-office/partner/commissions/upload-proof",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const markCommissionAsPaid = (
  id: string,
  payload: { proofUrl: string; transactionReference?: string | null },
) =>
  axiosInstance.patch(`/back-office/partner/commissions/${id}/pay`, payload);

export const revertCommission = (id: string) =>
  axiosInstance.patch(`/back-office/partner/commissions/${id}/revert`);

export const rejectCommission = (id: string, reason: string) =>
  axiosInstance.patch(`/back-office/partner/commissions/${id}/reject`, {
    reason,
  });
