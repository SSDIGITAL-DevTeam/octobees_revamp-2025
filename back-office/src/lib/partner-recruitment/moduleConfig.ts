export type RecruitmentBatchMeta = {
  role?: string;
  landingPageLink?: string;
  trainingMaterialIds?: string[];
};

export type RecruitmentDisbursementRecord = {
  status: "paid" | "unpaid";
  paidAt?: string;
  proofName?: string;
  proofDataUrl?: string;
};

export type RecruitmentSalesCommissionConfig = {
  mode: "percentage" | "fixed";
  value: number;
};

export type RecruitmentInitialCommissionTier = {
  closedClients: number;
  amount: number;
};

export type RecruitmentModuleConfig = {
  batchMetaById: Record<string, RecruitmentBatchMeta>;
  disbursementDate: string;
  disbursementByPartnerId: Record<string, RecruitmentDisbursementRecord>;
  initialCommission: {
    applyToAllBatches: boolean;
    selectedBatchId: string;
    tiers: RecruitmentInitialCommissionTier[];
  };
  basicCommissionWarnings: {
    noSalesMonths: number;
    noTargetMonths: number;
    regressionMonths: number;
  };
  salesCommissionByServiceId: Record<string, RecruitmentSalesCommissionConfig>;
  termsAndConditionsHtml: string;
};

const STORAGE_KEY = "partner-recruitment-system-config-v1";

export const defaultRecruitmentModuleConfig: RecruitmentModuleConfig = {
  batchMetaById: {},
  disbursementDate: "",
  disbursementByPartnerId: {},
  initialCommission: {
    applyToAllBatches: true,
    selectedBatchId: "",
    tiers: [{ closedClients: 2, amount: 0 }],
  },
  basicCommissionWarnings: {
    noSalesMonths: 2,
    noTargetMonths: 2,
    regressionMonths: 2,
  },
  salesCommissionByServiceId: {},
  termsAndConditionsHtml:
    "<p>Input Terms &amp; Conditions for partners here.</p>",
};

const isBrowser = () => typeof window !== "undefined";

export const readRecruitmentModuleConfig = (): RecruitmentModuleConfig => {
  if (!isBrowser()) return defaultRecruitmentModuleConfig;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultRecruitmentModuleConfig;

    const parsed = JSON.parse(raw);
    const legacyInitialCommissionTier =
      parsed?.initialCommission?.targetClients !== undefined ||
      parsed?.initialCommission?.amount !== undefined
        ? [
            {
              closedClients: Math.max(
                1,
                Number(parsed?.initialCommission?.targetClients || 2),
              ),
              amount: Math.max(0, Number(parsed?.initialCommission?.amount || 0)),
            },
          ]
        : null;
    return {
      ...defaultRecruitmentModuleConfig,
      ...parsed,
      batchMetaById: {
        ...defaultRecruitmentModuleConfig.batchMetaById,
        ...(parsed?.batchMetaById || {}),
      },
      disbursementByPartnerId: {
        ...defaultRecruitmentModuleConfig.disbursementByPartnerId,
        ...(parsed?.disbursementByPartnerId || {}),
      },
      initialCommission: {
        ...defaultRecruitmentModuleConfig.initialCommission,
        ...(parsed?.initialCommission || {}),
        tiers: Array.isArray(parsed?.initialCommission?.tiers)
          ? parsed.initialCommission.tiers
          : legacyInitialCommissionTier ||
            defaultRecruitmentModuleConfig.initialCommission.tiers,
      },
      basicCommissionWarnings: {
        ...defaultRecruitmentModuleConfig.basicCommissionWarnings,
        ...(parsed?.basicCommissionWarnings || {}),
      },
      salesCommissionByServiceId: {
        ...defaultRecruitmentModuleConfig.salesCommissionByServiceId,
        ...(parsed?.salesCommissionByServiceId || {}),
      },
    };
  } catch {
    return defaultRecruitmentModuleConfig;
  }
};

export const writeRecruitmentModuleConfig = (
  config: RecruitmentModuleConfig,
) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const getRecruitmentBatchMeta = (batchId: string) =>
  readRecruitmentModuleConfig().batchMetaById[batchId] || {};
