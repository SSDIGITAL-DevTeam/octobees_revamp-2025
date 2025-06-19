"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { CornerUpLeft } from 'lucide-react';
const BackArticleButton = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/insights")} className='text-primary text-lg font-semibold absolute top-24 lg:top-32 left-4 md:left-0 flex gap-3 items-center hover:bg-red-100/50 transition-colors duration-300 rounded-xl py-2.5 px-4 cursor-pointer'>
      <CornerUpLeft size={22} className='' /> <span className='lg:block hidden'>Back</span>
    </button>
  )
}

export default BackArticleButton