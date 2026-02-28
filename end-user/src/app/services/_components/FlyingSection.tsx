import ConsultationButton from "@/components/partials/Button/Consultation";
import Image from "next/image";

type Side = "left" | "right";
export default function FlyingSection({ image, title, subtitle, side }: { image: string, title: string | React.ReactNode, subtitle: string, side: Side }) {
    return (
        <div className="lg:max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-y-32 gap-x-10 lg:mx-auto relative" data-scroll data-scroll-container>
            <div className={`flex flex-col gap-3 items-center h-full lg:h-[65vh] lg:col-span-10 ${side == "right" ? "lg:col-start-1" : "lg:col-start-3"} relative`}>
                <div className={`w-full h-full ${side == "right" ? "lg:order-1 order-1" : "order-1 lg:order-2"}`}>
                    <Image src={image} quality={100} alt="section-image" width={1920} height={1080} className="object-cover z-[52] h-[70vh] lg:h-full w-full rounded-2xl shadow-sm" />
                </div>
                <div data-scroll data-scroll-speed="1.2" className={`lg:w-[55%] w-[90%] absolute top-1/2 -translate-y-1/2  ${side == "right" ? "order-2 lg:order-2 lg:-right-[24vh]" : "order-2 lg:order-1 lg:-left-[24vh]"} z-[56] bg-white rounded-2xl shadow-sm border-gray-200 border-[1px] p-6 lg:p-16 flex flex-col gap-4 lg:gap-6`}>
                    <h2 className="text-primary text-lg font-bold md:text-2xl !leading-[150%] capitalize">{title}</h2>
                    <p className="text-sm lg:text-base lg:max-w-lg md:leading-[1.7] text-gray-700">{subtitle}</p>
                    <ConsultationButton size={"small"} text="Get a free consultation"/>
                </div>
            </div>
        </div>
    )
}