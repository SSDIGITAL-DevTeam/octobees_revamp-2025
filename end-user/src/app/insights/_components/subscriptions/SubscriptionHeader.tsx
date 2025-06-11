import ImageSubscriptionHero from "@/assets/insights/webp/image-insights-subscription-hero.webp";
import Image from "next/image";
import { FormSubscription } from "@/components/partials/Form";

export default function SubscriptionHeader() {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-5 md:max-w-7xl md:mx-auto md:py-5">
            <div className="flex flex-col gap-5 md:gap-3 w-full md:w-[60%] lg:w-[38%] ">
                <h2 className="text-primary font-bold text-3xl md:text-5xl font-heading !leading-[130%]">
                    Subscribe once. <br className="hidden md:block"/> Benefit forever.
                </h2>
                <p className="text-gray-600 text-sm lg:text-lg !leading-[150%] md:w-[80%] lg:w-full ">
                    Subscribe to our newsletter for the latest updates, insights, and special offers.
                </p>
                <FormSubscription className="p-2 border-[1px] shadow-sm border-gray-300" source="insights-homepage"/>
            </div>
            <div className="">
                <Image src={ImageSubscriptionHero} alt="subscription-hero" width={1920} height={1080} className="w-full md:max-h-[300px] lg:max-h-[420px] object-contain" />
            </div>
        </header>
    )
}