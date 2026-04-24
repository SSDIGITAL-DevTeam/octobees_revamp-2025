import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Control } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

type Radio = {
    title: string
    value: string
}

type RadioGroupFieldProps = {
    name: string
    label: string
    control: Control<any>
    data: Radio[]
}

const statusBadge: Record<string, { selected: string; dot: string }> = {
    Published: {
        selected: 'bg-green-500 text-white border-green-500',
        dot: 'bg-green-400',
    },
    Draft: {
        selected: 'bg-yellow-400 text-white border-yellow-400',
        dot: 'bg-yellow-400',
    },
    Archived: {
        selected: 'bg-gray-400 text-white border-gray-400',
        dot: 'bg-gray-400',
    },
}

const RadioGroupField = ({
    control,
    name,
    label,
    data,
}: RadioGroupFieldProps) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='space-y-2'>
                    <FormLabel className='capitalize font-semibold text-base'>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className='flex flex-wrap gap-2'
                        >
                            {data.map((item, index) => {
                                const isSelected = field.value === item.value
                                const colors = statusBadge[item.value] ?? {
                                    selected:
                                        'bg-slate-500 text-white border-slate-500',
                                    dot: 'bg-slate-400',
                                }

                                return (
                                    <FormItem
                                        key={index}
                                        className='flex items-center space-y-0'
                                    >
                                        {/* Visually hidden radio input */}
                                        <FormControl className='sr-only'>
                                            <RadioGroupItem
                                                value={item.value}
                                                id={`${name}-${item.value}`}
                                            />
                                        </FormControl>

                                        <FormLabel
                                            htmlFor={`${name}-${item.value}`}
                                            className={cn(
                                                // base styles - mobile-first
                                                'cursor-pointer select-none',
                                                'flex items-center gap-1.5',
                                                'px-3 py-1.5 sm:px-4 sm:py-2',
                                                'rounded-full border transition-all duration-150',
                                                'text-xs sm:text-sm font-medium',
                                                isSelected
                                                    ? colors.selected
                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300',
                                            )}
                                        >
                                            {/* Status dot */}
                                            <span
                                                className={cn(
                                                    'w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full inline-block shrink-0',
                                                    isSelected
                                                        ? 'bg-white'
                                                        : colors.dot,
                                                )}
                                            />
                                            {item.title}
                                        </FormLabel>
                                    </FormItem>
                                )
                            })}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default RadioGroupField
