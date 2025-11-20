import { Suspense } from "react"

export default function CommissionControlLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div />}>{children}</Suspense>
}
