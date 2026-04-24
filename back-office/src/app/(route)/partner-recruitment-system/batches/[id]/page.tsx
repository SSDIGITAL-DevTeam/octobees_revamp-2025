"use client"

import PartnerRecruitmentBatchDetailContent from "@/components/partials/partner-recruitment/PartnerRecruitmentBatchDetailContent"

export default function PartnerRecruitmentBatchDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <PartnerRecruitmentBatchDetailContent batchId={params.id} />
}
