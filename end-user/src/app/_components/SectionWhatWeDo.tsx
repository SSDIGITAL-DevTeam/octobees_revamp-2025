import { TrendingUp } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import SectionTitle from "./SectionTitle";

import ImageWhatWeDo01 from "@/assets/homepage/svg/undraw_my-workspace_5961 1.svg";
import ImageWhatWeDo02 from "@/assets/homepage/svg/undraw_success-factors_3eki 1.svg";

type SectionWhatWeDoType = {
    heading: React.ReactNode,
    subheading: string,
    image: StaticImageData
}

const WhatWeDoMap: SectionWhatWeDoType[] = [
    {
        heading: <><span className="text-primary">Start</span> your business</>,
        subheading: "Enhance Your Business Brand Identity by Leveraging Affordable Digital Solutions for SMEs",
        image: ImageWhatWeDo01
    },
    {
        heading: <><span className="text-primary">Switch</span> to Octobees</>,
        subheading: "Get Expert Digital Marketing Services with best practices for website optimization and targeted B2B and B2C Strategies",
        image: ImageWhatWeDo02
    }
]

export default function SectionWhatWeDo() {
    return (
        <div className="space-y-10 md:space-y-16 w-full">
            <SectionTitle heading="Flexible services for every stage of your business" subheading="what we do" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 md:gap-x-2 xl:gap-x-7">
                {
                    WhatWeDoMap.map((data, i) => (
                        <div className="group flex flex-col items-center px-8 py-12 md:p-14 bg-white rounded-3xl gap-y-8 shadow-md transition-all duration-300 hover:shadow-primary/40 border-2">
                            <Image
                                src={data.image}
                                alt={`image-what-we-do-${i + 1}`}
                                className="w-[60%] md:w-full md:h-[25vh] object-contain transition-all duration-1000 group-hover:scale-[1.06]"
                                loading="lazy"
                                quality={100}
                            />
                            <div className="flex flex-col justify-center items-center gap-y-2 md:gap-y-4 w-full">
                                <h1 className="font-heading font-semibold text-xl md:text-3xl lg:text-4xl">
                                    {data.heading}
                                </h1>
                                <p className="text-sm text-gray-500 tracking-[0.2px] md:text-base text-center font-medium !leading-[140%]">
                                    {data.subheading}
                                </p>
                            </div>
                            <div className="w-full flex justify-center">
                                <Link
                                    href="/contact-us"
                                    className="group-hover:bg-primary hover:bg-red-900 group-hover:text-white bg-light px-5 py-2 lg:px-7 lg:py-3 font-semibold text-primary border-2 border-primary rounded-full md:text-lg whitespace-nowrap gap-x-2 md:gap-x-4 transition-all duration-1000 w-full flex justify-center items-center gap-2"
                                >
                                    Start Now
                                    <TrendingUp />
                                </Link>
                            </div>
                        </div>

                    ))
                }
            </div>
        </div>
    )
}