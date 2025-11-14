"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Wallet, User as UserIcon } from "lucide-react";
import Image from "next/image";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "My Leads", icon: Users, href: "/my-leads" },
  { label: "My Commissions", icon: Wallet, href: "/my-commissions" },
  { label: "My Profile", icon: UserIcon, href: "/my-profile" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] flex-col border-r border-slate-200 bg-white px-5 py-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E30613]/5">
          <Image
            src="/assets/icons/octobees-icon.svg"
            alt="Octobees"
            width={20}
            height={20}
            className="h-6 w-6"
          />
        </div>

        <span className="text-xl font-bold uppercase text-[#E30613]">
          OCTOBEES
        </span>
      </div>

      <nav className="space-y-2">
        <p className="mb-4 text-center text-sm font-medium text-gray-800">
          Octobees Partner Dashboard
        </p>

        {navigation.map(({ label, icon: Icon, href }) => {
          // ✔ RULE: hanya aktif jika path EXACT
          const active = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              className={`
                flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm transition
                ${active
                  ? "bg-[#E30613] font-semibold text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"}
              `}
            >
              <Icon
                className={`h-4 w-4 ${
                  active ? "text-white" : "text-slate-500"
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Octobees
      </div>
    </aside>
  );
};

export default Sidebar;
