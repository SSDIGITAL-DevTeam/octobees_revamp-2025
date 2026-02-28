import { JSX, ReactNode } from 'react'

import { seoMetadata } from '@/constants/metadata/metadata'; 

export const metadata = seoMetadata.blog; 

export default function Layout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    return <>{children}</>
}
