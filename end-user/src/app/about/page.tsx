'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import AssetImprovingAbout from '@/assets/about/svg/about.svg';
import AssetHarvineAbout from '@/assets/about/png/asset-harvine-about.png';
import ImageAboutHero from "@/assets/about/webp/image-about-hero.webp"
import ImageAboutHeroMobile from "@/assets/about/webp/image-about-hero-mobile.webp"
import ImageAboutSection from "@/assets/about/webp/image-about-section.webp"
// import Head from 'next/head';
import { SectionClientBrand } from '@/app/about/_components';
import { SectionLabel } from '../_components';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';

type PageAboutType = {
  heading: string,
  subheading: string
}

const PageAboutMap: PageAboutType[] = [
  {
    heading: "20+",
    subheading: "Client worldwide"
  },
  {
    heading: "40+",
    subheading: "Companies we’ve helped to upscale"
  },
  {
    heading: "2 years",
    subheading: "of Operations"
  },
]

export default function PageAbout(): JSX.Element {
  return (
    <>
      {/* <Head>
        <link rel="preload" href="/assets/webp/asset-caring-about.webp" as="image" />
      </Head> */}
      <main>
        <header className='bg-[#C20000]/10 relative'>
          <div className="flex flex-col md:flex-row items-start h-[600px] lg:h-[800px]  w-full gap-y-8 md:gap-y-5">
            <div className='absolute w-full md:max-w-7xl px-10 pt-32 md:pt-36 lg:pt-44 flex flex-col items-center left-1/2 -translate-x-1/2 space-y-10 sm:space-y-5 md:space-y-10'>
              <div className='w-full h-fit flex lg:flex-row flex-col items-center justify-between space-y-6'>
                <h1 className="text-primary font-bold text-3xl md:text-4xl lg:text-6xl font-heading">ABOUT US</h1>
                <p className=" w-full lg:w-7/12 text-primary/90 lg:text-lg !leading-[150%] md:!leading-[170%] text-center lg:text-justify">
                  We believe that entrepreneurs are the visionaries shaping world&apos;s future. They navigate through challenges and uncover opportunities that push the boundaries of what&apos;s possible. At Octobees, we ensure that entrepreneurs stay focused on innovation and growth. By managing their digital presence and marketing strategies, we take care of the complexities, allowing them to focus on what matters most — growing their business and achieving their goals.
                </p>
              </div>
              <div className='w-full flex justify-center items-center'>
                <Image src={ImageAboutHero} alt="hero-about" width={1920} height={1080} className="w-full hidden md:block" priority quality={100} />
                <Image src={ImageAboutHeroMobile} alt="hero-about" width={1920} height={1080} className="w-full md:hidden" priority quality={100} />
              </div>
            </div>
          </div>
        </header>
        <section className='w-full bg-white h-[150px] md:h-[200px] lg:h-[250px]' />

        <section className="w-full bg-primary">
          <div className="md:py-6 py-4 ">
            <SectionLabel side={"right"} />
          </div>
        </section>

        <section className="bg-white">
          <div className="flex flex-col justify-center items-center lg:flex-row py-12 md:py-24 w-full md:max-w-7xl md:mx-auto px-10 lg:gap-x-14 xl:gap-x-14">
            <div className="flex flex-col md:flex-row w-full gap-x-20 gap-y-14">
              <div className="w-full flex justify-center items-center">
                <Image src={AssetImprovingAbout} alt="Improving about" width={1920} height={1080} className="w-4/5 md:w-full" loading="lazy" />
              </div>
              <div className="space-y-5 md:space-y-6 md:max-w-[45%] flex flex-col justify-center items-center ">
                <h2 className="w-full text-2xl lg:text-4xl text-primary font-semibold font-heading !leading-[130%] md:max-w-full text-center md:text-left">Improving our services and quality continuously</h2>
                <p className="w-full lg:text-lg lg:text-start text-gray-600 !leading-[150%] text-center md:text-justify">
                  We are a team of dedicated professionals, always striving for growth — as individuals, as employees, as business partners, and as a company. At Octobees, we never stop searching for faster, more efficient, and higher-quality ways to deliver exceptional results for our clients. Improvement is in our DNA, and we are committed to evolving with every opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F2EDE6]">
          <div className="flex flex-col justify-center items-center lg:flex-row py-12 md:py-24 w-full md:max-w-7xl md:mx-auto px-10 lg:gap-x-14 xl:gap-x-14">
            <div className="flex flex-col md:flex-row w-full gap-x-20 gap-y-14">
              <div className="space-y-7 md:space-y-6 md:max-w-[45%] flex flex-col justify-center items-center">
                <h2 className="w-full text-2xl lg:text-4xl text-black font-semibold font-heading !leading-[130%] md:max-w-full text-center md:text-left">Doing best practice in every project</h2>
                <p className="w-full lg:text-lg lg:text-start text-gray-600 !leading-[150%] text-center md:text-justify">
                  We believe that excellence is not just a goal, but a habit that drives success for both our clients and our agency.
                </p>
                <Link
                  href="/contact-us"
                  className="group px-5 py-2 hover:pe-10 lg:px-7 lg:py-3 font-semibold border-2 border-dark rounded-full text-dark md:text-lg md:self-start self-center flex gap-x-2 md:gap-x-4 items-center transition-all duration-500 hover:bg-dark hover:text-white hover:scale-[1.03] focus:scale-110"
                >
                  Get In Touch With Us
                  <MoveRight className="transition-transform duration-500 group-hover:translate-x-3" />
                </Link>
                <div className='flex flex-col md:flex-row gap-y-5 gap-x-2 items-center justify-between md:pt-8 pt-5'>
                  {
                    PageAboutMap.map((data, i) => (
                      <div className="flex flex-col md:gap-3 gap-1 md:max-w-[28%] h-full items-center justify-start w-full" key={i}>
                        <h3 className="text-3xl lg:text-4xl font-bold text-center">{data.heading}</h3>
                        <p className='text-center !leading-[150%] text-gray-700'>{data.subheading}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="w-full flex md:justify-end items-center">
                <Image src={ImageAboutSection} alt="get-in-touch-with-us" width={1920} height={1080} className="w-full md:w-5/6" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className="hidden bg-merah-700 py-20 flex-col md:flex-row gap-y-16 md:justify-center md:gap-44 w-full text-lg text-white">
          {
            PageAboutMap.map((data, i) => (
              <div key={i} className="flex flex-col md:gap-3 gap-2 items-center justify-center">
                <h2 className="text-5xl md:text-6xl font-bold text-merah-200">{data.heading}</h2>
                <p>{data.subheading}</p>
              </div>
            ))
          }
        </section>

        <section className="bg-white hidden">
          <div className="space-y-8 py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-10">
            <SectionClientBrand />
            <p className="text-center w-full font-semibold text-lg text-primary">And many more</p>
          </div>
        </section>

        <section className='bg-white hidden'>
          <div className="py-12 md:py-16 pb-20 md:pb-32 w-full md:max-w-7xl md:mx-auto px-10 space-x-10">
            <div className="w-full flex flex-col md:flex-row gap-y-12 md:gap-y-10 lg:gap-x-24 items-center justify-center">

              <div className="flex flex-col gap-y-4 items-center justify-center">
                <Image src={AssetHarvineAbout} alt="Harvine about" className="w-[150px] lg:w-[250px]" loading="lazy" />
                <div className="hidden md:block font-semibold w-full space-y-2 text-[#682d2d]">
                  <span className="text-center lg:text-xl block">Harvine Khong</span>
                  <span className="text-center lg:text-xl block">CO-FOUNDER & CEO</span>
                </div>
              </div>

              <div className="space-y-6 lg:w-3/5 w-full">
                <p className="font-heading text-3xl text-primary font-semibold !leading-[130%] text-center md:text-left">Hi, I’m Harvine, the CEO of Octobees</p>
                <p className="text-base text-gray-600 text-justify lg:text-start !leading-[160%]">
                  Hi, I’m Harvine, the CEO of OCTOBEES. With a background of creative designer and branding, I’ve always been passionate about the power of digital communication and technology, and how it can transform businesses. The
                  idea to start OCTOBEES came from realizing that many companies struggled to harness the full potential of digital marketing, and I wanted to bridge that gap.
                  <br />
                  <br />
                  Starting from nothing wasn’t easy. From securing our first clients, educating the clients, to building a team of talented professionals, the journey was filled with challenges. But with determination and a clear
                  vision, opportunities came and we’ve been noticed and formed a partnership with Singapore’s sales & marketing company.
                </p>
                <p className='text-black font-medium text-lg'>- Harvine Khong, Co-Founder & CEO</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}