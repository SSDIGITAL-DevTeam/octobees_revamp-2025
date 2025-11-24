import { Suspense } from "react"

export default function PartnerDetailLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
