"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  User as UserIcon,
  BookOpen,
  FileText,
  Trophy,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/overview" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { label: "My Leads", icon: Users, href: "/my-leads" },
  {
    label: "Sales Knowledge Base",
    icon: BookOpen,
    href: "/sales-knowledge-base",
  },
  { label: "My Commissions", icon: Wallet, href: "/my-commissions" },
  { label: "Terms & Condition", icon: FileText, href: "/terms-and-condition" },
  { label: "My Profile", icon: UserIcon, href: "/my-profile" },
];

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white px-5 py-6
          transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[260px] lg:border-r-0 lg:border-r lg:px-5 lg:py-6
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="mb-8 flex items-center gap-3">
          <Image
            src="/asset-logo.webp"
            alt="OCTOBEES"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="text-xl font-bold tracking-[0em] text-[#E30613]">
            OCTOBEES
          </span>
        </div>

        <nav className="space-y-2">
          <p className="mb-3 text-center text-sm font-medium text-gray-800">
            OCTOBEES Partner Dashboard
          </p>

          <div className="space-y-2">
            {navigation.map(({ label, icon: Icon, href }) => {
              const active = pathname === href;

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={`
                    flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm transition
                    ${
                      active
                        ? "bg-[#E30613] font-semibold text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span className="whitespace-nowrap">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto pt-8 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} OCTOBEES
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
