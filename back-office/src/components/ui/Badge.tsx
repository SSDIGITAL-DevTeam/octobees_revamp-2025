import type { ReactNode } from "react"

export type BadgeCategory = "payment" | "status" | "role"

export type BadgeVariant =
  | "paid"
  | "unpaid"
  | "proposal_sent"
  | "follow_up"
  | "lead_created"
  | "closed"
  | "partner"
  | "active"
  | "inactive"

type BadgeProps = {
  children: ReactNode
  category: BadgeCategory
  variant: BadgeVariant
  className?: string
}

const DEFAULT_STYLE = "bg-slate-100 text-slate-600"

const badgeStyles: Record<BadgeCategory, Partial<Record<BadgeVariant, string>>> = {
  payment: {
    paid: "bg-emerald-100 text-emerald-700",
    unpaid: "bg-amber-100 text-amber-700",
  },
  status: {
    proposal_sent: "bg-[#D4AF37]/10 text-[#D4AF37]",
    follow_up: "bg-[#8026EF]/10 text-[#8026EF]",
    lead_created: "bg-[#2A399D]/10 text-[#2A399D]",
    closed: "bg-[#004F33]/10 text-[#004F33]",
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-rose-100 text-rose-700",
    paid: "bg-emerald-100 text-emerald-700",
    unpaid: "bg-amber-100 text-amber-700",
  },
  role: {
    partner: "bg-red-100 text-red-700",
  },
}

const Badge = ({ children, category, variant, className = "" }: BadgeProps) => {
  const categoryStyles = badgeStyles[category] ?? {}
  const styles = categoryStyles[variant] ?? DEFAULT_STYLE

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
