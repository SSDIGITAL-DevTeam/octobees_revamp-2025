import { sidebarItems } from "@/constrant/navlinks";

export default function isRouteAllowed(pathname: string, features: string[]) {
  const allRoutes = sidebarItems.flatMap(item => item.data.map(d => d.url));
  const isKnownRoute = allRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));
  
  if (!isKnownRoute) {
    return true;
  }

  const normalizedFeatures = features.length > 0 ? features : ["dashboard", "partnership"];

  const routeFeatureMap: Record<string, string[]> = {
    user: ["/user"],
    blog: ["/blog"],
    services: ["/services"],
    meta: ["/meta"],
    position: ["/position"],
    career: ["/career"],
    subscription: ["/subscription", "/affiliate-program"],
    partnership: ["/partnership", "/partner-recruitment-system"],
    dashboard: ["/dashboard"],
    lead: ["/lead"],
  };

  for (const feature of normalizedFeatures) {
    const prefixes = routeFeatureMap[feature];
    if (prefixes?.some(prefix => pathname.startsWith(prefix) || pathname === prefix)) {
      return true;
    }
  }

  if (normalizedFeatures.includes("dashboard") || normalizedFeatures.includes("partnership")) {
    return true;
  }

  return false;
}
