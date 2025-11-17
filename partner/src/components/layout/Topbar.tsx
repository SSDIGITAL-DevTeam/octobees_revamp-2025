"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "@/components/ui/Badge";

type TopbarProps = {
  title?: string;
  onLogout?: () => void;
};

const Topbar = ({ title = "Dashboard Overview", onLogout }: TopbarProps) => {
  const [open, setOpen] = useState(false);
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

  const handleLogout = () => {
    setOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-4 bg-transparent border-b border-slate-200">
      <div>
        <h1 className="text-3xl font-semibold text-[#E30613]">
          {title}
        </h1>
      </div>

      <div className="relative" ref={profileRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Bryan Adams</p>
            <Badge category="role" variant="partner">
              Octobees Partner
            </Badge>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E30613] text-base font-semibold text-white">
            BA
          </div>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg z-50">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
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
