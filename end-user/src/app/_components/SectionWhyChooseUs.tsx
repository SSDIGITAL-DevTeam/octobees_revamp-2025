import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import AssetWhyChooseUs1 from "@/assets/homepage/webp/asset-why-choose-us-1.webp";
import AssetWhyChooseUs2 from "@/assets/homepage/webp/asset-why-choose-us-2.webp";
import SectionTitle from "./SectionTitle";
import { MoveRight } from "lucide-react";

type SectionWhyChooseUsType ={
    heading: string,
    subheading: string,
    image: StaticImageData
}

const whyChooseUsMap = [
    {
        heading: "Agency that know your business",
        subheading: "We take a proactive approach to help you make best marketing financial decisions to grow revenue.",
        image: AssetWhyChooseUs1
    },
    {
        heading: "Google SEO-powered website for your business",
        subheading: "Our team helps to create the best Google SEO-Powered Website to drive traffic, increase visibility, and convert visitors into loyal customers.",
        image: AssetWhyChooseUs2
    },
]

export default function SectionWhyChooseUs() {
    return (
        <div className="space-y-10 md:space-y-16 w-full">
            <SectionTitle heading="From brand analysis to marketing strategy and beyond, we&apos;re with you." subheading="why choose us" />
            <div className="flex flex-col gap-y-16 lg:gap-y-20 w-full justify-center items-center">
                {
                    whyChooseUsMap.map((data, index) => {
                        const isEven = index % 2 == 0
                        return (
                            <div key={index} className={`flex flex-col justify-center items-center gap-y-10 lg:gap-y-0 gap-x-0 lg:gap-x-32 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                                <Image
                                    src={data.image}
                                    alt={data.heading}
                                    className="w-[80%] lg:w-2/5 lg:min-h-[280px] object-cover rounded-[30px] hover:rotate-6 transition-all duration-500 active:scale-105 shadow-md"
                                    loading="lazy"
                                />
                                <div className="flex flex-col gap-y-5 md:gap-y-6 justify-center w-full lg:w-1/3">
                                    <h3 className="text-2xl font-heading !leading-[130%] lg:text-4xl w-full text-center md:text-left">
                                        {data.heading}
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600 lg:text-lg !leading-[140%] text-center md:text-left">
                                        {data.subheading}
                                    </p>
                                    <Link
                                        href="/about"
                                        className="group px-5 py-2 hover:pe-10 lg:px-7 lg:py-3 font-semibold border-2 border-dark rounded-full text-dark md:text-lg md:self-start self-center flex gap-x-2 md:gap-x-4 items-center transition-all duration-500 hover:bg-dark hover:text-white hover:scale-[1.03] focus:scale-110"
                                    >
                                        Learn More
                                        <MoveRight className="transition-transform duration-500 group-hover:translate-x-3" />
                                    </Link>

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}