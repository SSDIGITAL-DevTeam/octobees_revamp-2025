import Image, { StaticImageData } from "next/image";
import AssetBarista from "@/assets/homepage/webp/asset-barista-smile.webp";
import AssetIllingWarm from "@/assets/homepage/webp/asset-illing-warm.webp";
import AssetSerious from "@/assets/homepage/webp/asset-serious-partner.webp";
import SectionTitle from "./SectionTitle";
import React from "react";

type SectionWhoWeHelpType = {
    title: React.ReactNode;
    image: StaticImageData;
}

const WhoWeHelpMap: SectionWhoWeHelpType[] = [
    {
        title: <><span className="text-primary">Solo founders</span>{" "}looking to boost their digital presence without the stress</>,
        image: AssetBarista
    },
    {
        title: <><span className="text-primary">Business owners</span>{" "}who know their needs and value quality services</>,
        image: AssetIllingWarm
    },
    {
        title: <>Company looking to<span className="text-primary">{" "}scale up{" "}</span>their business</>,
        image: AssetSerious
    }
]

export default function SectionWhoWeHelp() {
    return (
        <div className="space-y-16 md:space-y-20 w-full">
            <SectionTitle heading="For founders to expand their client base and strengthen brand identity" subheading="who we help" />
            <div className="mt-3 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 w-full">
                {
                    WhoWeHelpMap.map((data, i) => {
                        const isLast = i === WhoWeHelpMap.length - 1;
                        return (<div className={`flex flex-col items-center w-full gap-4 lg:gap-y-8 justify-start ${isLast && "md:col-span-2 md:justify-center lg:col-span-1"}`}>
                            <Image
                                src={data.image}
                                alt={`image-who-we-help-${i + 1}`}
                                className="w-[80%] md:w-[90%] rounded-[30px] transition-all duration-500 hover:scale-[1.06]"
                                loading="lazy"
                            />
                            <h2 className="text-center font-medium md:font-semibold text-base lg:text-xl w-full lg:w-[80%]">
                                {data.title}
                            </h2>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}