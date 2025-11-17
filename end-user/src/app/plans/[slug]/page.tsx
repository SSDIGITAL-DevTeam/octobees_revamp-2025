import { JSX } from "react";
import { notFound } from "next/navigation";
import HeaderComponents from "@/app/plans/_components/HeaderComponents";
import PlanComponents from "@/app/plans/_components/PlanComponents";
import RelatedInsightsRail from "@/app/plans/_components/RelatedInsightsRail";
import { CategoryService } from "@/constants/payload";
import { getCategoryBySlug } from "@/services/plan.services";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import BreadcrumbSchema from "@/app/seo/schema/BreadcrumbSchema";
import ServiceSchema from "@/app/seo/schema/ServiceSchema";

type Props = {
  params: {
    slug: string
  }
}

export const revalidate = 1800;

export default async function Page({ params }: Props): Promise<JSX.Element> {
  let category: CategoryService | null = null
  try {
    category = await getCategoryBySlug(params.slug);
  } catch (error) {
    return notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.octobees.com";
  const breadcrumbSegments = [
    { label: "Plans", href: "/plans" },
    { label: category.name },
  ];

  return (
    <>
      <ServiceSchema service={category} />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: siteUrl },
          { name: "Plans", item: `${siteUrl}/plans` },
          { name: category.name, item: `${siteUrl}/plans/${params.slug}` },
        ]}
      />
      <main className="w-full">
        <div className="container">
          <Breadcrumbs segments={breadcrumbSegments} />
        </div>
        <HeaderComponents
          plans={category.name}
          desc={category.description}
          title={category.heading}
        />
        <section className="flex flex-col overflow-x-auto py-[10px] xl:py-[20px]">
          <div className="container">
            <PlanComponents data={category.plans}/>
          </div>
        </section>
        <div className="container">
          <RelatedInsightsRail searchTerm={category.name} />
        </div>
      </main>
    </>
  );
}

