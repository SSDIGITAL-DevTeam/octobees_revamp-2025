import Image from "next/image"

//components
import Hero from '@/app/services/_components/Hero'
import ConsultationButton from "@/components/partials/Button/Consultation"
import FAQ from "../../_components/FAQ"
import FormJoin from "../../_components/FormJoin"
// import ProvenExperience from "../../_components/ProvenExperience"
import OurBrands from "../../_components/OurBrandPartner"
import Header from "../../_components/Header"

//image asset
import HeroImage from '@/assets/services/webp/hero.webp'
import GoogleSearch from '@/assets/services/webp/seo.webp'
import GoogleAds from '@/assets/services/webp/google-ads.webp'
import GridKiri from '@/assets/services/webp/grid-kiri.webp'
import GridKanan from '@/assets/services/webp/grid-kanan.webp'
import GridBawah from '@/assets/services/webp/grid-bawah.webp'
import Higer from '@/assets/services/webp/logo-higer.webp'
import HealingLoft from '@/assets/services/webp/logo-healingloft-symbol.webp'

//svg asset
import GlobeIcon from '@/assets/services/svg/globe.svg'
import Chart from '@/assets/services/svg/Chart.svg'
import Arrow from '@/assets/services/svg/arrow.svg'
import Key from '@/assets/services/svg/key.svg'
import Database from '@/assets/services/svg/database.svg'
import Graph from '@/assets/services/svg/graph.svg'
import GridSection from "../../_components/GridSection"
import { semFAQ } from "@/constants/services/faq"

type SemCampaign = {
    icons: string;
    title: string;
    desc: string;
}

const semCampaign: SemCampaign[] = [
    {
        icons: Chart.src,
        title: "Transparent Reporting",
        desc: "We prioritize trust by keeping you updated on your SEM campaigns' performance.",
    },
    {
        icons: Database.src,
        title: "Lower your Cost-Per-Acquisition",
        desc: "We focus on reducing lead costs to maximize your ROI."
    },
    {
        icons: Graph.src,
        title: "Conversion Tracking",
        desc: "Track campaign performance easily, with OOm accountable for results."
    },
    {
        icons: Arrow.src,
        title:"Ads Split Testing",
        desc: "We test ads to identify top performers, saving costs and boosting responses."
    },
    {
        icons: Key.src,
        title: "Keywords and Bids Strategy Management",
        desc: "Our experts use data to optimize keywords and bids for the best SEM results."
    },
]


export default function SEM() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Maximize Your ROI with Top SEM Agency in Singapore"
                subtitle="As a top SEM agency in Singapore, we can assist you in increasing conversions and reducing your cost-per-acquisition." />
            <section className="bg-white py-16 p-6 lg:p-8 lg:px-40 flex flex-col justify-center gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full lg:h-[50vh] rounded-xl border-gray-200 border-[1px] p-10 lg:pt-10 lg:pe-0 lg:pb-0 lg:ps-10 shadow-sm gap-10 overflow-y-hidden">
                    <div className="flex flex-col gap-4 justify-end lg:mb-32 lg:order-1 order-2">
                        <Image src={GlobeIcon.src} alt="seo-globe" width={1920} height={1080} quality={100} className="object-contain w-14 h-14" />
                        <h2 className="text-black text-2xl !leading-[120%] font-semibold">Search Engine Marketing</h2>
                        <p className="!leading-[150%]">Our SEM (Search Engine Marketing) solutions are crafted to propel your business toward success. We focus on boosting your conversion rates while lowering the cost per conversion. By reducing these costs, your business can achieve greater savings and maximize its marketing efficiency.</p>
                    </div>
                    <Image src={GoogleSearch.src} quality={100} alt="SEO" width={1920} height={1080} className="lg:order-2 order-1 object-cover z-[52] h-full w-full " />
                </div>
                <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-2 w-fit h-full lg:h-[50vh] rounded-xl border-gray-200 border-[1px] p-10 shadow-sm gap-10">
                    <Image src={GoogleAds.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover  z-[52] h-full w-full " />
                    <div className="flex flex-col gap-4 justify-end mb-20">
                        <h2 className="text-black text-2xl !leading-[120%] font-semibold">100% Transparency and Ownership of your Google Ad Account</h2>
                        <p className="!leading-[150%]">We are committed to 100% transparency, a core value since day one. Clients trust us because we provide full access to their Google Ads dashboard and ensure complete visibility into their ad spend. Whether we create a new account or manage an existing one, you remain the rightful owner. If you leave, all data and work stay with you—your trust and control come first.</p>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center mb-10">
                    <ConsultationButton />
                </div>
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col gap-16 lg:mx-auto">
                    <Header title="How We Manage your SEM Campaigns" subtitle="We utilize the best SEM practices to ensure optimal returns for your campaigns. This is just a glimpse of what we offer when managing your SEM campaigns." />
                        <GridSection list={semCampaign} side="left" height="lg:min-h-[360px]"/>
                    <div className="flex w-full justify-center items-center">
                        <ConsultationButton />
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12  lg:gap-8 lg:mx-auto">

                    <div className="flex flex-col gap-3 items-center h-full md:h-[40vh] lg:h-[50vh] relative">
                        <div className="w-full h-full lg:h-[80%]">
                            <Image src={GridKiri.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm" />
                        </div>
                        <div className="w-full lg:w-[80%] h-fit lg:h-[40%] md:absolute -bottom-20 md:-bottom-5 lg:-bottom-0 z-[56] bg-white rounded-md shadow-sm border-gray-200 border-[1px] p-8 flex flex-col gap-4 ">
                            <h3 className="text-primary text-lg font-bold md:text-xl uppercase">Call Tracking & Dashboard</h3>
                            <p className="text-sm">Our call tracking links calls to your campaigns, showing which keywords drive calls. We optimize campaigns for better returns.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 items-center h-full md:h-[40vh] lg:h-[50vh] relative">
                        <div className="w-full h-full lg:h-[80%]">
                            <Image src={GridKanan.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm" />
                        </div>
                        <div className="w-full lg:w-[80%] h-fit lg:h-[40%] md:absolute -bottom-20 md:-bottom-5 lg:-bottom-0 z-[56] bg-white rounded-md shadow-sm border-gray-200 border-[1px] p-8 flex flex-col gap-4 ">
                            <h3 className="text-primary text-lg font-bold md:text-xl uppercase">Remarketing Ads</h3>
                            <p className="text-sm">Target users who visited your site but didn’t convert. Remarketing boosts conversions and ad efficiency.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 items-center h-full md:h-[40vh] lg:h-[50vh] lg:col-span-2 relative">
                        <div className="w-full h-[150px] lg:h-[80%]">
                            <Image src={GridBawah.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm" />
                        </div>
                        <div className="w-full lg:w-[90%] h-fit lg:h-[40%] md:absolute -bottom-20 md:-bottom-5 lg:-bottom-0 z-[56] bg-white rounded-md shadow-sm border-gray-200 border-[1px] p-8 flex flex-col gap-4 ">
                            <h3 className="text-primary text-lg font-bold md:text-xl uppercase">SEM Campaigns</h3>
                            <p className="text-sm lg:max-w-lg">We handle campaigns from strategy to execution, offering tailored recommendations for your success.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col gap-16 lg:mx-auto">
                    <Header title="Our Clients' Successful SEM Results" subtitle="SEM agencies in Singapore must stay agile to keep up with the ever-evolving and competitive SEM landscape. We address these challenges with precision and deep expertise, backed by proven results from our successful campaigns. Discover how we’ve helped our clients reach their SEM objectives here:." />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:max-w-5xl lg:mx-auto ">
                        <div className="lg:w-[32vw] h-[45vh] border-gray-300 shadow-sm border-[1px] rounded-md p-5 flex flex-col justify-center items-center gap-8">
                            <div className="w-full h-[30%] flex justify-center">
                                <Image src={Higer.src} quality={100} alt="Higer-Logo" width={1920} height={1080} className="object-contain z-[52] lg:w-[15vw] md:w-[30vw] w-[40vw] rounded-md shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center bg-gray-100/50 border-[1px] border-gray-300 shadow-sm p-2 w-[90%] min-h-[40%] rounded-md">
                                <h3 className="text-lg font-extrabold text-center">HIGER</h3>
                                <p className="text-center text-sm"> <span className="text-primary text-2xl font-extrabold">3x</span><br />Increase in leads</p>
                            </div>
                        </div>
                        <div className="lg:w-[32vw] h-[45vh] border-gray-300 shadow-sm border-[1px] rounded-md p-5 flex flex-col justify-center items-center gap-8">
                            <div className="w-full h-[30%] flex justify-center">
                                <Image src={HealingLoft.src} quality={100} alt="Healing-Loft-Logo" width={1920} height={1080} className="object-contain z-[52] lg:w-[6vw] md:w-[23vw] w-[25vw] rounded-md shadow-sm" />
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center bg-gray-100/50 border-[1px] border-gray-300 shadow-sm p-2 w-[90%] min-h-[40%] rounded-md">
                                <h3 className="text-lg font-extrabold text-center">THE HEALING LOFT</h3>
                                <p className="text-center text-sm"> <span className="text-primary text-2xl font-extrabold">100+</span><br />More than a hundred leads every month</p>
                            </div>
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
            <section className="w-full bg-white py-12 lg:py-20">
                <FAQ value={semFAQ}/>
            </section>
            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )

}
