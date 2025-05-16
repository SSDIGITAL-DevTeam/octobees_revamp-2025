"use client"
import { Button } from "@/components/ui/button";
import NotFoundGif from '@/assets/not-found/404 dpa.gif'
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter()


  return (
    <main className="w-full h-screen bg-white lg:pt-44">
      <section className="max-w-7xl mx-auto h-full flex flex-col justify-center lg:justify-start items-center lg:items-start gap-2 lg:gap-6 relative px-10">
        <div className="lg:hidden flex flex-col items-center font-extrabold text-primary gap-5 mb-6">
          <p className="text-2xl lg:text-5xl">Oops! Error</p>
          <Image src={NotFoundGif} alt="404" width={400} height={400} className="w-full sm:max-w-[500px]" />
        </div>
        <h1 className="text-center md:text-left text-xl md:text-3xl lg:text-5xl font-semibold">Sorry, This Page Doesn’t Exist</h1>
        <p className="text-center md:text-left text-sm md:text-xl !leading-[130%] text-gray-600">the page you’re looking for doesn’t exist or may have been moved.</p>
        <Button onClick={() => router.push('/')} className="py-3 px-6 font-semibold rounded-xl lg:mt-0 mt-7 bg-red-700">Return to the Homepage</Button>
        <div className="hidden absolute bottom-10 right-10 lg:flex flex-col items-end font-bold text-red-700 gap-8 md:max-w-[40vw]">
          <p className="text-5xl">Oops! Error</p>
          <Image src={NotFoundGif} alt="404" width={400} height={400} className="w-full" />
        </div>
      </section>
    </main>
  )
}