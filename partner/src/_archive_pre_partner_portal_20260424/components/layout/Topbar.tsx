"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { partnerLogout } from "@/services/authService";
import { getAffiliateProfile } from "@/services/dashboardService";
import {
  clearPartnerSession,
  getCachedPartnerProfile,
  getPartnerInitials,
  getPartnerToken,
  setCachedPartnerProfile,
} from "@/lib/partner-portal";

type TopbarProps = {
  title?: string;
  onLogout?: () => void;
};

const Topbar = ({ title = "Dashboard Overview", onLogout }: TopbarProps) => {
  const [open, setOpen] = useState(false);
  const [partnerName, setPartnerName] = useState("DIGITAL-PA Partner");
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const cachedProfile = getCachedPartnerProfile();
    if (cachedProfile?.username) {
      setPartnerName(cachedProfile.username);
    }

    const token = getPartnerToken();
    if (!token) return;

    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getAffiliateProfile(token);
        const profile = response?.data;
        if (!active || !profile) return;

        setPartnerName(profile.username || "DIGITAL-PA Partner");
        setCachedPartnerProfile(profile);
      } catch {
        // Keep cached identity if live profile lookup fails.
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }

    const token = getPartnerToken();

    try {
      if (token) {
        await partnerLogout(token);
      }
    } catch {
      // Continue local sign out even if remote logout fails.
    } finally {
      clearPartnerSession();
      window.location.href = "/login";
    }
  };

  return (
    <header className="relative z-30 flex flex-col gap-4 border-b border-slate-200 bg-transparent px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-[#E30613] sm:text-3xl">
          {title}
        </h1>
      </div>

      <div
        className="relative self-end lg:self-auto max-lg:hidden"
        ref={profileRef}
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-2 focus:outline-none"
        >
          <div className="text-right">
            <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
              {partnerName}
            </p>
            <Badge category="role" variant="partner">
              DIGITAL-PA Partner
            </Badge>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E30613] text-sm font-semibold text-white sm:h-12 sm:w-12 sm:text-base">
            {getPartnerInitials(partnerName)}
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg z-50">
            <Link
              href="/my-profile"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <span>My Profile</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
