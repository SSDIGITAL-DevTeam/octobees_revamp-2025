"use client";

import { useMemo } from "react";

import {
  getLeadDetailById,
  leadStatusVariantMap,
  leads,
  type Lead,
  type LeadDetail,
  type LeadStatus,
} from "@/data/leads";
import type { BadgeVariant } from "@/components/ui/Badge";

export const useLeads = (): Lead[] => {
  return useMemo(() => leads, []);
};

export const useLeadDetail = (id: string): LeadDetail => {
  return useMemo(() => getLeadDetailById(id), [id]);
};

export const useLeadStatusVariant = (): (status: LeadStatus) => BadgeVariant => {
  return useMemo(() => {
    return (status: LeadStatus) => leadStatusVariantMap[status];
  }, []);
};
