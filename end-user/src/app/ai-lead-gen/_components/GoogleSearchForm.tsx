'use client'

import React, { useRef, useState, useEffect } from 'react'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { UploadCloud, Search, Hash, Globe, Languages, Settings2, FileOutput, Sparkles, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

interface GoogleSearchFormProps {
    register: UseFormRegister<any>
    errors: FieldErrors
    onSubmit: (e: React.FormEvent) => void
    isLoading: boolean
    setValue: UseFormSetValue<any>
}

export function GoogleSearchForm({
    register,
    errors,
    onSubmit,
    isLoading,
    setValue,
}: GoogleSearchFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeScrapeType, setActiveScrapeType] = useState<'search' | 'maps'>('search')
    const [quotaData, setQuotaData] = useState<{ remaining: number, totalUsage: number, totalLimit: number } | null>(null)

    // Fetch Token Quota on mount
    useEffect(() => {
        fetch('/api/ai-lead-gen/quota')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setQuotaData(data)
                }
            })
            .catch(err => console.error('Failed to load quota', err))
    }, [])

    // Initialize scrape_type in the form
    useEffect(() => {
        setValue('scrape_type', activeScrapeType)
    }, [activeScrapeType, setValue])

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
            alert('Currently only .csv and .txt files are supported for parsing.')
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            let queries: string[] = []
            
            if (file.name.endsWith('.csv')) {
                // assume first column contains queries
                queries = text.split('\n').map(line => line.split(',')[0].trim()).filter(Boolean)
            } else {
                queries = text.split('\n').map(line => line.trim()).filter(Boolean)
            }
            
            setValue('queries', queries.join('\n'), { shouldValidate: true })
            
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
        reader.readAsText(file)
    }

    return (
        <form onSubmit={onSubmit} className='w-full max-w-4xl mx-auto flex flex-col items-center'>
            
            <input type="hidden" {...register('scrape_type')} value={activeScrapeType} />

            {/* Main AI Prompt Container */}
            <div className='w-full relative overflow-hidden rounded-3xl border border-border/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/5 transition-all duration-300 hover:shadow-primary/10 flex flex-col'>
                
                {/* Clean Inner Tabs for Source */}
                <div className="flex px-6 md:px-8 pt-6 gap-8 border-b border-border/50 bg-white/40">
                    <button
                        type="button"
                        onClick={() => setActiveScrapeType('search')}
                        className={`relative pb-4 text-sm font-semibold transition-colors flex items-center gap-2 ${
                            activeScrapeType === 'search' 
                                ? 'text-primary' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <Globe className="h-4 w-4" /> Web Search
                        {activeScrapeType === 'search' && (
                            <motion.div layoutId="innerTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setActiveScrapeType('maps')}
                        className={`relative pb-4 text-sm font-semibold transition-colors flex items-center gap-2 ${
                            activeScrapeType === 'maps' 
                                ? 'text-primary' 
                                : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <MapPin className="h-4 w-4" /> Google Maps
                        {activeScrapeType === 'maps' && (
                            <motion.div layoutId="innerTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Top Section - Textarea */}
                <div className='p-6 md:p-8 relative'>
                    <div className="absolute top-8 left-8 hidden sm:block">
                        {activeScrapeType === 'search' ? <Search className='h-6 w-6 text-primary/60' /> : <MapPin className='h-6 w-6 text-primary/60' />}
                    </div>
                    <textarea
                        {...register('queries')}
                        placeholder={activeScrapeType === 'search' 
                            ? 'Type web search queries here...\ne.g., Marketing Agencies in Singapore'
                            : 'Type maps queries here...\ne.g., Coffee shops in New York\nRestaurants near London'}
                        className='w-full min-h-[160px] resize-none bg-transparent px-2 sm:px-10 py-2 text-xl md:text-2xl text-gray-800 placeholder-gray-300 focus:outline-none font-heading leading-relaxed'
                    />
                    {errors.queries && (
                        <p className='mt-2 text-sm text-primary flex items-center gap-1.5 px-2 sm:px-10'>
                            <span className='h-1.5 w-1.5 rounded-full bg-primary animate-pulse'></span>
                            {String(errors.queries?.message)}
                        </p>
                    )}
                </div>

                {/* Middle Section - Settings Bar */}
                <div className='border-y border-border/50 bg-gray-50/50 px-6 py-4 flex flex-wrap items-center gap-3'>
                    {/* Settings Title */}
                    <div className="flex items-center gap-2 mr-2 sm:mr-4 text-sm font-medium text-gray-500 font-body">
                        <Settings2 className="h-4 w-4" />
                        Parameters:
                    </div>

                    {/* Pages Limit Pill */}
                    <div className='flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border/80'>
                        <Hash className='h-3.5 w-3.5 text-gray-400' />
                        <input
                            type='number'
                            {...register('pages_limit', { valueAsNumber: true })}
                            min='1'
                            max='20'
                            className='w-12 bg-transparent text-sm font-medium text-gray-700 focus:outline-none'
                        />
                        <span className="text-xs text-gray-400 hidden sm:inline">pages</span>
                    </div>

                    {/* Language Pill */}
                    <div className='flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border/80'>
                        <Languages className='h-3.5 w-3.5 text-gray-400' />
                        <select
                            {...register('language')}
                            className='bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none pr-2 sm:pr-4 cursor-pointer min-w-[3rem]'
                        >
                            <option value='en'>EN</option>
                            <option value='id'>ID</option>
                            <option value='es'>ES</option>
                            <option value='fr'>FR</option>
                            <option value='de'>DE</option>
                            <option value='zh'>ZH</option>
                            <option value='ja'>JA</option>
                        </select>
                    </div>

                    {/* Region Pill */}
                    <div className='flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border/80'>
                        <Globe className='h-3.5 w-3.5 text-gray-400' />
                        <select
                            {...register('region')}
                            className='bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none pr-2 sm:pr-4 cursor-pointer min-w-[3rem]'
                        >
                            <option value='US'>US</option>
                            <option value='UK'>UK</option>
                            <option value='SG'>SG</option>
                            <option value='ID'>ID</option>
                            <option value='AU'>AU</option>
                            <option value='CA'>CA</option>
                        </select>
                    </div>

                    {/* Result Extension Pill */}
                    <div className='flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border/80'>
                        <FileOutput className='h-3.5 w-3.5 text-gray-400' />
                        <select
                            {...register('result_extension')}
                            className='bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none pr-2 sm:pr-4 cursor-pointer min-w-[3rem]'
                        >
                            <option value='csv'>CSV</option>
                            <option value='xlsx'>XLSX</option>
                        </select>
                    </div>
                </div>

                {/* Bottom Section - Actions */}
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white'>
                    {/* Left side actions (File Upload) */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
                        <button
                            type='button'
                            onClick={() => fileInputRef.current?.click()}
                            className='group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors'
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
                                <UploadCloud className='h-4 w-4' />
                            </div>
                            <span className="hidden sm:inline">Import List</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='.csv,.txt'
                            className='hidden'
                            disabled={isLoading}
                            onChange={handleFileUpload}
                        />
                        
                        <div className="h-8 w-px bg-border hidden sm:block"></div>

                        <div className="flex-1 sm:w-48">
                            <input
                                type='text'
                                {...register('task_title')}
                                placeholder='Task title (optional)'
                                className='w-full bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none font-body px-2 sm:px-0'
                            />
                        </div>
                    </div>

                    {/* Right side - Submit */}
                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                        {quotaData && (
                            <div className="text-[12px] text-gray-500 flex items-center gap-1.5 font-medium px-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${quotaData.remaining > 1 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                                Available Intelligence Limit: <strong className="text-gray-700">${quotaData.remaining.toFixed(2)}</strong> / ${quotaData.totalLimit.toFixed(2)}
                            </div>
                        )}
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(219,18,34,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0 overflow-hidden font-heading text-lg'
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full transition-transform duration-1000 group-hover:translate-x-full z-0"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-5 w-5" />
                                        Generate Leads
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
