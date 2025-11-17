const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Octobees",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/png/asset-logo-opengraph-octobees.png`,
    sameAs: [
      "https://www.linkedin.com/company/octobees",
      "https://www.instagram.com/octobees",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+62-821-0000-0000",
        contactType: "sales",
        areaServed: "ID",
        availableLanguage: ["en", "id"],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
