import Image from "next/image"

//image asset
import HeroImage from '@/assets/services/webp/cm/hero-cm.webp'
import SEOCopywriting from "@/assets/services/webp/expert-social.webp"
import ExecuteContentMarketingImage from '@/assets/services/svg/execute-cm.svg'

//svg icon
import HandShakeIcon from "@/assets/services/svg/hand-shake.svg"
import ParticleIcon from "@/assets/services/svg/particle.svg"
import TumbIcon from "@/assets/services/svg/tumb.svg"
import CoinIcon from "@/assets/services/svg/coin.svg"
import GraphIcon from "@/assets/services/svg/graph.svg"
import SearchIcon from "@/assets/services/svg/seo.svg"

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import Header from "../../_components/Header"
import LeftHeader from "../../_components/LeftHeader"

import SkycraperImage from '@/assets/services/webp/cm/skycraper-content.webp'
import InfographicImage from '@/assets/services/webp/cm/infographic.webp'
import BlogArticleImage from '@/assets/services/webp/cm/blog-article-content.webp'
import SocmedImage from '@/assets/services/webp/cm/sosmed-content.webp'
import CreatingContentImage from "@/assets/services/webp/free-seo-web-audit.webp"
import CMvsCWImage from "@/assets/services/webp/cm/cm-vs-cw.webp"
import WhatCMImage from "@/assets/services/webp/cm/what-cm.webp"

const exampleContentMarketing: { title: string, image: string; }[] = [
    {
        image: SkycraperImage.src,
        title: "Skycraper Content",
    },
    {
        image: InfographicImage.src,
        title: "Infographics"
    },
    {
        image: BlogArticleImage.src,
        title: "Blog & Article Content"
    },
    {
        image: SocmedImage.src,
        title: "Social Media Content"
    },
]

const contentmarketing_benefits: { desc: string, icon: string; }[] = [
    {
        icon: HandShakeIcon.src,
        desc: "Build Trust with your Audience",
    },
    {
        icon: ParticleIcon.src,
        desc: "Content Marketing Creates Better Social Media Traction"
    },
    {
        icon: GraphIcon.src,
        desc: "Increase Leads for your Business"
    },
    {
        icon: CoinIcon.src,
        desc: "Increase Profit"
    },
    {
        icon: SearchIcon.src,
        desc: "Content Marketing Strengthens your SEO Efforts"
    },
    {
        icon: TumbIcon.src,
        desc: "Content Marketing Retains your Audience"
    },
]

export default function ContentMarketing() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Leading Content Marketing Agency in Singapore"
                subtitle="We drive engagement, build brand authority, and deliver measurable results for businesses in Singapore and beyond." />

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={WhatCMImage.src} title="What is Content Marketing?" subtitle="Copywriting is a crucial component of any marketing strategy. In digital marketing, the quality of your content determines how effectively your website engages visitors, keeps them interested, and ultimately converts them into leads or customers. Compelling copy encourages action." side="left" />
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={CMvsCWImage.src} title="Content Marketing vs. Copywriting" subtitle="Copywriting drives specific actions, like purchases or downloads, while content marketing focuses on creating shareable, valuable content to build brand interest. Both must work together for optimal results—content marketing attracts, and copywriting converts." side="right" />
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="Why is Content Marketing so Important for your Business?" subtitle="Content marketing is essential because it effectively influences customer decisions through high-quality, engaging content—more powerfully than other marketing techniques. This approach provides multiple significant benefits for your business." />
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 justify-center items-center w-full mx-auto">
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {contentmarketing_benefits.slice(0, 3).map((d, i) => (
                                <div key={`contentmarketing_benefits-${i + 1}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="contentmarketing_benefits" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
                                    <p className="!leading-[150%] text-base font-bold">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {contentmarketing_benefits.slice(3, 6).map((d, i) => (
                                <div key={`contentmarketing_benefits-${i + 3}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="contentmarketing_benefits" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
                                    <p className="!leading-[150%] text-base font-bold">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <Header title="How we Execute Content Marketing" subtitle="To successfully implement content marketing, we develop a well-structured strategy for your businesss:" />
                    <div className="justify-center items-center lg:mx-auto lg:max-w-5xl">
                        <Image src={ExecuteContentMarketingImage.src} alt={`retargeting-image`} width={1920} height={1080} quality={100} className=" h-full w-full" />
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:mx-auto">
                    <Header title="Examples of Content Marketing" subtitle="Our team of skilled in-house writers creates various types of content, including the following:" />
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
                        {
                            exampleContentMarketing.map((d, i) => (
                                <div key={`exampleContentMarketing-${i + 1}`} className="flex flex-col gap-3 items-center h-full md:h-[40vh] lg:h-[50vh] relative">
                                    <div className="w-full h-full lg:h-full">
                                        <Image src={d.image} quality={100} alt="SEO" width={1920} height={1080} className="object-contain z-[52] h-full w-full rounded-md shadow-sm" />
                                    </div>
                                    <div className="w-full lg:w-[90%] h-fit md:absolute -bottom-20 md:-bottom-5 lg:-bottom-5 z-[56] bg-white rounded-md shadow-sm border-gray-200 border-[1px] p-4 lg:p-8 flex flex-col gap-4 ">
                                        <h3 className="text-black text-base lg:text-lg font-bold md:text-xl uppercase text-left">{d.title}</h3>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={CreatingContentImage.src} title="Creating a Content Marketing Strategy" subtitle="A solid content marketing strategy gives your business a competitive edge. Build your own team or outsource to us, and we'll handle it so you can focus on other areas." side="right" />
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={SEOCopywriting.src} title="In-House Expert Content Marketers" subtitle="We keep content marketing in-house to ensure consistent, high-quality results, maintaining full control over the content we deliver to our clients." side="left" />
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
