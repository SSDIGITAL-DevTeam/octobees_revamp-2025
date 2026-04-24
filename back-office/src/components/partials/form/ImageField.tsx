'use client'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ImageIcon, X, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Control } from 'react-hook-form'

type InputFieldProps = {
    name: string
    label: string
    control: Control<any>
    className?: string
    disabled?: boolean
    setImageFile: (file: File) => void
    defaultImage?: string
}

const ImageField = ({
    control,
    name,
    label,
    className,
    setImageFile,
    defaultImage,
}: InputFieldProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (defaultImage) {
            setPreviewUrl(defaultImage)
        }
    }, [defaultImage])

    const handleFile = (file: File | undefined) => {
        if (!file) return
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) handleFile(file)
    }

    const handleRemove = () => {
        setPreviewUrl(null)
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
                            {previewUrl ? (
                                /* Preview State */
                                <div className='w-full sm:max-w-sm'>
                                    <div className='relative group rounded-xl overflow-hidden border border-border'>
                                        <Image
                                            src={previewUrl}
                                            alt='Cover preview'
                                            width={600}
                                            height={400}
                                            className='w-full object-cover max-h-52'
                                        />
                                        {/* Desktop: hover overlay */}
                                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-3'>
                                            <button
                                                type='button'
                                                onClick={() =>
                                                    inputRef.current?.click()
                                                }
                                                className='bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition'
                                            >
                                                Change
                                            </button>
                                            <button
                                                type='button'
                                                onClick={handleRemove}
                                                className='bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-600 transition flex items-center gap-1'
                                            >
                                                <X size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile: always-visible action buttons below image */}
                                    <div className='flex gap-2 mt-2 sm:hidden'>
                                        <button
                                            type='button'
                                            onClick={() =>
                                                inputRef.current?.click()
                                            }
                                            className='flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition'
                                        >
                                            <Pencil size={13} /> Change
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleRemove}
                                            className='flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-100 transition'
                                        >
                                            <X size={13} /> Remove
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
                    w-full sm:max-w-sm h-40 rounded-xl border-2 border-dashed transition-all
                    ${
                        isDragging
                            ? 'border-red-400 bg-red-50'
                            : 'border-red-200 bg-red-50/40 hover:bg-red-50 hover:border-red-400'
                    }
                  `}
                                >
                                    <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
                                        <ImageIcon
                                            size={20}
                                            className='text-red-500'
                                        />
                                    </div>
                                    <div className='text-center px-4'>
                                        <p className='text-sm font-medium text-gray-700'>
                                            <span className='sm:hidden'>
                                                Tap to upload
                                            </span>
                                            <span className='hidden sm:inline'>
                                                Click or drag & drop
                                            </span>
                                        </p>
                                        <p className='text-xs text-gray-400 mt-0.5'>
                                            PNG, JPG, WEBP up to 10MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Hidden real file input */}
                            <input
                                ref={inputRef}
                                type='file'
                                accept='image/*'
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

export default ImageField
