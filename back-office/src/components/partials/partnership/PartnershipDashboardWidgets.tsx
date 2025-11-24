"use client"

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

import type { StatHighlight, StatusTone } from "@/constrant/partnership"
import { cn } from "@/lib/utils"

const statusToneStyles: Record<StatusTone, string> = {
  default: "border-slate-200 bg-slate-100 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
}

type DashboardPanelProps = {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  children: ReactNode
}

export const DashboardPanel = ({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: DashboardPanelProps) => (
  <div className="space-y-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="text-sm font-semibold text-red-700 transition-colors hover:text-red-800"
        >
          {actionLabel}
        </Link>
      )}
    </div>
    {children}
  </div>
)

export const StatCard = ({ highlight }: { highlight: StatHighlight }) => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-sm">
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-900">{highlight.title}</p>
      <p className="leading-none text-4xl font-semibold text-slate-950">{highlight.value}</p>
      {highlight.helper && <p className="mt-1 text-sm font-medium text-red-500">{highlight.helper}</p>}
    </div>
    <div className="pointer-events-none absolute -bottom-10 -right-10">
        <Image src={highlight.image} alt={highlight.title} className="h-40 w-40" />
    </div>
  </div>
)

export const StatusBadge = ({
  label,
  tone = "default",
  className,
}: {
  label: string
  tone?: StatusTone
  className?: string
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
      statusToneStyles[tone],
      className
    )}
  >
    {label}
  </span>
)

export const PerformanceBar = ({ value }: { value: number }) => (
  <div className="flex min-w-[140px] items-center gap-3">
    <div className="h-2 flex-1 rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-emerald-500"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <span className="text-sm font-semibold text-slate-900">{value}%</span>
  </div>
)
