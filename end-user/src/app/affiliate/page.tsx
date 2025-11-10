"use client";

import { useState } from "react";
import AffiliateModal from "@/components/modals/AffiliateModal";
import AffiliateSuccessModal from "@/components/modals/AffiliateSuccessModal";
import {
  submitAffiliateApplication,
  type AffiliatePayload,
} from "@/services/affiliate.service";

import AffiliateHero from "@/app/affiliate/_components/AffiliateHero";
import AffiliateProven from "@/app/affiliate/_components/AffiliateProven";
import AffiliateBenefits from "@/app/affiliate/_components/AffiliateBenefit";
import AffiliateSteps from "@/app/affiliate/_components/AffiliateSteps";
import AffiliateFinalCTA from "@/app/affiliate/_components/AffiliateFinalCTA";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export default function AffiliatePage() {
  const [openForm, setOpenForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const openPartnerModal = () => setOpenForm(true);

  const handleAffiliateSubmit = async (
    data: Record<string, FormDataEntryValue>
  ) => {
    try {
      const payload: AffiliatePayload = {
        full_name: String(data.full_name || "").trim(),
        email: String(data.email || "").trim(),
        country_code: String(data.country_code || "").trim() || "+62",
        phone: String(data.phone || "").trim(),
        country: String(data.country || "").trim(),
        gov_or_business_id:
          String(data.gov_or_business_id || "").trim() || null,
        strategy: String(data.strategy || "").trim(),
        portfolio_links: String(data.portfolio_links || "").trim(),
        motivation: String(data.motivation || "").trim(),
        other_programs: String(data.other_programs || "").trim(),
      };

      await submitAffiliateApplication(payload);
      setOpenForm(false);
      setOpenSuccess(true);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <>
      <main className="flex flex-col">
        <AffiliateHero onOpenPartner={openPartnerModal} />
        <AffiliateProven onOpenPartner={openPartnerModal} />
        <AffiliateBenefits />
        <AffiliateSteps onOpenPartner={openPartnerModal} />
        <AffiliateFinalCTA onOpenPartner={openPartnerModal} />
      </main>

      <AffiliateModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAffiliateSubmit}
      />

      <AffiliateSuccessModal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
      />
    </>
  );
}
