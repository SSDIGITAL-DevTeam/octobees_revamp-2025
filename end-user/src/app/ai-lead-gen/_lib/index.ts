/**
 * AI Lead Generation - Library Exports
 * Central export point for all utilities and hooks
 */

// Cookie utilities
export { setCookie, getCookie, deleteCookie } from './cookie-utils'

// Custom hooks
export { useScanHistory, usePolling, useFormattedDate } from './hooks'

// Outscraper integration
export {
    OutscraperClient,
    formatResults,
    formatAsCSV,
    validateApiKey,
    checkOutscraperStatus,
} from './outscraper-integration'

export type { SearchOptions, OutscraperResult } from './outscraper-integration'

// Constants
export {
    API_CONFIG,
    COOKIE_CONFIG,
    FORM_CONFIG,
    LANGUAGES,
    REGIONS,
    EXTENSIONS,
    PROGRESS_STAGES,
    STATUS_MESSAGES,
    DATE_FORMATS,
    UI_CONFIG,
    CSS_CLASSES,
    AI_LEAD_GEN_CONFIG,
    ErrorCode,
    ScanStatus,
} from './constants'

export type { ScanResult, ScanData } from './constants'

// Types
export interface ScanSession {
    id: string
    queries: string[]
    config: any
    startedAt: Date
}

export interface SearchProgress {
    current: number
    total: number
    percentage: number
}

export interface SearchResult {
    title: string
    url: string
    description: string
    position: number
    rating?: number
    reviewCount?: number
}
