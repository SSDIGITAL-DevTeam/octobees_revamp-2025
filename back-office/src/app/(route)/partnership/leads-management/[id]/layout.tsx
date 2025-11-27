import { Suspense } from "react"

export default function LeadDetailLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
