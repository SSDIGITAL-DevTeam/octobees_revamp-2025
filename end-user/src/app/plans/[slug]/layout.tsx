
import { defaultMetadata, pageMetadata } from '@/constants/metadata';
import generateMetatag from '@/utils/generateMetadata';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const metaTag = pageMetadata.plans
  const location = params.slug;
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
