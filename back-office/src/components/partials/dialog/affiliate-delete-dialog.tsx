"use client"

import { useState } from "react"
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
import { deleteApplication } from "@/lib/api/affiliate"
import { failedToast, successToast } from "@/utils/toast"

type AffiliateDeleteDialogProps = {
  applicationId: string
  children: React.ReactNode
  onDeleted?: () => Promise<void> | void
}

const AffiliateDeleteDialog = ({ applicationId, children, onDeleted }: AffiliateDeleteDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteApplication(applicationId)
      successToast("Application deleted successfully")
      await onDeleted?.()
      setOpen(false)
    } catch (error: any) {
      failedToast(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to delete application"
      )
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setIsDeleting(false)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[28rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900">
            Delete affiliate application
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            This action permanently removes the applicant&apos;s submission and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl border-gray-300 px-6 text-sm text-slate-700"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-2xl px-6 text-sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AffiliateDeleteDialog
