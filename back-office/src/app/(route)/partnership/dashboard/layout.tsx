import { Suspense } from "react"

export default function PartnershipDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
