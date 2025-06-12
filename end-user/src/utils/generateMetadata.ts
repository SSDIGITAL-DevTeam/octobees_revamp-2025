import {
  PageMetadataProps,
  defaultMetadata as metadata,
} from "@/constants/metadata";
import { MetaTag } from "@/constants/payload";
import { axiosInstance } from "@/lib/axios";
import { Metadata } from "next";

type generateMetadataProps = {
  location: string;
  metaTag: PageMetadataProps;
};

type OgTypeType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

type TwitterCardType = "summary_large_image" | "summary" | "player" | "app";

const generateMetatag = async ({
  location,
  metaTag,
}: generateMetadataProps): Promise<Metadata> => {
  try {
    const res = await axiosInstance.get(`/page/${location}`, { timeout: 5000 });
    const meta = res?.data?.data?.meta as MetaTag[];
    if (meta.length === 0) return { ...metadata, ...metaTag };

    const getValue = (key: string) =>
      meta.find((item) => item.value === key)?.content?.trim() || "";

    const title = getValue("title") || metaTag.title;
    const description = getValue("description") || metaTag.description;
    const keywordsRaw = getValue("keywords");
    const icons = getValue("icon") || metadata.icons.icon;
    const shortcutIcon = getValue("shortcut:icon") || metadata.icons.shortcut;
    const appleIcon = getValue("apple:icon") || metadata.icons.apple;
    const robots = getValue("robot") || metadata.robots;
    const authors = getValue("authors") || metadata.authors;
    const creator = getValue("creator") || metadata.creator;
    const publisher = getValue("publisher") || metadata.publisher;
    const canonical = getValue("canonical") || metadata.alternates.canonical;

    const ogTitle = getValue("og:title") || metaTag.openGraph.title;
    const ogDescription =
      getValue("og:description") || metaTag.openGraph.description;
    const ogUrl = getValue("og:url") || metaTag.openGraph.url;
    const ogSiteName = getValue("og:site_name") || metaTag.openGraph.siteName;
    const ogImages = getValue("og:images") || metaTag.openGraph.images;
    const ogType = getValue("og:type") || metaTag.openGraph.type;
    const ogLocale = getValue("og:locale") || metaTag.openGraph.locale;

    const twitterCard = getValue("twitter:card") || metaTag.twitter.card;
    const twitterTitle = getValue("twitter:title") || metaTag.twitter.title;
    const twitterDescription =
      getValue("twitter:description") || metaTag.twitter.description;
    const twitterSite = getValue("twitter:site") || metaTag.twitter.site;
    const twitterCreator =
      getValue("twitter:creator") || metaTag.twitter.creator;
    const twitterImageRaw = getValue("twitter:images");

    const applicationName =
      getValue("application-name") || metadata.applicationName;

    const keywords = keywordsRaw
      ? keywordsRaw.split(",").map((item: string) => item.trim())
      : metaTag.keywords;
    const twitterImage = twitterImageRaw
      ? twitterImageRaw.split(",").map((item: string) => item.trim())
      : metaTag.twitter.images;

    return {
      robots,
      authors: Array.isArray(authors) ? authors : metadata.authors,
      creator,
      publisher,
      alternates: {
        canonical: canonical,
      },

      icons: {
        icon: icons,
        shortcut: shortcutIcon,
        apple: appleIcon,
        other: metadata.icons.other,
      },

      applicationName,
      generator: metadata.generator,

      metadataBase: metaTag.metadataBase,
      title,
      description,
      keywords,

      openGraph: {
        title: ogTitle,
        description: ogDescription,
        images: ogImages,
        url: ogUrl,
        siteName: ogSiteName,
        type: ogType as OgTypeType,
        locale: ogLocale,
      },

      twitter: {
        card: twitterCard as TwitterCardType,
        title: twitterTitle,
        description: twitterDescription,
        site: twitterSite,
        creator: twitterCreator,
        images: twitterImage,
      },
    };
  } catch (error: any) {
    return {
      ...metadata,
      ...metaTag,
    };
  }
};

export default generateMetatag;
