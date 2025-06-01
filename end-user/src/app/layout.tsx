import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layouts/Navbar/Navbar";
import Footer from "@/components/layouts/Footer/Footer";
import Script from "next/script";
import React from "react";
import { Toaster } from "@/components/ui/toaster";

import { pageMetadata } from "@/constants/metadata";
import generateMetatag from "@/utils/generateMetadata";

export async function generateMetadata() {
  const metaTag = pageMetadata.home
  const location = "home";
  return await generateMetatag({ location, metaTag });
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
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W453F787');`,
        }}
      />
      {/* <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
      !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '707136298400890');
fbq('track', 'PageView');
    `,
        }}
      /> */}
      <html lang="en">
        <body className="font-body">
          {/* GTM */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W453F787" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          ></noscript>
          {/* <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=707136298400890&ev=PageView&noscript=1"
            />
          </noscript> */}
          <Navbar />

          <Providers>
            <div className="flex flex-col min-h-screen">{children}</div>
          </Providers>
          <Footer />
          <Toaster />
        </body>
      </html>
    </>
  );
}
