import { NextRequest, NextResponse } from 'next/server'
import { scanStatus, updateScanStatus } from '../_lib/scan-status'
import { incrementApifyUsage } from '../_lib/quota-manager'
import { ApifyClient } from 'apify-client'

// Global variables for Advanced Token Load Balancing
let currentTokenIndex = 0;
const disabledTokens: Record<string, { disabledAt: number, reason: string }> = {};

// Helper func to dynamically get a valid token
async function getValidApifyToken(scanId: string): Promise<string> {
    // Collect all Apify tokens dynamically (APIFY_API_TOKEN, APIFY_API_TOKEN_2, APIFY_API_TOKEN_3, etc)
    const tokens = Object.keys(process.env)
        .filter(key => key.startsWith('APIFY_API_TOKEN'))
        .map(key => process.env[key])
        .filter(Boolean) as string[];

    if (tokens.length === 0) {
        throw new Error('No APIFY API tokens found in environment variables')
    }

    const currentMonth = new Date().getMonth();

    for (let attempts = 0; attempts < tokens.length; attempts++) {
        // Round robin selection
        const candidateToken = tokens[currentTokenIndex % tokens.length];

        // Move pointer for next iteration
        currentTokenIndex = (currentTokenIndex + 1) % tokens.length;

        // Check if token is disabled
        if (disabledTokens[candidateToken]) {
            const disabledMonth = new Date(disabledTokens[candidateToken].disabledAt).getMonth();
            if (disabledMonth === currentMonth) {
                console.log(`[Load Balancer] Skipping token ${candidateToken.substring(0, 6)}*** (Disabled for this month)`);
                continue; // Skip to next token
            } else {
                // It's a new month, clear the disable flag
                delete disabledTokens[candidateToken];
            }
        }

        try {
            updateScanStatus(scanId, {
                progress: 5,
                message: `Validating Apify Token (${candidateToken.substring(0, 6)}***)...`,
            });

            // Validate token usage
            const res = await fetch('https://api.apify.com/v2/users/me/usage/monthly', {
                headers: { 'Authorization': `Bearer ${candidateToken}` }
            });

            if (!res.ok) {
                console.warn(`[Load Balancer] Token ${candidateToken.substring(0, 6)}*** failed validation (${res.status}). Disabling.`);
                disabledTokens[candidateToken] = { disabledAt: Date.now(), reason: 'API Error / Unauthorized' };
                continue;
            }

            const data = await res.json();

            // Assume $4.50 is the hard limit per token for the free tier. We'll disable it if it reaches $4.40 to be safe.
            const totalUsageUsd = data.data.totalUsageCreditsUsdAfterVolumeDiscount || 0;
            const USAGE_THRESHOLD = 4.40;

            if (totalUsageUsd >= USAGE_THRESHOLD) {
                console.warn(`[Load Balancer] Token ${candidateToken.substring(0, 6)}*** exceeded limit ($${totalUsageUsd.toFixed(2)}). Disabling for this month.`);
                disabledTokens[candidateToken] = { disabledAt: Date.now(), reason: 'Quota Exceeded' };
                continue;
            }

            console.log(`[Load Balancer] Selected Valid Token: ${candidateToken.substring(0, 6)}*** (Usage: $${totalUsageUsd.toFixed(2)})`);
            return candidateToken;

        } catch (error) {
            console.error(`[Load Balancer] Error validating token ${candidateToken.substring(0, 6)}***`, error);
            continue;
        }
    }

    throw new Error('All available APIFY tokens are exhausted for this month or invalid.');
}

async function getApifyUsage(token: string): Promise<number> {
    try {
        const res = await fetch('https://api.apify.com/v2/users/me/usage/monthly', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return 0;
        const data = await res.json();
        return data.data.totalUsageCreditsUsdAfterVolumeDiscount || 0;
    } catch {
        return 0;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { scan_id, queries, pages_limit, language, region, scrape_type = 'search' } = body

        if (!scan_id || !queries) {
            return NextResponse.json(
                { error: 'Missing required fields: scan_id, queries' },
                { status: 400 },
            )
        }

        // Parse queries
        const queryList = queries
            .split('\n')
            .map((q: string) => q.trim())
            .filter((q: string) => q)

        if (queryList.length === 0) {
            return NextResponse.json(
                { error: 'No valid queries provided' },
                { status: 400 },
            )
        }

        // Initialize scan status
        scanStatus.set(scan_id, {
            progress: 10,
            message: 'Initializing scan...',
            results: [],
            config: { scrape_type, pages_limit, language, region },
            completed: false,
            error: null,
            createdAt: Date.now(),
        })

        // Start background scraping (non-blocking)
        scrapeInBackground(scan_id, queryList, pages_limit || 1, language, region, scrape_type).catch(
            (error) => {
                console.error('Background scraping failed:', error)
                updateScanStatus(scan_id, {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error occurred',
                    completed: true,
                })
            },
        )

        return NextResponse.json({
            success: true,
            scan_id,
            message: 'Scan started successfully',
        })
    } catch (error) {
        console.error('Error in scrape endpoint:', error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to start scan',
            },
            { status: 500 },
        )
    }
}

async function scrapeInBackground(
    scanId: string,
    queries: string[],
    pagesLimit: number,
    language: string,
    region: string,
    scrapeType: string = 'search'
) {
    try {
        let allResults: any[] = []
        const totalQueries = queries.length

        // === Dynamically acquire a health-checked Apify Token ===
        const apifyToken = await getValidApifyToken(scanId);

        // Fetch Initial Quota Usage
        const usageBefore = await getApifyUsage(apifyToken);
        updateScanStatus(scanId, {
            message: `Current Quota Checked: $${usageBefore.toFixed(2)} used.`,
        });

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i]

            // Update progress
            const progressPercentage = 10 + Math.floor((i / totalQueries) * 40)
            updateScanStatus(scanId, {
                progress: progressPercentage,
                message: `Allocating quota & processing query ${i + 1}/${totalQueries}...`,
            })

            try {
                console.log(`[Scraper] Query ${i + 1}/${totalQueries} using APIFY...`)

                let queryResults: any[] = []

                if (scrapeType === 'maps') {
                    queryResults = await scrapeWithApifyMaps(
                        query,
                        pagesLimit, // pass pagesLimit to Maps
                        language,
                        region,
                        apifyToken as string,
                        scanId,
                        i,
                        totalQueries
                    )
                } else {
                    queryResults = await scrapeWithApify(
                        query,
                        pagesLimit,
                        language,
                        region,
                        apifyToken as string,
                        scanId,
                        i,
                        totalQueries
                    )
                }
                incrementApifyUsage()

                allResults = allResults.concat(queryResults)

                // Update progress
                const newProgress = 10 + Math.floor(((i + 0.7) / totalQueries) * 40)
                updateScanStatus(scanId, {
                    progress: newProgress,
                    message: `Query ${i + 1}/${totalQueries} completed via APIFY...`,
                })
            } catch (queryError) {
                console.error(`Error processing query "${query}":`, queryError)

                // Write error as a result entry to notify the user gracefully
                allResults.push({
                    title: `Error processing query: ${query}`,
                    url: '#',
                    description: queryError instanceof Error ? queryError.message : 'Unknown error',
                    type: 'error'
                })
            }
        }

        // Format and prepare results
        updateScanStatus(scanId, {
            progress: 80,
            message: 'Formatting results...',
        })

        // Delay for formatting
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Flatten and format results
        const formattedResults = formatResults(allResults, scrapeType)

        // Fetch Final Quota Usage
        updateScanStatus(scanId, {
            progress: 90,
            message: 'Calculating Intelligence Usage Cost...',
        });
        await new Promise((resolve) => setTimeout(resolve, 2000)); // allow Apify billing to sync
        const usageAfter = await getApifyUsage(apifyToken);
        const usageCost = usageAfter > usageBefore ? (usageAfter - usageBefore) : 0;

        // Complete scan
        updateScanStatus(scanId, {
            progress: 100,
            message: '✅ Scan completed successfully!',
            results: formattedResults.slice(0, 500),
            usageCost: usageCost,
            completed: true,
        })
    } catch (error) {
        console.error('Background scraping error:', error)
        updateScanStatus(scanId, {
            error:
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
            completed: true,
        })
    }
}

function formatResults(results: any[], scrapeType: string): any[] {
    let flattened: any[] = []

    if (Array.isArray(results)) {
        for (const item of results) {
            if (Array.isArray(item)) {
                flattened = flattened.concat(item)
            } else if (item && typeof item === 'object') {
                flattened.push(item)
            }
        }
    }

    if (scrapeType === 'maps') {
        // Enforce maps output format: name, subtypes, domain, company_phone, company_facebook, company_instagram, email_1, dll.
        return flattened.map((result, idx) => ({
            position: idx + 1,
            name: result.title || result.name || '',
            subtypes: result.type || result.category || result.subtypes || '',
            domain: result.url || result.website || result.link || result.domain || '',
            company_phone: result.phone || result.phone_number || result.company_phone || result.phoneUnformatted || '',
            company_facebook: result.facebook || result.facebooks?.[0] || result.facebookProfiles?.[0]?.profileURL || result.company_facebook || result.socialMediaLinks?.facebook || '',
            company_instagram: result.instagram || result.instagrams?.[0] || result.instagramProfiles?.[0]?.profileURL || result.company_instagram || result.socialMediaLinks?.instagram || '',
            email_1: result.email || result.emails?.[0] || result.email_1 || '',
            tiktok: result.tiktok || result.tiktoks?.[0] || result.tiktokProfiles?.[0]?.profileURL || result.socialMediaLinks?.tiktok || '',
            linkedin: result.linkedin || result.linkedIns?.[0] || result.socialMediaLinks?.linkedin || '',
        }))
    } else {
        // Enforce search output format: title, url, description, phone_numbers, email, facebook, instagram, linkedin, tiktok
        return flattened.map((result, idx) => ({
            position: idx + 1,
            title: result.title || result.name || '',
            url: result.url || result.link || result.website || '',
            description: result.description || result.snippet || '',
            phone_numbers: result.phone || result.phone_numbers || result.phoneNumber || '',
            email: result.email || result.emailAddresses?.join(', ') || result.emails?.[0] || '',
            facebook: result.facebook || '',
            instagram: result.instagram || '',
            linkedin: result.linkedin || '',
            tiktok: result.tiktok || '',
        }))
    }
}

// === Apify Web Scraper Implementation ===
async function scrapeWithApify(
    query: string,
    pagesLimit: number,
    language: string,
    region: string,
    token: string,
    scanId: string,
    queryIndex: number,
    totalQueries: number
) {
    const client = new ApifyClient({ token })

    const input = {
        queries: query,
        numResults: pagesLimit * 10,
        languageCode: language || 'en',
        countryCode: (region || 'us').toLowerCase(),
    }

    // Start actor asynchronously so we can poll for progress
    const run = await client.actor('apify/google-search-scraper').start(input)
    let isFinished = false
    let currentProgress = 10 + Math.floor((queryIndex / totalQueries) * 40)

    while (!isFinished) {
        // Wait 3 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 3000))

        const runStatusDetail = await client.run(run.id).get()
        isFinished = runStatusDetail?.status === 'SUCCEEDED' ||
            runStatusDetail?.status === 'FAILED' ||
            runStatusDetail?.status === 'ABORTED' ||
            runStatusDetail?.status === 'TIMED-OUT'

        if (!isFinished) {
            const maxProgressForQuery = 10 + Math.floor(((queryIndex + 0.95) / totalQueries) * 40)
            if (currentProgress < maxProgressForQuery) {
                currentProgress += 2
                updateScanStatus(scanId, {
                    progress: Math.min(currentProgress, maxProgressForQuery),
                    message: `Searching Google Web for "${query}" (Run ID: ${run.id})...`,
                })
            }
        } else if (runStatusDetail?.status !== 'SUCCEEDED') {
            throw new Error(`Apify run did not succeed. Status: ${runStatusDetail?.status}`)
        }
    }

    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return items.flatMap((item: any) => {
        if (item.organicResults && Array.isArray(item.organicResults)) {
            return item.organicResults
        }
        return []
    })
}



// === Apify Maps Scraper Implementation ===
async function scrapeWithApifyMaps(
    query: string,
    pagesLimit: number,
    language: string,
    region: string,
    token: string,
    scanId: string,
    queryIndex: number,
    totalQueries: number
) {
    const client = new ApifyClient({ token })

    // Map region short codes to full location names for better Google Maps interpretation
    const regionNames: Record<string, string> = {
        'US': 'United States',
        'UK': 'United Kingdom',
        'SG': 'Singapore',
        'ID': 'Indonesia',
        'AU': 'Australia',
        'CA': 'Canada'
    }

    const locationName = regionNames[region.toUpperCase()] || region || 'United States'

    const input = {
        searchStringsArray: [query],
        locationQuery: locationName,
        language: language || 'en',
        maxCrawledPlacesPerSearch: pagesLimit * 20, // 1 page = 20 places
        maxImages: 0, // Performance: We don't need image data
        maxReviews: 0, // Performance: We don't need reviews
        maxQuestions: 0, // Performance: We don't need questions
        scrapeContacts: false, // User requested basic contact extraction off
        scrapeDictionaries: false,
        scrapePlaceDetailPage: false,
        scrapeSocialMediaProfiles: {
            facebooks: true,
            instagrams: true,
            youtubes: false,
            tiktoks: true,
            twitters: false
        },
        searchMatching: 'all',
        allPlacesNoSearchAction: '',
        depth: 0 // Prevent deep crawling
    }

    // Start actor asynchronously so we can poll for progress
    const run = await client.actor('nwua9Gu5YrADL7ZDj').start(input)
    let isFinished = false
    let currentProgress = 10 + Math.floor((queryIndex / totalQueries) * 40) // Starting progress for this query

    while (!isFinished) {
        // Wait 3 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 3000))

        const runStatusDetail = await client.run(run.id).get()
        isFinished = runStatusDetail?.status === 'SUCCEEDED' ||
            runStatusDetail?.status === 'FAILED' ||
            runStatusDetail?.status === 'ABORTED' ||
            runStatusDetail?.status === 'TIMED-OUT'

        if (!isFinished) {
            // Slowly increment progress artificially to show activity on UI, capping at 95% of this query's allocation
            const maxProgressForQuery = 10 + Math.floor(((queryIndex + 0.95) / totalQueries) * 40)
            if (currentProgress < maxProgressForQuery) {
                currentProgress += 2
                updateScanStatus(scanId, {
                    progress: Math.min(currentProgress, maxProgressForQuery),
                    message: `Extracting data from Google Maps for "${query}" (Run ID: ${run.id})...`,
                })
            }
        } else if (runStatusDetail?.status !== 'SUCCEEDED') {
            throw new Error(`Apify run did not succeed. Status: ${runStatusDetail?.status}`)
        }
    }

    // Fetch the final dataset results
    const { items } = await client.dataset(run.defaultDatasetId).listItems()

    return items
}

