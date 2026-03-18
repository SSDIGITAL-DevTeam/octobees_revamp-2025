"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle, LogOut } from "lucide-react";
import Logo from "@/components/partials/Logo/Logo";
import { motion, AnimatePresence } from "framer-motion";

const CLIENT_SESSION_KEY = "octobees_client_session";

export default function ClientHeader() {
  const [session, setSession] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    const checkSession = () => {
      const rawSession = localStorage.getItem(CLIENT_SESSION_KEY);
      if (rawSession) {
        setSession(JSON.parse(rawSession));
      } else {
        setSession(null);
      }
    };
    checkSession();
    // Re-check periodically or listen to changes if needed, but since Next router doesn't usually reload pages, this might need an interval or context to update perfectly.
    // We can rely on basic storage events
    window.addEventListener("storage", checkSession);
    return () => window.removeEventListener("storage", checkSession);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(CLIENT_SESSION_KEY);
    setSession(null);
    router.replace("/client-login");
  };

  if (!isClient) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-[0_4px_30px_rgb(0,0,0,0.03)] fixed left-0 right-0 top-0 w-full z-[100] transition-all duration-300 border-b border-gray-100">
      <div className="max-w-7xl py-5 md:py-7 flex justify-between items-center relative mx-4 sm:mx-6 md:mx-8 lg:mx-auto">
        <div className="flex-1 opacity-0 pointer-events-none" aria-hidden="true">
          <Logo />
        </div>

        <Link
          href="/onboarding-kit"
          className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2"
        >
          <Logo />
        </Link>

        <div className="flex-1 flex justify-end">
          {session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/30 transition-all shadow-sm group"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden">
                  {session.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col items-start mr-1">
                  <span className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[120px] group-hover:text-primary transition-colors">
                    {session.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Client Account
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] bg-white border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {session.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {session.email}
                      </p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          pathname === "/profile"
                            ? "bg-primary/5 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <UserCircle className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-[100px]" />
          )}
        </div>
      </div>
    </nav>
  );
}
