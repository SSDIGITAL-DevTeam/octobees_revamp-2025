import "./globals.css";
import Navbar from "@/components/layouts/Navbar/Navbar";
import Footer from "@/components/layouts/Footer/Footer";
import Script from "next/script";
import React from "react";
import type { Metadata } from "next";
import generateMetatag from "@/utils/generateMetadata";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { pageMetadata } from "@/constants/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const metaTag = pageMetadata.home;
  const location = "home";

  const generated = await generateMetatag({ location, metaTag });

  return {
    ...generated,
    other: {
      ...(generated as any)?.other,
      "google-site-verification":
        "Om6R9r0thAlgOsy4-m-eBbYWAa8LTyxpeOTqnlTyNqc",
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

      <html lang="en">
        <body className="font-body">
          {/* GTM noscript */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W453F787" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>

          <Navbar />

          <Providers>
            {children}
          </Providers>

          <Footer />
          <Toaster />
        </body>
      </html>
    </>
  );
}
