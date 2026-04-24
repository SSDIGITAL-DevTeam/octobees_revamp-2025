'use client'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Control } from 'react-hook-form'
import { useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled — CKEditor 5 requires browser APIs
const CKEditorComponent = dynamic(
    () => import('@/components/partials/form/CKEditorComponent'),
    {
        ssr: false,
        loading: () => (
            <div className='flex items-center justify-center h-[300px] border border-gray-200 rounded-md bg-gray-50'>
                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <svg
                        className='animate-spin h-5 w-5'
                        viewBox='0 0 24 24'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                            fill='none'
                        />
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                        />
                    </svg>
                    Loading editor...
                </div>
            </div>
        ),
    },
)

interface Props {
    control: Control<any>
    name: string
    label: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_API_URL || ''

export default function BlogField({ control, name, label }: Props) {
    // Track content images for cleanup on delete
    const previousImagesRef = useRef<Set<string>>(new Set())

    /**
     * Extract content image filenames from HTML content.
     * Only considers images with /uploads/content- pattern.
     */
    const extractContentImages = useCallback((html: string): Set<string> => {
        const filenames = new Set<string>()
        if (!html) return filenames
        const regex = /\/uploads\/(content-[^"'\s)]+)/gi
        let match
        while ((match = regex.exec(html)) !== null) {
            filenames.add(match[1])
        }
        return filenames
    }, [])

    /**
     * Ensure content images use absolute URLs for display.
     */
    const fixImageUrls = useCallback((content: string): string => {
        if (!content) return ''
        const base = IMAGE_BASE_URL
        if (!base) return content
        return content.replace(
            /<img([^>]+)src=["']([^"']+)["']/g,
            (match, before, src) => {
                if (src.startsWith('http') || src.startsWith('data:'))
                    return match
                if (src.startsWith('/uploads/')) {
                    return `<img${before}src="${base}${src}"`
                }
                return `<img${before}src="${base}/uploads/${src}"`
            },
        )
    }, [])

    /**
     * Handle content change: detect removed images and call delete API.
     */
    const handleContentChange = useCallback(
        (value: string, onChange: (val: string) => void) => {
            const currentImages = extractContentImages(value)
            const prevImages = previousImagesRef.current

            // Find images that were in old content but not in new
            const removedImages = Array.from(prevImages).filter(
                (filename) => !currentImages.has(filename),
            )

            for (const filename of removedImages) {
                // Image was removed — call delete API (fire and forget)
                fetch(`${API_URL}/blog/delete-content-image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename }),
                    credentials: 'include',
                }).catch((err) =>
                    console.warn(
                        'Failed to delete content image:',
                        filename,
                        err,
                    ),
                )
            }

            previousImagesRef.current = currentImages
            onChange(value)
        },
        [extractContentImages],
    )

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Initialize previous images tracking on first render with content
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    if (field.value) {
                        previousImagesRef.current = extractContentImages(
                            field.value,
                        )
                    }
                }, [])

                return (
                    <FormItem className='md:col-span-2'>
                        <FormLabel className='capitalize font-semibold mb-2 text-base'>
                            {label}
                        </FormLabel>
                        <FormControl>
                            <div>
                                <CKEditorComponent
                                    value={fixImageUrls(field.value || '')}
                                    onChange={(data: string) =>
                                        handleContentChange(
                                            data,
                                            field.onChange,
                                        )
                                    }
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}
