import { defaultMetadata, pageMetadata } from '@/constants/metadata';
import generateMetatag from '@/utils/generateMetadata';
import { ReactNode } from 'react';

export async function generateMetadata() {
  const metaTag = pageMetadata.insights;
  const location = "insights";

  try {
    const generated = await generateMetatag({ location, metaTag });

    return {
      ...generated,
      other: {
        ...generated.other,
        "google-site-verification": "Om6R9r0thAlgOsy4-m-eBbYWAa8LTyxpeOTqnlTyNqc",
      },
    };
  } catch (error) {
    return {
      ...defaultMetadata,
      ...metaTag,
      other: {
        "google-site-verification": "Om6R9r0thAlgOsy4-m-eBbYWAa8LTyxpeOTqnlTyNqc",
      },
    };
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
