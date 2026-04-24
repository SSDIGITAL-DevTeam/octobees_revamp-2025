"use client"

import PartnerListDetailContent from "@/components/partials/partnership/PartnerListDetailContent"

export default function PartnerListDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <PartnerListDetailContent partnerId={params.id} />
}
