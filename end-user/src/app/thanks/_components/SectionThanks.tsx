"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Icon from "@/assets/thanks/Icon.png";

function SectionThanksContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const voucherApplied = searchParams.get("voucherApplied") === "true";
    const vType = searchParams.get("vType");
    const vValue = searchParams.get("vValue");
    
    let discountText = "";
    if (voucherApplied && vType && vValue) {
        discountText = vType === "fixed" 
            ? `Rp ${Number(vValue).toLocaleString("id-ID")}` 
            : `${vValue}%`;
    }

    return (
        <main className="w-full min-h-[100dvh] pt-32 pb-10">
            <section className="w-full flex flex-col gap-10 items-center justify-center h-full px-5">
                <Image src={Icon.src} alt="icon-image" width={1920} height={1080} className="object-contain w-28 h-28 md:w-36 md:h-36 bg-red-200 rounded-full mx-auto" />
                <div className="flex flex-col gap-4 justify-center items-center">
                    <h1 className="font-heading text-center mx-auto max-w-xl font-semibold text-xl sm:text-2xl md:text-3xl !leading-[120%] capitalize">
                        Thank You! We&apos;ve Received Your Inquiry!
                    </h1>
                    <p className="text-center !leading-[150%] font-body text-sm md:text-lg text-gray-600 sm:max-w-[60%]">
                        Hello! We appreciate you providing your details. Our team will contact you soon to help address your needs.
                    </p>
                    {voucherApplied && (
                        <div className="mt-4 p-4 md:p-6 bg-red-50 border border-red-200 rounded-2xl max-w-[80%] md:max-w-xl animate-fade-in text-center shadow-sm">
                            <h2 className="text-red-700 font-bold text-lg md:text-xl mb-2">🎉 Congratulations! 🎉</h2>
                            <p className="text-red-900/80 text-sm md:text-base font-medium">
                                You successfully claimed a <strong>{discountText}</strong> discount for this consultation. We will apply this to your proposal!
                            </p>
                        </div>
                    )}
                </div>
                <Button className="w-full py-3 rounded-3xl text-base md:text-lg font-semibold bg-primary text-white max-w-64 mx-auto" onClick={() => router.push("/")}>Continue</Button>
            </section>
        </main>
    );
}

export default function SectionThanks() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
            <SectionThanksContent />
        </Suspense>
    );
}