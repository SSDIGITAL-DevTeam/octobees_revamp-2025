"use client";

import Image from "next/image";
import { FormSubscription } from "@/components/partials/Form";

export default function SubscriptionHeader() {
  return (
    <header className="relative isolate overflow-hidden rounded-[40px] bg-[#7a0008] px-6 py-10 text-white shadow-2xl md:px-12 md:py-12">
      <Image
        src="/assets/png/bg-hero-insight.png"
        alt="Insight subscription background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#6f0007]/95 via-[#7a0008]/85 to-[#6f0007]/70" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            Stay in the know with
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight md:text-5xl">
            <span className="italic font-medium">The Most Updated</span>{" "}
            Tech News Around the World
          </h2>
          <p className="text-sm text-white/80 md:text-lg">
            Get stories, insights, and curated trends sent straight to your
            inbox so you never miss a beat.
          </p>
        </div>

        <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-[#A30005] shadow-2xl">
          <h3 className="font-heading text-3xl font-semibold leading-tight text-[#A30005]">
            Subscribe once.
            <br />
            Benefit forever.
          </h3>
          <p className="mt-4 text-sm text-slate-600">
            Subscribe to our newsletter for the latest updates, insights, and
            special offers.
          </p>
          <FormSubscription
            className="mt-6 border border-[#f4d7d7] shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
            source="insights-homepage"
          />
        </div>
      </div>
    </header>
  );
}
