import Image from "next/image"

// icon asset
import SEO from '@/assets/services/svg/seo.svg'
import DriveIcon from "@/assets/services/svg/drive-traffic.svg"
import AffordableGrowthIcon from "@/assets/services/svg/affordable-growth.svg"
import GenerateLeadsIcon from "@/assets/services/svg/generate-more-leads.svg"
import EstablishIcon from "@/assets/services/svg/establish.svg"

import Hero from '@/app/services/_components/Hero'
import ConsultationButton from "@/components/partials/Button/Consultation"
import FAQ from "../../_components/FAQ"
import OurBrands from "../../_components/OurBrandPartner"
import FormJoin from "../../_components/FormJoin"
// import ProvenExperience from "../../_components/ProvenExperience"
import Header from "../../_components/Header"
import FlyingSection from "../../_components/FlyingSection"
import ListSection from "../../_components/ListSection"

//image asset
import HeroImage from '@/assets/services/webp/seo-banner.webp'
import SEOSearch from '@/assets/services/webp/seo-search.webp'
import CompleteImage from "@/assets/services/webp/complete-expert-seo-team.webp"
import ChooseSEOAgencyImage from "@/assets/services/webp/how-to-choose-seo-agency.webp"
import FreeSEOWeb from "@/assets/services/webp/free-seo-web-audit.webp"
import GridSection from "../../_components/GridSection"
import IconGridSection from "../../_components/IconGridSection"
import { seoFAQ } from "@/constants/services/faq"

type SEOServices = {
    title: string;
    desc: string;
}

const seoServices: SEOServices[] = [
    {
        title: "Keyword Research",
        desc: "Utilising advanced tools, we identify keywords that will drive visitors to your website. Keywords are selected based on competition, search intent, search volume and business direction."
    },
    {
        title: "On-Page SEO",
        desc: "We will implement the recommended on-page optimisations, which includes content, images, title tags, internal links, and essentially anything on the actual web page."
    },
    {
        title: "Off-Page SEO",
        desc: "We focus on building your website’s authority through high-quality backlinks, media outreach, guest posting to disavowing toxic backlinks to improve your search engine rankings.",
    },
    {
        title: "Technical SEO",
        desc: "Our team ensures your website is optimised for speed, mobile responsiveness, crawlability, and indexing. We resolve technical issues like broken links, duplicate content, and XML sitemap errors to improve performance."
    },
    {
        title: "International SEO",
        desc: "For businesses targeting multiple countries, we optimise your website to rank globally by implementing hreflang tags, creating region-specific content, and ensuring search engines serve the right version of your site to the right audience."
    },
    {
        title: "Local SEO",
        desc: "We optimise your website for local search results to help you appear in “near me” searches. This includes managing Google My Business profiles, local citations, customer reviews, and location-specific keywords."
    },
    {
        title: "SEO Content Writing",
        desc: "Our SEO writers craft engaging, keyword-rich blogs and content pages that resonates with your audience and search engines."
    },
]

const invest: { title: string; desc: string, icon: string; }[] = [
    {
        icon: DriveIcon.src,
        title: "Drive Website Traffic",
        desc: "Utilising advanced tools, we identify keywords that will drive visitors to your website. Keywords are selected based on competition, search intent, search volume and business direction.",
    },
    {
        icon: AffordableGrowthIcon.src,
        title: "Affordable Growth",
        desc: "We will implement the recommended on-page optimisations, which includes content, images, title tags, internal links, and essentially anything on the actual web page."
    },
    {
        icon: GenerateLeadsIcon.src,
        title: "Generate More Leads & Sales",
        desc: "We focus on building your website’s authority through high-quality backlinks, media outreach, guest posting to disavowing toxic backlinks to improve your search engine rankings."
    },
    {
        icon: EstablishIcon.src,
        title: "Establish Credibility & Trust",
        desc: "Achieve top rankings in search engine results to establish your brand as a reliable industry authority and stay ahead of competitors."
    },
]

const list: string[] = [
    "Proven Track Record",
    "Expert SEO Team",
    "Comprehensive SEO Strategy",
    "Industry Experience",
    "Transparent Reporting"
]


export default function SEM() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Drive Digital Success with Singapore’s Top SEO Agency"
                subtitle="We drive more traffic, improve search rankings, and boost conversions through tailored SEO strategies that deliver results. Let us help you grow your digital presence." />
            <section className="w-full bg-white py-16 p-6 lg:p-8 lg:px-40 flex flex-col justify-center gap-12 px-10 md:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full rounded-xl border-gray-200 border-[1px] p-10 shadow-sm gap-10">
                    <Image src={SEOSearch.src} quality={100} alt="SEO" width={1000} height={1000} className="object-contain z-[52] lg:max-h-[45vh] h-full w-full " />
                    <div className="flex flex-col gap-4 justify-end">
                        <Image src={SEO.src} alt="seo-globe" width={1000} height={1000} className="object-contain w-14 h-14" />
                        <h2 className="text-black text-2xl !leading-[120% font-semibold]">What is SEO?</h2>
                        <p className="!leading-[150%]">SEO, or Search Engine Optimization, is the process of optimizing your website to appear on the first page of Google search results. This leads to an increase in organic traffic, which can ultimately generate leads or sales for your business.</p>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center">
                    <ConsultationButton />
                </div>
            </section>
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col gap-16 lg:mx-auto">
                    <Header title="Why Invest in SEO?" />
                    <IconGridSection list={invest}/>
                </div>
                <div className="flex w-full justify-center items-center mt-20">
                    <ConsultationButton />
                </div>
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Our seo services" subtitle="Our complete SEO framework is crafted to help you take control of search engine rankings, attract focused traffic, and achieve clear, measurable outcomes. The specific strategies will be customized to align with the distinct requirements of your business."/>
                    <GridSection list={seoServices}/>
                </div>
                <div className="flex w-full justify-center items-center mt-20">
                    <ConsultationButton />
                </div>
            </section>
            {/* Complete, Expert SEO Team */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5 flex flex-col gap-8 lg:gap-20">
                <FlyingSection image={CompleteImage.src} side="left" subtitle="We create real impact with data-driven strategies and relentless optimization, proven across 40+ companies. Let us turn your ad spend into success." title="Complete, Expert SEO Team" />
                <ListSection image={ChooseSEOAgencyImage.src} title="How to Choose the Best SEO Agency" subtitle="Here’s a concise guide with key factors to consider when selecting the ideal SEO agency for your business." list={list} />
            </section>
            {/* Free SEO */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={FreeSEOWeb.src} side="right" title="FREE SEO Website Audit" subtitle="Is your website reaching its full potential? Let us uncover hidden issues and opportunities to boost rankings, traffic, and conversions. Claim your FREE audit today and start optimizing for success!" />
            </section>
            {/* Our brands */}
            <section className="w-full bg-white py-12 lg:py-20">
                <OurBrands />
            </section>
            {/* Proven Experience */}
            {/* <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}
            {/* FAQ */}
            <section className="w-full bg-white py-12 lg:py-20">
                <FAQ value={seoFAQ}/>
            </section>
            {/* Join */}
            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )

}
