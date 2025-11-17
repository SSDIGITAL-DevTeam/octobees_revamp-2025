/* eslint-disable @next/next/no-img-element */
"use client"

import { brandHome } from "@/constants/brands";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroSectionImage from '@/assets/increase/webp/increase.webp';
import GridServices from "./_components/GridServices";
import { task, pointIcon, slides, CreativeDesign } from "@/constants/increase"
import ImageSection from "./_components/ImageSection";
import EmblaCarousel from "./_components/EmblaCarousel";
import GetStartedButton from "./_components/GetStartedButton";
import Script from "next/script";
import HeaderContactUs from "../contact-us/_components/HeaderContactUs";
import FAQSchema from "@/app/seo/schema/FAQSchema";

export default function IncreaseMySales() {
    const faqs = [
        {
            question: "How quickly can Octobees launch a growth campaign?",
            answer: "Discovery to launch typically takes 2–3 weeks depending on asset readiness and ad platform approvals.",
        },
        {
            question: "Do you provide a dedicated team?",
            answer: "Yes, every engagement receives a strategist, media buyer, creative lead, and marketing technologist from our in-house digital squad.",
        },
    ];
    return (
        <>
            <Script id="fb-pixel" strategy="afterInteractive">
                {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2123659238113302');
          fbq('track', 'PageView');
        `}
            </Script>

            {/* Fallback if JS disabled */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src="https://www.facebook.com/tr?id=2123659238113302&ev=PageView&noscript=1"
                    alt="Facebook pixel tracking"
                />
            </noscript>

            <main>
                <FAQSchema items={faqs} />
                <header className="px-8 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-0 bg-white lg:min-h-screen md:max-w-7xl md:mx-auto pt-32 lg:pt-[100px]">
                    <div className="container flex flex-col gap-6 justify-center items-center md:items-start">
                        <span className="font-semibold text-primary text-sm lg:text-lg flex gap-2 items-center justify-center lg:gap-4 text-center rounded-full py-2 px-4 border border-gray-300 shadow-sm tracking-wide">
                            <TrendingUp /> Why Us?
                        </span>
                        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-black !leading-[130%] font-semibold text-center md:text-left ">
                            Why Partner With Us to Increase Your Sales?
                        </h1>
                        <h3 className="text-sm lg:text-lg text-gray-500 !leading-[140%] sm:max-w-full text-center md:text-left mx-auto md:mx-0">
                            We bring 360° marketing solutions—data-driven, results-focused, and partnership-powered. No big budget? No problem. We make every dollar count
                        </h3>

                        <div className="flex gap-5 my-3 flex-col lg:flex-row w-full">
                            <GetStartedButton />
                            <Link
                                href="#our-team"
                                className="bg-gray-100 text-center md:text-left w-full lg:w-fit hover:bg-gray-300/60 px-8 py-3 lg:py-3 font-semibold text-gray-500 rounded-3xl text-base md:text-lg transition-all duration-500 shadow-md hover:shadow-gray-600/50 hover:shadow-lg border-[1px] border-gray-300"
                            >
                                Our Team
                            </Link>
                        </div>
                        <span className="text-gray-500 text-sm sm:text-base">TRUSTED BY GROWING COMPANIES</span>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 md:gap-4">
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
                                            className="object-contain w-12 sm:w-20"
                                        />
                                    </Link>
                                </div>
                            ))}
                            <p className="text-primary font-semibold text-sm sm:text-lg">40+ Companies</p>
                        </div>
                    </div>
                    <div className="w-full md:max-w-[40vw]">
                        <Image
                            src={HeroSectionImage.src}
                            alt="Asset Banner Hero"
                            width={1000}
                            height={1000}
                            className="rounded-xl md:rounded-[2rem] z-[52] w-full h-full object-contain"
                            loading="lazy"
                        />
                    </div>
                </header>

                <section className="px-8 flex flex-col items-center justify-center gap-12 md:gap-14 lg:min-h-screen md:max-w-7xl md:mx-auto py-20">
                    <h1 className="font-heading text-2xl lg:text-4xl text-black !leading-[140%] font-semibold max-w-xl text-center">
                        We offer tailored digital services to help your business grow
                    </h1>
                    <GridServices />
                </section>

                <section className="px-8 w-full lg:min-h-screen bg-[#F9EBEC] -scroll-mt-32 scroll-smooth" id="our-team">
                    <div className="flex flex-col items-center justify-center gap-5 md:max-w-7xl md:mx-auto py-20">
                        <h1 className="font-heading text-3xl lg:text-4xl text-black font-semibold max-w-xl text-center">
                            One Solution for All Your Tasks
                        </h1>
                        <p className="text-gray-700 text-base md:text-lg max-w-xl text-center !leading-[130%] mb-8">Stop wasting time and money on hiring multiple specialists! Our team consists of all the experts you need to run a successful campaign</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-5">
                            {
                                task.map((data, index) => (
                                    <div key={index} className="w-full min-h-[45vh] bg-white shadow-sm transition-all duration-300 hover:shadow-md py-12 px-10 rounded-2xl flex flex-col gap-5 justify-center items-center">
                                        <span className="text-5xl">{data.icon}</span>
                                        <h3 className="text-center text-2xl md:text-3xl font-heading text-primary font-semibold !leading-[150%]">{data.title}</h3>
                                        <p className="text-center text-gray-700 text-sm md:text-base !leading-[140%]">{data.desc}</p>
                                        <ul className="!leading-[140%] space-y-2 text-base md:text-lg">
                                            {
                                                data.list.map((item, index) => (
                                                    <li key={index} className="flex gap-2 items-center">{pointIcon} {item}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }

                        </div>
                        <GetStartedButton />
                    </div>
                </section>

                <section className="px-8 flex flex-col items-center justify-center gap-10 lg:min-h-screen md:max-w-7xl md:mx-auto py-20">
                    <ImageSection />
                </section>

                <section className="px-8 flex flex-col gap-20 lg:min-h-screen md:max-w-7xl md:mx-auto py-12 md:py-20">
                    <div className="flex md:justify-between flex-col md:flex-row items-center gap-5">
                        <div className="flex flex-col items-center md:items-start gap-5">
                            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl text-black font-semibold !leading-[150%] text-center md:text-left">Glimpse Of Our Creative Design Projects</h2>
                            <p className="text-gray-700 text-base md:text-lg max-w-2xl !leading-[140%] text-center md:text-left">Our talented internal design team crafts compelling and eye-catching visuals tailored for your social media channels. Check out this curated collection of designs we’ve produced for our clients:</p>
                        </div>
                        <GetStartedButton />
                    </div>
                    <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                        {CreativeDesign.map((img, i) => (
                            <div key={i} className="mb-4 break-inside-avoid">
                                <Image
                                    src={img}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-auto rounded-xl object-cover shadow-sm transition-all duration-300 hover:shadow-md"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="px-8 lg:min-h-screen w-full space-y-10">
                    <div className="flex flex-col items-center md:items-start md:max-w-7xl md:mx-auto py-12 md:py-20">
                        <div className="flex md:justify-between flex-col md:flex-row items-center gap-6 w-full">
                            <div className="flex flex-col gap-5">
                                <h2 className="text-center md:text-left font-heading text-2xl md:text-3xl lg:text-4xl text-black font-semibold !leading-[140%]">Our Web Design & Development Work</h2>
                                <p className="text-center md:text-left text-gray-700 text-base md:text-lg max-w-2xl !leading-[140%]">We transform ideas into high-performing websites with seamless functionality and cutting-edge design. Take a look at our portfolio of client projects that deliver real results.</p>
                            </div>
                            <GetStartedButton />
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-7 w-full pb-20'>
                        <EmblaCarousel side='right' slides={slides.slice(0, 5)} />
                        <EmblaCarousel side='left' slides={slides.slice(5, 10)} />
                    </div>
                </section>

                <section id="contact" className="-scroll-mt-28 scroll-smooth">
                    <div className="flex flex-col overflow-x-hidden bg-[#F7E6E7]">
                        <HeaderContactUs source="Increase My Sales"/>
                    </div>
                </section>
            </main>
        </>
    )
}   
