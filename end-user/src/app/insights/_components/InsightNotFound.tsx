"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogNotFound from '@/assets/homepage/svg/asset-blog-notfound.svg'

export default function InsightNotFound(): JSX.Element {
    const router = useRouter();
    return (
        <div className='w-full flex flex-col gap-4 justify-center items-center text-gray-400 py-10'>
            <Image src={BlogNotFound} alt='Blog Not Found' className=' object-contain w-[60%] md:w-[30%]' />
            <h2 className='text-center text-xl md:text-2xl font-bold w-full md:w-[40%]'>Our Blog is Coming Soon</h2>
            <p className='text-center w-[80%] sm:w-[40%] text-sm md:text-lg'>We’re excited to start sharing insights, stories, and updates with you! Right now, this space is still empty</p>
            <Button onClick={() => router.push("/insights")} className='w-[80%] md:w-[40%] rounded-3xl py-3 mt-3 font-semibold'>Back to Home Page</Button>
        </div>
    )
}