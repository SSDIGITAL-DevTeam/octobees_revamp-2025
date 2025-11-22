"use client"

import Header from "@/components/layout/header/Header"
import PartnerLeadTable from "@/components/partials/partnership/PartnerLeadTable"
import PartnerStatCard from "@/components/partials/partnership/PartnerStatCard"
import { Switch } from "@/components/ui/switch"
import ImgCoinIcon from "@/asset/card/svg/coin-icon.svg"
import ImgStopwatchIcon from "@/asset/card/svg/stopwatch-icon.svg"
import ImgGroupIcon from "@/asset/card/svg/group-icon.svg"
import ImgSingleIcon from "@/asset/card/svg/single-icon.svg"
import { usePartnerDetail } from "@/hooks/partnership/usePartnerDetail"

type PartnerDetailPageProps = {
  params: { slug: string }
}

export default function PartnerDetailPage({ params }: PartnerDetailPageProps) {
  const partner = usePartnerDetail(params.slug)

  if (!partner) {
    return (
      <main className="flex w-full flex-col gap-6 pb-12">
        <Header title="Partner Detail" breadcrumbs={[{ label: "Partners", href: "/partnership/partners" }]} />
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <p className="text-slate-600">Partner tidak ditemukan.</p>
        </div>
      </main>
    )
  }

  const { stats } = partner
  const statItems = [
    {
      title: "Total Commission",
      value: stats.totalCommission,
      helper: stats.totalCommissionHelper,
      image: ImgCoinIcon,
    },
    {
      title: "Pending Commission",
      value: stats.pendingCommission,
      helper: stats.pendingHelper,
      image: ImgStopwatchIcon,
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      helper: stats.totalLeadsHelper,
      image: ImgGroupIcon,
    },
    {
      title: "Closed Leads",
      value: stats.closedLeads,
      helper: stats.closedHelper,
      image: ImgSingleIcon,
    },
  ]

  return (
    <main className="flex w-full flex-col gap-8 pb-12">
      <Header
        title="Partner Detail"
        breadcrumbs={[
          { label: "Partners", href: "/partnership/partners" },
          { label: "Partner Detail" },
        ]}
      />

      <section className="space-y-6">
        <div className="rounded-[26px] border border-border bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xl font-semibold text-slate-950">Detail : {partner.fullName}</p>
              <div className="grid gap-3 text-sm text-slate-800 md:grid-cols-4 md:gap-6">
                <div>
                  <p className="text-slate-600">Full Name</p>
                  <p className="font-semibold text-slate-900">{partner.fullName}</p>
                </div>
                <div>
                  <p className="text-slate-600">Email Address</p>
                  <p className="font-semibold text-slate-900">{partner.email}</p>
                </div>
                <div>
                  <p className="text-slate-600">Phone</p>
                  <p className="font-semibold text-slate-900">{partner.phone}</p>
                </div>
                <div>
                  <p className="text-slate-600">Country of Residence</p>
                  <p className="font-semibold text-slate-900">{partner.country}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-slate-700">Affiliator Status</p>
              <div className="flex items-center gap-2">
                <Switch checked={partner.affiliateStatus === "Active"} disabled />
                <span className="text-sm font-semibold text-red-700">{partner.affiliateStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xl font-semibold text-slate-900">{partner.fullName}&apos;s Overview</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
              <PartnerStatCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[26px] border border-border bg-white p-6 shadow-sm px-8 py-8">
          <p className="text-xl font-semibold text-slate-900">Leads From {partner.fullName}</p>
          <PartnerLeadTable leads={partner.leads} />
        </div>
      </section>
    </main>
  )
}
