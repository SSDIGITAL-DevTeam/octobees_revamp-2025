import { pageMetadata } from "@/constants/metadata";
import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const metaTag = pageMetadata.insights;
  return buildMetadata({
    title: metaTag.title,
    description: metaTag.description,
    keywords: metaTag.keywords,
    path: `/insights/${params.slug}`,
    locale: metaTag.openGraph.locale,
    openGraphOverride: metaTag.openGraph,
    twitterOverride: metaTag.twitter,
    cmsPath: params.slug,
  });
}
export default function Layout({ children }: { children: ReactNode }) {
  return (
      <>{children}</>
  )
}
