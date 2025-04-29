"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();


  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) return router.push("/dashboard");
    router.push("/auth/login");
  }, [router]);

  return null;
}