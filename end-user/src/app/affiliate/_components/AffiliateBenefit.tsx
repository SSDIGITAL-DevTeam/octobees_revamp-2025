"use client";

import Image from "next/image";

export default function AffiliateBenefits() {
  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 py-16 md:py-20 space-y-16">
        {/* heading */}
        <div className="text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-[#B01212] font-semibold">
            What You Will Get
          </h2>
        </div>

        <div className="space-y-24">
          {/* 1. High Commissions - text on right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
            {/* image */}
            <div className="md:flex-1 flex justify-center md:justify-start">
              <Image
                src="/assets/png/asset-commition-affiliate.png"
                alt="High commissions illustration"
                width={220}
                height={220}
                className="w-[210px] h-auto object-contain"
              />
            </div>
            {/* text */}
            <div className="md:flex-1 text-center md:text-right space-y-3">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-semibold">
                High Commissions, Real Payouts
              </h3>
              <p className="text-[#333] leading-relaxed md:max-w-md md:ml-auto">
                Earn up to 30% on every project you bring in — transparent and
                reliably paid.
              </p>
            </div>
          </div>

          {/* 2. Real-time Dashboard - text on left */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* image */}
            <div className="md:flex-1 flex justify-center md:justify-end">
              <Image
                src="/assets/png/asset-realtime-affiliate.png"
                alt="Dashboard preview"
                width={360}
                height={220}
                className="w-[340px] h-auto object-contain"
              />
            </div>
            {/* text */}
            <div className="md:flex-1 text-center md:text-left space-y-3">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-semibold">
                Real-time Dashboard
              </h3>
              <p className="text-[#333] leading-relaxed md:max-w-md">
                Track your sales commission and easily manage your leads using
                OCTOBEES sales &amp; CRM dashboard.
              </p>
            </div>
          </div>

          {/* 3. Training & Partner Support - text on right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
            {/* image */}
            <div className="md:flex-1 flex justify-center md:justify-start">
              <Image
                src="/assets/png/asset-training-affiliate.png"
                alt="Training and partner support illustration"
                width={240}
                height={200}
                className="w-[230px] h-auto object-contain"
              />
            </div>
            {/* text */}
            <div className="md:flex-1 text-center md:text-right space-y-3">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-semibold">
                Training &amp; Partner Support
              </h3>
              <p className="text-[#333] leading-relaxed md:max-w-md md:ml-auto">
                Access ongoing training and on-demand support — we&apos;re
                always on standby to assist you with any challenge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
