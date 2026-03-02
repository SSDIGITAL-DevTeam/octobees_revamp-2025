import React, { useState, useEffect } from 'react'
import { Inbox, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

export function getStandardKeys(results: any[], scrapeType?: string): string[] {
    if (scrapeType === 'maps') {
        return ['name', 'subtypes', 'domain', 'company_phone', 'company_facebook', 'company_instagram', 'email_1', 'tiktok', 'linkedin']
    } else if (scrapeType === 'search') {
        return ['title', 'url', 'description', 'phone_numbers', 'email', 'facebook', 'instagram', 'linkedin', 'tiktok']
    }

    const allKeys = new Set<string>()
    results.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)))
    
    const keysArray = Array.from(allKeys)
    return keysArray.sort((a, b) => {
        if (a === 'position') return -1
        if (b === 'position') return 1
        return 0
    })
}

export function generateCSV(results: any[], scrapeType?: string): string {
    if (!results || results.length === 0) return ''
    const keys = getStandardKeys(results, scrapeType)
    const header = keys.map((k) => `"${k}"`).join(',')
    const rows = results.map((r) =>
        keys.map((k) => {
            let value = r[k] ?? ''
            if (typeof value === 'object') value = JSON.stringify(value)
            return `"${String(value).replace(/"/g, '""')}"`
        }).join(','),
    )
    return [header, ...rows].join('\n')
}

export function generateXLSX(results: any[], filename: string, scrapeType?: string) {
    if (!results || results.length === 0) return
    const keys = getStandardKeys(results, scrapeType)
    const formattedData = results.map(row => {
        const newRow: any = {}
        keys.forEach(k => {
            let val = row[k] ?? ''
            if (typeof val === 'object') val = JSON.stringify(val)
            newRow[k] = val
        })
        return newRow
    })
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: keys })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads")
    XLSX.writeFile(workbook, filename)
}

interface ScanDetailsModalProps {
    scan: any
    onClose: () => void
}

export function ScanDetailsModal({ scan, onClose }: ScanDetailsModalProps) {
    const [modalPage, setModalPage] = useState(1)
    const [modalPerPage, setModalPerPage] = useState(10)

    useEffect(() => {
        setModalPage(1)
    }, [scan?.id])

    if (!scan) return null

    const handleDownload = () => {
        if (!scan.results || scan.results.length === 0) return
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

    const keysToUse = getStandardKeys(scan.results, scan.config?.scrape_type)
    const hasMoreKeys = keysToUse.length > 15
    const visibleKeys = keysToUse.slice(0, 15)
    
    const results = scan.results || []
    const totalResults = results.length
    const totalPages = Math.max(1, Math.ceil(totalResults / modalPerPage))
    
    // Safety bound current page
    let currentPage = modalPage
    if (currentPage > totalPages) currentPage = totalPages

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-24 sm:p-8 sm:pt-28 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col font-body border border-border/60 overflow-hidden transform animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 font-heading">
                            {scan.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <span className="font-mono text-xs">{scan.id?.substring(0, 8)}</span>
                            <span>•</span>
                            <span>{totalResults} leads extracted</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="flex-1 overflow-auto p-0 bg-gray-50/30">
                    {totalResults === 0 ? (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                            <Inbox className="h-12 w-12 text-gray-300 mb-4" />
                            <p>No data extracted for this task yet.</p>
                        </div>
                    ) : (
                        <table className='w-full text-sm text-left whitespace-nowrap'>
                            <thead className='bg-gray-100/80 sticky top-0 z-10 shadow-sm'>
                                <tr>
                                    {visibleKeys.map((key: string, idx: number) => (
                                        <th key={idx} className='px-4 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px] font-heading'>
                                            {key.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                    {hasMoreKeys && (
                                        <th className='px-4 py-3 font-semibold text-gray-400 italic text-[11px]'>...+more</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/60 bg-white">
                                {results.slice((currentPage - 1) * modalPerPage, currentPage * modalPerPage).map((row: any, rowIdx: number) => (
                                    <tr key={rowIdx} className="hover:bg-primary/[0.02] transition-colors">
                                        {visibleKeys.map((key: string, colIdx: number) => {
                                            let val = row[key]
                                            if (typeof val === 'object' && val !== null) {
                                                val = JSON.stringify(val).substring(0, 40) + '...'
                                            }
                                            const isLink = typeof val === 'string' && val.startsWith('http')
                                            const isEmail = typeof val === 'string' && val.includes('@') && !val.includes(' ')
                                            
                                            let cellContent: React.ReactNode = val || <span className="text-gray-300">-</span>
                                            if (isLink) {
                                                cellContent = (
                                                    <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {val as string}
                                                    </a>
                                                )
                                            } else if (isEmail) {
                                                cellContent = (
                                                    <a href={`mailto:${val}`} className="text-blue-600 hover:underline">
                                                        {val as string}
                                                    </a>
                                                )
                                            }
                                            
                                            return (
                                                <td key={colIdx} className='px-4 py-3 text-[13px] text-gray-700 max-w-[250px] truncate' title={String(val || '')}>
                                                    {cellContent}
                                                </td>
                                            )
                                        })}
                                        {hasMoreKeys && (
                                            <td className="px-4 py-3 text-gray-300">...</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                
                <div className="p-4 border-t border-border/50 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                            <span>Rows per page:</span>
                            <select
                                value={modalPerPage}
                                onChange={(e) => {
                                    setModalPerPage(Number(e.target.value))
                                    setModalPage(1)
                                }}
                                className="bg-white border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div className="h-4 w-px bg-border hidden sm:block"></div>
                        <div>
                            Showing {Math.min((currentPage - 1) * modalPerPage + 1, totalResults)} - {Math.min(currentPage * modalPerPage, totalResults)} of {totalResults}
                        </div>
                        <div className='flex items-center gap-1 ml-2'>
                            <button 
                                onClick={() => setModalPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className='h-6 w-6 flex items-center justify-center rounded border border-border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white bg-gray-50'
                            >
                                ‹
                            </button>
                            <button 
                                onClick={() => setModalPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage >= totalPages}
                                className='h-6 w-6 rounded border border-border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white bg-gray-50'
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={totalResults === 0}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="h-4 w-4" />
                            Download File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
