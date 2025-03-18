"use client";
import LogoOctobees from "@/assets/logo/webp/logo-octobees-white.webp";
import Image from "next/image";
import HeroSectionImage from '@/assets/homepage/png/hero-section-image.png';
import ChartHeroSection from '@/assets/homepage/png/hero-asset-section.png';
import AssetWhatWeDO1 from "@/assets/homepage/svg/undraw_my-workspace_5961 1.svg";
import AssetWhatWeDO2 from "@/assets/homepage/svg/undraw_success-factors_3eki 1.svg";
import AssetBarista from "@/assets/homepage/webp/asset-barista-smile.webp";
import AssetIllingWarm from "@/assets/homepage/webp/asset-illing-warm.webp";
import AssetSerious from "@/assets/homepage/webp/asset-serious-partner.webp";
import AssetWhyChooseUs1 from "@/assets/homepage/webp/asset-why-choose-us-1.webp";
import AssetWhyChooseUs2 from "@/assets/homepage/webp/asset-why-choose-us-2.webp";
import AssetTestimonial from "@/assets/homepage/webp/asset-testimonials.webp";
import Link from "next/link";
import FloatButton from "@/components/partials/FloatButton/FloatButton";
import { TrendingUp } from "lucide-react";
import { brandHome } from "@/constants/brands";

export default function Home() {
  return (
    <main className="">
      <FloatButton />
      {/* Header / Hero  */}
      <header className="flex flex-col md:flex-row gap-16 md:gap-0 bg-white overflow-x-hidden lg:min-h-screen pb-[50px] lg:pb-[80px] pt-32 lg:pt-[120px] relative md:max-w-7xl md:mx-auto">
        <div className="bg-primary/20 rounded-full overflow-x-hidden h-[50%] w-[50%] absolute top-0 md:top-60 right-0 lg:right-28 blur-[90px] z-[50]"></div>
        <div id="left" className="container flex flex-col gap-10 justify-center relative">
          <h1 className="font-semibold text-gray-400 tetx-base lg:text-3xl flex flex-col gap-2 lg:gap-4">
            WE ARE
            <span className="flex flex-col gap-1 lg:gap-3 font-heading text-4xl lg:text-6xl text-black">
              <span>Your <span className="text-primary"> Revenue</span></span>
              <span><span className="text-primary">Growth</span> Partner</span>
            </span>
          </h1>
          <h3 className="text-xs lg:text-lg flex flex-col gap-1 lg:gap-3 text-gray-400">
            TRUSTED BY GROWING COMPANIES
            <span className="flex gap-1 lg:gap-3 items-start lg:items-center">
              {brandHome.map((brand, index) => (
                <div key={index} className="p-1 flex flex-col items-center justify-center">
                  {brand.web ? (
                    <Link href={brand.web} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Image src={brand.logo} alt={`${brand.name} logo`} width={175} height={175} className="w-[40px] lg:w-[70px]" priority={index < 4} quality={100} />
                    </Link>
                  ) : (
                    <Image src={brand.logo} alt={`${brand.name} logo`} width={175} height={175} className="object-contain w-[175px] h-auto" priority={index < 4} quality={100} />
                  )}
                </div>
              ))}
              <p className="text-primary font-semibold text-lg">40+ <span className="hidden lg:block">Companies</span></p>
            </span>
          </h3>
          <div className="flex justify-start">
            <Link
              href="/contact-us"
              className="bg-primary border-2 flex items-center gap-3 border-primary hover:bg-primary px-8 md:px-10 py-3 lg:py-4 font-semibold text-light rounded-full text-base md:text-lg lg:text-xl xl:text-xl whitespace-nowrap transition-all duration-500 shadow-md hover:shadow-primary/50 hover:shadow-lg"
            >
              Increase My Sales<TrendingUp />
            </Link>
          </div>
        </div>

        <div className="container flex items-center justify-end relative">
          <Image
            src={HeroSectionImage.src}
            alt="Asset Banner Hero"
            width={1000}
            height={1000}
            className="rounded-xl object-none sm:object-cover object-[0%_9%]  md:rounded-[2rem] z-[52] w-full lg:w-[35vw] h-[32vh] lg:h-[45vh]"
            loading="lazy"
          />
          <Image
            src={ChartHeroSection.src}
            alt="Asset Banner Hero"
            width={1000}
            height={1000}
            className="rounded-xl object-contain md:rounded-[2rem] z-[53] absolute h-[20vh] w-[28vw] md:h-[20vh] md:w-[20vw] lg:h-[28vh]  lg:top-10 left-5 lg:-left-20 -top-10"
            loading="lazy"
          />
        </div>
      </header>

      {/* Label */}
      <section className="w-full md:py-5 py-4 bg-primary text-white lg:absolute -bottom-0 left-0 right-0 z-[50]">
        <div className="flex flex-row gap-5 justify-evenly md:justify-center items-center font-bold text-xl">
          <h2 className="hidden lg:block">Website Development</h2>
          <Image
            src={LogoOctobees.src}
            alt="image hero 1"
            width={400}
            height={400}
            className="w-10 h-6 object-contain"
          />
          <h2 className="hidden lg:block">Search Engine Optimalization</h2>
          <Image
            src={LogoOctobees.src}
            alt="image hero 1"
            width={400}
            height={400}
            className="w-10 h-6 object-contain"
          />
          <h2 className="hidden lg:block">Search Engine Marketing</h2>
          <Image
            src={LogoOctobees.src}
            alt="image hero 1"
            width={400}
            height={400}
            className="w-10 h-6 object-contain"
          />
          <h2 className="hidden lg:block">Social Media Management</h2>
        </div>
      </section>
     {/*  End Label */}


      {/* What we do */}
      <section className="flex flex-col bg-tertiary overflow-x-hidden py-[50px] lg:py-[60px]">
        <div className="container flex flex-col items-center justify-center md:max-w-7xl md:mx-auto  gap-y-14 lg:gap-y-24">
          <div className="flex flex-col md:w-[660px] lg:w-[900px] items-center justify-center text-center gap-y-5">
            <h2 className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">what we do</h2>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[120%]">Flexible services for every stage of your business</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center gap-y-6 lg:gap-x-0 md:gap-x-2 xl:gap-x-7">
            {/* Card 1 */}
            <div className="flex flex-col justify-between md:pt-12 h-full items-center p-8 bg-white  rounded-xl lg:rounded-3xl overflow-hidden gap-y-8">
              <Image
                src={AssetWhatWeDO1}
                alt="Asset What We Do 1"
                className=" w-full h-[30vh] "
                loading="lazy"
                quality={100}
              />

              <div className="flex flex-col gap-y-4 w-full">
                <h1 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl">
                  <span className="text-primary">Start</span> your business
                </h1>
                <p className="text-base font-medium !leading-[150%]">
                  Enhance Your Business Brand Identity by Leveraging Affordable
                  Digital Solutions for SMEs
                </p>
              </div>
              <div className="w-full items-start">
                <Link
                  href="/contact-us"
                  className="group bg-light px-5 py-2 lg:px-7 lg:py-3 font-semibold text-primary border-2 border-primary rounded-full md:text-lg whitespace-nowrap gap-x-2 md:gap-x-4 transition-all duration-300 hover:bg-primary hover:text-white w-full flex justify-center items-center gap-2"
                >
                  Start Now
                  <TrendingUp />
                </Link>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col justify-between md:pt-12 h-full items-center p-8 bg-white  rounded-xl lg:rounded-3xl overflow-hidden gap-y-8">
              <Image
                src={AssetWhatWeDO2}
                alt="Asset What We Do 2"
                className=" w-full h-[30vh] "
                loading="lazy"
                quality={100}
              />
              <div className="flex flex-col gap-y-4 w-full">
                <h1 className="font-heading font-semibold text-2xl md:text-3xl lg:text-4xl">
                  <span className="text-primary">Switch</span> to Octobees
                </h1>
                <p className="text-base font-medium !leading-[150%]">
                  Get Expert Digital Marketing Services with best practices for
                  website optimization and targeted B2B and B2C Strategies
                </p>
              </div>
              <div className="w-full items-start">
              <Link
                  href="/contact-us"
                  className="group bg-light px-5 py-2 lg:px-7 lg:py-3 font-semibold text-primary border-2 border-primary rounded-full md:text-lg whitespace-nowrap gap-x-2 md:gap-x-4 transition-all duration-300 hover:bg-primary hover:text-white w-full flex justify-center items-center gap-2"
                >
                  Start Now
                  <TrendingUp />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="flex flex-col bg-light overflow-x-hidden py-[50px] lg:py-[60px]">
        <div className="container flex flex-col items-center justify-center md:px-10 gap-y-14 lg:gap-y-24">
        <div className="flex flex-col md:w-[660px] lg:w-[900px] items-center justify-center text-center gap-y-5">
            <h2 className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">what we help</h2>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[120%]">For founders to expand their client base and strengthen brand identity</h1>
          </div>
          <div className="mt-3 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 w-full">
            {/* First Section */}
            <div className="flex flex-col justify-start items-center w-full gap-4 lg:gap-y-8">
              <Image
                src={AssetBarista}
                alt="Asset Barista"
                className="w-full lg:w-4/5 rounded-[30px]"
                loading="lazy"
              />
              <h2 className="text-center font-semibold text-base lg:text-xl w-full lg:w-2/3">
                <span className="text-primary">
                  Solo founders
                </span>{" "}
                looking to boost their digital presence without the stress
              </h2>
            </div>

            {/* Second Section */}
            <div className="flex flex-col justify-start items-center  w-fullgap-4 lg: gap-y-8">
              <Image
                src={AssetIllingWarm}
                alt="Asset Illing Warm"
                className="w-full lg:w-4/5 rounded-[30px]"
                loading="lazy"
              />
              <h2 className="text-center font-semibold text-base lg:text-xl w-full lg:w-2/3">
                <span className="text-primary">
                  Business owners
                </span>{" "}
                who know their needs and value quality services
              </h2>
            </div>

            {/* Third Section */}
            <div className="flex flex-col justify-start items-center w-full gap-4 lg:gap-y-8">
              <Image
                src={AssetSerious}
                alt="Asset Barista"
                className="w-full lg:w-4/5 rounded-[30px]"
                loading="lazy"
              />
              <h2 className="text-center font-semibold text-base lg:text-xl w-full lg:w-2/3">
                <span className="text-primary">Companies</span>{" "}
                looking to scale their business in Singapore
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="flex flex-col bg-tertiary overflow-x-hidden py-[50px] lg:py-[70px]">
        <div className="container flex flex-col items-center justify-center md:px-10 gap-y-20 lg:gap-y-24">
        <div className="flex flex-col md:w-[660px] lg:w-[900px] items-center justify-center text-center gap-y-5">
            <h2 className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">why choose us</h2>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[120%]">From brand analysis to marketing strategy and beyond, we&apos;re
            with you.</h1>
          </div>
          <div className="mt-3 lg:mt-12 flex flex-col gap-y-16 lg:gap-y-32 w-full justify-center items-center">
            {/*  First Section */}
            <div className="flex flex-col justify-center lg:flex-row-reverse gap-y-10 lg:gap-y-0 gap-x-0 lg:gap-x-28">
              <Image
                src={AssetWhyChooseUs1}
                alt="AssetWhyChooseUS"
                className="w-full lg:w-2/5 lg:h-[50vh] object-cover rounded-[30px]"
                loading="lazy"
              />
              <div className="flex flex-col h-auto gap-y-6 lg:gap-y-8 items-center w-full lg:w-1/3 ">
                <h1 className="text-2xl font-heading !leading-[120%] lg:text-4xl w-full">
                  Agency that know your business
                </h1>
                <p className="text-base lg:text-xl">
                  We take a proactive approach to help you make best marketing
                  financial decisions to grow revenue.
                </p>
                <Link
                  href="/about"
                  className="group bg-transparent px-5 py-2 lg:px-7 lg:py-4 font-semibold text-dark border-2 border-dark rounded-full md:text-lg whitespace-nowrap flex gap-x-2 md:gap-x-4 items-center self-start hover:bg-dark hover:text-white transition-all duration-300"
                >
                  Learn More
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-all duration-300 stroke-dark group-hover:stroke-white"
                  >
                    <path
                      d="M14.93 18.07L21 12L14.93 5.92999"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.00008 12L20.8301 12"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/*  Second Section */}
            <div className="flex flex-col-reverse lg:flex-row-reverse justify-center gap-y-10 lg:gap-y-0 gap-x-0 lg:gap-x-28">
              
              <div className="flex flex-col h-auto gap-y-6 lg:gap-y-8 items-center w-full lg:w-1/3 ">
                <h1 className="text-2xl font-heading !leading-[120%] lg:text-4xl w-full">
                  Google SEO-powered website for your business
                </h1>
                <p className="text-base lg:text-xl">
                  Our team helps to create the best Google SEO-Powered Website
                  to drive traffic, increase visibility, and convert visitors
                  into loyal customers.
                </p>
                <Link
                  href="/about"
                  className="group bg-transparent px-5 py-2 lg:px-7 lg:py-4 font-semibold text-dark border-2 border-dark rounded-full md:text-lg whitespace-nowrap flex gap-x-2 md:gap-x-4 items-center self-start hover:bg-dark hover:text-white transition-all duration-300"
                >
                  Learn More
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-all duration-300 stroke-dark group-hover:stroke-white"
                  >
                    <path
                      d="M14.93 18.07L21 12L14.93 5.92999"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.00008 12L20.8301 12"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <Image
                src={AssetWhyChooseUs2}
                alt="AssetWhyChooseUS"
                className="w-full lg:w-2/5 object-[10%_80%] lg:h-[50vh] object-cover rounded-[30px]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col bg-light overflow-x-hidden py-[50px] lg:py-[60px]">
        <div className="container flex flex-col items-center justify-center md:px-10 gap-y-16">
        <div className="flex flex-col md:w-[660px] lg:w-[900px] items-center justify-center text-center gap-y-5">
            <h2 className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">testimonials</h2>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[120%]">What our clients think about Octobees services</h1>
          </div>
          <div className="flex flex-col gap-y-6">
            <div className="mt-3 lg:mt-12 flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 gap-x-0 lg:gap-x-4 lg:max-h-[55vh]">
              
              <div className="w-full relative">
                <Image
                  src={AssetTestimonial}
                  alt="Asset Testimonial"
                  className="w-full h-[470px] lg:h-full rounded-[30px] object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 rounded-[30px]"></div>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between gap-y-5 p-8 lg:p-10">
                  <h2 className="uppercase text-light">customer stories</h2>
                  <div className="flex flex-col gap-y-7 w-full lg:w-3/4">
                    <h1 className="font-heading text-2xl lg:text-5xl text-light tracking-wide">
                      “ I use Octobees to help me succeed “
                    </h1>
                    <p className="text-light text-base lg:text-xl">
                      Wayne Puah, Steadbook
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 bg-primary rounded-[30px] flex flex-col justify-between gap-y-5 p-10">
                <div className="flex flex-col h-full justify-center gap-8 lg:gap-0 lg:justify-between items-center w-full">
                  <h2 className="uppercase text-light">Facts & numbers</h2>
                  <svg className="lg:w-1/2 w-full lg:px-0 px-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50,10 A40,40 0 1,1 15,40" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" />
                    <text x="50" y="58" font-size="24" font-weight="bold" text-anchor="middle" fill="white">91%</text>
                  </svg>
                  <p className="text-light text-base lg:text-xl capitalize text-center">
                    of customers recommend Octobees services
                  </p>
                </div>
              </div>

            </div>
            <div className="w-full flex flex-col justify-center bg-[#FFEEEF] p-10 lg:p-14 rounded-[30px]">
              <div className="flex flex-col justify-between gap-y-14">
                <div className="flex flex-col justify-between gap-y-6 lg:gap-y-14">
                  <h2 className="uppercase text-secondary">review</h2>
                  <h1 className="font-heading text-xl lg:text-4xl !leading-snug">
                    “The good thing about Octobees is that it saves a lot of
                    time so I can do other things – the running of the business
                    part.”
                  </h1>
                </div>
                <p className="capitalize text-dark text-base lg:text-xl">Jennifer Halim</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
