"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCommissionControl } from "@/hooks/partnership/useCommissionControl"
import type { CommissionItem } from "@/constrant/partnership"
import { CommissionControlTable } from "./CommissionControlTable"
import { CommissionServiceModal, type CommissionFormValues } from "./CommissionServiceModal"

export const CommissionControlContent = () => {
  const { search, setSearch, items, addItem, updateItem } = useCommissionControl()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [selected, setSelected] = useState<CommissionItem | undefined>(undefined)

  const serviceOptions = useMemo(
    () => Array.from(new Set(items.map((item) => item.serviceName))),
    [items]
  )

  const handleCreateOpen = () => {
    setModalMode("create")
    setSelected(undefined)
    setModalOpen(true)
  }

  const handleEditOpen = (item: CommissionItem) => {
    setModalMode("edit")
    setSelected(item)
    setModalOpen(true)
  }

  const handleSubmit = (payload: CommissionFormValues) => {
    if (modalMode === "create") {
      addItem({
        serviceName: payload.serviceName,
        projectValue: payload.projectValue,
        commissionPercentage: Number(payload.commissionPercentage) || 0,
        description: payload.description,
      })
      return
    }

    if (selected) {
      updateItem(selected.id, {
        serviceName: payload.serviceName,
        projectValue: payload.projectValue,
        commissionPercentage: Number(payload.commissionPercentage) || selected.commissionPercentage,
        description: payload.description,
      })
    }
  }

  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header title="Commission Control" label="Partnership Program" />

      <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search here"
                className="w-full rounded-full border border-slate-200 py-6 pl-12 pr-6 text-base"
              />
            </div>
            <Button
              variant="addData"
              className="h-12 rounded-full px-6 text-base font-semibold"
              onClick={handleCreateOpen}
            >
              + Add New Service
            </Button>
          </div>

          <div className="mt-3">
            <CommissionControlTable items={items} onEdit={handleEditOpen} />
          </div>
      </section>

      <CommissionServiceModal
        open={modalOpen}
        mode={modalMode}
        initialData={selected}
        serviceOptions={serviceOptions}
        onSubmit={handleSubmit}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}

export default CommissionControlContent
