"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";

type MobileTopbarProps = {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  partnerName: string;
};

const MobileTopbar = ({
  isOpen,
  onToggle,
  onLogout,
  partnerName,
}: MobileTopbarProps) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    if (!isOpen) {
      setDropdownOpen(false);
    }
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 lg:hidden">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={handleMenuToggle}
        className="rounded-lg p-2 hover:bg-slate-100 active:bg-slate-200"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-700" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700" />
        )}
      </button>

      <div className="flex items-center gap-2">
        <Image
          src="/asset-logo.webp"
          alt="OCTOBEES"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="text-lg font-bold tracking-[0em] text-[#E30613]">
          OCTOBEES
        </span>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={handleAvatarClick}
          className="flex items-center gap-1 rounded-lg p-1 hover:bg-slate-100 active:bg-slate-200"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E30613] text-xs font-semibold text-white">
            {getInitials(partnerName)}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-[60] w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            <div className="border-b border-slate-100 px-3 py-2">
              <p className="text-sm font-medium text-slate-900">
                {partnerName}
              </p>
              <p className="text-xs text-slate-500">OCTOBEES Partner</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                router.push("/my-profile");
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileTopbar;
