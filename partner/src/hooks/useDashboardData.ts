"use client";

import { useMemo } from "react";

import type { BadgeVariant } from "@/components/ui/Badge";
import {
  availableServices,
  commissionHistoryEntries,
  commissionStatusVariantMap,
  currentDashboardLeads,
  dashboardStats,
  type CommissionHistoryEntry,
  type CommissionStatus,
  type DashboardLead,
  type DashboardStat,
  type ServiceOffering,
} from "@/data/dashboard";

export const useDashboardStats = (): DashboardStat[] => {
  return useMemo(() => dashboardStats, []);
};

export const useAvailableServices = (): ServiceOffering[] => {
  return useMemo(() => availableServices, []);
};

export const useCommissionHistory = (): CommissionHistoryEntry[] => {
  return useMemo(() => commissionHistoryEntries, []);
};

export const useCommissionStatusVariant = (): ((
  status: CommissionStatus
) => BadgeVariant) => {
  return useMemo(() => {
    return (status: CommissionStatus) => commissionStatusVariantMap[status];
  }, []);
};

export const useCurrentDashboardLeads = (): DashboardLead[] => {
  return useMemo(() => currentDashboardLeads, []);
};
