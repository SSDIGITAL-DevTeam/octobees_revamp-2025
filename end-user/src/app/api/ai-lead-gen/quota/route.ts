import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const tokens = Object.keys(process.env)
            .filter(key => key.startsWith('APIFY_API_TOKEN'))
            .map(key => process.env[key])
            .filter(Boolean) as string[]

        if (tokens.length === 0) {
            return NextResponse.json({ totalUsage: 0, totalLimit: 0, remaining: 0, activeTokens: 0 })
        }

        let totalUsage = 0
        let activeTokens = 0
        const limitPerToken = 4.50 // Apify Free limits

        for (const token of tokens) {
            try {
                // To safely fetch all we do them concurrently
                const res = await fetch('https://api.apify.com/v2/users/me/usage/monthly', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    cache: 'no-store'
                })
                
                if (res.ok) {
                    const data = await res.json()
                    totalUsage += data.data?.totalUsageCreditsUsdAfterVolumeDiscount || 0
                    activeTokens++
                }
            } catch (e) {
                console.error('Token fetch failed', e)
            }
        }

        const totalLimit = activeTokens * limitPerToken
        const remaining = Math.max(0, totalLimit - totalUsage)

        return NextResponse.json({
            totalUsage,
            totalLimit,
            remaining,
            activeTokens,
            success: true
        })
    } catch (error) {
        console.error('Error in Quota endpoint:', error)
        return NextResponse.json(
            { error: 'Failed to fetch quota' },
            { status: 500 }
        )
    }
}
