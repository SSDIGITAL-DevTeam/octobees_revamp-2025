
// import axios from 'axios';
import { defaultMetadata, pageMetadata } from '@/constants/metadata';
import generateMetatag from '@/utils/generateMetadata';
import { ReactNode } from 'react';

export async function generateMetadata() {
  const metaTag = pageMetadata.about
  const location = "about";
   try {
    const response = await generateMetatag({ location, metaTag });
    return response
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
