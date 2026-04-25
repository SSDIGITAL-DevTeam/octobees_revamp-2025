import type { BadgeVariant } from "@/components/ui/Badge";
import { getStoredCurrency, getCurrencySymbol, formatWithCurrency } from "@/store/currency";

export type PartnerProfile = {
  username: string;
  email: string;
  phoneNumber: string;
  country?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  bankAccountCompleted?: boolean;
};

export type PartnerServiceItem = {
  id: string;
  name: string;
  projectValue?: number;
  commissionPercentage: number;
  commissionMode?: "percentage" | "fixed";
  commissionValue?: number;
  description: string;
  isActive?: boolean;
};

export type SalesMaterialItem = {
  id: string;
  title: string;
  summary?: string | null;
  materialType: "rich_text" | "file" | "video" | "link";
  content?: string | null;
  externalUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerLeadItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId?: string;
  serviceName?: string;
  verticalMarketId?: string | null;
  verticalMarketName?: string | null;
  projectValue?: number;
  isCustomProjectValue?: boolean;
  status: string;
  source?: string;
  nextFollowUpAt?: string | null;
  lastContactAt?: string | null;
  lastStatusChangedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerVerticalMarketItem = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  isSystem?: boolean;
};

export type PartnerCommissionRuleCondition = {
  field: string;
  op: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in";
  value: string | number | boolean | string[] | number[];
};

export type PartnerCommissionRuleConditionTree = {
  operator: "AND" | "OR";
  groups: Array<{
    operator: "AND" | "OR";
    conditions: PartnerCommissionRuleCondition[];
  }>;
};

export type PartnerCommissionReward =
  | { type: "fixed"; value: number }
  | { type: "percentage"; value: number }
  | { type: "percentage_of_revenue"; value: number }
  | {
      type: "tiered";
      tiers: Array<{
        closedClients?: number;
        amount?: number;
        min?: number;
        max?: number;
        conditions?: PartnerCommissionRuleConditionTree | null;
      }>;
    }
  | { type: "service_config" }
  | { type: "batch_initial_config" }
  | Record<string, unknown>;

export type PartnerCommissionPolicyRule = {
  id: string;
  name: string;
  description?: string | null;
  triggerType: string;
  commissionType: string;
  scope: string;
  periodScope: string;
  conditions?: PartnerCommissionRuleConditionTree | null;
  reward?: PartnerCommissionReward | null;
  priority?: number;
};

export type PartnerCommissionPolicyReference = {
  batchId?: string | null;
  batchName?: string | null;
  dictionaries: {
    services: Record<string, string>;
    pipelineStatuses: Record<string, string>;
    verticalMarkets: Record<string, string>;
  };
  rules: PartnerCommissionPolicyRule[];
};

export const PARTNER_LEAD_PIPELINE_STATUSES = [
  "New Leads",
  "Contacted",
  "Won",
  "Lost",
] as const;

export type PartnerLeadPipelineStatus = {
  value: string;
  label: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
  isSystem?: boolean;
};

const getDefaultPipelineStatusColor = (value: string) => {
  if (value === "Won") return "green";
  if (value === "Lost") return "red";
  if (value === "New Leads") return "blue";
  return "purple";
};

export const DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS: PartnerLeadPipelineStatus[] =
  PARTNER_LEAD_PIPELINE_STATUSES.map((value, index) => ({
    value,
    label: value,
    color: getDefaultPipelineStatusColor(value),
    isActive: true,
    sortOrder: index + 1,
    isSystem: true,
  }));

const LEGACY_PARTNER_LEAD_STATUS_MAP: Record<string, string> = {
  "Lead Created": "New Leads",
  "Proposal Sent": "Contacted",
  "Follow-up": "Follow-up Day-1",
  "Closed Won": "Won",
  "Closed Lost": "Lost",
};

export const normalizePartnerLeadStatus = (status?: string | null) => {
  if (!status) return "New Leads";

  return LEGACY_PARTNER_LEAD_STATUS_MAP[status] || status;
};

export type PartnerLeadActivityItem = {
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

export type PartnerCommissionType = "sales" | "initial" | "basic_salary";
export type PartnerCommissionStatus = "Pending Transfer" | "Paid" | "Rejected";

export type PartnerCommissionItem = {
  id: string;
  leadId?: string | null;
  leadName?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  value?: number | null;
  amount: number;
  status: PartnerCommissionStatus | string;
  commissionType?: PartnerCommissionType | string;
  period?: string | null;
  proofUrl?: string | null;
  transactionReference?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  paidAt?: string | null;
  createdAt?: string;
};

export type PartnerPerformanceData = {
  policy: {
    basicSalaryAmount: number;
    basicSalarySalesThreshold: number;
    firstMonthMinimumClosedClients: number;
    initialCommissionFullClientThreshold: number;
    defaultInitialCommissionFullClientThreshold?: number;
    terminationGraceDays: number;
    monthlyPayoutDate: number;
  };
  currentMonth: {
    periodStart: string;
    periodEnd: string;
    closedClients: number;
    salesAmount: number;
    basicSalaryEligible: boolean;
    progressPercent: number;
    remainingSales: number;
  };
  initialCommission: {
    periodStart: string;
    periodEnd: string;
    closedClients: number;
    configuredAmount: number;
    eligibleAmount: number;
    tiers?: Array<{
      closedClients: number;
      amount: number;
    }>;
    nextTier?: {
      closedClients: number;
      amount: number;
    } | null;
    status: "eligible" | "not_eligible" | "disabled";
  };
  batch: {
    id: string | null;
    name: string | null;
    targetClosedClients: number;
    initialCommissionFullClientThreshold?: number | null;
    usesDefaultThreshold?: boolean;
  };
  termination: {
    status: "good_standing" | "termination_pending" | "terminated";
    alertSentAt?: string | null;
    terminationDueAt?: string | null;
    terminatedAt?: string | null;
  };
  ranking: {
    partnerRank: number | null;
    leaderboard: Array<{
      rank: number;
      affiliateId: string;
      partnerName: string;
      partnerEmail: string;
      closedClients: number;
      salesAmount: number;
      basicSalaryEligible: boolean;
    }>;
  };
};

export const getPartnerToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("partner_token");
};

export const clearPartnerSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("partner_token");
  window.localStorage.removeItem("partner_profile");
};

export const getCachedPartnerProfile = (): PartnerProfile | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("partner_profile");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PartnerProfile;
  } catch {
    return null;
  }
};

export const setCachedPartnerProfile = (profile: PartnerProfile) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("partner_profile", JSON.stringify(profile));
};

export const formatCurrencyIdr = (value?: number | null) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en").format(amount);
};

import {
  getStoredCurrency,
  getCurrencySymbol,
  formatWithCurrency,
} from "@/store/currency";

/**
 * Format an amount using the globally configured currency.
 * Falls back to USD if no currency has been set.
 */
export const formatCurrencyGlobal = (value?: number | null): string => {
  const currency = getStoredCurrency();
  return formatWithCurrency(Number(value ?? 0), currency);
};

export const formatServiceCommissionLabel = (
  service?: PartnerServiceItem | null,
) => {
  if (!service) return "0%";

  const mode = service.commissionMode || "percentage";
  const value = Number(
    service.commissionValue ?? service.commissionPercentage ?? 0,
  );

  if (mode === "fixed") {
    const symbol = getCurrencySymbol(getStoredCurrency());
    return `${symbol}${formatCurrencyIdr(value)} Fixed`;
  }

  return `${value}%`;
};

export const formatDate = (value?: string | null) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return value;
  }
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

export const getLeadStatusVariant = (status: string): BadgeVariant => {
  switch (normalizePartnerLeadStatus(status)) {
    case "Won":
      return "closed_won";
    case "Lost":
      return "closed_lost";
    case "Contacted":
    case "Follow-up Day-1":
    case "Follow-up Day-3":
    case "Follow-up Day-7":
    case "Follow-up Day-14":
      return "follow_up";
    case "New Leads":
    default:
      return "lead_created";
  }
};

export const getCommissionStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case "Paid":
      return "paid";
    case "Rejected":
      return "closed_lost";
    case "Pending Transfer":
    default:
      return "unpaid";
  }
};

export const COMMISSION_TYPE_LABELS: Record<string, string> = {
  sales: "Sales",
  initial: "Initial",
  basic_salary: "Basic Salary",
};

export const getCommissionTypeLabel = (type?: string | null) => {
  if (!type) return "-";
  return COMMISSION_TYPE_LABELS[type] || type;
};

export const getCommissionTypeBadgeClass = (type?: string | null) => {
  switch (type) {
    case "sales":
      return "bg-blue-100 text-blue-700";
    case "initial":
      return "bg-purple-100 text-purple-700";
    case "basic_salary":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

export const getPartnerInitials = (name?: string | null) => {
  const safe = (name || "").trim();
  if (!safe) return "DP";

  return safe
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};
