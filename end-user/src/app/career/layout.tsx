import { pageMetadata } from "@/constants/metadata";
import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { ReactNode } from "react";

export async function generateMetadata() {
  const metaTag = pageMetadata.career;
  return buildMetadata({
    title: metaTag.title,
    description: metaTag.description,
    keywords: metaTag.keywords,
    path: "/career",
    locale: metaTag.openGraph.locale,
    openGraphOverride: metaTag.openGraph,
    twitterOverride: metaTag.twitter,
    cmsPath: "career",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
