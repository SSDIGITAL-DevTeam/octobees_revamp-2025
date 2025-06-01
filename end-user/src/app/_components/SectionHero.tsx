import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroSectionImage from '@/assets/homepage/png/hero-section-image.png';
import { brandHome } from "@/constants/brands";
import { Button } from "@/components/ui/button";

export default function SectionHero() {
  return (
    <>
      <div className="bg-primary/20 rounded-full overflow-x-hidden h-[70%] w-[60%] absolute top-0 md:top-40 right-0 lg:right-0 blur-[90px] z-[50]" />
      <div className="container flex flex-col gap-8 md:gap-10 justify-center items-center md:items-start">
        <h1 className="font-semibold text-gray-500 text-sm lg:text-2xl flex flex-col gap-2 lg:gap-4 text-center md:text-left">
          WE ARE
          <span className="!leading-[130%] font-bold font-heading text-[2.4rem] md:text-5xl lg:text-6xl text-black text-center md:text-left">
            Your <span className="text-primary"> Revenue <br />Growth</span> Partner
          </span>
        </h1>
        <div className="w-full flex flex-col items-center md:items-start gap-y-4">
          <span className="text-xs lg:text-lg text-gray-500 !leading-[130%] text-center md:text-left">
            TRUSTED BY GROWING COMPANIES
          </span>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
            {brandHome.map((brand, index) => (
              <div key={index} className="p-1">
                <Link
                  href={brand.web || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${brand.name}`}
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo of ${brand.name}, trusted partner`}
                    width={1920}
                    height={1080}
                    className="object-contain w-16 md:24 lg:w-28"
                  />
                </Link>
              </div>
            ))}
            <p className="text-primary font-semibold text-base md:text-lg">40+ Companies</p>
          </div>
        </div>

        <Link
          href="/increase-my-sales"
          className="w-full md:w-auto"
        >
          <Button variant={"increasesales"} size={"normal"} className="hover:scale-105 duration-500 transition-all">
            Increase My Sales<TrendingUp />
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-end w-full">
        <Image
          src={HeroSectionImage.src}
          alt="Asset Banner Hero"
          width={1000}
          height={1000}
          className="rounded-xl md:rounded-[2rem] z-[52] w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    </>
  )
}