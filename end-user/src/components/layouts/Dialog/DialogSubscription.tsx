"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import Icon from "@/assets/thanks/Icon.png"
import { Button } from "@/components/ui/button";
import ImageSubscriptionDialog from "@/assets/insights/webp/image-insights-subscription-hero.webp";
import { FormSubscription } from "@/components/partials/Form";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function DialogSubscription({ open, setOpen }: Props): JSX.Element {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="z-[103] lg:h-[480px] bg-white rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row items-center w-full sm:max-w-full sm:w-[62vw] p-0 sm:p-0 overflow-hidden">
                <div className="w-full lg:w-[48%] h-fit py-6 lg:py-0 lg:h-full bg-[#F5F5F5] flex items-center justify-center">
                    <Image src={ImageSubscriptionDialog} alt="image-subscription-dialog" width={1920} height={1080} quality={100} className="w-[70%] md:w-[60%] lg:w-full"/>
                </div>
                <DialogHeader className="px-5 lg:pl-8 space-y-3 lg:space-y-5 max-w-[90%] mx-auto lg:max-w-full pt-3 md:pt-0 pb-10">
                    <DialogTitle className="space-y-8 md:space-y-14 flex flex-col">
                        <h1 className="font-heading text-center lg:text-left font-semibold text-primary text-2xl sm:text-3xl md:text-3xl lg:text-5xl !leading-[125%] capitalize">
                            Subscribe once. Benefit forever.
                        </h1>
                    </DialogTitle>
                    <div className="space-y-8 lg:space-y-10 flex flex-col items-center lg:items-start">
                        <p className="text-center lg:text-left !leading-[150%] font-body text-sm md:text-lg text-gray-800 pl-1">Subscribe to get the latest updates, insights, and special offers</p>
                        <FormSubscription source="insights-dialog" className="p-3 border-[1px] shadow-sm border-gray-300"/>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}