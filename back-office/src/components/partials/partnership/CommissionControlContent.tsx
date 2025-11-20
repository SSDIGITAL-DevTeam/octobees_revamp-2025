"use client"

import { Search } from "lucide-react"

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCommissionControl } from "@/hooks/partnership/useCommissionControl"
import { CommissionControlTable } from "./CommissionControlTable"

export const CommissionControlContent = () => {
  const { search, setSearch, items } = useCommissionControl()

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
            <Button variant="addData" className="h-12 rounded-full px-6 text-base font-semibold">
              + Add New Service
            </Button>
          </div>

          <div className="mt-3">
            <CommissionControlTable items={items} />
          </div>
      </section>
    </main>
  )
}

export default CommissionControlContent
