import type { ReactNode } from "react";

export type BadgeCategory = "payment" | "status" | "role";

export type BadgeVariant =
  | "paid"
  | "unpaid"
  | "proposal_sent"
  | "follow_up"
  | "lead_created"
  | "partner";

type BadgeProps = {
  children: ReactNode;
  category: BadgeCategory;
  variant: BadgeVariant;
  className?: string;
};

// Warna berdasarkan section dan variant
const badgeStyles: Record<BadgeCategory, Record<BadgeVariant, string>> = {
  payment: {
    paid: "bg-emerald-100 text-emerald-700",
    unpaid: "bg-amber-100 text-amber-700",
    proposal_sent: "",
    follow_up: "",
    lead_created: "",
    partner: "",
  },
  status: {
    proposal_sent: "bg-amber-100 text-amber-700",
    follow_up: "bg-purple-100 text-purple-700",
    lead_created: "bg-blue-100 text-blue-700",
    paid: "",
    unpaid: "",
    partner: "",
  },
  role: {
    partner: "bg-red-100 text-red-700",
    paid: "",
    unpaid: "",
    proposal_sent: "",
    follow_up: "",
    lead_created: "",
  },
};

const Badge = ({ children, category, variant, className = "" }: BadgeProps) => {
  const styles =
    badgeStyles[category]?.[variant] ?? "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
