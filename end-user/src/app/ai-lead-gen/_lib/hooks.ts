'use client'

import { useEffect, useState } from 'react'

/**
 * Hook untuk manage cookie-based scan storage
 */
export function useScanHistory() {
    const [scans, setScans] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Load from cookie
        const loadScans = () => {
            try {
                const cookies = document.cookie.split(';')
                const scanCookie = cookies.find((c) =>
                    c.includes('ai_lead_gen_scans'),
                )
                if (scanCookie) {
                    const value = scanCookie.split('=')[1]
                    if (value) {
                        const decoded = decodeURIComponent(value)
                        const parsed = JSON.parse(decoded)
                        setScans(Array.isArray(parsed) ? parsed : [])
                    }
                }
            } catch (error) {
                console.error('Failed to load scans from cookie:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadScans()
    }, [])

    const addScan = (scan: any) => {
        setScans((prev) => [scan, ...prev])
    }

    const removeScan = (id: string) => {
        setScans((prev) => prev.filter((s) => s.id !== id))
    }

    const clearAll = () => {
        setScans([])
    }

    return {
        scans,
        isLoading,
        addScan,
        removeScan,
        clearAll,
    }
}

/**
 * Hook untuk manage polling dengan exponential backoff
 */
export function usePolling(
    callback: () => Promise<any>,
    options: {
        interval?: number
        maxRetries?: number
        shouldStop?: boolean
    } = {},
) {
    const { interval = 2000, maxRetries = 300, shouldStop = false } = options

    const [retries, setRetries] = useState(0)
    const [isPolling, setIsPolling] = useState(!shouldStop)

    useEffect(() => {
        if (shouldStop || !isPolling || retries >= maxRetries) {
            setIsPolling(false)
            return
        }

        const timer = setTimeout(async () => {
            try {
                await callback()
            } catch (error) {
                console.error('Polling error:', error)
                setRetries((prev) => prev + 1)
            }
        }, interval)

        return () => clearTimeout(timer)
    }, [isPolling, retries, interval, maxRetries, shouldStop, callback])

    const stop = () => setIsPolling(false)
    const start = () => setIsPolling(true)

    return {
        isPolling,
        stop,
        start,
        retries,
    }
}

/**
 * Hook untuk format timestamps dengan dayjs
 */
export function useFormattedDate(date: string | Date) {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}
