"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  Database,
  FileCheck,
  LayoutDashboard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Logo from "@/asset/logo/webp/asset-logo-with-text.webp";
import { LogoutDialog } from "@/components/partials/dialog/LogoutDialog";
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
  useSidebar,
} from "@/components/ui/sidebar";

type RecruitmentSidebarChild = {
  title: string;
  url: string;
  children?: RecruitmentSidebarChild[];
};

type RecruitmentSidebarItem = RecruitmentSidebarChild & {
  icon: LucideIcon;
};

const recruitmentSidebarItems: {
  group: string;
  data: RecruitmentSidebarItem[];
}[] = [
  {
    group: "Partner Recruitment System",
    data: [
      {
        title: "Dashboard",
        url: "/partner-recruitment-system",
        icon: LayoutDashboard,
      },
      {
        title: "Recruitment Management",
        url: "/partner-recruitment-system/recruitment-management",
        icon: FileCheck,
      },
      {
        title: "Sales Portal Management",
        url: "/partner-recruitment-system/sales-portal-management",
        icon: BriefcaseBusiness,
        children: [
          {
            title: "Product & Service",
            url: "/partner-recruitment-system/sales-portal-management/product-service",
          },
          {
            title: "Commission Setting",
            url: "#",
            children: [
              {
                title: "Disbursement",
                url: "/partner-recruitment-system/sales-portal-management/disbursement",
              },
              {
                title: "Initial Commission",
                url: "/partner-recruitment-system/sales-portal-management/initial-commission",
              },
              {
                title: "Basic Commission",
                url: "/partner-recruitment-system/sales-portal-management/basic-commission",
              },
              {
                title: "Sales Commission",
                url: "/partner-recruitment-system/sales-portal-management/sales-commission",
              },
            ],
          },
          {
            title: "Terms & Conditions",
            url: "/partner-recruitment-system/sales-portal-management/terms-and-conditions",
          },
        ],
      },
      {
        title: "Master Data",
        url: "/partner-recruitment-system/master-data",
        icon: Database,
        children: [
          {
            title: "Pipeline Status",
            url: "/partner-recruitment-system/master-data/pipeline-status",
          },
        ],
      },
    ],
  },
];

export function PartnerRecruitmentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [openSalesPortalMenu, setOpenSalesPortalMenu] = useState(
    pathname.startsWith("/partner-recruitment-system/sales-portal-management"),
  );
  const [openMasterDataMenu, setOpenMasterDataMenu] = useState(
    pathname.startsWith("/partner-recruitment-system/master-data"),
  );

  const isMenuActive = (url: string) => {
    if (url === "/partner-recruitment-system") {
      return pathname === url;
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  useEffect(() => {
    if (
      pathname.startsWith("/partner-recruitment-system/sales-portal-management")
    ) {
      setOpenSalesPortalMenu(true);
      return;
    }

    setOpenSalesPortalMenu(false);
    setOpenMasterDataMenu(pathname.startsWith("/partner-recruitment-system/master-data"));
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader className="px-8 pt-8 flex flex-row items-center justify-between">
        <Image
          src={Logo.src}
          alt="Logo DIGITAL-PA"
          width={1000}
          height={1000}
          className="object-contain w-[12rem]"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pb-0 pt-2">
          <SidebarGroupContent>
            <button
              type="button"
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                router.push("/dashboard");
              }}
              className="flex mt-6 h-11 w-full items-center gap-3 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {recruitmentSidebarItems.map((item, index) => (
            <div key={index}>
              <SidebarGroupLabel>{item.group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.data.map((it, itemIndex) => (
                    <SidebarMenuItem key={itemIndex}>
                      {it.children ? (
                        <>
                          <SidebarMenuButton
                            type="button"
                            onClick={() => {
                              if (it.url.includes("/master-data")) {
                                setOpenMasterDataMenu((current) => !current);
                                setOpenSalesPortalMenu(false);
                                return;
                              }
                              setOpenSalesPortalMenu((current) => !current);
                              setOpenMasterDataMenu(false);
                            }}
                            className={`${isMenuActive(it.url) && "rounded-full text-red-700 font-semibold bg-red-700/20 border-[1px] border-red-700"}`}
                          >
                            <it.icon size={15} />
                            <span>{it.title}</span>
                            <ChevronDown
                              size={15}
                              className={`ml-auto transition-transform ${
                                (it.url.includes("/master-data") ? openMasterDataMenu : openSalesPortalMenu)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </SidebarMenuButton>

                          {(it.url.includes("/master-data") ? openMasterDataMenu : openSalesPortalMenu) ? (
                            <div className="mt-1 space-y-1 pl-[19px]">
                              {it.children.map((child) => {
                                if (child.children) {
                                  // Nested submenu logic (e.g. Commission Setting)
                                  const isNestedActive = child.children.some(c => isMenuActive(c.url));
                                  return (
                                    <div key={child.title} className="space-y-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const el = document.getElementById(`nested-${child.title.replace(/\s+/g, '-')}`);
                                          if (el) {
                                            el.classList.toggle('hidden');
                                            const icon = document.getElementById(`nested-icon-${child.title.replace(/\s+/g, '-')}`);
                                            if (icon) icon.classList.toggle('rotate-90');
                                          }
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50 ${isNestedActive ? "text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <ChevronRight id={`nested-icon-${child.title.replace(/\s+/g, '-')}`} size={14} className={isNestedActive ? "rotate-90 transition-transform" : "transition-transform"} />
                                          <span>{child.title}</span>
                                        </div>
                                      </button>
                                      
                                      <div id={`nested-${child.title.replace(/\s+/g, '-')}`} className={`space-y-0.5 ml-[19px] border-l border-slate-200 py-1 ${isNestedActive ? '' : 'hidden'}`}>
                                        {child.children.map((nestedChild) => (
                                          <Link
                                            key={nestedChild.url}
                                            href={nestedChild.url}
                                            onClick={() => {
                                              if (isMobile) setOpenMobile(false);
                                            }}
                                            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 ml-2 text-[13px] transition hover:bg-slate-50 ${
                                              isMenuActive(nestedChild.url)
                                                ? "bg-red-50 font-semibold text-red-700"
                                                : "text-slate-500 hover:text-slate-900"
                                            }`}
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full border border-current opacity-50 shrink-0" />
                                            <span>{nestedChild.title}</span>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <Link
                                    key={child.url}
                                    href={child.url}
                                    onClick={() => {
                                      if (isMobile) setOpenMobile(false);
                                    }}
                                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-slate-50 ${
                                      isMenuActive(child.url)
                                        ? "bg-red-50 font-semibold text-red-700"
                                        : "text-slate-600 hover:text-slate-900"
                                    }`}
                                  >
                                    <ChevronRight size={14} />
                                    <span>{child.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          onClick={() => {
                            if (isMobile) setOpenMobile(false);
                            setOpenSalesPortalMenu(false);
                            setOpenMasterDataMenu(false);
                          }}
                          className={`${isMenuActive(it.url) && "rounded-full text-red-700 font-semibold bg-red-700/20 border-[1px] border-red-700"}`}
                        >
                          <Link
                            href={it.url}
                            className="flex gap-3 items-center"
                          >
                            <it.icon size={15} />
                            <p>{it.title}</p>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <LogoutDialog>Logout</LogoutDialog>
      </SidebarFooter>
    </Sidebar>
  );
}

export default PartnerRecruitmentSidebar;
