import { Suspense } from "react"

export default function LeadsManagementLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
