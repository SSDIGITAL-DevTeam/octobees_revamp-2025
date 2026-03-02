/**
 * Outscraper Integration Guide
 *
 * Installation:
 * npm install outscraper-node
 *
 * API Documentation:
 * https://github.com/outscraper/outscraper-node
 * https://app.outscraper.cloud/api-docs
 */

// Example implementation for Outscraper integration

export interface SearchOptions {
    pages?: number
    language?: string
    region?: string
}

/**
 * Outscraper API Response Interface
 */
export interface OutscraperResult {
    title?: string
    name?: string
    url?: string
    link?: string
    description?: string
    snippet?: string
    position?: number
    type?: string
    rating?: number
    review_count?: number
    [key: string]: any
}

/**
 * Initialize Outscraper Client
 *
 * Usage:
 * const client = new OutscraperClient(process.env.OUTSCRAPER_API_KEY);
 */
export class OutscraperClient {
    private apiKey: string

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Outscraper API key is required')
        }
        this.apiKey = apiKey
    }

    /**
     * Search Google with Outscraper
     *
     * @param query - Search query string
     * @param options - Search options (pages, language, region)
     * @returns Array of search results
     *
     * Example:
     * const results = await client.googleSearch('iPhone', {
     *   pages: 1,
     *   language: 'en',
     *   region: 'US'
     * });
     */
    async googleSearch(
        query: string,
        options: SearchOptions = {},
    ): Promise<OutscraperResult[]> {
        try {
            // This is a mock implementation
            // In actual implementation, this would call the Outscraper API

            // Uncomment for real API:
            // const Outscraper = require('outscraper-node');
            // const client = new Outscraper.default(this.apiKey);
            // const results = await client.google_search(query, {
            //   pages: options.pages || 1,
            //   language: options.language || 'en',
            //   region: options.region || 'US',
            // });
            // return results;

            console.log(`Searching for: "${query}" with options:`, options)
            return []
        } catch (error) {
            console.error('Google search error:', error)
            throw error
        }
    }

    /**
     * Batch search multiple queries
     *
     * @param queries - Array of search queries
     * @param options - Common search options
     * @returns Map of query to results
     */
    async batchSearch(
        queries: string[],
        options: SearchOptions = {},
    ): Promise<Map<string, OutscraperResult[]>> {
        const results = new Map<string, OutscraperResult[]>()

        for (const query of queries) {
            try {
                const queryResults = await this.googleSearch(query, options)
                results.set(query, queryResults)
            } catch (error) {
                console.error(`Failed to search "${query}":`, error)
                results.set(query, [])
            }
        }

        return results
    }
}

/**
 * Format Outscraper results untuk export
 */
export function formatResults(
    results: OutscraperResult[],
    format: 'csv' | 'json' | 'xlsx' = 'csv',
): string {
    switch (format) {
        case 'csv':
            return formatAsCSV(results)
        case 'json':
            return JSON.stringify(results, null, 2)
        case 'xlsx':
            // For XLSX, return CSV format (actual XLSX requires additional library)
            return formatAsCSV(results)
        default:
            return formatAsCSV(results)
    }
}

/**
 * Format results as CSV
 */
export function formatAsCSV(results: OutscraperResult[]): string {
    if (!results || results.length === 0) {
        return ''
    }

    // Get all unique keys
    const keys = Array.from(
        new Set(results.flatMap((r) => Object.keys(r))),
    ).slice(0, 10) // Limit to 10 columns

    // Create header
    const header = keys.map((k) => `"${k}"`).join(',')

    // Create rows
    const rows = results.map((r) =>
        keys
            .map((k) => {
                let value = r[k] || ''
                if (typeof value === 'object') {
                    value = JSON.stringify(value)
                }
                // Escape quotes
                return `"${String(value).replace(/"/g, '""')}"`
            })
            .join(','),
    )

    return [header, ...rows].join('\n')
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): boolean {
    if (!apiKey || typeof apiKey !== 'string') {
        return false
    }

    // Basic validation - API key should be at least 20 characters
    return apiKey.length >= 20
}

/**
 * Get Outscraper API status
 * Useful for health checks
 */
export async function checkOutscraperStatus(apiKey: string): Promise<boolean> {
    try {
        const response = await fetch(
            'https://api.outscraper.com/api/v2/account',
            {
                headers: {
                    'API-KEY': apiKey,
                },
            },
        )

        return response.ok
    } catch (error) {
        console.error('Failed to check Outscraper status:', error)
        return false
    }
}
