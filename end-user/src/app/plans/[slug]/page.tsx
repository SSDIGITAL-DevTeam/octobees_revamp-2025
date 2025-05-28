"use client";

import { JSX, useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import HeaderComponents from "@/app/plans/_components/HeaderComponents";
import PlanComponents from "@/app/plans/_components/PlanComponents";
import { axiosInstance } from "@/lib/axios";
import Script from "next/script";

export default function Page(): JSX.Element {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/service-category/${slug}`, {
          params: { status: "Active" }
        });
        setData(response.data);
        if (!response.data) return notFound();
      } catch (e) {
        console.error("Error fetching category:", e);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '687653067246151');
fbq('track', 'PageView');
        `}
      </Script>

      {/* Fallback if JS disabled */}
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=687653067246151&ev=PageView&noscript=1" />
      </noscript>
      
      <main className="w-full">
        {/* Header */}
        <HeaderComponents
          plans={data?.name}
          desc={data?.description}
          title={data?.heading}
        />

        {/* Section 2 */}

        <section className="flex flex-col overflow-x-auto py-[10px] xl:py-[20px]">
          <div className="container">
            {data && <PlanComponents data={data?.plans} />}
          </div>
        </section>
      </main>
    </>
  );
}

