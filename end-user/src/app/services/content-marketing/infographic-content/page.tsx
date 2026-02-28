//image asset
import HeroImage from '@/assets/services/webp/ic/hero-ic.webp'
import InfographicMeaningImage from '@/assets/services/webp/ic/infographic-meaning.webp'
import ConsiderInfographicImage from '@/assets/services/webp/ic/consider-using-infographic.webp'
import InhouseExpertImage from '@/assets/services/webp/seo-copywriting.webp'

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import LeftHeader from "../../_components/LeftHeader"
import Header from "../../_components/Header"
import GridSection from "../../_components/GridSection"

import InfographicContent1 from '@/assets/services/webp/ic/infographic-showcase-1.webp'
import InfographicContent2 from '@/assets/services/webp/ic/infographic-showcase-2.webp'
import InfographicContent3 from '@/assets/services/webp/ic/infographic-showcase-3.webp'
import InfographicContent4 from '@/assets/services/webp/ic/infographic-showcase-4.webp'
import InfographicContent5 from '@/assets/services/webp/ic/infographic-showcase-5.webp'
import Image from 'next/image'

export type GridType = {
    title: string;
    desc: string;
}

const qualityInfographics: GridType[] = [
    {
        title: "Clear Message",
        desc: "A good infographic communicates a specific idea or message in a straightforward and easy-to-understand way. Avoid clutter and focus on delivering value."
    },
    {
        title: "Accurate Data",
        desc: "a: Ensure the information presented is accurate, up-to-date, and relevant to the topic. Credible data enhances the infographic's reliability."
    },
    {
        title: "Strong Visuals",
        desc: "Incorporate charts, icons, illustrations, and images to break down complex information and make it more digestible. Visuals should complement the text, not overwhelm it."
    },
    {
        title: "Visually Engaging",
        desc: "Use a cohesive colour scheme, attractive fonts, and balanced layouts to make the infographic visually engaging and professional."
    },
    {
        title: "Logical Flow",
        desc: "Organize the content in a logical sequence, guiding the viewer through the information smoothly. Use headings, sections, or numbered steps for clarity."
    },
    {
        title: "Audience-Focused",
        desc: "Tailor the design, tone, and content to resonate with your intended audience. A good infographic speaks directly to the interests and needs of its viewers."
    },
]
const infographicTypes: GridType[] = [
    {
        title: "Statistical Infographics",
        desc: "These infographics focus on data and statistics, visualizing numbers in a way that is easy to digest. They're ideal for presenting survey results, research findings, or comparisons."
    },
    {
        title: "Timeline Infographics",
        desc: "Timelines display information in a chronological order, making them perfect for showcasing the progression of events, historical milestones, or project timelines."
    },
    {
        title: "Process Infographics",
        desc: "These infographics break down a complex process into easy-to-follow steps. They are useful for explaining workflows, instructions, or guides."
    },
    {
        title: "Comparison Infographics",
        desc: "Comparison infographics present two or more items side by side, highlighting their differences and similarities. They're ideal for product comparisons or pros and cons."
    },
    {
        title: "Geographic Infographics",
        desc: "These use maps, charts, and location-based visuals to present data related to geographic areas. They're great for regional statistics, demographics, or travel guides."
    },
    {
        title: "List Infographics",
        desc: "List infographics highlight information in a visually appealing list format. They're perfect for showcasing tips, recommendations, or step-by-step instructions."
    },
]

export default function InfographicContent() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Leading infographic content creation Agency in Singapore"
                subtitle="We made visually compelling and data-driven infographics that transform complex information into engaging, easy-to-understand visuals. We help businesses boost brand visibility, and connect with their audience through innovative design and strategic content solutions." />

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InfographicMeaningImage.src} title="What is an Infographic?" subtitle="An infographic is a visual tool that simplifies and explains a specific subject or topic by combining graphics, charts, and text. It transforms complex information into an easily digestible and engaging format." side="left" />
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="INFOGRAPHIC CONTENT SHOWCASE" subtitle="Infographics boost brand visibility and audience interaction. Our content creation services include custom infographic design tailored for your platforms. Explore our infographic examples below:" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 lg:max-w-7xl w-full">
                        <div className="bg-blue-200 w-full">
                            <Image src={InfographicContent1.src} alt="Infographic Image 1" width={1920} height={1080} className='object-contain w-full h-full' />
                        </div>
                        <div className="bg-blue-200 lg:col-span-2 lg:row-span-2">
                            <Image src={InfographicContent2.src} alt="Infographic Image 1" width={1920} height={1080} className='object-contain w-full h-full' />
                        </div>
                        <div className="bg-blue-200 lg:col-start-4">
                            <Image src={InfographicContent3.src} alt="Infographic Image 1" width={1920} height={1080} className='object-contain w-full h-full' />
                        </div>
                        <div className="bg-blue-200 lg:row-start-2">
                            <Image src={InfographicContent4.src} alt="Infographic Image 1" width={1920} height={1080} className='object-contain w-full h-full' />
                        </div>
                        <div className="bg-blue-200 lg:col-start-4 lg:row-start-2 ">
                            <Image src={InfographicContent5.src} alt="Infographic Image 1" width={1920} height={1080} className='object-contain w-full h-full' />
                        </div>
                    </div>

                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={ConsiderInfographicImage.src} title="Why Should You Consider Using Infographics?" subtitle="Creating infographics for your business offers numerous advantages. Not only are infographics engaging and visually appealing, but well-designed ones also have the potential to be widely shared, driving more traffic to your website." side="right" />
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="What Defines a Quality Infographic?" subtitle="An impactful and successful infographic includes the following key components designed to grab your audience's interest:" />
                    <GridSection list={qualityInfographics} side="left" />
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Infographic Types" subtitle="Whether you create an infographic yourself or collaborate with an agency, it's important to choose the right template that suits your needs. Select the one that fits your objectives. Here are several infographic types to consider:" />
                    <GridSection list={infographicTypes} side="center" />
                </div>
            </section>

            <section className="w-full bg-[#f5f5f5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InhouseExpertImage.src} title="In-House EXPERT Copywriters & Designers" subtitle="Our team consists of in-house professional content writers and digital designers who handle your infographic content. We never outsource any of our work, ensuring we maintain full control over every step of the content creation process, from the initial storyboard to the final design." side="left" />
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
