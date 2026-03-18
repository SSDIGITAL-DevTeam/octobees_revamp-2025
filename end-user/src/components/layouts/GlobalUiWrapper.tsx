"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

interface GlobalUiWrapperProps {
  children: ReactNode;
  navbar?: ReactNode;
  footer?: ReactNode;
}

export default function GlobalUiWrapper({ children, navbar, footer }: GlobalUiWrapperProps) {
  const pathname = usePathname();

  const hiddenRoutes = ["/client-login", "/onboarding-kit", "/profile"];
  const isHiddenRoute = hiddenRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isHiddenRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {navbar}
      {children}
      {footer}
    </div>
  );
}
