'use client'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { FileText, ExternalLink, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Control } from 'react-hook-form'

type PdfFieldProps = {
    name: string
    label: string
    control: Control<any>
    className?: string
    disabled?: boolean
    setPdfFile: (file: File) => void
    defaultPdf?: string
}

const PdfField = ({
    control,
    name,
    label,
    className,
    setPdfFile,
    defaultPdf,
}: PdfFieldProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (defaultPdf) {
            setPreviewUrl(defaultPdf)
            const parts = defaultPdf.split('/')
            setFileName(parts[parts.length - 1])
        }
    }, [defaultPdf])

    const handleFile = (file: File | undefined) => {
        if (!file) return
        setPdfFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setFileName(file.name)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file && file.type === 'application/pdf') handleFile(file)
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        setFileName(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel className='capitalize font-semibold mb-2 text-base'>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <div>
                            {previewUrl && fileName ? (
                                /* PDF Selected State — full width on mobile, capped on desktop */
                                <div className='flex items-center gap-3 p-3 rounded-xl border border-blue-200 bg-blue-50 w-full sm:max-w-sm'>
                                    <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0'>
                                        <FileText
                                            size={18}
                                            className='text-blue-600'
                                        />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-xs sm:text-sm font-medium text-gray-800 truncate'>
                                            {fileName}
                                        </p>
                                        <p className='text-xs text-gray-400'>
                                            PDF Document
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-1 shrink-0'>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                window.open(
                                                    previewUrl,
                                                    '_blank',
                                                )
                                            }
                                            className='p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition'
                                            title='Preview PDF'
                                        >
                                            <ExternalLink size={15} />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleRemove}
                                            className='p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition'
                                            title='Remove PDF'
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Upload Zone */
                                <div
                                    onClick={() => inputRef.current?.click()}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setIsDragging(true)
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`
                    cursor-pointer flex flex-col items-center justify-center gap-3
                    w-full sm:max-w-sm h-36 rounded-xl border-2 border-dashed transition-all
                    ${
                        isDragging
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400'
                    }
                  `}
                                >
                                    <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                                        <FileText
                                            size={18}
                                            className='text-blue-500'
                                        />
                                    </div>
                                    <div className='text-center px-4'>
                                        <p className='text-sm font-medium text-gray-700'>
                                            <span className='sm:hidden'>
                                                Tap to upload PDF
                                            </span>
                                            <span className='hidden sm:inline'>
                                                Click or drag & drop
                                            </span>
                                        </p>
                                        <p className='text-xs text-gray-400 mt-0.5'>
                                            PDF only
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Hidden file input */}
                            <input
                                ref={inputRef}
                                type='file'
                                accept='application/pdf'
                                className='hidden'
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        field.onChange(file)
                                        handleFile(file)
                                    }
                                }}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default PdfField
