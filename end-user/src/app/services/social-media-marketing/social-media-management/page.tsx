import Image from "next/image"

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
// import FAQ from "../../_components/FAQ"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import LeftHeader from "../../_components/LeftHeader"
import SocmedShowcase from "../../_components/SocmedShowcase"
import MotionGraphicShowcase from "../../_components/MotionGraphicShowcase"


// image set
import HeroImage from '@/assets/services/webp/hero-smm.webp'
import MockPhone1 from "@/assets/services/webp/mock-phone-1.webp"
import MockPhone2 from "@/assets/services/webp/mock-phone-2.webp"
import MockPhone3 from "@/assets/services/webp/mock-phone-3.webp"
import MetaImage from "@/assets/services/webp/expand-meta.webp"
import ExpertImage from "@/assets/services/webp/expert-social.webp"

const mockPhones = [MockPhone1, MockPhone2, MockPhone3]

export default function SEM() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="SOCIAL MEDIA MANAGEMENT SERVICE (smm)"
                subtitle="We handle all aspects of your social media presence, taking care of both content creation and creative elements across platforms like Facebook and Instagram." />
            {/* Grow Your Socmed */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <div className="flex flex-col gap-5 items-start  w-full">
                        <h1 className="uppercase !leading-tight text-3xl sm:text-4xl md:text-5xl w-[70vw] text-left text-primary">Grow Your Social Media Following and Boost Engagement</h1>
                        <p className="!leading-[150%] text-left lg:w-[50vw]">Partner with us for expert social media content creation and design services. Our professional management team can handle all your posting needs, helping you attract more followers and drive higher engagement across your platforms. Check out examples of our work below:</p>
                    </div>
                    <div className="md:grid flex flex-wrap md:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-10 gap-y-5 md:max-w-5xl justify-center items-center">
                        {mockPhones.map((d, i) => (
                            <Image key={`mock-phone-${i + 1}`} src={d.src} alt={`mock-phone${i + 1}`} width={1920} height={1080} quality={100} className="object-containe h-full w-[35vw] md:w-full self-center" />
                        ))}
                    </div>
                </div>
            </section>
            {/* Socmed Design */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="Social Media Design Showcase" subtitle="Our in-house creative team develops engaging and impactful visuals for your social platforms. Browse through this selection of designs we've created for our clients:" />
                    <SocmedShowcase/>
                </div>
            </section>
            {/* Motion Garphic Showcase */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="Motion Graphic Video Showcase" subtitle="Videos enhance brand awareness and audience engagement. Our social media management package includes custom 2D motion graphic video production for your platforms. Browse our motion graphic video examples below:"/>
                    <MotionGraphicShowcase/>
                </div>
            </section>
            {/* Expand Your Reach */}
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={MetaImage.src} title="Expand Your Reach with Meta Ads" subtitle="Boosted posts through Meta Ads amplify your audience and engagement, complementing organic reach. Our certified Meta Blueprint specialists ensure optimized campaigns." side="left" />
            </section>
            {/* Expert Social Media */}
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={ExpertImage.src} title="Expert Social Media Management" subtitle="Our team of strategists, marketers, copywriters, and designers crafts compelling content that captivates your audience." side="right"/>
            </section>
            <section className="w-full bg-white py-12 lg:py-20">
                <OurBrands />
            </section>
            {/* <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}
            {/* <section className="w-full bg-white py-12 lg:py-20">
                <FAQ />
            </section> */}
            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )

}
