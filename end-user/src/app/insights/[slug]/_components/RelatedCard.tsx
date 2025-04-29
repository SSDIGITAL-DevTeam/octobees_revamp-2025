"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import BlogContent from "@/components/partials/BlogLayout/BlogContent";

const RelatedPostCard = ({ data }: { data: [] }) => {
  return (
    <main className="max-w-4xl mx-auto flex flex-col gap-8 px-10">
      <h2 className="font-heading text-2xl md:text-2xl lg:text-3xl text-primary font-semibold">Related Posts</h2>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data.map((d: any, i: number) => (
          <div key={`related-image-${i + 1}`} className="flex flex-col h-full w-full rounded-2xl border-[1px] border-gray-300 shadow-sm hover:shadow-lg transition-all">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${d.blog.image}`}
              alt={`${d.blog.title} image`}
              className="object-cover rounded-t-2xl h-[50%]"
              width={1920}
              height={1080}
            />
            <div className="w-full border-t-[1px] border-gray-400 bg-white flex flex-col h-1/2 rounded-b-2xl justify-center gap-4 p-6">
              <Link href={`/insights/${d.blog.slug}`} className="hover:underline duration-500 transition-all text-lg lg:text-xl font-semibold text-primary line-clamp-2 font-heading !leading-[120%]">
                {d.blog.title}
              </Link>
              <BlogContent content={d.blog.content} className="text-sm lg:text-base line-clamp-3 text-gray-600 !leading-[150%]" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default RelatedPostCard;