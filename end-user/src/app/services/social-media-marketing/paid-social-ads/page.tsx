import Image from "next/image"

//component asset
import Hero from '@/app/services/_components/Hero'
import ConsultationButton from "@/components/partials/Button/Consultation"
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
// import FAQ from "../../_components/FAQ"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import Header from "../../_components/Header"
import LeftHeader from "../../_components/LeftHeader"
import SocmedShowcase from "../../_components/SocmedShowcase"
import MotionGraphicShowcase from "../../_components/MotionGraphicShowcase"

//SVG Asset
import ChartIcon from "@/assets/services/svg/Chart.svg"
import GraphicIcon from "@/assets/services/svg/graph.svg"

import SettingIcon from "@/assets/services/svg/spa-setting.svg"
import SortingIcon from "@/assets/services/svg/spa-sorting.svg"
import ArmorIcon from "@/assets/services/svg/spa-full.svg"
import TargetIcon from "@/assets/services/svg/psa-precision.svg"

// image set
import HeroImage from '@/assets/services/webp/psa-hero.webp'
import MetaImage from "@/assets/services/webp/spa-meta.webp"
import TargetImage from "@/assets/services/webp/aps-retargeting.webp"

//Mock Phone
import IgAds1 from "@/assets/services/webp/ig-ads.webp"
import IgAds2 from "@/assets/services/webp/ig-ads-2.webp"
import FbAds1 from "@/assets/services/webp/fb-ads.webp"
import FbAds2 from "@/assets/services/webp/fb-ads-2.webp"
import IconGridSection from "../../_components/IconGridSection"

const mockPhones = [IgAds1, IgAds2, FbAds1, FbAds2]

const adsServices: { title: string; desc: string, icon: string; }[] = [
    {
        icon: TargetIcon.src,
        title: "Precision Targeting",
        desc: "Identify and reach your ideal audience.",
    },
    {
        icon: ChartIcon.src,
        title: "Transparent Reporting",
        desc: "Get monthly performance insights."
    },
    {
        icon: GraphicIcon.src,
        title: "Meta Pixel Tracking",
        desc: "Monitor conversions and optimize results."
    },
    {
        icon: SettingIcon.src,
        title: "Custom Ad Creatives",
        desc: "Stand out with high-quality designs."
    },
    {
        icon: ArmorIcon.src,
        title: "Full Account Ownership",
        desc: "You stay in complete control."
    },
    {
        icon: SortingIcon.src,
        title: "Funnel Optimization",
        desc: "Maximize results with data-driven strategies."
    },
]

export default function PaidSocialAds() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Paid social ads management service"
                subtitle="We leverage Meta Ads on Facebook and Instagram to drive leads and boost sales." />

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={MetaImage.src} title="Facebook & Instagram Advertising" subtitle="Leverage the power of Facebook and Instagram to reach your target audience effectively. We optimize your ad campaigns by refining audience demographics, locations, interests, and behaviors to maximize results. Let us help you grow your business with data-driven social media marketing." side="left" />
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="OUR PAID SOCIAL ADS SERVICE" subtitle="Drive results with targeted ads on Instagram and Facebook. Our data-driven approach ensures precise audience targeting, high-quality creatives, and optimized performance to maximize engagement and conversions." />
                    <div className="md:grid flex flex-wrap md:grid-cols-2 lg:grid-cols-4 gap-x-5 md:gap-x-10 gap-y-5 md:max-w-5xl justify-center items-center">
                        {mockPhones.map((d, i) => (
                            <Image key={`mock-phone-${i + 1}`} src={d.src} alt={`mock-phone${i + 1}`} width={1920} height={1080} quality={100} className="object-containe h-full w-[35vw] md:w-full self-center" />
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="Social Media Design Showcase" subtitle="Our in-house creative team develops engaging and impactful visuals for your social platforms. Browse through this selection of designs we've created for our clients:" />
                   <SocmedShowcase/>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="Motion Graphic Video Showcase" subtitle="Videos enhance brand awareness and audience engagement. Our social media management package includes custom 2D motion graphic video production for your platforms. Browse our motion graphic video examples below:"/>
                    <MotionGraphicShowcase/>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <Header title="OUR RETARGETING STRATEGY" subtitle="Retargeting ads play a crucial role in your social ads marketing strategy. Since potential customers often need multiple visits before making a purchase, these ads help re-engage them after their initial visit, encouraging them to take action and convert later." />
                    <div className="justify-center items-center lg:mx-auto lg:max-w-5xl">
                        <Image src={TargetImage.src} alt={`retargeting-image`} width={1920} height={1080} quality={100} className=" h-full w-full" />
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="our instagram & Facebook Ads Services" subtitle="Leverage the power of Instagram and Facebook with our expert ad services. We craft engaging content, launch targeted campaigns, and optimize performance to maximize your brand’s reach and conversions." />
                    <IconGridSection list={adsServices} side="left"/>
                </div>
                <div className="flex w-full justify-center items-center mt-12 lg:mt-20">
                    <ConsultationButton />
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
