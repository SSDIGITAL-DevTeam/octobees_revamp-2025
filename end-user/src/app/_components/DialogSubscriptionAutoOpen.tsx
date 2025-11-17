"use client";

import { useEffect, useState } from "react";
import { DialogSubscription } from "@/components/layouts/Dialog";

export default function DialogSubscriptionAutoOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return <DialogSubscription open={open} setOpen={setOpen} />;
}
