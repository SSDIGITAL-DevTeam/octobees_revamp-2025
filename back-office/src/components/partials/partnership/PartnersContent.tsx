"use client"

import Header from "@/components/layout/header/Header"
import { usePartners } from "@/hooks/partnership/usePartners"
import type { PartnerStatus } from "@/constrant/partnership"
import { PartnersFilterBar } from "./PartnersFilterBar"
import { PartnersTable } from "./PartnersTable"

export const PartnersContent = () => {
  const { partners, search, setSearch, status, setStatus, statusOptions } = usePartners()

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header title="Partners" label="Partnership Program" />

      <section className="flex flex-col gap-2">
          <PartnersFilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={(value) => setStatus(value as PartnerStatus | "all")}
            statusOptions={statusOptions}
          />

          <div className="mt-8">
            <PartnersTable partners={partners} />
          </div>
      </section>
    </main>
  )
}

export default PartnersContent
