'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface ProgressIndicatorProps {
    progress: number
    message: string
}

export function ProgressIndicator({
    progress,
    message,
}: ProgressIndicatorProps) {
    return (
        <div className='flex flex-col items-center justify-center py-20 px-6 font-body min-h-[400px]'>
            {/* Pulsing Concentric Rings */}
            <div className='relative flex items-center justify-center mb-12 h-32 w-32'>
                {/* Outer Glow */}
                <div className='absolute inset-0 rounded-full bg-primary/5 blur-xl animate-pulse'></div>
                
                {/* Ring 3 (Outer) */}
                <div className='absolute inset-[-50%] rounded-full border border-primary/10 animate-[spin_8s_linear_infinite]'></div>
                
                {/* Ring 2 (Middle) */}
                <div className='absolute inset-[-25%] rounded-full border border-primary/20 animate-[spin_4s_linear_infinite_reverse]'></div>
                
                {/* Ring 1 (Inner) */}
                <div className='absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse'></div>
                
                {/* Center Core */}
                <div className='relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_0_30px_rgba(219,18,34,0.2)] border border-primary/10'>
                    <Search className='h-6 w-6 text-primary animate-pulse' />
                </div>
                
                {/* Progress Circle (Optional visual anchor) */}
                <svg className="absolute inset-[-10%] h-[120%] w-[120%] -rotate-90 text-primary transition-all duration-300" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={`${progress * 3} 300`} strokeLinecap="round" className="opacity-50" />
                </svg>
            </div>

            {/* Typography */}
            <div className='text-center max-w-sm'>
                <h3 className='text-2xl font-heading font-light text-gray-800 mb-3 tracking-wide'>
                    {progress === 100 ? 'Scan Complete' : 'Intelligence Gathering...'}
                </h3>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-gray-50/50 px-4 py-1.5 shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                    <p className='text-sm text-gray-500 font-medium'>
                        {message || 'Initializing connection...'}
                    </p>
                </div>
            </div>
            
            {/* Subtle Progress Text */}
            <div className="mt-8 text-xs font-semibold tracking-widest text-primary/40 uppercase">
                {Math.round(progress)}% Extracted
            </div>
        </div>
    )
}
