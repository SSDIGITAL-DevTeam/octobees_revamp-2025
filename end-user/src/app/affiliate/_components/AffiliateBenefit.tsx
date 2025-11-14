"use client";

import Image from "next/image";

export default function AffiliateBenefits() {
  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 py-16 md:py-20 space-y-16">
        {/* heading */}
        <div className="text-center">
          <h2 className="font-heading text-[2rem] md:text-[2.6rem] leading-tight text-[#B01212] font-semibold">
            What You Will Get
          </h2>
        </div>

        <div className="space-y-16">
          {/* 1. High Commissions - text kiri, gambar kanan */}
          <div className="md:grid md:grid-cols-2 md:items-center gap-10">
            {/* text */}
            <div className="text-center md:text-right md:pr-6 md:ml-auto space-y-3 max-w-md">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-bold">
                High Commissions, Real Payouts
              </h3>
              <p className="text-[#333] leading-relaxed">
                Earn up to 30% on every project you bring in — transparent and
                reliably paid.
              </p>
            </div>
            {/* image */}
            <div className="flex justify-center md:justify-center">
              <Image
                src="/assets/png/asset-commition-affiliate.png"
                alt="High commissions illustration"
                width={320}
                height={320}
                className="w-[210px] md:w-[240px] h-auto object-contain"
              />
            </div>
          </div>

          {/* 2. Real-time Dashboard - gambar kiri, text kanan */}
          <div className="md:grid md:grid-cols-2 md:items-center gap-10">
            {/* image */}
            <div className="flex justify-center md:justify-center order-none md:order-none">
              <Image
                src="/assets/png/asset-realtime-affiliate.png"
                alt="Dashboard preview"
                width={440}
                height={440}
                className="w-[440px] md:w-[440px] h-auto object-contain"
              />
            </div>
            {/* text */}
            <div className="text-center md:text-left md:pl-6 md:mr-auto space-y-3 max-w-md">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-bold">
                Real-time Dashboard
              </h3>
              <p className="text-[#333] leading-relaxed">
                Track your sales commission and easily manage your leads using
                OCTOBEES sales &amp; CRM dashboard.
              </p>
            </div>
          </div>

          {/* 3. Training & Partner Support - text kiri, gambar kanan */}
          <div className="md:grid md:grid-cols-2 md:items-center gap-10">
            {/* text */}
            <div className="text-center md:text-right md:pr-6 md:ml-auto space-y-3 max-w-md">
              <h3 className="font-heading text-xl md:text-2xl text-[#191919] font-bold">
                Training &amp; Partner Support
              </h3>
              <p className="text-[#333] leading-relaxed">
                Access ongoing training and on-demand support — we&apos;re
                always on standby to assist you with any challenge.
              </p>
            </div>
            {/* image */}
            <div className="flex justify-center md:justify-center">
              <Image
                src="/assets/png/asset-training-affiliate.png"
                alt="Training and partner support illustration"
                width={260}
                height={260}
                className="w-[230px] md:w-[250px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
