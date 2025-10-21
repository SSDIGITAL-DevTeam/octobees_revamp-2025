"use client"

import { useMemo } from "react"
import { useAuthStore } from "@/app/store/login"
import BreadCrumbComponents, {
  type BreadcrumbEntry,
} from "@/components/partials/breadcrumb/BreadCrumbComponents"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

type HeaderProps = {
  title: string
  label?: string
  breadcrumbs?: BreadcrumbEntry[]
}

const formatSegment = (segment: string) =>
  segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

const isUuidLike = (segment: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment)

const Header = ({ title, label, breadcrumbs }: HeaderProps) => {
  const path = usePathname()
  const name = useAuthStore((state) => state.name)
  const role = useAuthStore((state) => state.role)

  const derivedBreadcrumbs = useMemo(() => {
    if (breadcrumbs?.length) {
      return breadcrumbs
    }

    const items: BreadcrumbEntry[] = []

    if (label) {
      label
        .split("/")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => {
          items.push({
            label: formatSegment(part),
          })
        })
    }

    const segments = path.split("/").filter(Boolean)
    segments.forEach((segment, index) => {
      if (isUuidLike(segment)) return
      const href =
        index < segments.length - 1 ? `/${segments.slice(0, index + 1).join("/")}` : undefined
      items.push({
        label: formatSegment(segment),
        href,
      })
    })

    return items
  }, [breadcrumbs, label, path])

  return (
    <header className="w-full flex items-center justify-between border-b border-gray-300 py-6 text-slate-950 shadow-sm">
      <div className="flex flex-col gap-3">
        <h1 className="text-lg font-semibold sm:text-3xl">{title}</h1>
        <BreadCrumbComponents items={derivedBreadcrumbs} />
      </div>
      <div className="flex items-end gap-5 text-end">
        <span>
          {name} <br /> <span className="text-red-800">{role}</span>
        </span>
        {name && <SidebarTrigger />}
      </div>
    </header>
  )
}

export default Header
