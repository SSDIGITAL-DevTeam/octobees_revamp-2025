'use client';

import Link from 'next/link';
import React, { JSX } from 'react';
import Image from 'next/image';
import AssetImprovingAbout from '@/assets/about/png/asset-improving-about.png';
import AssetHarvineAbout from '@/assets/about/png/asset-harvine-about.png';
import AssetNathanAbout from '@/assets/about/png/asset-nathan-about.png';
import ClientBrand from '@/components/partials/ClientBrand/ClientBrand';
import Head from 'next/head';
// import ArticleCard from '@/components/partials/ArticleCard/ArticleCard';

export default function About(): JSX.Element {
  return (
    <>
      <Head>
        <link rel="preload" href="/assets/webp/asset-caring-about.webp" as="image" />
      </Head>
      <main className="bg-light font-openSans overflow-x-hidden">
        {/* Header or Hero */}
        <header className="flex flex-col overflow-x-hidden py-[50px] lg:py-[100px] bg-[url('/assets/png/asset-header-about.png')] bg-cover bg-center bg-no-repeat min-h-[75vh] lg:min-h-[90vh] items-center justify-center">
          <div className="flex flex-col lg:items-center justify-center text-justify lg:text-center w-full gap-y-5 px-5">
            <h1 className="text-primary font-bold text-4xl lg:text-6xl font-Josefin">About us</h1>
            <p className=" w-full lg:w-[38%] text-primary lg:text-lg">
              We believe that entrepreneurs are the visionaries shaping world&apos;s future. They navigate through challenges and uncover opportunities that push the boundaries of what&apos;s possible. At <strong>Octobees</strong>, we
              ensure that entrepreneurs stay focused on innovation and growth. By managing their digital presence and marketing strategies, we take care of the complexities, allowing them to focus on what matters most — growing their
              business and achieving their goals.
            </p>
          </div>
        </header>

        {/* Section 3 */}
        <section className="bg-[#ed8b8b] flex flex-col py-[60px] lg:py-[200px] items-center justify-center">
          <div className="container flex flex-col justify-center items-center lg:flex-row px-10 lg:px-[9rem] 2xl:px-5 lg:gap-x-10 xl:gap-x-14">
            <div className="flex flex-col gap-y-14">
              <div className="flex flex-col gap-y-4">
                <h1 className="w-full text-3xl lg:text-4xl font-bold text-light font-Josefin lg:w-[80%] xl:w-[62%] 2xl:w-[56%]">Improving our services and quality continuously</h1>
                <p className="w-full lg:text-lg text-light text-justify lg:text-start lg:w-[70%] 2xl:w-[60%]">
                  We are a team of dedicated professionals, always striving for growth — as individuals, as employees, as business partners, and as a company. At Octobees, we never stop searching for faster, more efficient, and
                  higher-quality ways to deliver exceptional results for our clients. Improvement is in our DNA, and we are committed to evolving with every opportunity.
                </p>
              </div>
              <div className="w-full block lg:hidden">
                <Image src={AssetImprovingAbout} alt="Improving about" className="w-full" loading="lazy" />
              </div>
              <div className="flex flex-col gap-y-4">
                <h1 className="w-full text-3xl lg:text-4xl font-bold text-light font-Josefin lg:w-[80%] xl:w-[62%] 2xl:w-[56%]">Doing best practice in every project</h1>
                <p className="w-full lg:text-lg text-light text-justify lg:text-start lg:w-[70%] 2xl:w-[60%]">We believe that excellence is not just a goal, but a habit that drives success for both our clients and our agency.</p>
              </div>
            </div>
            <div className="lg:w-[170rem] 2xl:w-[180rem] hidden lg:block">
              <Image src={AssetImprovingAbout} alt="Improving about" className="w-full" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col overflow-hidden bg-[#682d2d] items-center">
          <div className="w-full min-h-fit bg-[url('/assets/webp/asset-caring-about.webp')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-between will-change-scroll">
            <div className="container flex flex-col px-10 lg:px-[4rem] 2xl:px-[3rem] gap-y-[14rem] 2xl:gap-y-[20rem] py-[70px] lg:py-[130px] 2xl:py-[150px] h-full">
              <div className="flex flex-col gap-y-8 lg:gap-y-10 items-end">
                <h1 className="text-end lg:w-[35%] 2xl:w-[36%] font-Josefin text-4xl font-bold text-white tracking-wide 2xl:tracking-normal">Caring for teammates as we care for customers</h1>
                <Link href="/" className="bg-[#e98b1b] hover:bg-[#DD8000] transition-colors duration-300 py-3 px-9 rounded-full font-semibold text-white">
                  Join Octobees
                </Link>
              </div>
              <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-16 items-start w-full justify-between lg:px-[8rem]">
                <div className="flex flex-col items-center text-center lg:gap-y-7 w-full lg:w-auto">
                  <h1 className="font-Josefin text-white hover:text-[#fad900] transition-colors duration-300 cursor-pointer text-5xl lg:text-7xl h-[100px] flex items-center font-bold">20+</h1>
                  <p className="text-white text-xl lg:text-3xl w-full lg:w-[100%]">Client worldwide</p>
                </div>
                <div className="flex flex-col items-center text-center lg:gap-y-7 w-full lg:w-auto">
                  <h1 className="font-Josefin text-white hover:text-[#fad900] transition-colors duration-300 cursor-pointer text-5xl lg:text-7xl h-[100px] flex items-center font-bold">40+</h1>
                  <p className="text-white text-xl lg:text-3xl w-[85%]">Companies we&apos;ve helped to upscale</p>
                </div>
                <div className="flex flex-col items-center text-center lg:gap-y-7 w-full lg:w-auto">
                  <h1 className="font-Josefin text-white hover:text-[#fad900] transition-colors duration-300 cursor-pointer text-5xl lg:text-6xl h-[100px] flex items-center font-bold">2 years</h1>
                  <p className="text-white text-xl lg:text-3xl w-full lg:w-[100%]">of operation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="flex flex-col py-[60px] lg:py-[150px] items-center justify-center">
          <div className="container flex flex-col px-5 lg:px-[5rem] 2xl:px-[3rem] gap-y-[3rem] lg:gap-y-[5rem] xl:gap-y-[7rem] h-full">
            <div className="flex flex-col px-5">
              <ClientBrand />
              <h1 className="text-center mt-7 font-semibold text-lg">And many more</h1>
            </div>
            <div className="w-full flex flex-col gap-y-10 lg:gap-y-24 items-center justify-center">
              {/* Card 1 */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-y-7 lg:gap-y-0 lg:gap-x-16 2xl:gap-x-32">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                  <Image src={AssetHarvineAbout} alt="Harvine about" className="w-[150px] lg:w-[250px]" loading="lazy" />
                  <div className="flex flex-col items-center justify-center text-[#682d2d] ">
                    <h1 className="font-medium lg:text-xl">Harvine Khong</h1>
                    <p className="uppercase font-medium lg:text-xl">co-founder & ceo</p>
                  </div>
                </div>
                <div className="bg-[#fcf3f3] p-8 lg:p-10 lg:w-[58%] rounded-2xl">
                  <div className="flex flex-col gap-y-6">
                    <h1 className="font-Josefin text-3xl text-[#a72d2d] font-semibold">Hi, I’m Harvine, the CEO of Octobees</h1>
                    <p className="text-lg text-[#a72d2d] text-justify lg:text-start">
                      Hi, I’m Harvine, the CEO of OCTOBEES. With a background of creative designer and branding, I’ve always been passionate about the power of digital communication and technology, and how it can transform businesses. The
                      idea to start OCTOBEES came from realizing that many companies struggled to harness the full potential of digital marketing, and I wanted to bridge that gap.
                      <br />
                      <br />
                      Starting from nothing wasn’t easy. From securing our first clients, educating the clients, to building a team of talented professionals, the journey was filled with challenges. But with determination and a clear
                      vision, opportunities came and we’ve been noticed and formed a partnership with Singapore’s sales & marketing company.
                    </p>
                  </div>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex flex-col lg:flex-row-reverse justify-center gap-y-7 lg:gap-y-0 lg:gap-x-16 2xl:gap-x-32">
                <div className="flex flex-col gap-y-4 items-center justify-center">
                  <Image src={AssetNathanAbout} alt="Harvine about" className="w-[150px] lg:w-[250px]" loading="lazy" />
                  <div className="flex flex-col gap-y-2 items-center justify-center text-[#682d2d] ">
                    <h1 className="font-medium lg:text-xl">Nathan Tjong</h1>
                    <p className="uppercase font-medium lg:text-xl">co-founder & cmo</p>
                  </div>
                </div>
                <div className="bg-[#fcfbf3] p-8 lg:p-10 lg:w-[58%] rounded-2xl">
                  <div className="flex flex-col gap-y-6">
                    <h1 className="font-Josefin text-3xl text-[#a7602d] font-semibold">Hi, I’m Nathan, the CMO of Octobees</h1>
                    <p className="text-lg text-[#a7602d] text-justify lg:text-start">
                      Hello, I’m Nathan, the CMO of OCTOBEES. With extensive expertise in digital marketing and a proven ability to leverage social media for substantial business growth, I’m dedicated to enhancing OCTOBEES impact as a
                      leading agency that helps businesses achieve their digital marketing goals. I was invited to join OCTOBEES by Harvine, who recognized the value of my experience and strategic vision. Together, we are committed to
                      leveraging our combined strengths to build OCTOBEES into an industry leader. My role is to ensure we not only meet but exceed our ambitious goals.
                      <br />
                      <br />
                      Today, OCTOBEES stands as a testament to what passion and hard work can achieve. Our mission is to empower businesses to succeed online through innovative and effective digital marketing strategies. We believe in
                      building strong, lasting relationships with our clients, helping them grow and thrive in the digital landscape.
                    </p>
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
