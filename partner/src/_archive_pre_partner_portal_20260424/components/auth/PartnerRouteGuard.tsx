"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getPartnerToken } from "@/lib/partner-portal";
import TnCDialog from "@/components/auth/TnCDialog";

type PartnerRouteGuardProps = {
  children: ReactNode;
  requireAuth: boolean;
};

const PartnerRouteGuard = ({
  children,
  requireAuth,
}: PartnerRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const [showTnc, setShowTnc] = useState(false);

  useEffect(() => {
    const token = getPartnerToken();
    const hasSession = Boolean(token);

    if (requireAuth && !hasSession) {
      router.replace("/login");
      setIsAllowed(false);
      setIsChecking(false);
      return;
    }

    if (!requireAuth && hasSession) {
      router.replace("/overview");
      setIsAllowed(false);
      setIsChecking(false);
      return;
    }

    if (requireAuth && hasSession) {
      const tncAgreed = typeof window !== "undefined"
        ? window.localStorage.getItem("partner_tnc_agreed") === "true"
        : true;
      setShowTnc(!tncAgreed);
    }

    setIsAllowed(true);
    setIsChecking(false);
  }, [pathname, requireAuth, router]);

  if (isChecking || !isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  return (
    <>
      {showTnc && (
        <TnCDialog onAgreed={() => setShowTnc(false)} />
      )}
      {children}
    </>
  );
};

export default PartnerRouteGuard;
