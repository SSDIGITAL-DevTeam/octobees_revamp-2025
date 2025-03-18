"use client";

import React, { JSX} from "react";
import BlogLayout from "@/components/partials/BlogLayout/BlogLayout";

export default function Page(): JSX.Element {
  return (
    <main className="w-full py-24 lg:px-10 px-8">
      <header className="flex flex-col justify-normal items-start overflow-x-hidden gap-2 lg:gap-4 xl:py-12 py-8 max-w-7xl mx-auto">
        <h1 className="text-primary font-bold text-2xl lg:text-4xl font-heading !leading-[120%]">
          Our Latest Blog Posts
        </h1>
        <p className="text-sm md:text-base text-gray-600 lg:text-xl !leading-[150%] w-[70%] lg:w-full ">
          Discover the latest insights, trends, and news from our expert team.
        </p>
      </header>
      <div className="w-full border-b-[1.2px] border-gray-300" />
      <section className="flex flex-col overflow-x-auto lg:max-w-7xl mx-auto py-8">
        <BlogLayout/>
      </section>
    </main>
  );
}