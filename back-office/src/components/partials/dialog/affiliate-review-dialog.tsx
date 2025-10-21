"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { reviewApplication } from "@/lib/api/affiliate"
import { failedToast, successToast } from "@/utils/toast"

type ReviewStatus = "approved" | "rejected"

type AffiliateReviewDialogProps = {
  applicationId: string
  currentStatus: "pending" | "approved" | "rejected"
  children: React.ReactNode
  reviewerId?: string | null
  onReviewed?: (nextStatus: ReviewStatus, notes?: string) => Promise<void> | void
}

const AffiliateReviewDialog = ({
  applicationId,
  currentStatus,
  children,
  reviewerId,
  onReviewed,
}: AffiliateReviewDialogProps) => {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<ReviewStatus>(
    currentStatus === "rejected" ? "rejected" : "approved"
  )
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  let primaryActionLabel = "Reject"
  if (isSubmitting) {
    primaryActionLabel = "Saving..."
  } else if (status === "approved") {
    primaryActionLabel = "Approve"
  }

  useEffect(() => {
    setStatus(currentStatus === "rejected" ? "rejected" : "approved")
  }, [currentStatus])

  const handleClose = () => {
    setOpen(false)
    setNotes("")
    setStatus(currentStatus === "rejected" ? "rejected" : "approved")
    setIsSubmitting(false)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await reviewApplication(applicationId, {
        status,
        notes: notes || undefined,
        reviewerId: reviewerId || undefined,
      })
      successToast(`Application ${status === "approved" ? "approved" : "rejected"} successfully`)
      await onReviewed?.(status, notes || undefined)
      handleClose()
    } catch (error: any) {
      failedToast(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to review application"
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          handleClose()
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900">Review Application</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Approve or reject this affiliate application. The applicant will be notified automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Decision</Label>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as ReviewStatus)}
              className="grid gap-4 md:grid-cols-2"
            >
              <label className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
                <RadioGroupItem value="approved" id="affiliate-review-approved" />
                <div>
                  <p className="font-semibold text-emerald-700">Approve</p>
                  <p className="text-sm text-emerald-600">Grant access to the affiliate program.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-3">
                <RadioGroupItem value="rejected" id="affiliate-review-rejected" />
                <div>
                  <p className="font-semibold text-rose-700">Reject</p>
                  <p className="text-sm text-rose-600">Decline the application with optional notes.</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliate-review-notes" className="text-sm font-medium text-slate-700">
              Notes <span className="text-slate-400">(optional)</span>
            </Label>
            <Textarea
              id="affiliate-review-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Share short feedback or internal notes for your team..."
              className="min-h-[120px] rounded-2xl border-gray-300"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl border-gray-300 px-6 text-sm text-slate-700"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
          variant="addData"
          className="h-11 rounded-2xl px-6 text-sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {primaryActionLabel}
        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AffiliateReviewDialog
