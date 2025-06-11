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

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
}
export default function DialogSubscription({ open, setOpen }: Props): JSX.Element {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="z-[103] h-[410px] sm:h-[430px] md:h-[500px] lg:h-[540px] bg-white rounded-2xl flex justify-center flex-col gap-5 w-[80%] ">
                <DialogHeader className="max-w-[90%] md:max-w-[80%] mx-auto">
                    <DialogTitle className="space-y-8 md:space-y-14 flex flex-col items-center justify-center">
                        <span className="text-center text-5xl md:text-7xl">🥳</span>
                        <h1 className="font-heading text-center font-semibold text-xl sm:text-2xl md:text-3xl !leading-[120%] capitalize">
                            Thank You! We&apos;ve Received Your Inquiry!
                        </h1>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-8 md:space-y-10 max-w-[80%] mx-auto flex flex-col items-center justify-center">
                    <p className="text-center !leading-[150%] font-body text-sm md:text-lg text-gray-800">Hello! We appreciate you providing your details. Our team will contact you soon to help address your needs.</p>
                    <Button className=" w-full py-3 rounded-xl text-base md:text-lg font-semibold bg-primary text-white md:w-[60%]" onClick={() => setOpen(false)}>Continue</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}