"use client"
import { BlogCategory } from "@/constants/payload";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InsightCategory({ categories, id }: { categories: BlogCategory[], id?: string }) {
    return (
        <div className="border-[1px] border-gray-200 shadow-sm rounded-xl">
            <h3 className="text-sm lg:text-lg font-bold p-4 lg:p-6">Category</h3>
            <div className="flex flex-col justify-normal">
                {categories?.map((category, index) => {
                    let isSelectCategory = id === category.slug ? 'font-semibold' : '';
                    return (
                        <Link href={`/insights/category/${category.slug}`} key={`category-${index}`} className={`w-full text-left p-3 lg:py-3 hover:font-semibold  lg:px-5 justify-between flex items-center text-sm lg:text-base text-primary border-t border-gray-300 transition-all duration-500 ${isSelectCategory}`}>
                            {category.name} <ArrowRight className='text-primary' />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}