import { JSX, ReactNode } from 'react'

import { seoMetadata } from '@/constants/metadata/metadata'; 

export const metadata = seoMetadata.webDesign; 

export default function Layout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    return <>{children}</>
}
