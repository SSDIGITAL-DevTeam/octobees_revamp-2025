"use client";

import { Suspense } from "react";
import SectionThanks from "../_components/SectionThanks";

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
      <SectionThanks />
    </Suspense>
  );
}
