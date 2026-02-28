"use client"
import React, { JSX } from 'react'
import Image from 'next/image'
import Header from '../../_components/Header'
import ConsultationButton from '@/components/partials/Button/Consultation'
import OurBrands from '../../_components/OurBrandPartner'
// import ProvenExperience from '../../_components/ProvenExperience'
import FormJoin from '../../_components/FormJoin'
import FlyingSection from '../../_components/FlyingSection'
import LeftHeader from '../../_components/LeftHeader'
import GridSection from '../../_components/GridSection'
import GradientSection from '../../_components/GradientSection'
import ColumnsIconSection from '../../_components/ColumnsIconSection'
import IconGridSection from '../../_components/IconGridSection'
import TabSection from '../../_components/TabSection'

import SimplifyImage from '@/assets/services/webp/ai/Image.webp'
import HelpingImage1 from '@/assets/services/webp/ai/help1.webp'
import HelpingImage2 from '@/assets/services/webp/ai/help2.webp'

//asset simbol
import Symbol1 from '@/assets/services/webp/ai/Symbol.svg-1.webp'
import Symbol2 from '@/assets/services/webp/ai/Symbol.svg-2.webp'
import Symbol3 from '@/assets/services/webp/ai/Symbol.svg-3.webp'
import Symbol4 from '@/assets/services/webp/ai/Symbol.svg-4.webp'
import Symbol5 from '@/assets/services/webp/ai/Symbol.svg-5.webp'

import InSummaryImage from '@/assets/services/webp/free-seo-web-audit.webp'

import {
    allInOnePlatformAI,
    canWeDo,
    increaseRevenueProfit,
    keyFunction,
    saveMoneyTime,
    saveMoneyTime2,
    whoShouldUseOurAI
} from '@/constants/services/ai-automation'
// import useLocoScroll from '@/hook/useLocomotive'

const AiAutomation: React.FC = (): JSX.Element => {
    // useLocoScroll();
    return (
        <main>
            {/* Header */}
            <header className="w-full bg-white lg:pt-14">
                <div className="relative lg:max-w-[98%] flex flex-col items-center justify-center gap-5 lg:gap-3 lg:mx-auto py-12 lg:py-16 rounded-3xl bg-gradient-to-l from-[#F3BEBE]/40 from-40% to-gray-200/50">
                    <p className='text-center p-2 rounded-full bg-white shadow-sm font-bold text-base md:text-lg'>🤖
                        <span className='bg-gradient-to-r from-pink-600 to-orange-400 text-transparent bg-clip-text'> AI-Powered Automation</span>
                    </p>
                    <div className="flex flex-col gap-8 md:gap-7 items-center px-5">
                        <h1 className="normal-case lg:max-w-5xl !leading-[140%] text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-6xl text-center w-full bg-gradient-to-r from-pink-600 to-orange-400 text-transparent bg-clip-text">
                            <span className='text-black'>All-in-one</span> business marketing and CRM automation
                            <span className='text-black'> platform for SMEs owners</span>
                        </h1>
                        <p className="max-w-4xl text-center !leading-[150%] lg:text-lg font-medium text-gray-700">helps small to medium-sized businesses capture leads, drive sales, nurture customer relationships, and optimize day-to-day processes.</p>
                    </div>
                    <div className="flex w-full justify-center items-center lg:mt-7 mt-5">
                        <ConsultationButton />
                    </div>

                    {/* Bouncing Images */}
                    <Image src={Symbol2.src} quality={100} width={1920} height={1080} priority className="hidden lg:block absolute z-[4] h-12 w-12 top-[24%] left-[12%]  animate-smoothBounce delay-1000" alt={`symbol-google`} />
                    <Image src={Symbol3.src} quality={100} width={1920} height={1080} priority className="hidden lg:block absolute z-[4] h-12 w-12 top-[44%] left-[15%]  animate-smoothBounce" alt={`symbol-google-ads`} />
                    <Image src={Symbol5.src} quality={100} width={1920} height={1080} priority className="hidden lg:block absolute z-[4] h-12 w-12 top-[17%] right-[14%] animate-smoothBounce" alt={`symbol-instagram`} />
                    <Image src={Symbol4.src} quality={100} width={1920} height={1080} priority className="hidden lg:block absolute z-[4] h-12 w-12 top-[33%] right-[10%] animate-smoothBounce delay-1000" alt={`symbol-meta`} />
                    <Image src={Symbol1.src} quality={100} width={1920} height={1080} priority className="hidden lg:block absolute z-[4] h-12 w-12 top-[51%] right-[17%] animate-smoothBounce delay-500" alt={`symbol-facebook`} />
                </div>
            </header>

            {/* Simplyfy Section */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <h3 className='text-center p-2 rounded-full bg-white shadow-sm font-semibold text-base md:text-lg'>🏆
                        <span className='bg-gradient-to-r from-pink-600 to-orange-400 text-transparent bg-clip-text'> Where Smart Business Owners Automate, Scale, and Win</span>
                    </h3>
                    <Header title="In the era of AI, either you are part of it, or you are simply out of it!!" subtitle="Most businesses fall into these traps:" className="lg:max-w-7xl" />
                    <GridSection list={saveMoneyTime2} side="left" height='lg:min-h-[380px]' />
                </div>
            </section>

            {/* Grid Section */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Who Should Use Our AI Integrated Solution?" subtitle="Whether you’re a marketer, part of a sales team, an entrepreneur, or run a local business, it helps you out." className="lg:max-w-7xl" />
                    <GridSection list={whoShouldUseOurAI} side="top" height='lg:min-h-[360px]' />
                </div>
            </section>

            {/* Flying Section */}
            <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <FlyingSection image={SimplifyImage.src} side='left' title='Simplify Marketing & Sales for Solopreneurs & Small Teams' subtitle='Essentially, any business looking to simplify its marketing and sales stack could benefit from our solution. It provides enterprise-level tools for solopreneurs and small teams without the complexity and cost. The platform is designed to be user-friendly, even for nontechnical users.' />
            </section>

            {/* Column Icon Section */}
            <section className="w-full bg-primary py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-10 lg:gap-16 lg:mx-auto">
                    <h1 className="text-white text-3xl lg:text-4xl !leading-[120%] font-bold uppercase lg:text-start text-center ">What can We do for you?</h1>
                    {/* asdasd */}
                    <IconGridSection list={canWeDo} side='left' padding="lg:py-8" className='lg:text-xl lg:font-semibold text-primary' />
                    <ConsultationButton color='white' />
                </div>
            </section>

            {/* Gradient Section All In One Platform */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="All-in-One Platform to Grow & Retain Customers" subtitle="We aim to provide a unified system to help companies capture leads, nurture prospects, close sales, and retain happy customers—all within one easy-to-use platform." />
                    <GradientSection data={allInOnePlatformAI} name="allInOnePlatformAI" />
                </div>
            </section>

            {/* Tab Section */}
            <section className="w-full bg-white pt-0 pb-12 lg:pb-20 lg:pt-6 px-0">
                <TabSection />
            </section>

            {/* Grid Key Function Section */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-10 lg:mx-auto">
                    <div className='flex lg:flex-row flex-col gap-4 items-center justify-between w-full lg:px-10'>
                        <h1 className="text-primary text-3xl md:text-4xl !leading-[120%] font-bold uppercase self-center md:self-start">Key Functions</h1>
                        <div className='hidden lg:flex ' >
                            <ConsultationButton />
                        </div>
                    </div>
                    <GridSection list={keyFunction} side="left" height='lg:min-h-[380px]'/>
                    <div className='lg:hidden flex w-full justify-center' >
                        <ConsultationButton />
                    </div>
                </div>
            </section>

            {/* Column Icon Section */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-14 lg:gap-16 lg:mx-auto">
                    <h1 className="text-primary text-3xl lg:text-4xl !leading-[120%] font-bold lg:text-start text-center">HOW OUR SOLUTION HELP SMEs?</h1>
                    <div className='flex flex-col gap-8 w-full'>
                        <div className='flex lg:flex-row flex-col gap-4 items-center justify-between w-full'>
                            <h3 className='uppercase text-xl sm:text-3xl md:text-4xl font-bold lg:text-start text-center'>SAVE MONEY / TIME 💰</h3>
                            <div className='hidden lg:flex ' >
                                <ConsultationButton />
                            </div>
                        </div>
                        <ColumnsIconSection data={saveMoneyTime} name="saveMoneyTime" />
                        <div className='lg:hidden flex w-full justify-center' >
                            <ConsultationButton />
                        </div>
                    </div>
                    <div className='flex flex-col gap-8 w-full'>
                        <div className='flex lg:flex-row flex-col gap-4 items-center justify-between w-full'>
                            <h3 className='uppercase text-xl sm:text-3xl md:text-4xl font-bold lg:text-start text-center'>Increase Revenue / ProﬁIt  🚀</h3>
                            <div className='hidden lg:flex ' >
                                <ConsultationButton />
                            </div>
                        </div>
                        <ColumnsIconSection data={increaseRevenueProfit} name="increaseRevenueProfit" />
                        <div className='lg:hidden flex w-full justify-center' >
                            <ConsultationButton />
                        </div>
                    </div>
                </div>
            </section>

            {/* Fyling section */}
            <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InSummaryImage.src} side='right' title='In Summary' subtitle='Our platform consolidates essential tools to help businesses generate leads, nurture prospects, boost conversions, re-engage past clients, and automate workflows.' />
            </section>

            {/* 2 section button */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-10 lg:mx-auto">
                    <h1 className="text-primary text-3xl md:text-4xl !leading-[120%] font-bold uppercase lg:text-start text-center ">Ultimately helping them to</h1>
                    <div className='lg:ps-16 w-full flex lg:flex-row flex-col gap-4 lg:justify-between border-[1px] border-gray-300 shadow-md rounded-xl lg:p-6 items-center'>
                        <p className='lg:max-w-[50%] font-semibold lg:text-start text-center lg:font-bold !leading-[150%] text-base md:text-xl lg:text-2xl order-2 md:order-1 lg:p-0 p-5'>Save time, reduce business cost, increase productivity and efficiency of their business process</p>
                        <Image src={HelpingImage1.src} alt={"helping-image-1"} width={1920} height={1080} quality={100} priority className="object-cover md:object-contain w-fit md:h-[40vh] rounded-lg order-1 md:order-2" />
                    </div>
                    <div className='w-full flex lg:flex-row flex-col gap-4 lg:justify-between border-[1px] border-gray-300 shadow-md rounded-xl lg:p-6 items-center'>
                        <Image src={HelpingImage2.src} alt={"helping-image-2"} width={1920} height={1080} quality={100} priority className="object-cover md:object-contain w-fit md:h-[40vh] rounded-lg" />
                        <p className='lg:max-w-[50%] font-semibold lg:text-start text-center lg:font-bold !leading-[150%] text-base md:text-xl lg:text-2xl order-2 md:order-1 lg:p-0 p-5'>While acquiring new clients, increasing revenue, profit and lifetime value of clients</p>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20">
                <OurBrands />
            </section>

            {/* <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}

            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )
}

export default AiAutomation