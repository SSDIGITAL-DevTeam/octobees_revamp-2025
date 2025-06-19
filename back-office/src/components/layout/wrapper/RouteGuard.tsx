'use client';

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import isRouteAllowed from "@/utils/isRouteAllowed";

export default function RouteGuard({ features, children }: {
  features: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const allowed = isRouteAllowed(pathname, features);
    if (!allowed) {
      router.push("/dashboard");
    }
  }, [pathname, features]);

  return <>{children}</>;
}
