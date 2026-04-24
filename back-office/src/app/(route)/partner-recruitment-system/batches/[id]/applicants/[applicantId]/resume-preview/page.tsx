"use client"
/* eslint-disable no-nested-ternary */

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Expand, FileWarning, Loader2, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"

const resolveResumeUrl = (value?: string | null) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "")
    .replace(/\/api\/v1$/, "")
    .replace(/\/$/, "")
  return apiBase ? `${apiBase}${value}` : value
}

export default function BatchApplicantResumePreviewPage() {
  const params = useParams<{ id: string; applicantId: string }>()
  const searchParams = useSearchParams()
  const batchId = params?.id
  const applicantId = params?.applicantId
  const candidateName = searchParams.get("name") || "Candidate"
  const resumeSourceUrl = resolveResumeUrl(searchParams.get("url"))
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const previewFrameRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null

    const loadPdf = async () => {
      if (!resumeSourceUrl) {
        setLoadingPdf(false)
        setPdfError(true)
        return
      }

      try {
        setLoadingPdf(true)
        setPdfError(false)

        const response = await fetch(resumeSourceUrl, {
          method: "GET",
          credentials: "omit",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status}`)
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)

        if (!active) return
        setBlobUrl(objectUrl)
      } catch (error) {
        console.error("Failed to load resume preview:", error)
        if (!active) return
        setPdfError(true)
        setBlobUrl(null)
      } finally {
        if (active) {
          setLoadingPdf(false)
        }
      }
    }

    void loadPdf()

    return () => {
      active = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [resumeSourceUrl])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const iframeSrc = useMemo(() => {
    if (!blobUrl) return null
    return `${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitV`
  }, [blobUrl])

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      if (previewFrameRef.current?.requestFullscreen) {
        await previewFrameRef.current.requestFullscreen()
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen preview:", error)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col gap-6 px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Resume Preview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{candidateName}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Internal CV preview. Download controls are not shown in this workspace.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-full border-slate-300 px-4 text-sm">
          <Link href={`/partner-recruitment-system/batches/${batchId}/applicants/${applicantId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to candidate
          </Link>
        </Button>
      </div>

      <div
        ref={previewFrameRef}
        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-end border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-300 px-4 text-sm"
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? (
              <>
                <Minimize className="mr-2 h-4 w-4" />
                Exit Fullscreen
              </>
            ) : (
              <>
                <Expand className="mr-2 h-4 w-4" />
                Maximize Preview
              </>
            )}
          </Button>
        </div>
        {loadingPdf ? (
          <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-600">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Loading resume preview</p>
              <p className="mt-1 text-sm text-slate-500">
                Please wait while we prepare the PDF preview.
              </p>
            </div>
          </div>
        ) : !iframeSrc || pdfError ? (
          <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-rose-50 p-4 text-rose-600">
              <FileWarning className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Resume preview unavailable</p>
              <p className="mt-1 text-sm text-slate-500">
                {!iframeSrc
                  ? "Resume URL is missing from this preview request."
                  : "The PDF could not be loaded in the preview frame."}
              </p>
            </div>
          </div>
        ) : (
          <iframe
            title="Resume preview"
            src={iframeSrc}
            className="min-h-[88vh] w-full bg-slate-50"
            onError={() => setPdfError(true)}
          />
        )}
      </div>
    </div>
  )
}
