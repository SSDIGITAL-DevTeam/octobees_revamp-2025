import Image from "next/image";
import AssetTestimonial from "@/assets/homepage/webp/asset-testimonials.webp";
import SectionTitle from "./SectionTitle";

const TestimonialsDiagram = () => (
    <svg className="lg:w-2/3 sm:w-[80%] md:w-full w-full lg:px-0 px-10" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,10 A40,40 0 1,1 15,40" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" />
        <text x="50" y="58" font-size="24" font-weight="bold" text-anchor="middle" fill="white">91%</text>
    </svg>
)

export default function SectionTestimonials() {
    return (
        <div className="space-y-10 md:space-y-20 w-full">
            <SectionTitle heading="What our clients think about Octobees services" subheading="testimonials" />
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-rows-4 gap-8">
                <div className="md:col-span-4 lg:row-span-2 min-h-[380px] md:min-h-[360px] md:max-h-[400px] w-full relative group overflow-hidden rounded-[30px] shadow-md">
                    <Image
                        src={AssetTestimonial}
                        alt="image-testimonials-1"
                        className="w-full h-full object-cover object-top filter brightness-[50%] group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-8 lg:p-10">
                        <h2 className="uppercase text-light text-sm md:text-base">customer stories</h2>
                        <div className="flex flex-col gap-y-3 md:gap-y-7 w-full lg:w-3/4">
                            <span className="font-heading text-xl md:text-3xl lg:text-5xl text-light !leading-[115%]">
                                “I use Octobees to help me succeed“
                            </span>
                            <span className="text-light text-base md:text-xl">
                                Wayne Puah, Steadbook
                            </span>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 md:row-span-2 md:col-start-5 min-h-[380px] md:min-h-[360px] md:max-h-[400px] bg-primary rounded-[30px] md:py-0 lg:py-10 p-10 shadow-md">
                    <div className="flex flex-col h-full justify-center gap-4 lg:gap-0 lg:justify-between items-center w-full">
                        <h2 className="uppercase text-light font-normal">Facts & numbers</h2>
                        <TestimonialsDiagram />
                        <span className="text-light text-base md:text-xl capitalize text-center">
                            of customers recommend Octobees services
                        </span>
                    </div>
                </div>
                <div className="md:col-span-6 md:row-span-2 md:row-start-3 min-h-[380px] md:min-h-[360px] md:max-h-[400px] flex flex-col justify-center bg-[#FFEEEF] p-10 lg:p-14 rounded-[30px] shadow-md">
                    <div className="flex flex-col justify-between gap-y-10 md:gap-y-14">
                        <h2 className="uppercase text-gray-600 text-sm md:text-base">review</h2>
                        <span className="font-heading text-xl lg:text-4xl !leading-[140%]">
                            “The good thing about Octobees is that it saves a lot of
                            time so I can do other things – the running of the business
                            part.”
                        </span>
                        <p className="capitalize text-dark text-base lg:text-xl">Jennifer Halim</p>
                    </div>
                </div>
            </div>
        </div>
    )
}