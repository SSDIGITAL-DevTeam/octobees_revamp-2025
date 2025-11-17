import Image from "next/image";
import { CircleUser } from "lucide-react";
import type { Metadata } from "next";

import BackArticleButton from "@/components/partials/Button/ButtonBackArticle";
import ShareSocmedButton from "@/components/partials/Button/ButtonShareSocmed";
import AdsCarousel from "@/app/insights/[slug]/_components/AdsCarousel";
import { InsightContent } from "@/app/insights/_components";
import dayjs from "dayjs";
import { Blog } from "@/constants/payload";
import ImageInsightContent from "@/assets/insights/webp/image-insights-subscription-content.webp";
import FormSubscription from "./_components/FormSubscription";
import { notFound } from "next/navigation";
import { getInsightByCategory, getInsightBySlug } from "@/services/insight.service";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ArticleSchema from "@/app/seo/schema/ArticleSchema";
import BreadcrumbSchema from "@/app/seo/schema/BreadcrumbSchema";
import RelatedArticles from "./_components/RelatedArticles";
import RelatedServices from "./_components/RelatedServices";
import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";

type SlugInsightPageProps = {
  params: {
    slug: string
  }
}

export const revalidate = 1800;

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const buildAbsoluteUrl = (path: string) => {
  const baseSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  if (!path) return baseSiteUrl ? `${baseSiteUrl}/default-og.png` : "/default-og.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (baseSiteUrl) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${baseSiteUrl}${normalized}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
};

const buildUploadUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  const uploadBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (!uploadBase) return null;
  return `${uploadBase}/uploads/${imagePath}`;
};

const getMetaContent = (blog: Blog | null, value: string, fallbacks: string[] = []) => {
  const metas = blog?.metas ?? [];
  const primary = metas.find((meta) => meta.value === value)?.content?.trim();
  if (primary) return primary;
  for (const fallback of fallbacks) {
    const alt = metas.find((meta) => meta.value === fallback)?.content?.trim();
    if (alt) return alt;
  }
  return "";
};

export async function generateMetadata({ params }: SlugInsightPageProps): Promise<Metadata> {
  const fallback = {
    title: "Insights Blog",
    description: "Stay updated with the latest insights from our blog.",
  };

  try {
    const blog = await getInsightBySlug(params.slug);
    if (!blog) {
      return buildMetadata({
        ...fallback,
        path: `/insights/${params.slug}`,
        cmsPath: params.slug,
      });
    }

    const rawTitle = getMetaContent(blog, "title") || blog.title || fallback.title;
    const rawDescription =
      getMetaContent(blog, "description") ||
      (blog.content ? stripHtml(blog.content).slice(0, 160) : "");
    const description = rawDescription || fallback.description;
    const keywordString =
      getMetaContent(blog, "keyword", ["keywords"]) || blog.category?.name || "";
    const keywords = keywordString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const ogImageMeta =
      getMetaContent(blog, "og:image") ||
      getMetaContent(blog, "twitter:image") ||
      buildUploadUrl(blog.image) ||
      "/default-og.png";

    const ogImage = buildAbsoluteUrl(ogImageMeta);

    return buildMetadata({
      title: rawTitle,
      description,
      keywords,
      path: `/insights/${params.slug}`,
      locale: "en-US",
      openGraphOverride: {
        title: rawTitle,
        description,
        type: "article",
        images: [
          {
            url: ogImage,
            alt: rawTitle,
          },
        ],
      },
      twitterOverride: {
        card: "summary_large_image",
        title: rawTitle,
        description,
        images: [ogImage],
      },
      cmsPath: params.slug,
    });
  } catch {
    return buildMetadata({
      ...fallback,
      path: `/insights/${params.slug}`,
      cmsPath: params.slug,
    });
  }
}

export default async function ArticleDetail({ params }: SlugInsightPageProps) {
  let blog: Blog | null = null;
  let relatedBlog: Blog[] = [];

  try {
    blog = await getInsightBySlug(params.slug);
    const response = await getInsightByCategory(blog?.categoryId || "", 3);
    relatedBlog = response.data;
  } catch (error) {
    return notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.octobees.com";
  const breadcrumbSegments = blog
    ? [
        { label: "Insights", href: "/insights" },
        {
          label: blog.category.name,
          href: `/insights/category/${blog.category.slug}`,
        },
        { label: blog.title },
      ]
    : [{ label: "Insights", href: "/insights" }];

  return (
    <main className="flex flex-col gap-10 lg:gap-20 md:max-w-7xl md:mx-auto md:min-h-screen py-20 pt-28 md:pt-44 px-5 md:px-10 lg:px-5 bg-white relative">
      {blog && (
        <>
          <ArticleSchema article={blog} />
          <BreadcrumbSchema
            items={[
              { name: "Home", item: siteUrl },
              { name: "Insights", item: `${siteUrl}/insights` },
              {
                name: blog.category.name,
                item: `${siteUrl}/insights/category/${blog.category.slug}`,
              },
              {
                name: blog.title,
                item: `${siteUrl}/insights/${blog.slug}`,
              },
            ]}
          />
        </>
      )}
      <BackArticleButton />
      {
        blog && (
          <div className="container lg:max-w-3xl mx-auto flex flex-col gap-8 lg:gap-y-12">
            <Breadcrumbs segments={breadcrumbSegments} />
            <div className="space-y-6 w-full">

              <p className="text-center w-fit mx-auto bg-gray-200/80 text-xs lg:text-sm capitalize rounded-3xl font-medium py-2 px-4 text-gray-800 flex items-center gap-2 shadow-sm max-w-[90%]">
                {blog.category.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-primary text-center md:text-left !leading-[140%] font-heading">
                {blog.title}
              </h1>
              <div className="space-y-3 md:space-y-5">
                <div className="flex items-center bg-white w-full gap-3 lg:gap-4">
                  <CircleUser className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  <div className="flex flex-col justify-center lg:gap-[1px] gap-[2px] h-full">
                    <p className="text-sm lg:text-base capitalize font-medium text-gray-800">
                      {blog.user.name}
                    </p>
                    <p className="font-normal text-xs lg:text-sm text-gray-400">{dayjs(blog.createdAt).format("DD MMMM YYYY")}</p>
                  </div>
                </div>
                <div className="py-2 md:py-3 border-y-[1px] border-gray-300 flex items-center justify-end">
                  <ShareSocmedButton title={blog.title} slug={params.slug} />
                </div>
              </div>
              <div className="w-full rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${blog.image}`}
                  alt={`image-${blog.title}`}
                  width={1920}
                  height={1080}
                  quality={100}
                  className="object-contain w-full"
                />
              </div>
            </div>
            <InsightContent content={blog.content} className="!leading-[150%] text-gray-700 body-parser space-y-3 md:space-y-4" />
            <RelatedServices categorySlug={blog.category.slug} />
            <div className="flex flex-col md:flex-row justify-center items-center gap-x-16 rounded-3xl bg-red-50/90 shadow-sm p-8">
              <Image
                src={ImageInsightContent}
                alt={`image-subscription`}
                width={1920}
                height={1080}
                quality={100}
                className="object-contain w-[40%] md:w-[25%] h-full rounded-3xl"
              />
              <div className="space-y-3 md:space-y-5">
                <h2 className="text-2xl md:text-2xl lg:text-3xl text-black font-semibold text-center md:text-left">Never miss a thing.</h2>
                <p className="text-gray-700 text-sm lg:text-base text-center md:text-left">Subscribe to get the latest updates, insights, and special offers</p>
                <FormSubscription slug={blog.slug} />
              </div>
            </div>
            <RelatedArticles articles={relatedBlog} currentSlug={params.slug} />
          </div>
        )
      }
      <AdsCarousel />
    </main>
  );
}
