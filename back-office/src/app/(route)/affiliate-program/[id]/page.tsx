"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Loader2, ShieldCheck, Trash2 } from "lucide-react"
import Header from "@/components/layout/header/Header"
import AffiliateReviewDialog from "@/components/partials/dialog/affiliate-review-dialog"
import AffiliateDeleteDialog from "@/components/partials/dialog/affiliate-delete-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AffiliateDetail } from "@/constrant/affiliate"
import { getApplication } from "@/lib/api/affiliate"
import { failedToast } from "@/utils/toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useAuthStore } from "@/app/store/login"

type FetchOptions = {
  silent?: boolean
}

const statusStyles: Record<AffiliateDetail["status"], string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200",
}

const statusDotStyles: Record<AffiliateDetail["status"], string> = {
  pending: "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "N/A"
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm")
  } catch {
    return value ?? "N/A"
  }
}

const normalizeLink = (value: string) => {
  if (!value) return ""
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }
  return `https://${value}`
}

const splitLinks = (value?: string | null) => {
  if (!value) return []
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const AffiliateDetailPage = () => {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const applicationId = params?.id
  const reviewerId = useAuthStore((state) => state.id)

  const [application, setApplication] = useState<AffiliateDetail | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const backHref = useMemo(() => {
    const query = searchParams.toString()
    return query ? `/affiliate-program?${query}` : "/affiliate-program"
  }, [searchParams])

  const fetchApplication = useCallback(
    async (options?: FetchOptions) => {
      if (!applicationId) return
      if (options?.silent) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
        setError(null)
      }
      try {
        const response = await getApplication(applicationId)
        setApplication(response.data?.data as AffiliateDetail)
        setError(null)
      } catch (err: any) {
        const status = err?.response?.status
        const message =
          status === 404 ? "Application not found." : "Failed to load affiliate application."
        setError(message)
        failedToast(message)
      } finally {
        if (options?.silent) {
          setIsRefreshing(false)
        } else {
          setIsLoading(false)
        }
      }
    },
    [applicationId]
  )

  useEffect(() => {
    fetchApplication()
  }, [fetchApplication])

  const handleDeleted = async () => {
    const destination = backHref
    router.push(destination)
  }

  if (!applicationId) {
    return null
  }

  const renderSkeleton = () => (
    <div className="space-y-8">
      <Skeleton className="h-16 w-full rounded-3xl" />
      <Skeleton className="h-48 w-full rounded-3xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  )

  const renderBadge = (status: AffiliateDetail["status"]) => (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        statusStyles[status]
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", statusDotStyles[status])} />
      {status}
    </span>
  )

  const infoItems = [
    { label: "Full name", value: application?.fullName },
    { label: "Email", value: application?.email },
    { label: "Phone", value: application?.phone ?? "N/A" },
    { label: "Country", value: application?.country },
  ]

  const detailItems = [
    { label: "Government / Business ID", value: application?.govOrBusinessId ?? "N/A" },
    { label: "Promotion Strategy", value: application?.strategy, multiline: true },
    { label: "Motivation / Reason", value: application?.motivation, multiline: true },
    { label: "Currently Part of Any Other Affiliate Program", value: application?.otherPrograms, multiline: true },
  ]

  const technicalItems = [
    { label: "IP Address", value: application?.ipAddress ?? "N/A" },
    { label: "User Agent", value: application?.userAgent ?? "N/A" },
  ]

  let content: ReactNode = null

  if (isLoading) {
    content = renderSkeleton()
  } else if (error) {
    content = (
      <div className="flex flex-col items-center justify-center gap-5 rounded-3xl border border-dashed border-rose-200 bg-rose-50/40 p-16 text-center">
        <div>
          <p className="text-lg font-semibold text-rose-700">We couldn&apos;t load this application</p>
          <p className="text-sm text-rose-600">{error}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-full border-gray-300 px-5 text-sm text-slate-600"
            onClick={() => fetchApplication()}
          >
            Try again
          </Button>
          <Button asChild variant="addData" className="rounded-full px-5 text-sm">
            <Link href={backHref}>Go to list</Link>
          </Button>
        </div>
      </div>
    )
  } else if (application) {
    const portfolioLinks = splitLinks(application.portfolioLinks)
    content = (
      <div className="flex flex-col gap-10">
        <div className="grid gap-6 rounded-3xl border border-border bg-white p-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {renderBadge(application.status)}
              <span className="text-sm text-slate-500">
                Reviewed at {formatDateTime(application.reviewedAt)}
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {infoItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                    {item.value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Review summary</p>
            <p className="text-sm font-medium text-slate-800">
              {application.notes ? application.notes : "No notes provided."}
            </p>
            <div className="text-xs text-slate-500">
              <p>
                Reviewed by:{" "}
                <span className="font-semibold text-slate-700">
                  {application.reviewerName || application.reviewerId || "N/A"}
                </span>
              </p>
              <p>
                Reviewed at:{" "}
                <span className="font-semibold text-slate-700">
                  {formatDateTime(application.reviewedAt)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 rounded-3xl border border-border bg-white p-6 md:grid-cols-2">
          <div className="space-y-5">
            {detailItems.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p
                  className={cn(
                    "mt-2 text-sm text-slate-800",
                    item.multiline ? "whitespace-pre-line" : "font-semibold"
                  )}
                >
                  {item.value ? item.value : "N/A"}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Portfolio links</p>
              <div className="mt-3 space-y-2">
                {portfolioLinks.length > 0 ? (
                  portfolioLinks.map((link) => (
                    <a
                      key={link}
                      href={normalizeLink(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block break-all text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No portfolio links provided.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Technical details</p>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                {technicalItems.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="flex w-full flex-col gap-12 pb-12">
      <Header
        title="Application Detail"
        breadcrumbs={[
          { label: "Subscription Management" },
          { label: "Affiliate Program", href: "/affiliate-program" },
          { label: "Application Detail" },
        ]}
      />
      <section className="flex min-h-[50vh] w-full flex-col gap-10 rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-border bg-slate-50 p-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <Button asChild variant="outline" className="w-fit rounded-full border-gray-300 px-4 text-sm text-slate-600">
              <Link href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{application?.fullName ?? "Affiliate application"}</h2>
              <p className="text-sm text-slate-500">
                Submitted {formatDateTime(application?.createdAt)} | Last updated{" "}
                {formatDateTime(application?.updatedAt)}
              </p>
            </div>
            {isRefreshing && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing latest data...
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {application && (
              <AffiliateReviewDialog
                applicationId={application.id}
                currentStatus={application.status}
                reviewerId={reviewerId}
                onReviewed={() => fetchApplication({ silent: true })}
              >
                <Button variant="addData" className="h-11 rounded-full px-6 text-sm font-semibold">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Review
                </Button>
              </AffiliateReviewDialog>
            )}
            {application && (
              <AffiliateDeleteDialog applicationId={application.id} onDeleted={handleDeleted}>
                <Button variant="destructive" className="h-11 rounded-full px-6 text-sm">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete
                </Button>
              </AffiliateDeleteDialog>
            )}
          </div>
        </div>

        {content}
      </section>
    </main>
  )
}

export default AffiliateDetailPage
