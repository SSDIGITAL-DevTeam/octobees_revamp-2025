'use client'
import { User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
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
import { useEffect, useState } from "react"
import { useAuthStore } from "@/app/store/login"

// Menu items.
const items = [
  {
    group: "Dashboard",
    data: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: User,
      }
    ],
  },
  {
    group: "User Management",
    data: [
      {
        title: "User",
        url: "/user",
        icon: User,
      }
    ],
  },
  {
    group: "Blog Management",
    data: [
      {
        title: "Blogs",
        url: "/blog/blogs",
        icon: User,
      },
      {
        title: "Blog Category",
        url: "/blog/blog-category",
        icon: User,
      }
    ],
  },
  {
    group: "Service Management",
    data: [
      {
        title: "Services Category",
        url: "/services/categories",
        icon: User,
      },
      {
        title: "Services Package",
        url: "/services/packages",
        icon: User,
      },
    ],
  },
  {
    group: "Others",
    data: [
      {
        title: "Meta Content Management",
        url: "/meta",
        icon: User,
      }
    ],
  },
]


export function Sidebarcomponents() {
  const pathname = usePathname()
  const router = useRouter()
  const [hasToken, setHasToken] = useState<boolean | null>(null)
  const tokenName = useAuthStore((state) => state.name);

// useEffect(() => {
//   if (tokenName) {
//     setHasToken(true);
//     return;
//   }

//   const token = sessionStorage.getItem("token");
//   if (!token) {
//     router.push("/login");
//   } else {
//     setHasToken(true);
//   }
// }, [tokenName]);

// if (!hasToken) return null;

  
  return (
    <Sidebar>
      <SidebarHeader className="px-8 pt-8 flex flex-row items-center justify-between">
        <Image src={Logo.src} alt="Logo Octobees" width={1000} height={1000} className="object-contain w-[12rem]" />

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {
            items.map((d, i) => (
              <div key={i}>
                <SidebarGroupLabel>{d.group}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {
                      d.data.map((it, index: number) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton asChild className={`${pathname.startsWith(it.url) && "rounded-full text-red-700 font-semibold bg-red-700/20 border-[1.2px] border-red-700"}`}>
                            <a href={it.url} className="flex gap-2 items-center">
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
    </Sidebar>
  )
}
