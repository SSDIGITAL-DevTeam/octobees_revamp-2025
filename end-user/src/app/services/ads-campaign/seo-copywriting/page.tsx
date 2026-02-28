import Image from "next/image"

// components
import Hero from '@/app/services/_components/Hero'
import ConsultationButton from "@/components/partials/Button/Consultation"
import FormJoin from "../../_components/FormJoin"
// import ProvenExperience from "../../_components/ProvenExperience"
import OurBrands from "../../_components/OurBrandPartner"
import ListSection from "../../_components/ListSection"
import FlyingSection from "../../_components/FlyingSection"

// icon asset
import UnderstandingIcon from '@/assets/services/svg/understanding.svg'
import SEOCopywritingIcon from '@/assets/services/svg/seo-copywriting.svg'

// image asset
import HeroImage from '@/assets/services/webp/hero-copyswriting.webp'
import ImportantImage from '@/assets/services/webp/copywriting-important.webp'
import BalancingImage from '@/assets/services/webp/balancing-hunt.webp'
import ChooseUsImage from '@/assets/services/webp/why-choose-us.webp'
import UnderstandingImage from '@/assets/services/webp/understanding.webp'
import SEOCopywriterImage from '@/assets/services/webp/seo-copywriting.webp'
import Header from "../../_components/Header"
import GridSection from "../../_components/GridSection"

type SemCampaign = {
    title: string;
    desc: string;
}

const keyAspect: SemCampaign[] = [
    {
        title: "Keywords",
        desc: "Research relevant topics and use long-tail keywords."
    },
    {
        title: "Headline",
        desc: "Must be keyword-rich and attention-grabbing."
    },
    {
        title: "Meta Title & Description",
        desc: "Optimize for search visibility and clicks.",
    },
    {
        title: "Keyword Use",
        desc: "Avoid stuffing; focus on readability."
    },
    {
        title: "Internal & External Links",
        desc: "Use internal and authoritative external links."
    },
    {
        title: "Call-to-Action (CTA)",
        desc: "Drive reader action for conversions."
    },
    {
        title: "Site Speed",
        desc: "Ensure fast loading to retain visitors."
    },
]

const listCopywriting: string[] = [
    "Drives more business when executed correctly.",
    "Focuses on creating valuable content for potential customers.",
    "Avoids keyword stuffing, which harms readability and ranking.",
    "Helps your website rank higher in search results.",
    "Increases organic traffic and brand awareness.",
    "Encourages readers to take action through persuasive writing.",
]

export default function SEOCopyWriting() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="SEO COPYWRITING"
                subtitle="As a digital marketing agency, we offer top-notch SEO copywriting services designed to engage your audience effectively." />
            <section className="bg-white py-16 p-6 lg:p-8 lg:px-40 flex flex-col justify-center gap-5 lg:gap-12">
                <div className="grid  grid-cols-1 lg:grid-cols-5 w-full lg:h-[50vh] gap-6 h-full">
                    <div className="lg:col-span-3 grid w-full rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md relative lg:gap-0 gap-6">
                        <div className="flex flex-col lg:max-w-[50%] justify-center gap-4">
                            <Image src={UnderstandingIcon.src} alt="seo-globe" width={1000} height={1000} className="object-contain w-14 h-14" />
                            <h2 className="text-black text-2xl !leading-[120%] font-semibold">Understanding Copywriting</h2>
                            <p className="!leading-[150%]">Copywriting is the art of persuasive writing, motivating readers to take action—whether buying, inquiring, or subscribing. In the digital space, where content is abundant, compelling copywriting is essential for capturing attention and standing out.</p>
                        </div>
                        <Image src={UnderstandingImage.src} alt="seo-globe" width={1000} height={1000} className="object-cover w-full lg:w-[26vh] lg:absolute bottom-0 right-0 rounded-ss-md" />
                    </div>
                    <div className="flex flex-col lg:col-span-2 justify-center rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md gap-4">
                        <Image src={SEOCopywritingIcon.src} alt="seo-globe" width={1000} height={1000} className="object-contain w-14 h-14" />
                        <h2 className="text-black text-2xl !leading-[120% font-semibold]">What is SEO Copywriting?</h2>
                        <p className="!leading-[150%]">SEO copywriting combines valuable content with SEO strategies to rank on Google’s first page. It involves natural keyword integration and adherence to Google’s algorithms. Skilled SEO copywriters optimize content for better visibility and higher rankings.</p>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center mb-10">
                    <ConsultationButton />
                </div>
            </section>
            {/* What is COpywriting */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ListSection image={ImportantImage.src} title="Why Is SEO Copywriting Important?" list={listCopywriting} />
            </section>
            {/* Key Aspect */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                   <Header title="Key Aspects of SEO Copywriting:" subtitle="Below are some pointers to note when it comes to SEO copywriting" />
                   <GridSection list={keyAspect} height="lg:min-h-[340px]"/>
                </div>
                <div className="flex w-full justify-center items-center mt-8 lg:mt-20">
                    <ConsultationButton />
                </div>
            </section>
            {/* SEO Copywriting */}
            <section className="w-full bg-white lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-y-8 lg:gap-y-32 gap-x-10 lg:mx-auto">
                    <div className="flex flex-col gap-3 items-center h-full lg:h-[70vh] relative rounded-md shadow-sm border-gray-200 border-[1px] hover:shadow-md transition-all duration-300">
                        <div className="w-full h-full max-h-[40vh]">
                            <Image src={BalancingImage.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm " />
                        </div>
                        <div className="p-8 gap-y-3 flex flex-col">
                            <h2 className="text-primary text-xl !leading-[120%] font-semibold uppercase">SEO Copywriting: Balancing Human Value and Search Engine Visibility</h2>
                            <p className="text-gray-600 text-sm !leading-[150%]">While keyword density still affects rankings, Google now values it less. This discourages content made just for SEO. Avoid keyword stuffing in your content. When hiring SEO agencies, prioritize content that serves readers first, not just ranking goals.</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 items-center h-full lg:h-[70vh] relative rounded-md shadow-sm border-gray-200 border-[1px] hover:shadow-md transition-all duration-300">
                        <div className="w-full h-full max-h-[40vh]">
                            <Image src={ChooseUsImage.src} quality={100} alt="SEO" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm " />
                        </div>
                        <div className="p-8 gap-y-3 flex flex-col">
                            <h2 className="text-primary text-xl !leading-[120%] font-semibold uppercase">Why Choose Us for SEO Copywriting</h2>
                            <p className="text-gray-600 text-sm !leading-[150%]">We delivers comprehensive SEO services, including specialized copywriting. Our dedicated team of SEO content writers combines usefulness with ranking effectiveness, creating content that resonates with readers while performing well in Google search results.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Our In House */}
            <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <FlyingSection image={SEOCopywriterImage.src} title="Our In-House SEO Copywriters" subtitle="Our SEO copywriters work in-house, allowing us to oversee every step of the writing process and ensure top-quality content. We provide ongoing training to keep our team updated on Google's latest algorithm changes, helping you stay ahead in SEO." side="left" />
            </section>
            <section className="w-full bg-white lg:py-20 py-12">
                <OurBrands />
            </section>
            {/* <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}
            <section className="w-full bg-primary lg:py-20 py-12">
                <FormJoin />
            </section>
        </main>
    )

}
