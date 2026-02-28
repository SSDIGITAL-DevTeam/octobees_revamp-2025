//component asset
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import LeftHeader from "../../_components/LeftHeader"

// image set
import HeroImage from '@/assets/services/webp/wm/hero-wm.webp'
import InhouseImage from "@/assets/services/webp/wdd/inhouse-webdesign-web.webp"
//Mock Phone
import GridSection from "../../_components/GridSection"

const maintenanceServices: { title: string; desc: string }[] = [
    {
        title: "Page Speed Optimization",
        desc: "Regular monitoring to maintain fast loading speeds.",
    },
    {
        title: "Content Updates",
        desc: "Add, edit, or remove content to enhance user experience."
    },
    {
        title: "Contact Form Updates",
        desc: "Modify forms based on new data requirements."
    },
    {
        title: "Monthly Backups",
        desc: "Secure backups to prevent data loss."
    },
    {
        title: "Site Security & Admin Support",
        desc: "Password management and security monitoring."
    },
]

export default function WebsiteMaintenance() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Website Maintenance Services"
                subtitle="In today’s ever-changing digital landscape, managing your website doesn’t stop after design and development. Continuous improvements and updates are essential to keep your website secure, optimized, and ahead of the competition." />
            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="What’s Included in Our Website Maintenance Service?" subtitle="We ensure your website stays secure, updated, and optimized so you can focus on your business." />
                    <GridSection list={maintenanceServices} side="left" height='lg:min-h-[300px]'/>
                </div>
            </section>
            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InhouseImage.src} title="Our In-House Web Design & Development Team" subtitle="Work with our experienced professionals to create intuitive, user-friendly designs and high-speed, SEO-optimized websites that cater to both users and search engines." side="left" />
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
