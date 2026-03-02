import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Lead Generation - Google Search Scraper',
    description:
        'Scrape data from Google Search dengan mudah menggunakan AI Lead Generation tool. Input queries, configure parameters, dan dapatkan hasil secara real-time.',
    keywords:
        'lead generation, google search, scraper, data scraping, outscraper',
}

export default function AILeadGenLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
