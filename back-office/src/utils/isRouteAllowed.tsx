export default function isRouteAllowed(pathname: string, features: string[]) {
  // Mapping route ke fitur
  const routeFeatureMap: Record<string, string[]> = {
    user: ["/user"],
    blog: ["/blog"],
    services: ["/services"],
    meta: ["/meta"],
    position: ["/position"],
    career: ["/career"],
    subscription: ["/subscription", "/affiliate-program"],
  };
  if (pathname === "/dashboard") return true;

  for (const feature of features) {
    const prefixes = routeFeatureMap[feature];
    if (prefixes?.some((prefix) => pathname.startsWith(prefix))) {
      return true;
    }
  }
  return false;

}
