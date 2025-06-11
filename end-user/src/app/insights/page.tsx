"use client";

import { JSX, useEffect, useState } from "react";
import { InsightLayout } from "@/app/insights/_components";
import { SubscriptionHeader } from "./_components/subscriptions";
import { DialogSubscription } from "@/components/layouts/Dialog";

export default function PageInsight(): JSX.Element {
  const [open, setOpen] = useState(true);
   useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <main className="w-full px-8 md:px-10 lg:px-5 space-y-10 md:space-y-5 py-20 pt-28 md:pt-32">
      <SubscriptionHeader />
      <InsightLayout />
      <DialogSubscription open={open} setOpen={setOpen} />
    </main>
  );
}