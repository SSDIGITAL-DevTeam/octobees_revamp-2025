"use client"
import { BlogCategory } from "@/constants/payload";
import { axiosInstance } from "@/lib/axios";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function InsightCategory() {
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const { id } = useParams()
    useEffect(() => {
        const fetchCategories = async () => {
            const categoriesResponse = await axiosInstance.get(`/blog-category`, {
                params: {
                    status: true
                }
            })
            setCategories(categoriesResponse.data.data);
        }
        fetchCategories()
    }, [id])

    return (
        <div className="border-[1px] border-gray-200 shadow-sm rounded-xl">
            <h3 className="text-sm lg:text-lg font-bold p-4 lg:p-6">Category</h3>
            <div className="flex flex-col justify-normal">
                {categories?.map((category, index) => (
                    <Link href={`/insights/category/${category.slug}`} key={`category-${index}`} className={`w-full text-left p-3 lg:py-3 hover:font-semibold lg:px-5 justify-between flex items-center text-sm lg:text-base text-primary border-t border-gray-300 transition-colors duration-300 ${id == category.id && 'font-semibold'}`}>
                        {category.name} <ArrowRight className='text-primary' />
                    </Link>))}
            </div>
        </div>
    )
}