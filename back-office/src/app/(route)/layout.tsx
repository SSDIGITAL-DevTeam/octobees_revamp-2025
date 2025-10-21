"use client"
import React, { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Sidebarcomponents } from "@/components/partials/sidebar/SidebarComponents"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"
import { useAuthStore } from "../store/login"
import { toast } from "sonner"
import RouteGuard from "@/components/layout/wrapper/RouteGuard"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [hasToken, setHasToken] = useState<boolean>(false)
  const setToken = useAuthStore((state) => state.setToken)
  const features = useAuthStore((state) => state.features)

  useEffect(() => {
    const token = sessionStorage.getItem("token")

    if (!token) {
      router.push("/auth/login")
      return
    }

    try {
      setToken(token)
      setHasToken(true)
    } catch (error) {
      toast.error("Invalid token, please login again")
      router.push("/auth/login")
    }
  }, [])

  if (!hasToken) return null
  return (
    <>
      <SidebarProvider>
        <Sidebarcomponents features={features} />
        <div className="bg-slate-50 w-full px-2 md:px-12">
          <RouteGuard features={features}>{children}</RouteGuard>
        </div>
        <Toaster />
      </SidebarProvider>
    </>
  )
}
