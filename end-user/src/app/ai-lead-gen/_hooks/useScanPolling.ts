import { useState, useCallback, useRef } from 'react'

interface ScanData {
    id: string
    title: string
    queries: string[]
    status: 'processing' | 'completed' | 'failed'
    progress: number
    results: any[]
    config: any
    created_at: string
    error?: string
    usageCost?: number
}

export function useScanPolling(onScanComplete: (scan: ScanData) => void) {
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [statusMessage, setStatusMessage] = useState('')
    const [results, setResults] = useState<any[]>([])

    // Use ref to clear interval if component unmounts
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const clearPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current)
            pollIntervalRef.current = null
        }
    }, [])

    const startScan = useCallback(async (data: any, scanId: string) => {
        setIsLoading(true)
        setProgress(0)
        setStatusMessage('Initializing scan...')
        setResults([])

        try {
            // Setup polling interval FIRST, so we don't miss quick updates
            pollIntervalRef.current = setInterval(async () => {
                try {
                    const response = await fetch('/api/ai-lead-gen/status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ scan_id: scanId }),
                    })

                    const statusData = await response.json()

                    if (statusData.progress) setProgress(statusData.progress)
                    if (statusData.message) setStatusMessage(statusData.message)
                    if (statusData.results) setResults(statusData.results)

                    if (statusData.completed && !statusData.error) {
                        clearPolling()
                        setIsLoading(false)
                        setProgress(100)
                        setStatusMessage('✅ Scan completed successfully!')

                        const scanData: ScanData = {
                            id: scanId,
                            title: data.task_title,
                            queries: data.queries.split('\n').filter((q: string) => q.trim()),
                            status: 'completed',
                            progress: 100,
                            results: statusData.results || [],
                            config: data,
                            created_at: new Date().toISOString(),
                            usageCost: statusData.usageCost,
                        }

                        // Save to localStorage safely
                        try {
                            const existingScans = localStorage.getItem('ai_lead_gen_scans')
                            let allScans = []
                            if (existingScans) {
                                try {
                                    allScans = JSON.parse(existingScans)
                                } catch (e) {
                                    console.error('Failed to parse existing scans')
                                }
                            }

                            // Keep localStorage footprint light by truncating results heavily
                            const lightScanData = {
                                ...scanData,
                                results: scanData.results.slice(0, 50)
                            }

                            allScans.unshift(lightScanData)
                            allScans = allScans.slice(0, 20) // Only keep last 20 tasks
                            localStorage.setItem('ai_lead_gen_scans', JSON.stringify(allScans))
                        } catch (storageError) {
                            console.error('LocalStorage quota exceeded or failed:', storageError)
                        }

                        onScanComplete(scanData)
                        return
                    }

                    if (statusData.error) {
                        clearPolling()
                        setIsLoading(false)
                        setStatusMessage(`❌ Error: ${statusData.error}`)

                        const errorScan: ScanData = {
                            id: scanId,
                            title: data.task_title || 'Unnamed Task',
                            queries: data.queries.split('\n').filter((q: string) => q.trim()),
                            status: 'failed',
                            progress: 0,
                            results: [],
                            config: data,
                            created_at: new Date().toISOString(),
                            error: statusData.error,
                        }

                        try {
                            const existingScans = localStorage.getItem('ai_lead_gen_scans')
                            let allScans = []
                            if (existingScans) {
                                try {
                                    allScans = JSON.parse(existingScans)
                                } catch (e) {
                                    console.error('Failed to parse existing scans')
                                }
                            }

                            allScans.unshift(errorScan)
                            allScans = allScans.slice(0, 20)
                            localStorage.setItem('ai_lead_gen_scans', JSON.stringify(allScans))
                        } catch (storageError) {
                            console.error('LocalStorage quota exceeded or failed:', storageError)
                        }

                        onScanComplete(errorScan)
                    }
                } catch (error) {
                    console.error('Polling error:', error)
                }
            }, 2000)

            // Trigger the actual scrape
            const response = await fetch('/api/ai-lead-gen/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scan_id: scanId,
                    queries: data.queries,
                    pages_limit: data.pages_limit,
                    language: data.language,
                    region: data.region,
                    scrape_type: data.scrape_type,
                    result_extension: data.result_extension
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to start scan')
            }

            setStatusMessage('Scan started, processing in background...')
        } catch (error) {
            clearPolling()
            setIsLoading(false)
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            setStatusMessage(`❌ ${errorMessage}`)
        }
    }, [onScanComplete, clearPolling])

    return {
        isLoading,
        progress,
        statusMessage,
        results,
        startScan,
        clearPolling
    }
}
