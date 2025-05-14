"use client";

import { JSX, useState, useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Icon from "@/assets/thanks/Icon.png"


export default function Page(): JSX.Element {
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!slug) return notFound();

    const validSlugs = ["plans", "contact-us", "increase-your-sales"];
    if (!validSlugs.includes(String(slug))) return notFound();
  }, [slug]);


  return (
    <main className="w-full h-screen">
      <section className="w-full flex flex-col gap-10 items-center justify-center h-full px-5">
        <Image src={Icon.src} alt="icon-image" width={1920} height={1080} className="object-contain w-28 h-28 md:w-36 md:h-36 bg-red-200 rounded-full mx-auto" />
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="font-heading text-center mx-auto max-w-xl font-semibold text-xl sm:text-2xl md:text-3xl !leading-[120%] capitalize">
            Thank You! We&apos;ve Received Your Inquiry!
          </h1>
          <p className="text-center !leading-[150%] font-body text-sm md:text-lg text-gray-600 sm:max-w-[60%]">Hello! We appreciate you providing your details. Our team will contact you soon to help address your needs.</p>
        </div>
        <Button className=" w-full py-3 rounded-3xl text-base md:text-lg font-semibold bg-primary text-white max-w-64 mx-auto" onClick={() => router.push("/")}>Continue</Button>
      </section>
    </main>
  );
}

