import { JSX } from 'react'
import Header from '../../_components/Header'
import ConsultationButton from '@/components/partials/Button/Consultation'
import EmblaCarousel from '@/components/partials/FramerMotion/EmblaCarousel'
import OurBrands from '../../_components/OurBrandPartner'
// import ProvenExperience from '../../_components/ProvenExperience'
import FAQ from '../../_components/FAQ'
import FormJoin from '../../_components/FormJoin'
import FlyingSection from '../../_components/FlyingSection'
import LeftHeader from '../../_components/LeftHeader'
import Image from 'next/image'
import GridSection from '../../_components/GridSection'


//svg icon
import EyesIcon from "@/assets/services/svg/wd/eyes.svg"
import CircleChartIcon from "@/assets/services/svg/wd/circlechart.svg"
import CTAIcon from "@/assets/services/svg/wd/cta.svg"
import NavigationIcon from "@/assets/services/svg/wd/navigation.svg"
import ResponsiveIcon from "@/assets/services/svg/wd/responsive.svg"
import SpedoIcon from "@/assets/services/svg/wd/spedo.svg"
import GlobeIcon from "@/assets/services/svg/globe.svg"


import BackendDashboard from '@/assets/services/webp/wdd/backend-dashboard.webp'
import CarouselTop1 from '@/assets/services/webp/wdd/c1.webp'
import CarouselTop2 from '@/assets/services/webp/wdd/c2.webp'
import CarouselTop3 from '@/assets/services/webp/wdd/c3.webp'
import CarouselTop4 from '@/assets/services/webp/wdd/c4.webp'
import CarouselTop5 from '@/assets/services/webp/wdd/c5.webp'
import CarouselBottom1 from '@/assets/services/webp/wdd/c6.webp'
import CarouselBottom2 from '@/assets/services/webp/wdd/c7.webp'
import CarouselBottom3 from '@/assets/services/webp/wdd/c8.webp'
import CarouselBottom4 from '@/assets/services/webp/wdd/c9.webp'
import CarouselBottom5 from '@/assets/services/webp/wdd/c10.webp'
import InhouseWebDesign from '@/assets/services/webp/wdd/inhouse-webdesign-web.webp'
import MaintenanceService from '@/assets/services/webp/wdd/maintenance-server.webp'
import ReliableImage1 from '@/assets/services/webp/wdd/reliable1.webp'
import ReliableImage2 from '@/assets/services/webp/wdd/reliable2.webp'
import ReliableImage3 from '@/assets/services/webp/wdd/reliable3.webp'
import TailoredImage1 from '@/assets/services/webp/wdd/tailored1.webp'
import TailoredImage2 from '@/assets/services/webp/wdd/tailored2.webp'
import TailoredImage3 from '@/assets/services/webp/wdd/tailored3.webp'
import GradientSection from '../../_components/GradientSection'
import CheckBoxIcon from '../../_components/CheckBoxIcon'
import { webFAQ } from '@/constants/services/faq'

type List = {
    title: string;
    image: string;
    subtitle: string;
}

const reliableWebSolutions: List[] = [
    {
        title: "Web Design",
        subtitle: "Craft visually stunning and user-friendly designs that captivate your audience and drive engagement.",
        image: ReliableImage1.src
    },
    {
        title: "Web Development",
        subtitle: "Build high-performance, custom websites tailored to your business needs, ensuring seamless functionality and scalability.",
        image: ReliableImage2.src
    },
    {
        title: "Web Maintenance",
        subtitle: "Keep your website secure, updated, and running smoothly with our ongoing support and optimization services.",
        image: ReliableImage3.src
    },
]
const tailoredWebsiteSolutions = [
    {
        title: "Starter Website",
        subtitle: "Perfect for small businesses looking for a solid online presence.",
        image: TailoredImage1.src,
        list: [
            "5 Static Pages",
            "Website Maintenance",
            "Free Landing Page"
        ],
        side: "left",
        color: "white"
    },
    {
        title: "Dynamic Website",
        subtitle: "Ideal for brands needing a more interactive experience.",
        image: TailoredImage2.src,
        list: [
            "6 Dynamic Pages",
            "Blog & Product Showcase",
            "Website Maintenance",
            "Free Landing Page",
        ],
        side: "right",
        color: "no-white"
    },
    {
        title: "E-Commerce+",
        subtitle: "For businesses ready to sell online with a powerful e-commerce platform.",
        image: TailoredImage3.src,
        list: [
            "Custom Online Store",
            "Scalable & Secure",
            "Optimized for Sales"
        ],
        side: "left",
        color: "white"
    },
]

const high_performance_lead: { desc: string, icon: string; }[] = [
    {
        icon: EyesIcon.src,
        desc: "Visually Stunning Design",
    },
    {
        icon: NavigationIcon.src,
        desc: "Seamless Navigation"
    },
    {
        icon: SpedoIcon.src,
        desc: "Lightning-Fast Performance"
    },
    {
        icon: ResponsiveIcon.src,
        desc: "Fully Responsive Layout"
    },
    {
        icon: GlobeIcon.src,
        desc: "Optimized for SEO"
    },
    {
        icon: CTAIcon.src,
        desc: "Effective Call-to-Action"
    },
]

const whyBussinessWeb: { title: string; }[] = [
    {
        title: "Take your business online and reach customers worldwide.",
    },
    {
        title: "Enable seamless shopping anytime, anywhere."
    },
    {
        title: "Leverage digital marketing to boost website traffic and sales."
    },
    {
        title: "Streamline and enhance business operations."
    },
    {
        title: "Keep your store open 24/7 for continuous revenue."
    },
    {
        title: "Maximize profits by cutting operational costs."
    },
]

const slides = [
    CarouselTop1.src,
    CarouselTop2.src,
    CarouselTop3.src,
    CarouselTop4.src,
    CarouselTop5.src,
    CarouselBottom1.src,
    CarouselBottom2.src,
    CarouselBottom3.src,
    CarouselBottom4.src,
    CarouselBottom5.src
]

export default function WebsiteDevelopment(): JSX.Element {

    return (
        <main className="">
            <section className="w-full bg-white py-12 lg:py-20 px-0 lg:pt-32">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-12 lg:gap-16 lg:mx-auto">
                    <Header className='capitalize lg:max-w-5xl lg:text-6xl' title="Website Design & Development Agency in Singapore" subtitle="We make a lasting first impression on your potential customers. Our expert team of designers and developers crafts visually stunning and high-converting websites tailored to your needs. We specialize in Landing Pages, Dynamic Website Design, E-commerce Platforms, and Web Applications." />
                </div>
                <div className="flex w-full justify-center items-center my-12 lg:mb-20">
                    <ConsultationButton />
                </div>
                <div className='w-full flex flex-col justify-center items-center gap-7'>
                    <EmblaCarousel side='right' slides={slides.slice(0, 5)} />
                    <EmblaCarousel side='left' slides={slides.slice(5, 10)} />
                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title='Reliable Web Solutions for Your Business' subtitle='From design to development and maintenance, we ensure your website is visually compelling, highly functional, and always up-to-date.' />
                    <GradientSection data={reliableWebSolutions} name="reliableWebSolutions" />
                </div>
            </section>*

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-0 flex flex-col gap-y-10">
                <Header title="Tailored Website Solutions for Your Business" subtitle="Whether you need a simple site, a dynamic platform, or a full-scale e-commerce store, we’ve got the perfect plan to help your business grow." className="lg:max-w-7xl" />
                <div className="flex flex-col justify-center items-center w-full pt-12 lg:gap-0 gap-12">
                    {tailoredWebsiteSolutions.map((d, i) => (
                        <div key={`tailoredWebsiteSolutions-${i + 1}`} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 w-full ${d.color == "white" ? "bg-white" : "bg-[#F5F5F5]"}`}>
                            <div className={`lg:w-[40vw] ${d.side === "left" ? "order-1" : "order-1 lg:order-2 lg:ms-[2vw]"}`}>
                                <Image
                                    src={d.image}
                                    alt="Image"
                                    width={1920}
                                    height={1080}
                                    quality={100}
                                    className="w-full h-full "
                                />
                            </div>
                            <div className={`flex flex-col gap-5 justify-center ms-5 ${d.side === "left" ? "order-2 lg:order-2 lg:ps-10" : "order-1 lg:ps-32"}`}>
                                <h2 className='uppercase text-xl lg:text-4xl font-bold'>{d.title}</h2>
                                <p>{d.subtitle}</p>
                                <ul className=" flex flex-col gap-3 lg:gap-2">
                                    {
                                        d.list.map((item: string, index: number) => (
                                            <li key={`list-${index + 1}`} className="flex text-sm lg:text-base items-center gap-2"><CheckBoxIcon />{item}</li>
                                        ))
                                    }
                                </ul>
                                <div className="flex w-full mt-2">
                                    <ConsultationButton color='white' />
                                </div>
                            </div>
                        </div>))}
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center  gap-16 lg:mx-auto">
                    <LeftHeader title="High-Performance Lead Generation Website" subtitle="A strategically designed website can give you a competitive advantage and enhance your brand’s credibility. As a leading digital marketing and web design agency in Singapore, we optimize user experience and SEO to turn your website into a powerful tool for generating leads." />
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 justify-center items-center w-full mx-auto">
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {high_performance_lead.slice(0, 3).map((d, i) => (
                                <div key={`high_performance_lead-${i + 1}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="high_performance_lead" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
                                    <p className="!leading-[150%] text-base font-bold">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-9 gap-8">
                            {high_performance_lead.slice(3, 6).map((d, i) => (
                                <div key={`high_performance_lead-${i + 3}`} className="flex-row flex gap-8 items-center">
                                    <Image src={d.icon} alt="high_performance_lead" width={1000} height={1000} className="object-contain w-12 h-12 lg:w-[62px] lg:h-[62px]" />
                                    <p className="!leading-[150%] text-base font-bold">{d.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Why Your Business Should Have an E-commerce Website" />
                    <GridSection list={whyBussinessWeb} side="center" leading='leading-[160%]' />
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-10 lg:mx-auto">
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1 rounded-xl  p-10 lg:pe-0 lg:pb-0 lg:pt-10 lg:ps-10 border-gray-300 border-[1px] lg:h-[60vh] shadow-sm hover:shadow-md lg:gap-10 gap-6 place-items-end">
                        <div className="flex flex-col w-full justify-center gap-4 lg:pb-10">
                            <Image src={CircleChartIcon.src} alt="globe-icon" width={1000} height={1000} className="object-contain w-14 h-14" />
                            <h2 className="text-black text-2xl !leading-[120%] font-semibold mt-10">Easy to Manage Backend Dashboard</h2>
                            <p className="!leading-[150%]">We have developed an easy-to-manage backend dashboard that you can effortlessly handle on your own in the event that we are no longer managing your website.</p>
                        </div>
                        <div className='w-fit lg:h-[50vh]'>
                            <Image src={BackendDashboard.src} alt="back-end-dashboard" width={1000} height={1000} className="object-contain w-fit h-full rounded-xl lg:rounded-none lg:rounded-ss-xl" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 justify-items-center lg:grid-cols-2 lg:gap-10 gap-6 rounded-xl border-gray-300 border-[1px] p-10 shadow-sm hover:shadow-md">
                        <div className='h-full order-2 lg:order-1'>
                            <Image src={MaintenanceService.src} alt="inhouse-copywriting" width={1000} height={1000} className=" w-full h-full rounded-xl border-gray-300 border-[1px]" />
                        </div>
                        <div className="flex flex-col justify-center gap-4 w-full order-1 lg:order-2">
                            <h2 className="text-black text-2xl !leading-[120% font-semibold]">Website Maintenance Service</h2>
                            <p className="!leading-[150%]">The option of website maintenance service is available if you require assistance with any updates or improvements on your website after it goes live.</p>
                        </div>
                    </div>
                    <div className="flex w-full justify-center items-center">
                        <ConsultationButton />
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InhouseWebDesign.src} side='left' title='Our In-House Web Design & Development Team' subtitle='Work with our experienced professionals to create intuitive, user-friendly designs and high-speed, SEO-optimized websites that cater to both users and search engines.' />
            </section>

            <section className="w-full bg-white py-12 lg:py-20">
                <OurBrands />
            </section>

            {/* <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}

            <section className="w-full bg-white py-12 lg:py-20">
                <FAQ value={webFAQ}/>
            </section>

            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )
}
