"use client";

import PartnerRouteGuard from "@/components/auth/PartnerRouteGuard";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import nextDynamic from "next/dynamic";
import {
  getCachedPartnerProfile,
  getPartnerToken,
  clearPartnerSession,
} from "@/lib/partner-portal";
import { partnerLogout } from "@/services/authService";

// Skip static prerendering for protected pages
export const dynamic = "force-dynamic";

type PagesLayoutProps = {
  children: ReactNode;
};

// Dynamically import Sidebar and ToastProvider for client-side rendering
const Sidebar = nextDynamic(() => import("@/components/layout/Sidebar"), {
  ssr: false,
  loading: () => null,
});

const MobileTopbar = nextDynamic(
  () => import("@/components/layout/MobileTopbar"),
  { ssr: false, loading: () => null },
);

const NProgressProvider = nextDynamic(
  () => import("@/components/providers/NProgressProvider"),
  { ssr: false, loading: () => null },
);

const PagesLayout = ({ children }: PagesLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [partnerName, setPartnerName] = useState("Partner");

  useEffect(() => {
    const profile = getCachedPartnerProfile();
    if (profile?.username) {
      setPartnerName(profile.username);
    }
  }, []);

  const handleLogout = async () => {
    const token = getPartnerToken();
    try {
      if (token) {
        await partnerLogout(token);
      }
    } catch {
      // Continue local sign out even if remote logout fails.
    } finally {
      clearPartnerSession();
      router.push("/login");
    }
  };

  return (
    <>
      <PartnerRouteGuard requireAuth>
        <div className="flex min-h-screen flex-col bg-[#F5F5F5] lg:flex-row">
          <MobileTopbar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            onLogout={handleLogout}
            partnerName={partnerName}
          />
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="flex min-h-screen min-w-0 flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
            <main className="mt-16 min-w-0 flex-1 lg:mt-6">{children}</main>
          </div>
        </div>
      </PartnerRouteGuard>
      <NProgressProvider />
    </>
  );
};

export default PagesLayout;
