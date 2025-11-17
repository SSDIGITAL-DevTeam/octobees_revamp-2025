import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return buildMetadata({
    title: "Search Insights | Octobees",
    description:
      "Refine your search results to uncover marketing, automation, and branding insights tailored to your query.",
    path: `/insights/search/${params.id}`,
    cmsPath: "insights",
    noindex: true,
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
