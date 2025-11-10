"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onOpenPartner: () => void;
};

export default function AffiliateProven({ onOpenPartner }: Props) {
  return (
    <section className="bg-[#F2EBE3]">
      <div className="w-full md:max-w-5xl mx-auto px-5 py-14 md:py-16 text-center space-y-5">
        {/* heading */}
        <h2 className="font-heading md:text-[2.6rem] leading-tight text-[#1E1B1A] font-semibold">
          Proven Track Record with High-Value Clients
        </h2>

        {/* subtext 1 – sama persis gaya lowercase */}
        <p className="text-[#1E1B1A] text-sm md:text-base leading-relaxed">
          we operate as a <span className="font-semibold">full-scale Martech &amp; Dev agency</span> that has delivered{" "}
          <span className="font-semibold">premium projects for both local and international clients.</span>
        </p>

        {/* subtext 2 */}
        <p className="text-[#1E1B1A] text-sm md:text-base leading-relaxed">
          Our portfolio includes <span className="font-semibold">high-ticket, enterprise-grade work</span> across Singapore and Indonesia
        </p>

        {/* button */}
        <div className="pt-3 flex justify-center">
          <Button
            type="button"
            onClick={onOpenPartner}
            aria-label="Open affiliate partner form from proven track record section"
            className="bg-black text-white hover:bg-black/90 rounded-full px-10 py-6 h-auto text-base"
          >
            Become A Partner
          </Button>
        </div>
      </div>
    </section>
  );
}
