import { pageMetadata } from "@/constants/metadata";
import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { ReactNode } from "react";

export async function generateMetadata() {
  const metaTag = pageMetadata.contact;
  return buildMetadata({
    title: metaTag.title,
    description: metaTag.description,
    keywords: metaTag.keywords,
    path: "/contact-us",
    locale: metaTag.openGraph.locale,
    openGraphOverride: metaTag.openGraph,
    twitterOverride: metaTag.twitter,
    cmsPath: "contact-us",
  });
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
