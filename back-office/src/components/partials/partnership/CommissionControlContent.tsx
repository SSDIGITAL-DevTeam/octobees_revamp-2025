"use client"

import { useState } from "react"

import Header from "@/components/layout/header/Header"
import { CommissionControlTable } from "./CommissionControlTable"
import { CommissionServiceModal } from "./CommissionServiceModal"
import type { PartnerServiceApiItem } from "@/lib/api/partnership/dashboardPartnership"

export const CommissionControlContent = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selected, setSelected] = useState<PartnerServiceApiItem | null>(null)

  const handleCreateOpen = () => {
    setSelected(null)
    setModalOpen(true)
  }

  const handleEditOpen = (item: PartnerServiceApiItem) => {
    setSelected(item)
    setModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey((current) => current + 1)
  }

  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header title="Commission Control" label="Partnership Program" />

      <section className="flex flex-col gap-3">
        <div className="mt-3">
          <CommissionControlTable
            key={refreshKey}
            onRefresh={handleSuccess}
            onAddNew={handleCreateOpen}
            onEdit={handleEditOpen}
          />
        </div>
      </section>

      <CommissionServiceModal
        open={modalOpen}
        initialData={selected}
        onSuccess={handleSuccess}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}

export default CommissionControlContent
