export default function isRouteAllowed(pathname: string, features: string[]) {
  const routeFeatureMap: Record<string, string[]> = {
    user: ["/user"],
    blog: ["/blog"],
    services: ["/services"],
    meta: ["/meta"],
    position: ["/position"],
    career: ["/career"],
    subscription: ["/subscription", "/affiliate-program"],
    partnership: ["/partnership", "/partner-recruitment-system"],
  };

  const exactRoutes = ["/dashboard", "/lead", "/lead/client-onboarding", "/lead/onboarding-videos"];

  if (exactRoutes.includes(pathname) || pathname.startsWith("/dashboard/") || pathname.startsWith("/lead/")) {
    return true;
  }

  for (const feature of features) {
    const prefixes = routeFeatureMap[feature];
    if (prefixes?.some((prefix) => pathname.startsWith(prefix) || pathname === prefix)) {
      return true;
    }
  }
  return false;
}
