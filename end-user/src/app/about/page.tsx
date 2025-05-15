'use client';

import React, { JSX } from 'react';
import Image from 'next/image';
import AssetImprovingAbout from '@/assets/about/svg/about.svg';
import AssetHarvineAbout from '@/assets/about/png/asset-harvine-about.png';
import ClientBrand from '@/components/partials/ClientBrand/ClientBrand';
import Head from 'next/head';

export default function About(): JSX.Element {
  return (
    <>
      <Head>
        <link rel="preload" href="/assets/webp/asset-caring-about.webp" as="image" />
      </Head>
      <main className="bg-light font-openSans overflow-x-hidden">
        {/* Header or Hero */}
        <header className="flex flex-col overflow-x-hidden pt-[160px] pb-[60px] lg:pt-[160px] lg:pb-[120px] bg-merah-200/30 min-h-[75vh] lg:min-h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center justify-center text-justify lg:text-center w-full gap-y-5 px-10">
            {/* <h2 className="px-3 text-xs md:text-sm py-2 bg-white font-semibold text-zinc-900 border-[1px] shadow-sm rounded-full w-fit">
              ABOUT OCTOBEES
            </h2> */}
            <h1 className="text-primary font-bold text-4xl lg:text-6xl font-Josefin">About Us</h1>
            <p className=" w-full lg:w-[60%] text-primary/70 lg:text-lg !leading-[150%]">
              We believe that entrepreneurs are the visionaries shaping world&apos;s future. They navigate through challenges and uncover opportunities that push the boundaries of what&apos;s possible. At <strong>Octobees</strong>, we
              ensure that entrepreneurs stay focused on innovation and growth. By managing their digital presence and marketing strategies, we take care of the complexities, allowing them to focus on what matters most — growing their
              business and achieving their goals.
            </p>
          </div>
        </header>

        {/* Section 3 */}
        <section className="bg-white flex flex-col py-[60px] lg:py-[100px] items-center justify-center">
          <div className="container flex flex-col justify-center items-center lg:flex-row px-10 lg:px-[9rem] 2xl:px-5 lg:gap-x-14 xl:gap-x-14">
            <div className="flex flex-col gap-y-14 lg:max-w-[45%]">
              <div className="flex flex-col gap-y-5">
                <h1 className="w-full text-3xl lg:text-4xl text-primary font-bold font-heading  !leading-[130%]">Improving our services and quality continuously</h1>
                <p className="w-full lg:text-lg text-justify lg:text-start text-gray-600 !leading-[150%]">
                  We are a team of dedicated professionals, always striving for growth — as individuals, as employees, as business partners, and as a company. At Octobees, we never stop searching for faster, more efficient, and higher-quality ways to deliver exceptional results for our clients. Improvement is in our DNA, and we are committed to evolving with every opportunity.
                </p>
              </div>
              <div className="w-full block lg:hidden">
                <Image src={AssetImprovingAbout} alt="Improving about" className="w-full" loading="lazy" />
              </div>
              <div className="flex flex-col gap-y-4">
                <h1 className="w-full text-3xl lg:text-4xl font-bold text-primary font-heading  !leading-[130%]">Doing best practice in every project</h1>
                <p className="w-full lg:text-lg text-justify lg:text-start text-gray-600 !leading-[150%]">We believe that excellence is not just a goal, but a habit that drives success for both our clients and our agency.</p>
              </div>
            </div>
            <div className="w-full hidden lg:block">
              <Image src={AssetImprovingAbout} alt="Improving about" className="w-full" loading="lazy" />
            </div>
          </div>
        </section>
        
        {/* Section 4 */}
                   <section className=" bg-merah-700 py-20 flex flex-col md:flex-row gap-10 md:justify-center md:gap-44 w-full text-lg text-white">
             <div className="flex flex-col md:gap-3 gap-2 items-center justify-center">
               <h1 className="text-5xl font-bold text-merah-200">20+</h1>
               <p>Client worldwide</p>
             </div>
             <div className="flex flex-col md:gap-5 gap-2 items-center justify-center">
               <h1 className="text-5xl font-bold text-merah-200">40+</h1>
               <p>Companies we’ve helped to upscale</p>
             </div>
             <div className="flex flex-col md:gap-5 gap-2 items-center justify-center">
               <h1 className="text-5xl font-bold text-merah-200">2 years</h1>
               <p>of Operations</p>
             </div>
           </section>


        {/* Section 5 */}
        <section className="flex flex-col py-[60px] lg:py-[150px] items-center justify-center">
          <div className="container flex flex-col px-5 lg:px-[5rem] 2xl:px-[3rem] gap-y-[6rem] lg:gap-y-[5rem] xl:gap-y-[7rem] h-full">
            
            <div className="flex flex-col px-5">
              <ClientBrand />
              <p className="text-center mt-7 font-semibold text-lg text-primary">And many more</p>
            </div>

            <div className="w-full flex flex-col gap-y-10 lg:gap-y-24 items-center justify-center">
              {/* Card 1 */}
              <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-x-16 2xl:gap-x-32">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                  <Image src={AssetHarvineAbout} alt="Harvine about" className="w-[150px] lg:w-[250px]" loading="lazy" />
                  <div className="hidden font-semibold md:flex flex-col gap-y-2 items-center justify-center text-[#682d2d]">
                    <h1 className=" lg:text-xl">Harvine Khong</h1>
                    <p className="uppercase lg:text-xl">co-founder & ceo</p>
                  </div>
                </div>
                <div className=" p-8 lg:p-10 lg:w-[58%] rounded-2xl">
                  <div className="flex flex-col gap-y-6">
                    <h1 className="font-heading text-3xl text-primary font-semibold !leading-[130%]">Hi, I’m Harvine, the CEO of Octobees</h1>
                    <p className="text-base text-gray-600 text-justify lg:text-start !leading-[150%]">
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
}