"use client"

import AffiliateDetailContent from "@/components/partials/partner-recruitment/AffiliateDetailContent"

export default function BatchApplicantDetailPage({
  params,
}: {
  params: { id: string; applicantId: string }
}) {
  return (
    <AffiliateDetailContent
      applicationId={params.applicantId}
      batchId={params.id}
    />
  )
}
