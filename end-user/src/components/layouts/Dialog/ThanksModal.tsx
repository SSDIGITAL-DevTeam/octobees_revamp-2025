"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Icon from "@/assets/thanks/Icon.png"
import Image from "next/image";


export default function ThanksModal({open, setOpen} : {open: boolean, setOpen: (open: boolean) => void}) {
    const router = useRouter()
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="z-[103] p-10 bg-white rounded-md gap-10">
                    <DialogHeader>
                        <DialogTitle>
                            <Image src={Icon.src} alt="icon-image" width={1920} height={1080} className="object-contain w-28 h-28 md:w-36 md:h-36 bg-red-200 rounded-full mx-auto" />
                        </DialogTitle>
                    </DialogHeader>
                        <DialogDescription className="flex flex-col gap-4 justify-center items-center">
                            <h1 className="font-heading text-center mx-auto max-w-xl font-semibold text-xl md:text-3xl !leading-[120%] capitalize">
                            Thank You! We&apos;ve Received Your Inquiry!
                            </h1>
                            <p className="text-center !leading-[150%] font-body text-sm md:text-base text-gray-600">Hello! We appreciate you providing your details. Our team will contact you soon to help address your needs.</p>
                        </DialogDescription>
                        <DialogFooter>
                            <Button className="w-full py-3 rounded-3xl text-base md:text-lg font-semibold bg-primary text-white max-w-[50%] mx-auto" onClick={() => router.push("/")}>Continue</Button>
                        </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}