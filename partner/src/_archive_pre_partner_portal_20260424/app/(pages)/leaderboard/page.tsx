"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PerformanceRankingPanel from "@/components/dashboard/PerformanceRankingPanel";
import Topbar from "@/components/layout/Topbar";
import { SkeletonCard } from "@/components/ui/Shimmer";
import {
  getPartnerToken,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";
import { getAffiliatePerformance } from "@/services/dashboardService";

const LeaderboardPage = () => {
  const [performance, setPerformance] = useState<PartnerPerformanceData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let active = true;

    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await getAffiliatePerformance(token);

        if (!active) return;

        setPerformance(
          (response?.data || null) as PartnerPerformanceData | null,
        );
      } catch (err: any) {
        if (!active) return;
        toast.error(err?.message || "Failed to load leaderboard.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <Topbar title="Leaderboard" />

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <SkeletonCard rows={10} headerLines={2} />
        </div>
      ) : (
        <PerformanceRankingPanel performance={performance} showInsights={false} />
      )}
    </div>
  );
};

export default LeaderboardPage;
