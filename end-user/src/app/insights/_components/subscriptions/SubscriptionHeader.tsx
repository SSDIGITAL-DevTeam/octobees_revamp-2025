"use client";

import Image from "next/image";
import { FormSubscription } from "@/components/partials/Form";

export default function SubscriptionHeader() {
  return (
    <header className="relative isolate overflow-hidden rounded-[40px] bg-[#7a0008] shadow-2xl">
      {/* background image + gradient */}
      <div className="absolute inset-0">
        <Image
          src="/assets/png/bg-hero-insight.png"
          alt="Insight subscription background"
          fill
          className="h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#6f0007]/95 via-[#7a0008]/88 to-[#6f0007]/75" />
      </div>

      {/* content */}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* LEFT: copy */}
        <div className="flex-1 max-w-xl space-y-5 text-white">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">
            Stay in the know with
          </p>
          <h2 className="font-heading text-3xl font-semibold leading-tight md:text-[40px] md:leading-[1.1]">
            <span className="italic font-medium">The Most Updated</span>{" "}
            <br />
            Tech News Around the World
          </h2>
          <p className="text-sm text-white/80 md:text-base">
            Get stories, insights, and curated trends sent straight to your
            inbox so you never miss a beat.
          </p>
        </div>

        {/* RIGHT: subscribe card */}
        <div className="w-full max-w-sm lg:max-w-md lg:ml-4">
          <div className="flex h-full flex-col justify-center rounded-[32px] bg-white p-7 text-[#A30005] shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:p-8">
            <h3 className="font-heading text-2xl font-semibold leading-tight text-[#A30005] md:text-3xl">
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
      </div>
    </header>
  );
}
