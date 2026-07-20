const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

export default function OrganizationSchema() {
  const waDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const telephone = waDigits ? `+${waDigits}` : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Octobees",
    description:
      "Octobees is a digital marketing and technology agency in Yogyakarta, Indonesia, offering SEO, SEM, content marketing, social media, website and software development, and AI/GEO services.",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/png/asset-logo-opengraph-octobees.png`,
    email: "contact@octobees.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Artech Space Building, 4th Floor, Cambridge, Jl. Sagan Kidul No.14, Terban, Kec. Gondokusuman",
      addressLocality: "Kota Yogyakarta",
      addressRegion: "Daerah Istimewa Yogyakarta",
      postalCode: "55223",
      addressCountry: "ID",
    },
    sameAs: [
      "https://www.linkedin.com/company/octobees",
      "https://www.instagram.com/octobees.id",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        ...(telephone ? { telephone } : {}),
        email: "contact@octobees.com",
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
