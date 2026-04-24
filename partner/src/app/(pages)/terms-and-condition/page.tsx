"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import io from "socket.io-client";

import CommissionPolicyInfoPanel from "@/components/dashboard/CommissionPolicyInfoPanel";
import Topbar from "@/components/layout/Topbar";
import { Shimmer, SkeletonProse } from "@/components/ui/Shimmer";
import {
  getPartnerToken,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";
import {
  getAffiliatePerformance,
  getAffiliateTermsAndConditions,
} from "@/services/dashboardService";

const TermsAndConditionPage = () => {
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [performance, setPerformance] = useState<PartnerPerformanceData | null>(
    null,
  );

  useEffect(() => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let active = true;
    const baseApi =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005/api/v1";
    const baseUploads = baseApi.replace("/api/v1", "/uploads");
    const socketUrl = baseApi.replace("/api/v1", "");

    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const processHtmlImages = (rawHtml: string) => {
      let processed = rawHtml || "";
      processed = processed.replace(
        /src="\/uploads\//g,
        `src="${baseUploads}/`,
      );
      processed = processed.replace(
        /src="http:\/\/localhost:3005\/uploads\//g,
        `src="${baseUploads}/`,
      );
      return processed;
    };

    socket.on("partner:terms-updated", (data: any) => {
      const newHtml = typeof data === "string" ? data : data?.html || "";
      setHtml(processHtmlImages(newHtml));
      toast.info("Terms and conditions have been updated.");
    });

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [termsResponse, performanceResponse] = await Promise.all([
          getAffiliateTermsAndConditions(token),
          getAffiliatePerformance(token).catch(() => null),
        ]);
        if (!active) return;

        setHtml(processHtmlImages(termsResponse?.data?.html || ""));
        setPerformance(
          (performanceResponse?.data || null) as PartnerPerformanceData | null,
        );
      } catch (error: any) {
        if (!active) return;
        toast.error(error?.message || "Failed to load terms and conditions.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Topbar title="Terms & Condition" />

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card">
        <header className="mb-5 border-b border-slate-200 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E30613]">
            Program Terms
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Partner Terms &amp; Conditions
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Full legal agreement governing your partnership. This is the
            authoritative document — the summary above is provided for quick
            reference only.
          </p>
        </header>

        {isLoading ? (
          <div aria-busy="true" aria-live="polite">
            <SkeletonProse paragraphs={5} />
          </div>
        ) : html.trim() ? (
          <div
            className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-p:text-slate-600 prose-li:text-slate-600"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="text-sm text-slate-500">
            Terms and conditions are not available yet.
          </div>
        )}
      </section>

      {isLoading ? (
        <section
          className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-card sm:p-8"
          aria-busy="true"
          aria-live="polite"
        >
          <Shimmer className="h-3 w-48" />
          <Shimmer className="mt-3 h-6 w-2/3" />
          <Shimmer className="mt-2 h-3 w-4/5" />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <Shimmer className="h-11 w-11 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-3 w-24" />
                    <Shimmer className="h-5 w-3/4" />
                    <Shimmer className="h-3 w-full" />
                  </div>
                </div>
                <div className="mt-4 space-y-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5">
                  <Shimmer className="h-3 w-2/3" />
                  <Shimmer className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <CommissionPolicyInfoPanel performance={performance} />
      )}
    </div>
  );
};

export default TermsAndConditionPage;
