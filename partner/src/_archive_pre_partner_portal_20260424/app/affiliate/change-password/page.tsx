"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ChangePasswordRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    router.replace(query ? `/forgot-password?${query}` : "/forgot-password");
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-sm text-slate-500">
      Redirecting...
    </div>
  );
};

const LegacyAffiliateChangePasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white px-6 text-sm text-slate-500">
          Redirecting...
        </div>
      }
    >
      <ChangePasswordRedirect />
    </Suspense>
  );
};

export default LegacyAffiliateChangePasswordPage;
