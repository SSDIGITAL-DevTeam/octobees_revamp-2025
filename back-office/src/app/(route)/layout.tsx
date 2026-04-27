"use client"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebarcomponents } from "@/components/partials/sidebar/SidebarComponents"
import { PartnerRecruitmentSidebar } from "@/components/partials/partner-recruitment/PartnerRecruitmentSidebar"
import { Toaster } from "@/components/ui/sonner"
import { useAuthStore } from "../store/login"
import { toast } from "sonner"
import RouteGuard from "@/components/layout/wrapper/RouteGuard"
import { syncCurrencyFromServer } from "../store/currency"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [hasToken, setHasToken] = useState<boolean>(false)
  const setToken = useAuthStore((state) => state.setToken)
  const features = useAuthStore((state) => state.features)
  const isPartnerRecruitmentModule = pathname.startsWith("/partner-recruitment-system")

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      router.push("/auth/login")
      return
    }

    try {
      setToken(token)
      setHasToken(true)
      void syncCurrencyFromServer({ force: true })
    } catch (error) {
      toast.error("Invalid token, please login again")
      router.push("/auth/login")
    }
  }, [])

  if (!hasToken) return null
  return (
    <>
      <SidebarProvider>
        {isPartnerRecruitmentModule ? (
          <PartnerRecruitmentSidebar />
        ) : (
          <Sidebarcomponents features={features} />
        )}
        <div className="bg-slate-50 w-full px-2 md:px-12">
          <RouteGuard features={features}>{children}</RouteGuard>
        </div>
        <Toaster />
      </SidebarProvider>
    </>
  )
}
