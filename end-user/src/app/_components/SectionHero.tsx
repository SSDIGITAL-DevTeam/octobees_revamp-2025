"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroSectionImage from "@/assets/homepage/png/hero-section-image.png";
import { brandHome } from "@/constants/brands";
import { Button } from "@/components/ui/button";
import AffiliateModal from "@/components/modals/AffiliateModal";
import AffiliateSuccessModal from "@/components/modals/AffiliateSuccessModal";
import { submitAffiliateApplication, type AffiliatePayload } from "@/services/affiliate.service";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try { return JSON.stringify(err); } catch { return "Unknown error"; }
}

export default function SectionHero() {
  const [affiliateOpen, setAffiliateOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      {/* bg blur */}
      <div className="bg-primary/20 rounded-full overflow-x-hidden h-[70%] w-[60%] absolute top-0 md:top-40 right-0 lg:right-0 blur-[90px] z-[50]" />

      <div className="container flex flex-col gap-6 md:gap-10 justify-center items-center md:items-start">
        {/* heading */}
        <h1
          id="hero-title"
          className="font-semibold text-gray-500 text-sm lg:text-2xl flex flex-col gap-2 lg:gap-4 text-center md:text-left"
        >
          WE ARE
          <span className="!leading-[110%] md:leading-[150%] font-bold font-heading text-[2.9rem] md:text-5xl lg:text-6xl text-black text-center md:text-left">
            Your <span className="text-primary"> Revenue <br />Growth</span> Partner
          </span>
        </h1>

        {/* trusted logos */}
        <div className="w-full flex flex-col items-center md:items-start gap-y-4">
          <span className="text-xs lg:text-lg text-black/60 !leading-[130%] text-center md:text-left">
            TRUSTED BY GROWING COMPANIES
          </span>
          <ul
            aria-label="Trusted companies"
            className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4"
          >
            <span className="sr-only text-[1px]">Trusted brands</span>
            {brandHome.map((brand, index) => (
              <li key={index} className="p-1">
                <Link
                  href={brand.web || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${brand.name}`}
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo of ${brand.name}, trusted partner`}
                    width={1920}
                    height={1080}
                    className="object-contain w-16 md:w-24 lg:w-28"
                  />
                </Link>
              </li>
            ))}
            <p className="text-primary font-semibold text-base md:text-lg">40+ Companies</p>
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-4 md:mt-6 flex w-full md:w-auto flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 z-[52]">
          <Button variant="increasesales" size="lg" asChild className="w-full md:w-auto">
            <Link href="/increase-my-sales" aria-label="Go to Increase My Sales page">
              <span>Increase my sales</span>
              <TrendingUp className="w-5 h-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            aria-label="Open affiliate application form"
            className="w-full md:w-auto"
          >
            <Link href="/affiliate">Join Our Affiliate Program</Link>
          </Button>
        </div>
      </div>

      {/* right image */}
      <div className="flex items-center justify-end w-full">
        <Image
          src={HeroSectionImage.src}
          alt="Illustration of business growth and sales strategy"
          width={1000}
          height={1000}
          className="rounded-xl md:rounded-[2rem] z-[52] w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Affiliate form modal */}
      <AffiliateModal
        open={affiliateOpen}
        onClose={() => setAffiliateOpen(false)}
        onSubmit={async (data) => {
          try {
            const payload: AffiliatePayload = {
              full_name: String((data as any).full_name || "").trim(),
              email: String((data as any).email || "").trim(),
              country_code: String((data as any).country_code || "").trim() || "+62",
              phone: String((data as any).phone || "").trim(),
              country: String((data as any).country || "").trim(),
              gov_or_business_id: String((data as any).gov_or_business_id || "").trim() || null,
              strategy: String((data as any).strategy || "").trim(),
              portfolio_links: String((data as any).portfolio_links || "").trim(),
              motivation: String((data as any).motivation || "").trim(),
              other_programs: String((data as any).other_programs || "").trim(),
            };

            await submitAffiliateApplication(payload);
            setAffiliateOpen(false);
            setSuccessOpen(true);
          } catch (err) {
            alert(getErrorMessage(err));
          }
        }}
      />

      {/* Success modal */}
      <AffiliateSuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}
