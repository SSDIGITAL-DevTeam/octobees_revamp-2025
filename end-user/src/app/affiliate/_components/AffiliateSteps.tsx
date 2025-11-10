"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "1. Sign Up",
    icon: "/assets/png/asset-abc-1.png",
  },
  {
    title: "2. Promote",
    icon: "/assets/png/asset-abc-2.png",
  },
  {
    title: "3. Earn",
    icon: "/assets/png/asset-abc-3.png",
  },
];

type Props = {
  onOpenPartner: () => void;
};

export default function AffiliateSteps({ onOpenPartner }: Props) {
  return (
    <section className="bg-[#F8E9E8]">
      <div className="w-full max-w-6xl mx-auto px-5 py-16 md:py-20 space-y-10 text-center">
        {/* heading */}
        <h2 className="font-heading text-2xl md:text-3xl text-black font-semibold">
          We operate as simple as A–B–C
        </h2>

        {/* cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          {steps.map((step) => (
            <article
              key={step.title}
              className="bg-white flex-1 min-h-[170px] rounded-2xl md:rounded-3xl border border-[#F0D5D2] shadow-sm flex flex-col items-center justify-center gap-4 px-6 py-8"
            >
              <Image
                src={step.icon}
                alt={step.title}
                width={80}
                height={80}
                className="w-[68px] h-[68px] object-contain"
              />
              <h3 className="font-heading text-lg md:text-xl text-[#C61515] font-semibold">
                {step.title}
              </h3>
            </article>
          ))}
        </div>

        {/* button */}
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            onClick={onOpenPartner}
            className="bg-[#C61515] hover:bg-[#aa1212] text-white rounded-full px-12 md:px-16 py-6 h-auto text-base md:text-lg font-medium"
          >
            Become A Partner →
          </Button>
        </div>
      </div>
    </section>
  );
}
