"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AffiliateModal from "@/components/modals/AffiliateModal";
import AffiliateSuccessModal from "@/components/modals/AffiliateSuccessModal";
import AffiliatePNG from "@/assets/homepage/png/affiliate-cta.png";
import {
  submitAffiliateApplication,
  type AffiliatePayload,
} from "@/services/affiliate.service";
import router from "next/router";
import Link from "next/link";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export default function SectionAffiliateCTA() {
  const [openForm, setOpenForm] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  return (
    <>
      <section className="container pt-8 md:pt-12 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-0">
          <div className="order-2 md:order-1 flex justify-center md:justify-start">
            <Image
              src={AffiliatePNG}
              alt="Smiling woman holding laptop illustration"
              width={520}
              height={360}
              className="block w-full max-w-[520px] h-auto object-contain"
            />
          </div>

          {/* Right: Copy + CTA */}
          <div className="order-1 md:order-2 text-center md:text-left space-y-4">
            <h2 className="font-heading text-[28px] md:text-[40px] leading-tight text-primary">
              Join Our Affiliate Program
            </h2>
            <p className="text-base md:text-lg text-black/80 leading-relaxed">
              <span className="text-primary font-semibold">Earn up to 30%</span>{" "}
              in commission for every successful sale you refer through our
              program.
            </p>
            <div className="pt-2">
              <Button
                variant="increasesales"
                size="lg"
                className="md:w-auto w-full"
                aria-label="Go to Affiliate page"
              >
                <Link href="/affiliate">Join Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
