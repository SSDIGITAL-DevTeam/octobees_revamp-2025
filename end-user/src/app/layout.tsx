import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layouts/Navbar/Navbar";
import Footer from "@/components/layouts/Footer/Footer";
import Script from "next/script";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.API_URL}/meta/home`);
    const meta = await res.json();
    if (!meta) return {
      metadataBase: new URL('https://octobees.com/'),
      title: "OCTOBEES | Branding-focused & marketing tech company",
      description: "OCTOBEES is a Branding-focused & marketing tech company",
      keywords: ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
      icons: {
        icon: '/assets/png/asset-logo-octobees.png',
      },
      openGraph: {
        title: 'Octobees | Octobees',
        description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
        images: '/assets/png/asset-logo-octobees.png',
      },
    };

    const title = meta.meta.find((item: any) => item.value === 'title')?.content || '';
    const description = meta.meta.find((item: any) => item.value === 'description')?.content || '';
    const keywords = meta.meta.find((item: any) => item.value === 'keywords')?.content || '';
    const newKeywords = keywords.split(',').map((item: string) => item.trim());

    return {
      metadataBase: new URL("https://octobees.com/"),
      title: title || "OCTOBEES | Branding-focused & marketing tech company",
      description: description || "OCTOBEES is a Branding-focused & marketing tech company",
      keywords: newKeywords || ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
      icons: {
        icon: '/assets/png/asset-logo-octobees.png',
      },
      openGraph: {
        title: 'Octobees | Octobees',
        description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
        images: '/assets/png/asset-logo-octobees.png',
      },
    };
  } catch (error: any) {
    return {
      metadataBase: new URL('https://octobees.com/'),
      title: "OCTOBEES | Branding-focused & marketing tech company",
      description: "OCTOBEES is a Branding-focused & marketing tech company",
      keywords: ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
      icons: {
        icon: '/assets/png/asset-logo-octobees.png',
      },
      openGraph: {
        title: 'Octobees | Octobees',
        description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
        images: '/assets/png/asset-logo-octobees.png',
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W453F787');`,
        }}
      />
      <html lang="en">
        <body className="font-body">
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W453F787"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
          <Navbar />

          <Providers>
            <div className="flex flex-col min-h-screen">{children}</div>
          </Providers>
          <Footer />
        </body>
      </html>
    </>
  );
}
