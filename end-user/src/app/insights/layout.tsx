import { defaultMetadata, pageMetadata } from '@/constants/metadata';
import generateMetatag from '@/utils/generateMetadata';
import { ReactNode } from 'react';

export async function generateMetadata() {
  const metaTag = pageMetadata.insights
  const location = "insights";
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
  return (
      <>{children}</>
  )
}
