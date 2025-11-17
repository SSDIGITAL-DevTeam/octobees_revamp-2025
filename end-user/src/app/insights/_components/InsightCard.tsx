// components/InsightCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { InsightContent } from '@/app/insights/_components';
import { Blog } from '@/constants/payload';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';

type InsightCardProps = {
    data: Blog;
};

export default function InsightCard({ data }: InsightCardProps) {
    return (
        <div
            className={`relative shadow-md rounded-xl w-full h-[300px] md:h-[420px] overflow-hidden`}
        >
            <Image
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${data.image}`}
                alt={data.title}
                fill
                className="object-cover w-full h-full"
                quality={100}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 from-10% via-black/40 via-80% to-transparent text-white flex flex-col justify-between gap-5 p-5 lg:p-12">
                <div className='flex flex-col justify-start gap-2 lg:gap-3'>
                    <span className='text-sm lg:text-base'> {data.user.name} • {dayjs(data.createdAt).format("MMMM D, YYYY")}</span>
                    <h2 className="text-lg sm:text-xl lg:text-4xl font-semibold !leading-[130%] line-clamp-3 font-heading md:max-w-[500px]">
                        {data.title}
                    </h2>
                    <InsightContent content={data.content} className='line-clamp-2 lg:text-base text-sm text-white/80 md:max-w-[500px]' />
                </div>
                <Link href={`/insights/${data.slug}`}>
                    <Button className='rounded-xl bg-white/20 border border-white hover:bg-white/40 text-white !leading-[120%] transition-all duration-300 flex items-center gap-2 pe-2 font-semibold'>Read More <ChevronRight/></Button>
                </Link>
            </div>
        </div>
    );
}
