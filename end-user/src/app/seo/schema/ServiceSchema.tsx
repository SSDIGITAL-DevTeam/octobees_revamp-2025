import type { CategoryService } from "@/constants/payload";

type Props = {
  service: CategoryService;
};

export default function ServiceSchema({ service }: Props) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.octobees.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Octobees",
      url: siteUrl,
    },
    areaServed: "ID",
    serviceType: "Marketing Technology",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.name,
      itemListElement: service.plans?.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price:
          plan.prices?.[0]?.amount !== undefined
            ? plan.prices[0].amount
            : undefined,
        priceCurrency: plan.prices?.[0]?.curr ?? "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/plans/${service.slug}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
