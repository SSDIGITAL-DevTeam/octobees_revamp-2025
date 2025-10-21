"use client";
import FloatButton from "@/components/partials/FloatButton/FloatButton";
import {
  SectionWhatWeDo,
  SectionHero,
  SectionAffiliateCTA,
  SectionLabel,
  SectionWhyChooseUs,
  SectionWhoWeHelp,
  SectionTestimonials
} from "./_components";
import { DialogSubscription } from "@/components/layouts/Dialog";
import { useEffect, useState } from "react";
import { ButtonFloatingCTA } from "@/components/partials/Button";

export default function Home() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <ButtonFloatingCTA />

      <header className="bg-white" role="banner">
        <section aria-labelledby="hero-title" className="flex flex-col md:flex-row gap-y-16 lg:min-h-screen py-16 pt-32 md:py-32  md:pt-52 lg:py-0 relative md:max-w-7xl md:mx-auto px-5">
          <SectionHero />
        </section>
      </header>

      <section className="w-full bg-primary lg:absolute lg:-bottom-0 z-[50]">
        <div className="py-4 md:py-6">
          <SectionLabel />
        </div>
      </section>

      <section className="bg-white overflow-hidden">
        <div className="pt-12 md:pt-20 pb-0 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionAffiliateCTA />
        </div>
      </section>

      <section className="bg-tertiary">
        <div className="pt-8 md:pt-12 pb-12 md:pb-20 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionWhatWeDo />
        </div>
      </section>

      <section className="w-full bg-primary">
        <div className="md:py-6 py-4 ">
          <SectionLabel side={"left"} />
        </div>
      </section>

      <section className="bg-tertiary">
        <div className="py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionWhyChooseUs />
        </div>
      </section>

      <section className="bg-light">
        <div className="py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionTestimonials />
        </div>
      </section>

      <DialogSubscription open={open} setOpen={setOpen} />
    </main>
  );
}
