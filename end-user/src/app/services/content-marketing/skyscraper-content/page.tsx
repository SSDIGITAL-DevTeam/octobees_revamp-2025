//image asset
import HeroImage from '@/assets/services/webp/sc/hero-sc.webp'
import SkyscraperMeaningImage from '@/assets/services/webp/sc/sc-meaning.webp'
import AttractNatural from '@/assets/services/webp/sc/attract-natural.webp'
import ExperienceSEO from '@/assets/services/webp/sc/experience-seo.webp'
import InhouseCopywritingImage from '@/assets/services/webp/sc/in-house-copywriting.webp'

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import Header from "../../_components/Header"
import GridSection from "../../_components/GridSection"

import Image from 'next/image'
import ConsultationButton from '@/components/partials/Button/Consultation'
import IconGridSection from '../../_components/IconGridSection'


//svg asset
import GlobeIcon from '@/assets/services/svg/globe.svg'
import Graph from '@/assets/services/svg/graph.svg'
import Tumb from '@/assets/services/svg/tumb.svg'
import Rank from '@/assets/services/svg/rank.svg'
import Establish from '@/assets/services/svg/establish.svg'
import BoostOrganic from '@/assets/services/svg/organic-traffic.svg'
import DriveTraffic from '@/assets/services/svg/drive-web-traffic.svg'
import { GridType, ListType } from '@/constants/services/skyscaper'

const qualityInfographics: GridType[] = [
    {
        icon: DriveTraffic.src,
        title: "Drive Website Traffic",
        desc: "Draw in a steady flow of potential customers who are actively looking for your products or services."
    },
    {
        icon: Establish.src,
        title: "Stay Ahead of Competitors",
        desc: "Consistently producing top-tier content helps maintain an edge."
    },
    {
        icon: BoostOrganic.src,
        title: "Boost Organic Traffic",
        desc: "Quality content earns backlinks, improving search rankings."
    },
    {
        icon: Graph.src,
        title: "Generate More Leads",
        desc: "Well-crafted content attracts potential customers."
    },
    {
        icon: Tumb.src,
        title: "Grow Social Media Following",
        desc: "Engaging content gets shared, expanding your reach."
    },
    {
        icon: Rank.src,
        title: "Establish Authority",
        desc: "Publishing industry-relevant content positions your brand as a leader."
    },
]
const skyscraperTechnique: ListType[] = [
    {
        title: "Find High-Performing Content",
        desc: "Identify existing content that ranks well and aligns with your target keywords."
    },
    {
        title: "Create a Better Version",
        desc: "Enhance the content by making it longer, more updated, and visually appealing while naturally integrating SEO-friendly keywords."
    },
    {
        title: "Promote Effectively",
        desc: "Share your improved content with the right audience to maximize visibility and backlinks."
    }
]

export default function InfographicContent() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Leading skyscraper content creation Agency in Singapore"
                subtitle="We use the powerful Skyscraper Technique to craft top-tier content that outperforms your competition. By identifying the best-performing topics and creating even better, more engaging content, we help your brand achieve higher search engine rankings." />
            <section className="w-full bg-white py-8 lg:py-16 px-10 md:px-20 lg:px-5">
                <div className="w-full lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 justify-center items-center">
                    <div className="flex flex-col gap-3 items-center justify-center h-[35vh] lg:h-[50vh] lg:col-span-6 col-span-1 ">
                        <Image src={SkyscraperMeaningImage.src} quality={100} alt="SEO-Agent" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm" />
                    </div>
                    <div className="flex flex-col gap-3 items-center justify-center lg:h-[60vh] lg:col-span-6">
                        <div className="p-0 lg:p-10 flex flex-col gap-5">
                            <h2 className="text-primary text-lg font-bold md:text-3xl uppercase">What is Skyscraper Content?</h2>
                            <p className="text-sm lg:max-w-lg">Skyscraper content is an SEO content strategy where you identify successful topics on search engines and develop content that surpasses the existing ones. Then, you carry out outreach campaigns to promote your skyscraper content, encouraging more shares and backlinks. When implemented effectively, skyscraper content can boost your SEO rankings and help you achieve first-page positions for highly competitive keywords.</p>
                            <ConsultationButton />
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="The Skyscraper Technique for SEO" subtitle="SEO agencies use the skyscraper technique to improve rankings through high-quality content marketing. The process involves three key steps:" />
                    <GridSection list={skyscraperTechnique} side="left" />
                </div>
            </section>
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Benefits of the Skyscraper Technique for Your Business" />
                    <IconGridSection list={qualityInfographics} side="left" />
                </div>
            </section>
            <section className="w-full bg-[#f5f5f5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={AttractNatural.src} title="Attract Natural Backlinks with Skyscraper Content" subtitle="Creating high-quality skyscraper content that surpasses existing articles in length, design, and depth makes it highly shareable. This naturally attracts backlinks, boosting your website’s SEO performance. Investing in this technique can significantly improve your online visibility and rankings." side="left" />
            </section>
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-10 lg:mx-auto">
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 rounded-xl  p-10 lg:pe-0 lg:pb-0 lg:pt-10 lg:ps-10 border-gray-300 border-[1px] lg:h-[60vh] shadow-sm hover:shadow-md lg:gap-10 gap-6 place-items-end">
                        <div className="flex flex-col w-full justify-center gap-4 lg:pb-10">
                            <Image src={GlobeIcon.src} alt="globe-icon" width={1000} height={1000} className="object-contain w-14 h-14" />
                            <h2 className="text-black text-2xl !leading-[120%] font-semibold">Experienced SEO Agency in Singapore for Skyscraper Content</h2>
                            <p className="!leading-[150%]">Outsource your skyscraper content creation to our expert SEO team. With a proven track record, we help businesses achieve SEO success while allowing you to focus on other priorities.</p>
                        </div>
                        <div className='w-fit lg:h-[50vh]'>
                            <Image src={ExperienceSEO.src} alt="seo-experience" width={1000} height={1000} className="object-contain w-fit h-full rounded-ss-xl" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center lg:grid-cols-2 lg:gap-10 gap-6 rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md">
                        <div className='h-full'>
                            <Image src={InhouseCopywritingImage.src} alt="inhouse-copywriting" width={1000} height={1000} className=" w-full h-full rounded-xl border-gray-300 border-[1px]" />
                        </div>
                        <div className="flex flex-col justify-center gap-4 w-full">
                            <h2 className="text-black text-2xl !leading-[120% font-semibold]">In-House Copywriters & Designers for Quality Content</h2>
                            <p className="!leading-[150%]">Our dedicated in-house team of digital copywriters and designers ensures top-tier skyscraper content. We never outsource, maintaining full control over quality to deliver the best results.</p>
                        </div>
                    </div>
                    <div className="flex w-full justify-center items-center">
                        <ConsultationButton />
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
