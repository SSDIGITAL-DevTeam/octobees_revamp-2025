// import axios from 'axios';
import { Metadata } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.API_URL}/meta/contact-us`);
    const meta = await res.json();
    if (!meta) return {
      metadataBase: new URL('https://octobees.com/'),
      title: 'Increase My Sales | Octobees',
      description: 'Increase My Sales - Octobees',
      keywords: ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
      icons: {
        icon: '/assets/png/asset-logo-octobees.png',
      },
      openGraph: {
        title: 'Octobees | Octobees',
        description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
        images: '/assets/png/asset-logo-octobees.png',
      },
    }
    const title = meta.meta.find((item: any) => item.value === 'title')?.content || '';
    const description = meta.meta.find((item: any) => item.value === 'description')?.content || '';
    const keywords = meta.meta.find((item: any) => item.value === 'keywords')?.content || '';
    const newKeywords = keywords.split(',').map((item: string) => item.trim());

    return {
      metadataBase: new URL('https://octobees.com/'),
      title: title || 'Increase My Sales | Octobees',
      description: description || 'Increase My Sales - Octobees',
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
      title: 'Increase My Sales | Octobees',
      description: 'Increase My Sales - Octobees',
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

export default function Layout({ children }: { children: ReactNode }) {
  return <>
    <Script
      id="fb-pixel-increase"
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
fbq('init', '2123659238113302');
fbq('track', 'PageView');
    `,
      }}
    />
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src="https://www.facebook.com/tr?id=2123659238113302&ev=PageView&noscript=1"
      />
    </noscript>
    {children}
  </>;
}
