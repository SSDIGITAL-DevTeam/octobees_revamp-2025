import Image from "next/image"

//image asset
import HeroImage from '@/assets/services/webp/hero-copyswriting.webp'
import UnderstandImage from '@/assets/services/webp/cm/understanding.webp'
import SEOCopywriting from "@/assets/services/webp/expert-social.webp"
import CopywritingType1 from '@/assets/services/webp/cm/carstreet.webp'
import CopywritingType2 from '@/assets/services/webp/cm/socmed-content.webp'
import CopywritingType3 from '@/assets/services/webp/cm/higer.webp'

//svg icon
import KeyboardIcon from "@/assets/services/svg/keyboard.svg"
import CrownIcon from "@/assets/services/svg/crown.svg"
import TumbIcon from "@/assets/services/svg/tumb.svg"
import DiamondIcon from "@/assets/services/svg/diamond.svg"
import GraphIcon from "@/assets/services/svg/graph.svg"
import RankIcon from "@/assets/services/svg/rank.svg"

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import Header from "../../_components/Header"
import LeftHeader from "../../_components/LeftHeader"

const copywritingServices: { title: string, image: string; }[] = [
    {
        image: CopywritingType1.src,
        title: "Website Content",
    },
    {
        image: CopywritingType2.src,
        title: "Social Media Content"
    },
    {
        image: CopywritingType3.src,
        title: "Blog Post Content & Informative Article"
    },
]

const copywriting_benefits: { desc: string, icon: string; }[] = [
    {
        icon: KeyboardIcon.src,
        desc: "A Skilled Copywriter Uses Proven Techniques to Capture Attention",
    },
    {
        icon: DiamondIcon.src,
        desc: "Good Copywriting Keeps Your Business Ahead of the Competition"
    },
    {
        icon: GraphIcon.src,
        desc: "Effective Copywriting Boosts Your Business Profits"
    },
    {
        icon: CrownIcon.src,
        desc: "Powerful Copywriting Shapes Your Ideal Brand Image"
    },
    {
        icon: RankIcon.src,
        desc: "Strong Copywriting Gives Your Business an Edge in SEO"
    },
    {
        icon: TumbIcon.src,
        desc: "A Skilled Copywriter Repurposes Content for Multiple Digital Platforms"
    },
]

export default function Copywriting() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Boost Engagement with Expert Copywriting Services"
                subtitle="As a leading copywriting agency, we create compelling content that increases conversions and strengthens your brand’s impact." />

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={UnderstandImage.src} title="Understanding Copywriting" subtitle="Copywriting is a crucial component of any marketing strategy. In digital marketing, the quality of your content determines how effectively your website engages visitors, keeps them interested, and ultimately converts them into leads or customers. Compelling copy encourages action." side="left" />
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="How Can Good Copywriting Benefit Your Business?" subtitle="High-quality content engages your audience, builds trust, and strengthens your brand. Here’s how effective copywriting can elevate your business:" />
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 justify-center items-center w-full mx-auto">
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {copywriting_benefits.slice(0, 3).map((d, i) => (
                                <div key={`copywriting_benefits-${i + 1}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="copywriting_benefits" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
                                    <p className="!leading-[150%] text-base font-bold">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {copywriting_benefits.slice(3,6).map((d, i) => (
                                <div key={`copywriting_benefits-${i + 3}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="copywriting_benefits" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
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
                    <div className="md:grid flex flex-wrap items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-10 gap-y-8 lg:max-w-5xl">
                        {copywritingServices.map((d, i) => (
                            <div key={`copywriting-type-${i + 1}`} className="w-fit h-fit flex flex-col items-center lg:items-start justify-center gap-4">
                                <div className="h-full w-full">
                                    <Image src={d.image} alt={`copywriting-type-${i + 1}`} width={1920} height={1080} quality={100} className="object-contain h-full w-full" />
                                </div>
                                <p className="line-clamp-2 max-w-[60%] font-bold text-center lg:text-left text-lg !leading-[150%]">{d.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={SEOCopywriting.src} title="What is SEO Copywriting?" subtitle="SEO copywriting combines valuable content with SEO strategies to rank on Google’s first page. It involves natural keyword integration and adherence to Google’s algorithms. Skilled SEO copywriters optimize content for better visibility and higher rankings." side="right" />
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
