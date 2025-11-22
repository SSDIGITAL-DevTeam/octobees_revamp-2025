"use client"

import { useEffect, useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CommissionItem } from "@/constrant/partnership"

type Mode = "create" | "edit"

type CommissionFormValues = {
  serviceName: string
  projectValue: string
  commissionPercentage: string
  description: string
}

type CommissionServiceModalProps = {
  open: boolean
  mode: Mode
  initialData?: CommissionItem
  serviceOptions: string[]
  onSubmit: (values: CommissionFormValues) => void
  onClose: () => void
}

const emptyValues: CommissionFormValues = {
  serviceName: "",
  projectValue: "",
  commissionPercentage: "",
  description: "",
}

export const CommissionServiceModal = ({
  open,
  mode,
  initialData,
  serviceOptions,
  onSubmit,
  onClose,
}: CommissionServiceModalProps) => {
  const [values, setValues] = useState<CommissionFormValues>(emptyValues)

  useEffect(() => {
    if (open) {
      setValues(
        initialData
          ? {
              serviceName: initialData.serviceName,
              projectValue: initialData.projectValue,
              commissionPercentage: String(initialData.commissionPercentage),
              description: initialData.description,
            }
          : emptyValues
      )
    }
  }, [initialData, open])

  const title = mode === "create" ? "Add New Service" : "Edit Service"
  const submitLabel = mode === "create" ? "Create Service" : "Save Changes"
  const submitVariant = mode === "create" ? "addData" : undefined

  const options = useMemo(() => {
    const unique = Array.from(new Set(serviceOptions.concat(values.serviceName ? [values.serviceName] : [])))
    return unique.filter(Boolean)
  }, [serviceOptions, values.serviceName])

  const handleChange = (key: keyof CommissionFormValues, next: string) => {
    setValues((prev) => ({ ...prev, [key]: next }))
  }

  const handleSubmit = () => {
    if (!values.serviceName) return
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => (!isOpen ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl rounded-[24px] px-8 py-8">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-2xl font-semibold text-slate-900">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Service Name</p>
            <Select value={values.serviceName} onValueChange={(value) => handleChange("serviceName", value)}>
              <SelectTrigger className="h-12 rounded-lg border-slate-200 text-sm font-medium">
                <SelectValue placeholder="Select Services" />
              </SelectTrigger>
              <SelectContent>
                {options.map((service) => (
                  <SelectItem key={service} value={service} className="capitalize">
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Project Value</p>
            <Input
              value={values.projectValue}
              onChange={(event) => handleChange("projectValue", event.target.value)}
              placeholder="IDR 0"
              className="h-12 rounded-lg border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Commission (%)</p>
            <Input
              value={values.commissionPercentage}
              onChange={(event) => handleChange("commissionPercentage", event.target.value)}
              placeholder="Enter Commission"
              className="h-12 rounded-lg border-slate-200 text-sm"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">Description</p>
            <Textarea
              value={values.description}
              onChange={(event) => handleChange("description", event.target.value)}
              placeholder="Enter Description"
              className="min-h-[140px] rounded-lg border-slate-200 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-slate-300 px-4 text-sm font-semibold text-slate-600"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={submitVariant ?? "secondary"}
              className={`h-10 rounded-full px-5 text-sm font-semibold ${
                mode === "edit" ? "bg-amber-400 text-white hover:bg-amber-500" : ""
              }`}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { CommissionFormValues }
export default CommissionServiceModal
