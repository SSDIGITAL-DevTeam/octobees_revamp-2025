"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  onOpenPartner: () => void;
};

export default function AffiliateFinalCTA({ onOpenPartner }: Props) {
  return (
    <section className="bg-white overflow-hidden">
      {/* tinggi section dikunci */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* LEFT: image nempel bawah */}
        <div className="relative min-h-[320px] md:min-h-[420px]">
          <Image
            src="/assets/png/asset-partner-affiliate.png"
            alt="Affiliate partner illustration"
            fill
            // contain supaya orangnya nggak kepotong, object-bottom supaya nempel bawah
            className="object-contain object-bottom md:object-left-bottom"
            priority
          />
        </div>

        {/* RIGHT: text punya padding sendiri */}
        <div className="flex flex-col justify-center px-5 md:pl-12 py-10 md:py-0 space-y-5 text-center md:text-left">
          <h2 className="font-heading text-2xl md:text-[2.2rem] font-bold text-[#B01212] leading-tight">
            Ready to Partner?
          </h2>
          <p className="text-[#1A1A1A] text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            Submit your profile now. Qualified partners will have special access
            to their affiliate dashboard.
          </p>
          <div>
            <Button
              type="button"
              onClick={onOpenPartner}
              aria-label="Open affiliate partner form"
              className="bg-[#C61515] hover:bg-[#a51212] text-white rounded-full px-10 py-5 h-auto text-base font-semibold"
            >
              Become A Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
