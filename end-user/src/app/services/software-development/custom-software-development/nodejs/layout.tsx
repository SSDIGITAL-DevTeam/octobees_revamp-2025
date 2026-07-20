import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Node.js Development Services | Octobees",
  description:
    "Scalable Node.js development services in Singapore. We build real-time backend solutions, APIs, and microservices using the efficient V8 engine.",
  keywords: [
    "Node.js development",
    "Node.js services",
    "backend development Singapore",
    "API development",
    "microservices",
    "Node.js experts",
  ],
  openGraph: {
    title: "Node.js Development Services | Octobees",
    description:
      "Scalable Node.js development services in Singapore. We build real-time backend solutions, APIs, and microservices.",
    url: "https://www.octobees.com/services/software-development/custom-software-development/nodejs",
    siteName: "Octobees",
    images: [
      {
        url: "/png/hero-nodejs.jpg",
        width: 1200,
        height: 630,
        alt: "Node.js Development Services",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Node.js Development Services | Octobees",
    description:
      "Scalable Node.js development services in Singapore. We build real-time backend solutions, APIs, and microservices.",
    images: ["/png/hero-nodejs.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.octobees.com/services/software-development/custom-software-development/nodejs",
  },
};

export default function NodejsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
