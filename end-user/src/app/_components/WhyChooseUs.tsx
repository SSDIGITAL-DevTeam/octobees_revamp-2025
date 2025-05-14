import Image from "next/image";
import Link from "next/link";
import AssetWhyChooseUs1 from "@/assets/homepage/webp/asset-why-choose-us-1.webp";
import AssetWhyChooseUs2 from "@/assets/homepage/webp/asset-why-choose-us-2.webp";
const Arrow = () => (
    <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 stroke-dark group-hover:stroke-white"
    >
        <path
            d="M14.93 18.07L21 12L14.93 5.92999"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4.00008 12L20.8301 12"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)

const data = [
    {
        title: "Agency that know your business",
        desc: "We take a proactive approach to help you make best marketing financial decisions to grow revenue.",
        image: AssetWhyChooseUs1
    },
    {
        title: "Google SEO-powered website for your business",
        desc: "Our team helps to create the best Google SEO-Powered Website to drive traffic, increase visibility, and convert visitors into loyal customers.",
        image: AssetWhyChooseUs2
    },
]

export default function WhyChooseUs() {
    return (
        <div className="container flex flex-col items-center justify-center md:px-10 gap-y-10 md:gap-y-12">
            <div className="flex flex-col md:w-[660px] lg:w-[900px] items-center justify-center text-center gap-y-5">
                <span className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">why choose us</span>
                <h1 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[120%]">From brand analysis to marketing strategy and beyond, we&apos;re
                    with you.</h1>
            </div>
            <div className="mt-3 lg:mt-12 flex flex-col gap-y-16 lg:gap-y-20 w-full justify-center items-center">
                {/*  First Section */}
                {
                    data.map((item, index) => (
                        <div key={index} className={`flex flex-col items-center justify-center  gap-y-10 lg:gap-y-0 gap-x-0 lg:gap-x-28 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                            <Image
                                src={item.image}
                                alt={item.title}
                                className="w-[80%] lg:w-2/5 lg:h-[50vh] object-cover rounded-[30px]"
                                loading="lazy"
                            />
                            <div className="flex flex-col h-auto gap-y-3 md:gap-y-6 items-center justify-center w-full lg:w-1/3 ">
                                <h3 className="text-xl font-heading !leading-[130%] lg:text-4xl w-full text-center md:text-left">
                                    {item.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-700 lg:text-lg !leading-[140%] text-center md:text-left">
                                    {item.desc}
                                </p>
                                <Link
                                    href="/about"
                                    className="text-center md:text-left group mt-2 bg-transparent px-5 py-2 lg:px-7 lg:py-3 font-semibold text-dark border-2 border-dark rounded-full md:text-lg flex gap-x-2 md:gap-x-4 items-center md:self-start hover:bg-dark hover:text-white transition-all duration-300"
                                >
                                    Learn More
                                    <Arrow />
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}