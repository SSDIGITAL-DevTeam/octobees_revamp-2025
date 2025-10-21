"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThankYouPNG from "@/assets/homepage/png/thank-you.png";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AffiliateSuccessModal({ open, onClose }: Props) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-[880px] bg-white rounded-[24px] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden">
                {/* tombol close */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* konten modal */}
                <div className="pt-8 px-6 md:px-12 text-center">
                    <h3 className="text-2xl font-semibold mb-6">Thank You for Joining!</h3>

                    <div className="flex justify-center mb-6">
                        <Image
                            src={ThankYouPNG}
                            alt="Thank you illustration"
                            width={220}
                            height={220}
                            className="w-[220px] h-auto select-none"
                            priority
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed max-w-xl mx-auto">
                        Your application has been received. We’ll review it shortly and get
                        back to you with the next steps. We’re excited to have you on board!
                    </p>

                    {/* tombol (centered) */}
                    <div className="py-6 md:py-8">
                        <div className="px-4 md:px-8 flex justify-center">
                            <Button
                                variant="increasesales"
                                size="lg"
                                // full width di mobile, fixed width di >=sm, dan DICENTERKAN
                                className="w-full sm:w-[280px] md:w-[320px] mx-auto"
                                onClick={onClose}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
