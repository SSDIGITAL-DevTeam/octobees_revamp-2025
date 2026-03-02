'use client'

import React, { useState, useEffect } from 'react'
import { Inbox, Trash2, Download, Search, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import dayjs from 'dayjs'
import { ScanDetailsModal, generateCSV, generateXLSX } from './ScanDetailsModal'

interface Scan {
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

interface ScanResultsProps {
    latestScan?: Scan | null
}

export function ScanResults({ latestScan }: ScanResultsProps) {
    const [scans, setScans] = useState<Scan[]>([])
    const [selectedScan, setSelectedScan] = useState<Scan | null>(null)
    const [searchTag, setSearchTag] = useState('')

    // 1. Load initial history from local storage on mount
    useEffect(() => {
        const savedScans = localStorage.getItem('ai_lead_gen_scans')
        if (savedScans) {
            try {
                setScans(JSON.parse(savedScans))
            } catch (error) {
                console.error('Failed to parse scan history:', error)
            }
        }
    }, [])

    // 2. React to new completed scans from the Scraper component
    useEffect(() => {
        if (latestScan) {
            setScans(prev => {
                // If it already exists in the list (e.g., from an earlier status update), replace it
                const exists = prev.some(s => s.id === latestScan.id)
                if (exists) {
                    return prev.map(s => s.id === latestScan.id ? latestScan : s)
                }
                // Otherwise, prepend it
                return [latestScan, ...prev]
            })

            // Auto-open modal if the scan just completed
            if (latestScan.status === 'completed') {
                setSelectedScan((prev) => {
                    if (prev?.id === latestScan.id) return prev
                    return latestScan
                })
            }
        }
    }, [latestScan])

    const filteredScans = scans.filter((scan) => {
        if (!searchTag.trim()) return true
        const term = searchTag.toLowerCase()
        const titleMatch = scan.title?.toLowerCase().includes(term)
        const queryMatch = (scan.queries || []).some((q) =>
            q.toLowerCase().includes(term),
        )
        return titleMatch || queryMatch
    })

    const itemsPerPage = 5
    const [currentPage, setCurrentPage] = useState(1)
    
    const totalPages = Math.max(1, Math.ceil(filteredScans.length / itemsPerPage))
    
    // Validasi currentPage jika search tag mengubah jumlah hasil
    if (currentPage > totalPages) setCurrentPage(totalPages)

    const paginatedScans = filteredScans.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleRefresh = () => {
        const savedScans = localStorage.getItem('ai_lead_gen_scans')
        if (savedScans) {
            try {
                setScans(JSON.parse(savedScans))
            } catch (error) {
                console.error('Failed to parse scan history:', error)
            }
        }
    }

    const handleDeleteScan = (id: string) => {
        const updated = scans.filter((s) => s.id !== id)
        setScans(updated)

        const existing = localStorage.getItem('ai_lead_gen_scans')
        let allScans = []
        if (existing) {
            try {
                allScans = JSON.parse(existing)
            } catch (e) {
                console.error('Failed to parse scans')
            }
        }

        allScans = allScans.filter((s: Scan) => s.id !== id)
        localStorage.setItem(
            'ai_lead_gen_scans',
            JSON.stringify(allScans)
        )
    }

    const handleDownload = (scanId: string) => {
        const scan = scans.find((s) => s.id === scanId)
        if (!scan || !scan.results || scan.results.length === 0) return

        const extension = scan.config?.result_extension || 'csv'
        const filename = `${scan.title || 'scan'}-${Date.now()}.${extension}`
        const scrapeType = scan.config?.scrape_type

        if (extension === 'xlsx') {
            generateXLSX(scan.results, filename, scrapeType)
        } else {
            const csv = generateCSV(scan.results, scrapeType)
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            a.click()
            window.URL.revokeObjectURL(url)
        }
    }

    if (scans.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center rounded-3xl bg-white/50 backdrop-blur-sm p-16 shadow-[0_4px_40px_-15px_rgba(0,0,0,0.05)] text-center font-body min-h-[400px]'>
                <div className='relative mb-8'>
                    <div className='absolute inset-0 rounded-full bg-primary/5 blur-2xl animate-pulse'></div>
                    <div className='relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-b from-white to-gray-50 border border-border shadow-xl'>
                        <Inbox className='h-10 w-10 text-primary/80' strokeWidth={1.5} />
                    </div>
                </div>
                <h3 className='text-3xl font-heading font-light text-gray-800 mb-3 tracking-wide'>
                    Your Workspace is Empty
                </h3>
                <p className='text-gray-500 max-w-md font-body text-lg'>
                    Start by setting up a new scraper task to automatically discover and extract high-quality leads.
                </p>
            </div>
        )
    }

    return (
        <div className='space-y-6 font-body'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <h2 className='text-2xl font-bold font-heading tracking-tight text-gray-900'>Task History</h2>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <div className='relative w-full sm:w-64'>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            placeholder='Search title or queries'
                            className='w-full rounded-lg border border-border bg-gray-50/50 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body'
                        />
                    </div>
                    <button
                        onClick={handleRefresh}
                        className='flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200'
                    >
                        <RefreshCw className="h-4 w-4 text-gray-500" />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            <div className='overflow-x-auto rounded-3xl bg-white shadow-[0_4px_40px_-15px_rgba(0,0,0,0.05)] border border-border/50'>
                <table className='w-full text-sm text-left'>
                    <thead className='bg-gray-50/50 border-b border-border/50'>
                        <tr>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs w-[100px]'>
                                Task ID
                            </th>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs max-w-[250px]'>
                                Details
                            </th>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs w-[160px]'>
                                Status
                            </th>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs'>
                                Extracted Data
                            </th>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs w-[150px]'>
                                Created
                            </th>
                            <th className='px-6 py-4 font-semibold font-heading text-gray-500 uppercase tracking-wider text-xs text-right w-[100px]'>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {paginatedScans.map((scan) => (
                            <tr
                                key={scan.id}
                                className='group hover:bg-primary/[0.02] transition-colors duration-300'
                            >
                                <td className='px-6 py-5 text-gray-400 font-mono text-[13px]'>
                                    {scan.id.slice(0, 8)}
                                </td>
                                <td className='px-6 py-5 max-w-[250px]'>
                                    <div className='font-semibold font-heading text-gray-900 truncate text-base' title={scan.title}>
                                        {scan.title}
                                    </div>
                                    <div className='text-[13px] text-gray-500 mt-1 flex items-center gap-2'>
                                        <span>{scan.queries.length} {scan.queries.length === 1 ? 'query' : 'queries'}</span>
                                        <span className="text-gray-300">•</span>
                                        {scan.config?.scrape_type === 'maps' ? (
                                            <span className="inline-flex items-center rounded-sm bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 ring-1 ring-inset ring-purple-700/10 uppercase tracking-wider">Maps</span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">Search</span>
                                        )}
                                        {scan.usageCost !== undefined && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="font-mono text-emerald-600 font-semibold text-[11px]">${scan.usageCost.toFixed(3)} usage</span>
                                            </>
                                        )}
                                    </div>
                                    {scan.status === 'failed' && (
                                        <div className='text-[12px] text-primary mt-1.5 flex gap-1 line-clamp-1' title={scan.error}>
                                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                            {scan.error || 'Task failed'}
                                        </div>
                                    )}
                                </td>
                                <td className='px-6 py-5'>
                                    {(() => {
                                        if (scan.status === 'completed') {
                                            return (
                                                <div className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'>
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    <span className="text-[13px] font-medium leading-none">Completed</span>
                                                </div>
                                            )
                                        }
                                        if (scan.status === 'failed') {
                                            return (
                                                <div className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary ring-1 ring-inset ring-primary/20'>
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    <span className="text-[13px] font-medium leading-none">Failed</span>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div className='inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-inset ring-blue-600/20'>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                <span className="text-[13px] font-medium leading-none">{scan.progress}%</span>
                                            </div>
                                        )
                                    })()}
                                </td>
                                <td className='px-6 py-5'>
                                    <div className='flex items-center gap-2'>
                                        <span className="font-semibold text-gray-900">
                                            {scan.results?.length || 0}
                                        </span>
                                        <span className="text-gray-500 text-[13px]">leads</span>
                                    </div>
                                    <div className='flex flex-wrap gap-1 mt-1.5'>
                                        {(scan.queries || [])
                                            .slice(0, 2)
                                            .map((q, idx) => (
                                                <span
                                                    key={idx}
                                                    className='rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 font-medium truncate max-w-[100px]'
                                                    title={q}
                                                >
                                                    {q}
                                                </span>
                                            ))}
                                        {(scan.queries || []).length > 2 && (
                                            <span className='rounded-md bg-gray-50 border border-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500 font-medium'>
                                                +{(scan.queries || []).length - 2}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className='px-6 py-5 text-[13px] text-gray-500 whitespace-nowrap'>
                                    {dayjs(scan.created_at).format('MMM D, YYYY')}
                                    <div className="text-[12px] text-gray-400 mt-0.5">
                                        {dayjs(scan.created_at).format('HH:mm')}
                                    </div>
                                </td>
                                <td className='px-6 py-5 text-right'>
                                    <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                                        <button
                                            onClick={() => setSelectedScan(scan)}
                                            className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-200'
                                            title='View Data'
                                        >
                                            <Search className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(scan.id)}
                                            className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-transparent hover:border-emerald-200'
                                            title='Download Data'
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteScan(scan.id)}
                                            className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20'
                                            title='Delete Task'
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Data Preview Modal */}
            <ScanDetailsModal scan={selectedScan} onClose={() => setSelectedScan(null)} />

            <div className='flex items-center justify-between text-xs text-gray-600 mt-6'>
                <div>
                    Showing {paginatedScans.length} from{' '}
                    {filteredScans.length} data
                </div>
                <div className='flex items-center gap-2'>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className='h-7 w-7 flex items-center justify-center rounded-md border border-border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                    >
                        ‹
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = currentPage - 2 + i;
                        if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        
                        if (pageNum < 1) pageNum = 1;
                        if (pageNum > totalPages) pageNum = totalPages;
                        
                        if (i > 0 && pageNum === totalPages && Array.from({ length: Math.min(5, totalPages) })[i-1] === totalPages) return null;

                        return pageNum <= totalPages ? (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`h-7 w-7 rounded-md border ${
                                    currentPage === pageNum 
                                        ? 'border-primary bg-primary text-white' 
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ) : null;
                    })}

                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className='h-7 w-7 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    )
}
