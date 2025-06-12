// import axios from 'axios';
import { defaultMetadata, pageMetadata } from '@/constants/metadata';
import generateMetatag from '@/utils/generateMetadata';
import { Metadata } from 'next';
import { ReactNode } from 'react';

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const res = await fetch(`${process.env.API_URL}/meta/contact-us`);
//     const meta = await res.json();
//     if (!meta) return {
//       metadataBase: new URL('https://octobees.com/'),
//       title: 'Contact Us | Octobees',
//       description: 'Contact Us - Octobees',
//       keywords: ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
//       icons: {
//         icon: '/assets/png/asset-logo-octobees.png',
//       },
//       openGraph: {
//         title: 'Octobees | Octobees',
//         description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
//         images: '/assets/png/asset-logo-octobees.png',
//       },
//     }
//     const title = meta.meta.find((item: any) => item.value === 'title')?.content || '';
//     const description = meta.meta.find((item: any) => item.value === 'description')?.content || '';
//     const keywords = meta.meta.find((item: any) => item.value === 'keywords')?.content || '';
//     const newKeywords = keywords.split(',').map((item: string) => item.trim());

//     return {
//       metadataBase: new URL('https://octobees.com/'),
//       title: title || 'Contact Us | Octobees',
//       description: description || 'Contact Us - Octobees',
//       keywords: newKeywords || ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
//       icons: {
//         icon: '/assets/png/asset-logo-octobees.png',
//       },
//       openGraph: {
//         title: 'Octobees | Octobees',
//         description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
//         images: '/assets/png/asset-logo-octobees.png',
//       },
//     };
//   } catch (error: any) {
//     return {
//       metadataBase: new URL('https://octobees.com/'),
//       title: 'Contact Us | Octobees',
//       description: 'Contact Us - Octobees',
//       keywords: ['Digital Marketing', 'Marketing Automation', 'Social Media Marketing', 'SEO'],
//       icons: {
//         icon: '/assets/png/asset-logo-octobees.png',
//       },
//       openGraph: {
//         title: 'Octobees | Octobees',
//         description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
//         images: '/assets/png/asset-logo-octobees.png',
//       },
//     };
//   }
// }

export async function generateMetadata() {
  const metaTag = pageMetadata.contact
  const location = "contact-us";
   try {
    return await generateMetatag({ location, metaTag });
  } catch (error) {
    return {
      ...defaultMetadata,
      ...metaTag,
    };
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
