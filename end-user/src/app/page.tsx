"use client";
import FloatButton from "@/components/partials/FloatButton/FloatButton";
import {
  SectionWhatWeDo,
  SectionHero,
  SectionLabel,
  SectionWhyChooseUs,
  SectionWhoWeHelp,
  SectionTestimonials
} from "./_components";
import { DialogSubscription } from "@/components/layouts/Dialog";
import { useEffect, useState } from "react";


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
      <FloatButton />

      <header className="bg-white">
        <div className="flex flex-col md:flex-row gap-y-16 lg:min-h-screen py-24 md:py-32 pt-36 md:pt-52 lg:py-0 relative md:max-w-7xl md:mx-auto px-5">
          <SectionHero />
        </div>
      </header>

      <section className="w-full bg-primary lg:absolute lg:-bottom-0 z-[50]">
        <div className="md:py-6 py-4 ">
          <SectionLabel />
        </div>
      </section>

      <section className="bg-tertiary">
        <div className="py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionWhatWeDo />
        </div>
      </section>

      <section className="bg-light">
        <div className="py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-5">
          <SectionWhoWeHelp />
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
