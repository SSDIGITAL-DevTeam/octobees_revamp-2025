import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebarcomponents } from "@/components/partials/sidebar/SidebarComponents";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        <Sidebarcomponents />
        <div className="bg-slate-50 w-full px-2 md:px-12">
          {children}
        </div>
        <Toaster />
      </SidebarProvider>
    </>
  )
}