import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return buildMetadata({
    title: "Insights Category | Octobees",
    description:
      "Explore curated marketing technology and branding articles grouped by topic.",
    path: `/insights/category/${params.id}`,
    cmsPath: "insights",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
