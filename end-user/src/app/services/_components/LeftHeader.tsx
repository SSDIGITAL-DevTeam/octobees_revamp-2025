import ConsultationButton from "@/components/partials/Button/Consultation";

export default function LeftHeader({ title, subtitle, className }: { title: string | React.ReactNode, subtitle?: string, className?: string }) {
    return (
        <div className="flex flex-col gap-5 md:gap-3 w-full px-0 md:px-10 lg:px-5">
            <div data-scroll data-scroll-speed="0.1" className="flex flex-col items-start lg:max-w-[50vw] w-full h-full">
                <h2  className={`capitalize !leading-tight text-3xl sm:text-4xl w-full text-primary lg:text-start text-center  ${className}`}>{title}</h2>
            </div>
            <div data-scroll data-scroll-speed="0.08" className="flex lg:flex-row gap-y-7 flex-col items-center lg:items-start lg:justify-between w-full">
                <p className="!leading-[150%] text-sm md:text-lg text-left lg:max-w-[45vw] text-gray-700">{subtitle}</p>
                <ConsultationButton text="Get a free consultation"/>
            </div>
        </div>
    )
}