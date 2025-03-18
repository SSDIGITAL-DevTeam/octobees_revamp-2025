"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  CircleUser,
  CornerUpLeft,
  Tag,
  User,
} from "lucide-react";

const data = {
  id: 4,
  title:
    "Judul sit amet, consectetur adipisicing elit. A minus consequatur possimus. Quidem illo velit mollitia, eum corr",
  slug: "4",
  description:
    `# **Lorem Ipsum Dolor Sit Amet**\nLorem ipsum dolor sit amet, consectetur **adipisicing elit**.\n_A minus consequatur possimus._ Quidem illo velit mollitia, eum corrupti sunt hic!\n---\n\n## **Mengapa Lorem Ipsum?**  \n  \n- **Lorem**: Teks ini sering digunakan dalam desain dan pengembangan web.  \n- **Ipsum**: Berguna untuk menguji tata letak sebelum konten asli dimasukkan.  \n- **Dolor**: Membantu fokus pada elemen visual tanpa teralihkan oleh makna teks.  \n  \n---  \n  \n## **Kategori**  \n  \nBerikut adalah beberapa kategori terkait:  \n  \n1. **Manusia** 🧑‍🤝‍🧑  \n   - Studi tentang perilaku dan interaksi manusia.  \n2. **Hewan** 🐾  \n   - Dunia fauna dan ekosistemnya.  \n3. **Tumbuhan** 🌿  \n   - Keanekaragaman flora di berbagai habitat.  \n  \n---  \n  \n## **Tentang Penulis**  \n  \n✍️ Ditulis oleh **Ryan** (ID: 12414)  \n📅 Dipublikasikan pada **23 Desember 2024**  \n  \n> "Menulis adalah cara terbaik untuk menuangkan gagasan dan berbagi pengetahuan."  \n  \n---  \n  \nSemoga ini sesuai dengan yang kamu inginkan! 🚀  \nJika ingin ada tambahan lain, beri tahu saya. 😊  
    `,
  status: "active",
  published_at: "2024-12-23T00:02:23",
  category: [
    {
      id: 1,
      name: "mANUSIA",
      slug: "mAUSIAN",
    },
    {
      id: 2,
      name: "hEWANB",
      slug: "Hewan",
    },
    {
      id: 3,
      name: "Tumbuhan",
      slug: "TUmbuhan",
    },
    {
      id: 4,
      name: "Tumbuhan",
      slug: "TUmbuhan",
    },
    {
      id: 5,
      name: "Tumbuhan",
      slug: "TUmbuhan",
    },
  ],
  author: {
    id: 12414,
    name: "ryan",
  },
};

import BackArticleButton from "@/components/partials/Button/BackArticleButton";
import ShareSocmedButton from "@/components/partials/Button/ShareSocmedButton";
import AdsCarousel from "@/app/insights/[slug]/_components/AdsCarousel";
import RelatedPostCard from "@/app/insights/[slug]/_components/RelatedCard";
import BlogContent from "@/components/partials/BlogLayout/BlogContent";
import dayjs from "dayjs";
import { axiosInstance } from "@/lib/axios";

export default function ArticleDetail({
  params,
}: {
  params: { slug: string };
}) {

  const [blog, setBlog]= useState<any>([]);
  const [category, setCategory]= useState<any>([]);
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
          const blogs = await axiosInstance.get(`/blog/${params.slug}`)
          const categories = await axiosInstance.get(`/blog-category/${blogs.data.categoryId}`)
        setBlog(blogs.data);
        setCategory(categories.data);

      } catch (error:any) {
        console.error(error?.response?.data.error || error?.message || "Error fetching blog posts");
      }
    }
    fetchBlogPosts();
  }, [])

  return (
    <main className="overflow-x-hidden flex flex-col gap-10 lg:gap-20 max-w-7xl mx-auto lg:min-h-screen py-36 pb-[60px] lg:pt-[180px] bg-white relative">
      <BackArticleButton />
      <article className="container lg:max-w-4xl mx-auto flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-wrap lg:w-full gap-5 justify-center items-center">
            <p
              className="bg-gray-100 text-xs lg:text-base capitalize rounded-3xl px-5 py-2 font-semibold text-gray-700 flex items-center gap-2 shadow-sm"
            >
              {category.name}
            </p>
        </div>
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary lg:text-center text-left !leading-[120%] font-heading">
          {blog.title}
        </h1>

        {/* Author */}
        <div className="flex flex-row items-center justify-between text-gray-600">
          <div className="flex items-center bg-white w-full lg:gap-4 gap-3">
            <CircleUser className="text-primary w-6 h-6 lg:w-10 lg:h-10" />
            <div className="flex flex-col justify-center lg:gap-1 gap-[2px] h-full">
              <p className="text-sm lg:text-lg capitalize font-semibold">
                {blog.role?.name}
              </p>
              <p className="font-normal text-xs lg:text-sm">{dayjs(blog.createdAt).format("DD MMMM YYYY")}</p>
            </div>
          </div>
          <ShareSocmedButton title={blog.title} slug={params.slug}/>
        </div>

        <div className="relative w-full h-[50%] md:h-[400px] lg:mb-10 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={`http://localhost:3004/uploads/${blog.image}`}
            alt={`image-${blog.title}`}
            width={1920}
            height={1080}
            quality={100}
            className="object-contain w-full h-full"
          />
        </div>
        <BlogContent content={blog.content} className="!leading-[150%] text-sm lg:text-base" />
      </article>
      <RelatedPostCard data={category?.blogs}/>
      <AdsCarousel />
    </main>
  );
}