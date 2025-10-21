'use client'
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "@/asset/sidebar/webp/logo-lengkap.webp"
import Image from "next/image"
import { LogoutDialog } from '@/components/partials/dialog/LogoutDialog';
import { sidebarItems } from "@/constrant/navlinks";


type SidebarComponentsProps = {
  features?: string[] | null
}

export function Sidebarcomponents({ features }: SidebarComponentsProps) {
  const pathname = usePathname()
  const featureList = Array.isArray(features) ? features : []
  const allowedSidebarItems = sidebarItems.filter(
    (item) => item.name === "dashboard" || featureList.includes(item.name)
  );

  return (
    <Sidebar>
      <SidebarHeader className="px-8 pt-8 flex flex-row items-center justify-between">
        <Image src={Logo.src} alt="Logo Octobees" width={1000} height={1000} className="object-contain w-[12rem]" />

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {
            allowedSidebarItems.map((item, i) => (
              <div key={i}>
                <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {
                      item.data.map((it, index: number) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton asChild className={`${pathname.startsWith(it.url) && "rounded-full text-red-700 font-semibold bg-red-700/20 border-[1px] border-red-700"}`}>
                            <a href={it.url} className="flex gap-3 items-center">
                              <it.icon size={15} />
                              <p>{it.title}</p>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </div>
            ))
          }
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutDialog>Logout</LogoutDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
