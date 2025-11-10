"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  onOpenPartner: () => void;
};

export default function AffiliateHero({ onOpenPartner }: Props) {
  return (
    <section className="relative h-[628px] flex items-center overflow-hidden">
      {/* full image to the right edge */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2">
        <Image
          src="/assets/png/asset-header-affiliate.png"
          alt="Affiliate teamwork"
          fill
          className="object-cover object-center md:object-right"
          priority
        />
      </div>

      {/* centered text container */}
      <div className="relative w-full">
        <div className="w-full md:max-w-7xl md:mx-auto px-6 md:px-10 flex items-center">
          <div className="max-w-xl space-y-6 text-center md:text-left">
            <h1 className="font-heading font-bold text-[2rem] md:text-5xl text-black leading-tight">
              Earn With <span className="text-primary">OCTOBEES</span>
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              Join OCTOBEES&apos; Affiliate Partner Program. Drive qualified
              leads for high-value digital services and earn{" "}
              <span className="font-semibold">
                up to 30% recurring commission.
              </span>
            </p>
            <Button
              type="button"
              variant="increasesales"
              size="lg"
              onClick={onOpenPartner}
              className="rounded-full bg-red-700 hover:bg-red-800 px-8 text-white"
            >
              Become A Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
