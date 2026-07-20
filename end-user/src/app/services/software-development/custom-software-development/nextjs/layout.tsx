import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Development Services | Octobees",
  description:
    "Professional Next.js development services in Singapore. Build high-performance, SEO-friendly web applications with the React Framework for Production.",
  keywords: [
    "Next.js development",
    "Next.js services",
    "React framework",
    "SSR development Singapore",
    "web development",
    "Next.js experts",
  ],
  openGraph: {
    title: "Next.js Development Services | Octobees",
    description:
      "Professional Next.js development services in Singapore. Build high-performance, SEO-friendly web applications.",
    url: "https://www.octobees.com/services/software-development/custom-software-development/nextjs",
    siteName: "Octobees",
    images: [
      {
        url: "/png/hero-nextjs.jpg",
        width: 1200,
        height: 630,
        alt: "Next.js Development Services",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Development Services | Octobees",
    description:
      "Professional Next.js development services in Singapore. Build high-performance, SEO-friendly web applications.",
    images: ["/png/hero-nextjs.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.octobees.com/services/software-development/custom-software-development/nextjs",
  },
};

export default function NextjsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
