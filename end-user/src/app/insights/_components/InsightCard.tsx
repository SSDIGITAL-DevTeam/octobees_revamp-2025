// components/InsightCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle2 } from 'lucide-react';
import { InsightContent } from '@/app/insights/_components';

type InsightCardProps = {
    data?: {
        blog: any;
        blogCategory: any;
        user: any;
    };
    large?: boolean;
    length?: number;
};

export default function InsightCard({ data, large = false, length }: InsightCardProps) {
    if (!data) return null;
    console.log(length)
    return (
        <Link
            href={`/insights/${data.blog.slug ?? ''}`}
            className={`relative border-[1px] border-gray-300 shadow-sm rounded-md overflow-hidden w-full 
                ${large && length == 3
                    ? 'lg:col-span-2 lg:row-span-2 lg:h-[60vh]'
                    : large && length == 2
                        ? 'h-[40vh] md:h-[60vh]'
                        : large && length == 1
                            ? 'h-[40vh] md:h-[60vh] w-full'
                            : 'h-[30vh]'
                }`}
        >
            {data.blog.image ? (
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${data.blog.image}`}
                    alt={data.blog.title ?? 'Blog Image'}
                    fill
                    className="object-cover w-full h-full"
                    quality={100}
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}

            {large ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent text-white flex-col flex gap-5 p-5 lg:p-12 justify-end">
                    <h2 className="text-xl lg:text-4xl font-semibold !leading-[130%] line-clamp-3">
                        {data.blog.title ?? 'Untitled'}
                    </h2>
                    <InsightContent content={data.blog.content} className='line-clamp-2 lg:text-base text-sm text-white/60' />
                </div>
            ) : (
                <div className="absolute bottom-0 left-0 w-full h-fit bg-white text-black flex flex-col gap-3 p-5 lg:py-5 lg:px-6 justify-end z-20">
                    <h2 className="text-base lg:text-lg font-medium !leading-[130%] line-clamp-3">
                        {data.blog.title ?? 'Untitled'}
                    </h2>
                    {/* <InsightContent content={data.blog.content} className='line-clamp-2 text-sm'/> */}
                    <p className="text-xs text-gray-600 !leading-[150%] flex gap-1 items-center">
                        <UserCircle2 className="text-primary lg:h-5 h-4" />
                        <span>{data.user?.name ?? 'Unknown Author'}</span>
                    </p>
                </div>
            )}
        </Link>
    );
}
