import "./globals.css";
import { Manrope, Sora } from "next/font/google";
import Navbar from "@/components/layouts/Navbar/Navbar";
import Footer from "@/components/layouts/Footer/Footer";
import Script from "next/script";
import React from "react";
import { generateMetadata as buildMetadata } from "@/utils/generateMetadata";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { pageMetadata } from "@/constants/metadata";
import OrganizationSchema from "@/app/seo/schema/OrganizationSchema";
import GlobalUiWrapper from "@/components/layouts/GlobalUiWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  preload: true,
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  preload: true,
});

export async function generateMetadata() {
  const meta = pageMetadata.home;
  const metadata = await buildMetadata({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    path: "/",
    locale: meta.openGraph.locale,
    openGraphOverride: meta.openGraph,
    twitterOverride: meta.twitter,
    cmsPath: "home",
  });

  return {
    ...metadata,
    icons: {
      icon: "/assets/webp/logo-octobees.webp",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W453F787');`,
        }}
      />

      <html lang="en" className={`${manrope.variable} ${sora.variable}`}>
        <head>
          <meta
            name="google-site-verification"
            content="Om6R9r0thAlgOsy4-m-eBbYWAa8LTyxpeOTqnlTyNqc"
          />
        </head>
        <body className="font-body">
          {/* GTM noscript */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W453F787" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
          <OrganizationSchema />
          <GlobalUiWrapper
            navbar={<Navbar />}
            footer={<Footer />}
          >
            <Providers>{children}</Providers>
          </GlobalUiWrapper>
          <Toaster />
        </body>
      </html>
    </>
  );
}
