import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript Development Services | Octobees",
  description:
    "Expert JavaScript development services in Singapore. We build high-performance web applications, single-page apps, and enterprise solutions using modern JavaScript frameworks.",
  keywords: [
    "JavaScript development",
    "JavaScript services",
    "web development Singapore",
    "frontend development",
    "React development",
    "JavaScript experts",
  ],
  openGraph: {
    title: "JavaScript Development Services | Octobees",
    description:
      "Expert JavaScript development services in Singapore. We build high-performance web applications using modern frameworks.",
    url: "https://www.octobees.com/services/software-development/custom-software-development/javascript",
    siteName: "Octobees",
    images: [
      {
        url: "/png/hero-javascript.jpg",
        width: 1200,
        height: 630,
        alt: "JavaScript Development Services",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Development Services | Octobees",
    description:
      "Expert JavaScript development services in Singapore. We build high-performance web applications using modern frameworks.",
    images: ["/png/hero-javascript.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.octobees.com/services/software-development/custom-software-development/javascript",
  },
};

export default function JavascriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
