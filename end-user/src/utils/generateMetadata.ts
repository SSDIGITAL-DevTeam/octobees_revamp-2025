import { MetadataProps } from "@/constants/metadata";
import { axiosInstance } from "@/lib/axios";
import { Metadata } from "next";

type generateMetadataProps = {
  location: string;
  metaTag: MetadataProps;
};

const generateMetatag = async ({
  location,
  metaTag,
}: generateMetadataProps): Promise<Metadata> => {
  try {
    const res = await axiosInstance.get(`/meta/${location}`);
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta/${location}`, {
    //   cache: "no-store",
    // });
    // const meta = await res.json();

    if (!res?.data?.meta) return metaTag;

    const getValue = (key: string) =>
      res?.data?.meta.find((item: any) => item.value === key)?.content?.trim() || "";

    const title = getValue("title") || metaTag.title;
    const description = getValue("description") || metaTag.description;
    const keywordsRaw = getValue("keywords");

    const keywords = keywordsRaw
      ? keywordsRaw.split(",").map((item: string) => item.trim())
      : metaTag.keywords;

    return {
      metadataBase: metaTag.metadataBase,
      title,
      description,
      keywords,
      icons: metaTag.icons,
      openGraph: {
        title,
        description,
        images: metaTag.openGraph.images,
      },
    };
  } catch (error) {
    return metaTag;
  }
};

export default generateMetatag;
