import { Suspense } from "react"

export default function PendingCommissionPaymentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
