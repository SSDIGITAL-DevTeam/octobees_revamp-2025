import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type BreadcrumbEntry = {
  label: string
  href?: string
}

type BreadCrumbProps = {
  data?: string
  items?: BreadcrumbEntry[]
}

const isUuidLike = (segment: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment)

const capitalizeSegment = (segment: string) =>
  segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

const parseData = (data?: string): BreadcrumbEntry[] => {
  if (!data) return []
  return data
    .split("/")
    .map((item) => item.trim())
    .filter((segment) => segment && !isUuidLike(segment))
    .map((item) => ({
      label: capitalizeSegment(item),
      href: undefined,
    }))
}

const BreadCrumbComponents: React.FC<BreadCrumbProps> = ({ data, items }) => {
  const computedItems = React.useMemo(() => {
    if (items?.length) {
      return items
    }
    return parseData(data)
  }, [data, items])

  if (!computedItems.length) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {computedItems.map((item, index) => {
          const isLast = index === computedItems.length - 1
          const contentLabel = capitalizeSegment(item.label)

          return (
            <React.Fragment key={`${contentLabel}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="capitalize text-slate-600">{contentLabel}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={item.href}
                    className="capitalize text-red-700 hover:text-red-800"
                  >
                    {contentLabel}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export type { BreadcrumbEntry }
export default BreadCrumbComponents
