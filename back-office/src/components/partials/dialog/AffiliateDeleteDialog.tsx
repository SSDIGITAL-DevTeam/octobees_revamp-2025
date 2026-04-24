"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
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
  onDeleted?: () => void
  children: React.ReactNode
}

const AffiliateDeleteDialog = ({
  applicationId,
  onDeleted,
  children,
}: AffiliateDeleteDialogProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteApplication(applicationId)
      successToast("Application deleted", "The application has been removed.")
      setOpen(false)
      onDeleted?.()
    } catch (error) {
      failedToast("Delete failed", "Unable to delete the application.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Application</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this application? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AffiliateDeleteDialog
