import fs from 'fs'
import path from 'path'
import os from 'os'

export interface QuotaState {
    date: string
    apifyUsage: number
    serpapiUsage: number
}

// === MANUAL API TOGGLES ===
// You can turn off a specific library here. 
// If both are true, the load balancer will route evenly based on quota.
export const SCRAPER_CONFIG = {
    ENABLE_APIFY: true,
    ENABLE_SERPAPI: false,
}

// Apify gets ~26 requests per day (800 / 30)
// SerpApi gets ~8 requests per day (250 / 30)
export const API_LIMITS = {
    APIFY: 26,
    SERPAPI: 8,
}

const QUOTA_FILE_PATH = path.join(os.tmpdir(), 'ai_lead_gen_quota.json')

function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0]
}

function getInitialState(): QuotaState {
    return {
        date: getTodayDateString(),
        apifyUsage: 0,
        serpapiUsage: 0,
    }
}

export function getQuotaState(): QuotaState {
    try {
        if (fs.existsSync(QUOTA_FILE_PATH)) {
            const data = fs.readFileSync(QUOTA_FILE_PATH, 'utf-8')
            const state: QuotaState = JSON.parse(data)
            
            // If it's a new day, reset quotas
            if (state.date !== getTodayDateString()) {
                const newState = getInitialState()
                saveQuotaState(newState)
                return newState
            }
            
            return state
        }
    } catch (error) {
        console.error('Error reading quota state:', error)
    }

    // Default or fallback
    const initialState = getInitialState()
    saveQuotaState(initialState)
    return initialState
}

function saveQuotaState(state: QuotaState) {
    try {
        fs.writeFileSync(QUOTA_FILE_PATH, JSON.stringify(state, null, 2), 'utf-8')
    } catch (error) {
        console.error('Error saving quota state:', error)
    }
}

export function incrementApifyUsage() {
    const state = getQuotaState()
    state.apifyUsage += 1
    saveQuotaState(state)
}

export function incrementSerpapiUsage() {
    const state = getQuotaState()
    state.serpapiUsage += 1
    saveQuotaState(state)
}

/**
 * Determines which API to use based on current daily usage.
 * Tries to distribute usage evenly, preferring SerpApi first 
 * until it hits its smaller daily limit.
 */
export function getRecommendedApi(): 'apify' | 'serpapi' {
    // 1. Check strict manual toggles first
    if (SCRAPER_CONFIG.ENABLE_APIFY && !SCRAPER_CONFIG.ENABLE_SERPAPI) {
        return 'apify'
    }
    if (SCRAPER_CONFIG.ENABLE_SERPAPI && !SCRAPER_CONFIG.ENABLE_APIFY) {
        return 'serpapi'
    }
    if (!SCRAPER_CONFIG.ENABLE_APIFY && !SCRAPER_CONFIG.ENABLE_SERPAPI) {
        console.warn('⚠️ WARNING: Both Apify and SerpApi are disabled in quota-manager.ts. Defaulting to Apify to prevent crash.')
        return 'apify'
    }

    // 2. Load balancer logic (if both are enabled)
    const state = getQuotaState()

    const serpapiAvailable = state.serpapiUsage < API_LIMITS.SERPAPI
    const apifyAvailable = state.apifyUsage < API_LIMITS.APIFY

    if (serpapiAvailable && apifyAvailable) {
        // Balancer: Keep the ratio roughly proportional (8:26 is roughly 1:3)
        // If SerpApi has used less than its proportional share, use it.
        const serpapiRatio = state.serpapiUsage / API_LIMITS.SERPAPI
        const apifyRatio = state.apifyUsage / API_LIMITS.APIFY
        
        if (serpapiRatio <= apifyRatio) {
            return 'serpapi'
        } else {
            return 'apify'
        }
    }

    if (serpapiAvailable) return 'serpapi'
    if (apifyAvailable) return 'apify'

    // If both daily limits are reached, default to Apify as it has a much larger monthly pool (800)
    return 'apify'
}
