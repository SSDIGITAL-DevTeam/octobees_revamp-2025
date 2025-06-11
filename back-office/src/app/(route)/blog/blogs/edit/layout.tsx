import { ReactNode, Suspense } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div></div>}>{children}</Suspense>;
}
