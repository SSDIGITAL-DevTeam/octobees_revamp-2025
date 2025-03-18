"use client"
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogCategory({ data }: { data: any }) {
    const {id} = useParams()
    return (
        <div className="border-[1px] border-gray-200 shadow-sm rounded-md">
            <h3 className="text-sm lg:text-lg font-bold p-4 lg:p-6">Category</h3>
            <div className="flex flex-col justify-normal">
                {data?.map((cat: any, index: number) => (
                    <Link href={`/insights/category/${cat.id}`} key={`category-${index}`} className={`w-full text-left p-3 lg:py-3 hover:font-semibold lg:px-5 justify-between flex items-center text-sm lg:text-base text-primary border-t border-gray-300 ${id == cat.id ? 'font-semibold' : '  transition-colors duration-300'}`}>
                        {cat.name} <ArrowRight className='text-primary' />
                    </Link>))}
            </div>
        </div>
    )
}