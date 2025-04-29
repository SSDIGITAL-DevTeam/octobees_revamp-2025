"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { CornerUpLeft } from 'lucide-react';
const BackArticleButton = () => {
  const router = useRouter();
    return (
    <div onClick={()=>router.back()} className='text-primary text-lg font-semibold absolute top-24 lg:top-32 left-0 flex gap-3 items-center hover:bg-gray-100 transition-colors duration-300 rounded-xl py-2.5 px-4 cursor-pointer'>
    <CornerUpLeft  size={22} className=''/> <span className='lg:block hidden'>Back</span>
    </div>
    )
}

export default BackArticleButton