import Image from "next/image"

//image asset
import HeroImage from '@/assets/services/webp/smc/hero-smc.webp'
import RequireAgencyImage from '@/assets/services/webp/smc/require-content-agency.webp'
import SocmedImage from '@/assets/services/webp/smc/socmed-editorial.webp'
import UnderstandImage from '@/assets/services/webp/smc/understanding-smc.webp'

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import LeftHeader from "../../_components/LeftHeader"

import GridSection from "../../_components/GridSection"
import SocmedShowcase from "../../_components/SocmedShowcase"
import MotionGraphicShowcase from "../../_components/MotionGraphicShowcase"
import ConsultationButton from "@/components/partials/Button/Consultation"

// icon asset
import CalendarIcon from '@/assets/services/svg/calendar.svg'
import GalleryIcon from '@/assets/services/svg/gallery.svg'
import UsersIcon from '@/assets/services/svg/users.svg'

type ContentWorkType = {
    title: string;
    desc: string;
}

const contentWorkType: ContentWorkType[] = [
    {
        title: "Images & Graphics",
        desc: "High-quality photos, infographics, and custom graphics grab attention and are highly shareable."
    },
    {
        title: "Videos",
        desc: "Short-form videos (e.g., reels, TikToks), tutorials, behind-the-scenes clips, and live streams engage audiences effectively."
    },
    {
        title: "User-Generated Content",
        desc: "Content created by your audience, like reviews or testimonials, builds trust and community."
    },
    {
        title: "Polls and Quizzes",
        desc: "Interactive content encourages engagement and helps you understand your audience better."
    },
    {
        title: "Educational Content",
        desc: "How-to guides, tips, and industry insights position your brand as an authority."
    },
    {
        title: "Memes and Trending Content",
        desc: "Leveraging humor or trending topics makes your brand relatable and timely."
    },
    {
        title: "Stories (Ephemeral Content)",
        desc: "Short-lived content on platforms like Instagram or Facebook creates urgency and boosts engagement."
    },
    {
        title: "Inspirational Posts",
        desc: "Quotes, success stories, or uplifting messages resonate emotionally with your audience."
    },
]

export default function SocialMediaContent() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Leading Social media content creation Agency in Singapore"
                subtitle="We create engaging, results-driven content to elevate your brand and maximize your online presence. Transform your social media with our expertise." />

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={UnderstandImage.src} title="understanding social media content" subtitle="Social media content refers to the material you share on platforms like Facebook, Instagram, Twitter, or other social media. It can take various forms, including text, images, infographics, videos, and blog posts. Nowadays, businesses leverage content marketing strategies to promote their social media content, aiming to attract new followers or generate potential leads." side="left" />
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="What Types of Content Work Best for Social Media?" subtitle="The ideal strategy is to mix different content types. Some audiences prefer articles or blogs, while others enjoy videos. Here are the types of content you can share:" />
                    <GridSection list={contentWorkType} side="left"/>
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="Social Media Design Showcase" subtitle="Our in-house creative team develops engaging and impactful visuals for your social platforms. Browse through this selection of designs we've created for our clients:" />
                    <SocmedShowcase />
                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="Motion Graphic Video Showcase" subtitle="Videos enhance brand awareness and audience engagement. Our social media management package includes custom 2D motion graphic video production for your platforms. Browse our motion graphic video examples below:" />
                    <MotionGraphicShowcase />
                </div>
            </section>


            <section className="bg-white py-16 p-6 lg:p-8 lg:px-40 flex flex-col justify-center gap-5 lg:gap-12">
                <div className="flex flex-col gap-5 justify-center items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 h-full w-full rounded-xl border-gray-300 border-[1px] shadow-sm hover:shadow-md">
                        <div className="w-full h-full p-10 lg:pb-10 pb-0 ps-0">
                            <Image src={RequireAgencyImage.src} alt="require-agency-image" width={1920} height={1080} className="object-contain rounded-e-2xl" />
                        </div>
                        <div className="flex flex-col justify-center p-10 gap-4">
                            <Image src={GalleryIcon.src} alt="seo-globe" width={1000} height={1000} className="object-contain w-14 h-14" />
                            <h2 className="text-black text-2xl !leading-[120% font-semibold]">Do you require an agency to handle your social media content?</h2>
                            <p className="!leading-[150%]">As a social media marketing agency, We can recommend appropriate content types for your business and create an editorial calendar tailored to your social media platforms.</p>
                        </div>
                    </div>

                    <div className="grid  grid-cols-1 lg:grid-cols-5 w-full lg:h-[50vh] gap-6 h-full">
                        <div className="lg:col-span-3 grid w-full rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md relative lg:gap-0 gap-6">
                            <div className="flex flex-col lg:max-w-[50%] justify-center gap-4">
                                <Image src={CalendarIcon.src} alt="seo-globe" width={1920} height={1080} className="object-contain w-14 h-14" />
                                <h2 className="text-black text-2xl !leading-[120%] font-semibold">Social Media Editorial Calendar Scheduling</h2>
                                <p className="!leading-[150%]">We utilizes its own social media calendar scheduling tool to ensure your content is published on time across all your social media channels.</p>
                            </div>
                            <Image src={SocmedImage.src} alt="calendar-image" width={1000} height={1000} className="object-cover w-full lg:w-[26vh] lg:absolute bottom-0 right-0 rounded-ss-md h-full md:h-[40vh] lg:h-auto" />
                        </div>
                        <div className="flex flex-col lg:col-span-2 justify-center rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md gap-4">
                            <Image src={UsersIcon.src} alt="users-icon" width={1000} height={1000} className="object-contain w-14 h-14" />
                            <h2 className="text-black text-2xl !leading-[120% font-semibold]">In-House Expert Content Creator</h2>
                            <p className="!leading-[150%]">We have a dedicated in-house team of professional content creators to create top-quality social media content for our clients. To ensure complete control over the quality of the content we deliver, we never outsource any of our work.</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-center items-center mb-10">
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
