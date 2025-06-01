'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import AssetImprovingAbout from '@/assets/about/svg/about.svg';
import AssetHarvineAbout from '@/assets/about/png/asset-harvine-about.png';
import Head from 'next/head';
import { SectionClientBrand } from '@/app/about/_components';

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
      <Head>
        <link rel="preload" href="/assets/webp/asset-caring-about.webp" as="image" />
      </Head>
      <main>
        <header className='bg-[#F7E6E7]'>
          <div className="flex flex-col items-center justify-center py-24 md:py-40 pt-36 md:pt-60 md:max-w-7xl md:mx-auto px-10 w-full gap-y-5">
            <h1 className="text-primary font-bold text-4xl lg:text-6xl font-Josefin">About Us</h1>
            <p className=" w-full lg:w-[60%] text-primary/70 lg:text-lg !leading-[150%] md:!leading-[170%] text-center">
              We believe that entrepreneurs are the visionaries shaping world&apos;s future. They navigate through challenges and uncover opportunities that push the boundaries of what&apos;s possible. At <strong>Octobees</strong>, we
              ensure that entrepreneurs stay focused on innovation and growth. By managing their digital presence and marketing strategies, we take care of the complexities, allowing them to focus on what matters most — growing their
              business and achieving their goals.
            </p>
          </div>
        </header>

        <section className="bg-white">
          <div className="flex flex-col justify-center items-center lg:flex-row py-12 md:py-20 lg:pt-40 w-full md:max-w-7xl md:mx-auto px-10 lg:gap-x-14 xl:gap-x-14">
            <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 w-full gap-x-20 gap-y-14">
              
              <div className="md:col-span-3 space-y-7 md:space-y-5 order-1">
                <h2 className="w-full text-3xl lg:text-4xl text-primary font-bold font-heading !leading-[130%] max-w-[80%] md:max-w-full">Improving our services and quality continuously</h2>
                <p className="w-full lg:text-lg text-justify lg:text-start text-gray-600 !leading-[150%]">
                  We are a team of dedicated professionals, always striving for growth — as individuals, as employees, as business partners, and as a company. At Octobees, we never stop searching for faster, more efficient, and higher-quality ways to deliver exceptional results for our clients. Improvement is in our DNA, and we are committed to evolving with every opportunity.
                </p>
              </div>

              <div className="md:col-span-3 md:row-start-2 space-y-7 md:space-y-5 order-3 md:order-2">
                <h2 className="w-full text-3xl lg:text-4xl font-bold text-primary font-heading !leading-[130%] max-w-[80%] md:max-w-full">Doing best practice in every project</h2>
                <p className="w-full lg:text-lg text-justify lg:text-start text-gray-600 !leading-[150%]">We believe that excellence is not just a goal, but a habit that drives success for both our clients and our agency.</p>
              </div>

              <div className="w-full md:col-start-4 md:col-span-2 md:row-span-2 flex justify-center items-center lg:items-start lg:pt-20 order-2 md:order-3">
                <Image src={AssetImprovingAbout} alt="Improving about" width={1920} height={1080} className="w-3/5 md:w-full" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <section className=" bg-merah-700 py-20 flex flex-col md:flex-row gap-y-16 md:justify-center md:gap-44 w-full text-lg text-white">
          {
            PageAboutMap.map((data, i) => (
              <div className="flex flex-col md:gap-3 gap-2 items-center justify-center">
                <h2 className="text-5xl md:text-6xl font-bold text-merah-200">{data.heading}</h2>
                <p>{data.subheading}</p>
              </div>
            ))
          }
        </section>

        <section className="bg-white">
          <div className="space-y-8 py-12 md:py-20 w-full md:max-w-7xl md:mx-auto px-10">
            <SectionClientBrand />
            <p className="text-center w-full font-semibold text-lg text-primary">And many more</p>
          </div>
        </section>

        <section className='bg-white'>
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