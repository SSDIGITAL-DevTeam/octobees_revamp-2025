// components/BlogCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserCircle2 } from 'lucide-react';
import BlogContent from './BlogContent';

type BlogCardProps = {
    data?: any; 
    size: 'large' | 'medium' | 'small';
};

export default function BlogCard({ data, size }: BlogCardProps) {
    if (!data) return null;
    return (
        <Link
             href={`/insights/${data.id ?? ''}`}
             className={`relative border-[1px] border-gray-300 shadow-sm rounded-md overflow-hidden w-full ${size === 'large' ? 'lg:col-span-2 lg:row-span-2 lg:h-[70vh]' : size === 'medium' ? 'h-[30]' : 'h-full'
             }`}
             > 
            {data.image ? (
                <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${data.image}`}
                    alt={data.title ?? 'Blog Image'}
                    fill
                    className="object-contain w-full h-full"
                    quality={100}
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                </div>
            )}

            {size === 'large' ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent text-white flex-col flex gap-2 p-5 lg:p-10 justify-end">
                    <h2 className="text-xl lg:text-4xl font-semibold !leading-[120%] line-clamp-3">
                        {data.title ?? 'Untitled'}
                    </h2>
                    <BlogContent content={data.content} className='line-clamp-2 lg:text-base text-sm text-white/60'/>
                </div>
            ) : (
                <div className="absolute bottom-0 left-0 w-full h-fit bg-white text-black flex flex-col gap-2 p-5 lg:py-5 lg:px-6 justify-end z-20">
                    <h2 className="text-base lg:text-xl font-semibold !leading-[120%] line-clamp-3">
                        {data.title ?? 'Untitled'}
                    </h2>
                    <BlogContent content={data.content} className='line-clamp-2 text-sm'/>
                    <p className="text-xs text-gray-600 !leading-[150%] flex gap-1 items-center">
                        <UserCircle2 className="text-primary lg:h-5 h-4" />
                        <span>{data.role?.name ?? 'Unknown Author'}</span>
                    </p>
                </div>
            )}
        </Link>
    );
}
