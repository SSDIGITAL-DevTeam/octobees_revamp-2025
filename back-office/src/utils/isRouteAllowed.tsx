import { sidebarItems } from "@/constrant/navlinks";

export default function isRouteAllowed(pathname: string, _features: string[]) {
  const allRoutes = sidebarItems.flatMap(item => item.data.map(d => d.url));
  
  const isKnownRoute = allRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );

  if (isKnownRoute) {
    return true;
  }

  return pathname.startsWith("/dashboard") || pathname.startsWith("/lead");
}
