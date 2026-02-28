import { JSX, ReactNode } from 'react'
import { seoMetadata } from '@/constants/metadata/metadata';
import WhatsappButton from '@/components/partials/Button/WhatsappButton';

export const metadata = seoMetadata.aiAutomation;

export default function Layout({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    return <>
        {children}
        <WhatsappButton />
    </>
}
