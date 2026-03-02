'use client'

import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GoogleSearchForm } from './GoogleSearchForm'
import { ProgressIndicator } from './ProgressIndicator'
import { useScanPolling } from '../_hooks/useScanPolling'


const schema = z.object({
    queries: z.string().min(1, 'Minimal 1 query diperlukan'),
    pages_limit: z.coerce.number().min(1).max(20).default(1),
    language: z.string().default('en'),
    region: z.string().default('US'),
    scrape_type: z.enum(['search', 'maps']).default('search'),
    result_extension: z.enum(['xlsx', 'csv']).default('xlsx'),
    task_title: z.string().default('Google Search Scraper'),
})

type FormData = z.infer<typeof schema>

interface ScanData {
    id: string
    title: string
    queries: string[]
    status: 'processing' | 'completed' | 'failed'
    progress: number
    results: any[]
    config: FormData
    created_at: string
    error?: string
    usageCost?: number
}

// Helper functions to avoid nested ternaries
function getStatusMessageClasses(statusMessage: string): string {
    if (statusMessage.includes('✅'))
        return 'rounded-lg border p-4 border-green-200 bg-green-50'
    if (statusMessage.includes('❌'))
        return 'rounded-lg border p-4 border-red-200 bg-red-50'
    return 'rounded-lg border p-4 border-gray-200 bg-gray-50'
}

function getStatusTextClasses(statusMessage: string): string {
    if (statusMessage.includes('✅')) return 'text-green-700'
    if (statusMessage.includes('❌')) return 'text-red-700'
    return 'text-gray-600'
}

export function GoogleSearchScraper({
    onScanComplete,
}: {
    onScanComplete: (scan: ScanData) => void
}) {
    const {
        isLoading,
        progress,
        statusMessage,
        startScan,
    } = useScanPolling(onScanComplete)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            pages_limit: 1,
            language: 'en',
            region: 'SG',
            scrape_type: 'search',
            result_extension: 'xlsx',
        }
    })


    const onSubmit = useCallback(
        async (data: FormData) => {
            const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            await startScan(data, scanId)
            reset()
        },
        [startScan, reset],
    )

    return (
        <div className='w-full'>
            {!isLoading ? (
                <div
                    key="form"
                    className="grid gap-6 lg:grid-cols-1 w-full animate-in fade-in zoom-in-95 duration-500"
                >
                    {/* Form Section */}
                    <GoogleSearchForm
                        register={register}
                        errors={errors}
                        onSubmit={handleSubmit(onSubmit)}
                        isLoading={isLoading}
                        setValue={setValue}
                    />
                    
                    {/* Result Message Section (Completed/Failed) */}
                    {statusMessage && (
                        <div className={getStatusMessageClasses(statusMessage)}>
                            <p className={getStatusTextClasses(statusMessage)}>
                                {statusMessage}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    key="loading"
                    className="flex flex-col items-center justify-center min-h-[400px] w-full animate-in fade-in zoom-in-95 duration-300"
                >
                    <ProgressIndicator
                        progress={progress}
                        message={statusMessage}
                    />
                </div>
            )}
        </div>
    )
}
