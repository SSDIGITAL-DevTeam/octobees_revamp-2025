"use client";

import { useEffect, useRef, useState } from "react";
import { agreeToTnc } from "@/services/authService";
import { getAffiliateTermsAndConditions } from "@/services/dashboardService";
import { getPartnerToken } from "@/lib/partner-portal";
import { SkeletonProse } from "@/components/ui/Shimmer";

type TnCDialogProps = {
  onAgreed: () => void;
};

const TnCDialog = ({ onAgreed }: TnCDialogProps) => {
  const [html, setHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getPartnerToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    getAffiliateTermsAndConditions(token)
      .then((res) => {
        const content = res?.data?.html || res?.html;
        setHtml(content || "");
      })
      .catch(() => {
        setLoadError("Unable to load Terms & Conditions. Please contact support.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom) setScrolledToBottom(true);
  };

  useEffect(() => {
    // If there's no scrollable content (short TnC), auto-enable the checkbox
    // so the user isn't locked out.
    if (isLoading) return;
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 4) {
      setScrolledToBottom(true);
    }
  }, [isLoading, html]);

  const handleAgree = async () => {
    if (!checked || submitting) return;
    const token = getPartnerToken();
    if (!token) return;
    setSubmitting(true);
    setError("");
    try {
      await agreeToTnc(token);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("partner_tnc_agreed", "true");
      }
      onAgreed();
    } catch (err: any) {
      setError(err?.message || "Failed to record your agreement. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-2xl flex-col rounded-[28px] bg-white shadow-2xl" style={{ maxHeight: "90vh" }}>
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-900">Terms &amp; Conditions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Please read and accept the Terms &amp; Conditions before using the partner portal.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5 prose prose-sm max-w-none"
          style={{ minHeight: 0 }}
        >
          {isLoading ? (
            <div aria-busy="true" aria-live="polite">
              <SkeletonProse paragraphs={6} />
            </div>
          ) : loadError ? (
            <p className="text-sm text-rose-600">{loadError}</p>
          ) : html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-sm text-slate-500">
              Terms and conditions are not available yet.
            </p>
          )}
        </div>

        {!isLoading && !loadError && !scrolledToBottom ? (
          <div className="border-t border-slate-100 bg-amber-50 px-6 py-3">
            <p className="text-xs font-medium text-amber-700">
              Please scroll to the bottom to enable the agreement checkbox.
            </p>
          </div>
        ) : null}

        <div className="border-t border-slate-100 px-6 py-5 space-y-4">
          {error ? (
            <p className="text-sm text-rose-600">{error}</p>
          ) : null}

          <label className={`flex items-start gap-3 ${!scrolledToBottom ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
            <input
              type="checkbox"
              checked={checked}
              disabled={!scrolledToBottom}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#E30613]"
            />
            <span className="text-sm text-slate-700">
              I have read and agree to the Terms &amp; Conditions
            </span>
          </label>

          <button
            type="button"
            onClick={handleAgree}
            disabled={!checked || submitting}
            className="w-full rounded-full bg-[#E30613] py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Agree & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TnCDialog;
