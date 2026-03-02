/**
 * AI Lead Generation Constants & Configuration
 */

// API Configuration
export const API_CONFIG = {
    SCRAPE_ENDPOINT: '/api/ai-lead-gen/scrape',
    STATUS_ENDPOINT: '/api/ai-lead-gen/status',
    POLLING_INTERVAL: 2000, // milliseconds
    POLLING_MAX_RETRIES: 300, // ~10 minutes
    REQUEST_TIMEOUT: 60000, // milliseconds
}

// Cookie Configuration
export const COOKIE_CONFIG = {
    SCAN_HISTORY_KEY: 'ai_lead_gen_scans',
    EXPIRATION_DAYS: 30,
    MAX_SCANS: 50,
}

// Form Configuration
export const FORM_CONFIG = {
    MIN_QUERIES: 1,
    MAX_QUERIES: 100,
    MIN_PAGES_LIMIT: 1,
    MAX_PAGES_LIMIT: 10,
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_REGION: 'US',
    DEFAULT_EXTENSION: 'xlsx' as const,
    DEFAULT_TASK_TITLE: 'Google Search Scraper',
}

// Languages
export const LANGUAGES = [
    { label: 'English (En)', value: 'en' },
    { label: 'Indonesian (Id)', value: 'id' },
    { label: 'Spanish (Es)', value: 'es' },
    { label: 'French (Fr)', value: 'fr' },
    { label: 'German (De)', value: 'de' },
    { label: 'Chinese (Zh)', value: 'zh' },
    { label: 'Japanese (Ja)', value: 'ja' },
] as const

// Regions
export const REGIONS = [
    { label: '🇺🇸 United States', value: 'US' },
    { label: '🇬🇧 United Kingdom', value: 'UK' },
    { label: '🇨🇦 Canada', value: 'CA' },
    { label: '🇦🇺 Australia', value: 'AU' },
    { label: '🇩🇪 Germany', value: 'DE' },
    { label: '🇫🇷 France', value: 'FR' },
    { label: '🇮🇩 Indonesia', value: 'ID' },
    { label: '🇸🇬 Singapore', value: 'SG' },
    { label: '🇯🇵 Japan', value: 'JP' },
    { label: '🇨🇳 China', value: 'CN' },
] as const

// Result Extensions
export const EXTENSIONS = [
    { label: 'XLSX (Excel)', value: 'xlsx' },
    { label: 'CSV', value: 'csv' },
    { label: 'TXT', value: 'txt' },
    { label: 'Parquet', value: 'parquet' },
] as const

// Progress Stages
export const PROGRESS_STAGES = [
    { label: 'Initializing', percentage: 0 },
    { label: 'Processing', percentage: 30 },
    { label: 'Scraping', percentage: 60 },
    { label: 'Formatting', percentage: 85 },
    { label: 'Completing', percentage: 100 },
] as const

// Status Messages
export const STATUS_MESSAGES = {
    INITIALIZING: 'Initializing scan...',
    PROCESSING: 'Processing queries...',
    SCRAPING: 'Scraping data from Google...',
    FORMATTING: 'Formatting results...',
    COMPLETED: '✅ Scan completed successfully!',
    FAILED: '❌ Scan failed. Please try again.',
    ERROR_API_KEY: 'Outscraper API key not configured',
    ERROR_NO_QUERIES: 'No valid queries provided',
    ERROR_NO_RESULTS: 'No results found',
    ERROR_UNKNOWN: 'An unknown error occurred',
} as const

// Date Formats
export const DATE_FORMATS = {
    FULL: 'dddd, MMMM DD, YYYY HH:mm:ss',
    SHORT: 'MMM DD, HH:mm',
    TIME_ONLY: 'HH:mm:ss',
    DATE_ONLY: 'MMM DD, YYYY',
} as const

// UI Configuration
export const UI_CONFIG = {
    RESULTS_PREVIEW_LIMIT: 100,
    RESULTS_TABLE_ROWS: 5,
    HISTORY_PAGE_SIZE: 10,
    ANIMATION_DURATION: 300, // milliseconds
    DEBOUNCE_DELAY: 500, // milliseconds
}

// CSS Classes
export const CSS_CLASSES = {
    BUTTON_PRIMARY:
        'w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
    BUTTON_SECONDARY:
        'flex-1 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-semibold text-red-400 hover:bg-red-500/20 transition-colors',
    BUTTON_SUCCESS:
        'flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
    INPUT_BASE:
        'w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
    CARD: 'rounded-xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur',
    BADGE_SUCCESS:
        'rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400',
    BADGE_ERROR:
        'rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-400',
    BADGE_INFO:
        'rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-400',
} as const

// Error Codes
export enum ErrorCode {
    MISSING_API_KEY = 'MISSING_API_KEY',
    INVALID_QUERIES = 'INVALID_QUERIES',
    SCAN_NOT_FOUND = 'SCAN_NOT_FOUND',
    API_ERROR = 'API_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    PARSING_ERROR = 'PARSING_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Scan Status
export enum ScanStatus {
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

// Result Types
export interface ScanResult {
    position: number
    title: string
    url: string
    description: string
    type: string
    rating?: number
    review_count?: number
    [key: string]: any
}

export interface ScanData {
    id: string
    title: string
    queries: string[]
    status: 'processing' | 'completed' | 'failed'
    progress: number
    results: ScanResult[]
    config: {
        language: string
        region: string
        pages_limit: number
        result_extension: string
    }
    created_at: string
    error?: string
}

export interface ScanStatusResponse {
    scan_id: string
    progress: number
    message: string
    results: ScanResult[]
    completed: boolean
    error: string | null
}

// Validation
export const VALIDATION = {
    QUERY_MIN_LENGTH: 1,
    QUERY_MAX_LENGTH: 1000,
    TITLE_MAX_LENGTH: 100,
    PAGES_LIMIT_RANGE: { min: 1, max: 10 },
}

// Mock Data for Development
export const MOCK_QUERY_SAMPLES = [
    'iPhone',
    'Bitcoin',
    'Aria tickets',
    'Best restaurants',
    'Web development',
]

export const MOCK_RESULTS_PER_PAGE = 10

// Export all constants as single object for convenience
export const AI_LEAD_GEN_CONFIG = {
    API: API_CONFIG,
    COOKIE: COOKIE_CONFIG,
    FORM: FORM_CONFIG,
    LANGUAGES,
    REGIONS,
    EXTENSIONS,
    PROGRESS_STAGES,
    STATUS_MESSAGES,
    DATE_FORMATS,
    UI: UI_CONFIG,
    CSS: CSS_CLASSES,
    VALIDATION,
    MOCK: {
        SAMPLES: MOCK_QUERY_SAMPLES,
        RESULTS_PER_PAGE: MOCK_RESULTS_PER_PAGE,
    },
}
