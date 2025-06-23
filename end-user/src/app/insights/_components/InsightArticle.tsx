import { Blog } from "@/constants/payload"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import InsightContent from "./InsightContent"

export default function InsightArticle({ blogs }: { blogs: Blog[] }) {
    if (!blogs) return null
    return (
        <div className="flex flex-col w-full gap-y-5 gap-x-4 lg:gap-x-2">
            {blogs.map((blog) => (
                <article key={blog.id} className="py-3 lg:py-2">
                    <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
                        <div className="w-full md:w-1/3">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${blog.image}`}
                                alt={blog.title}
                                className="w-full h-52 object-cover rounded-lg border-[1px] border-gray-300 shadow-sm"
                                width={1920}
                                height={1080}
                                quality={100}
                            />
                        </div>
                        <div className="md:w-2/3 flex flex-col gap-2 justify-center">
                            <Link href={`/insights/${blog.slug}`} className={`text-lg md:text-xl lg:text-2xl font-bold text-primary hover:underline hover:underline-offset-3 font-heading !leading-[140%] duration-500 transition-all`}>{blog.title}</Link>
                            <p className="order-2 md:order-1 flex lg:items-center gap-1 md:gap-2 justify-start text-xs lg:text-base text-gray-500">
                                <span>{blog.user.name ?? "Anonymous"}</span>
                                {" • "}
                                <span>{dayjs(blog.createdAt).format("MMMM D, YYYY")}</span>
                            </p>
                            <div className='order-1 md:order-2'>
                                <InsightContent content={blog.content} className='text-sm lg:text-base text-gray-600 line-clamp-2' />
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}