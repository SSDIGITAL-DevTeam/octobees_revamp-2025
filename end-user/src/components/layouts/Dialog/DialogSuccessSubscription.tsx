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
            <DialogContent className="z-[103] h-[360px] sm:h-[400px] md:h-[430px] lg:h-[460px] bg-white flex justify-center flex-col gap-2 rounded-2xl sm:rounded-2xl">
                <DialogHeader className="max-w-[90%] w-full mx-auto">
                    <DialogTitle className="space-y-8 md:space-y-8 flex flex-col items-center justify-center">
                        <div className="bg-gray-200/50 rounded-2xl w-full flex justify-center items-center md:pb-12 pb-8">
                            <span className="text-center text-6xl sm:text-7xl md:text-8xl">📨</span>
                        </div>
                        <h1 className="font-heading text-center font-semibold text-lg sm:text-xl md:text-2xl !leading-[140%] capitalize">
                            Thank you for subscribing! 🎉
                        </h1>
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-8 md:space-y-8 max-w-[90%] mx-auto flex flex-col items-center justify-center">
                    <p className="font-heading text-center !leading-[150%] text-xs sm:text-sm md:text-base text-gray-500">Stay tuned for exciting updates in your inbox.</p>
                    <Button className=" w-full py-3 rounded-xl text-base md:text-lg font-semibold bg-primary text-white md:w-[50%]" onClick={() => setOpen(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}