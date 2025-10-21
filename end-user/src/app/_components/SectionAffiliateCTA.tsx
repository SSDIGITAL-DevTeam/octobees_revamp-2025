"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AffiliateModal from "@/components/modals/AffiliateModal";
import AffiliateSuccessModal from "@/components/modals/AffiliateSuccessModal";
import AffiliatePNG from "@/assets/homepage/png/affiliate-cta.png";
import { submitAffiliateApplication, type AffiliatePayload } from "@/services/affiliate.service";

function getErrorMessage(err: unknown) {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    try {
        return JSON.stringify(err);
    } catch {
        return "Unknown error";
    }
}

export default function SectionAffiliateCTA() {
    const [openForm, setOpenForm] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    return (
        <>
            <section className="container pt-8 md:pt-12 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-0">
                    <div className="order-2 md:order-1 flex justify-center md:justify-start">
                        <Image
                            src={AffiliatePNG}
                            alt="Smiling woman holding laptop illustration"
                            width={520}
                            height={360}
                            className="block w-full max-w-[520px] h-auto object-contain"
                        />
                    </div>

                    {/* Right: Copy + CTA */}
                    <div className="order-1 md:order-2 text-center md:text-left space-y-4">
                        <h2 className="font-heading text-[28px] md:text-[40px] leading-tight text-primary">
                            Join Our Affiliate Program
                        </h2>
                        <p className="text-base md:text-lg text-black/80 leading-relaxed">
                            <span className="text-primary font-semibold">Earn up to 30%</span> in
                            commission for every successful sale you refer through our program.
                        </p>
                        <div className="pt-2">
                            <Button
                                variant="increasesales"
                                size="lg"
                                className="md:w-auto w-full"
                                onClick={() => setOpenForm(true)}
                                aria-label="Open affiliate application form"
                            >
                                Join Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Modal */}
            <AffiliateModal
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={async (data) => {
                    try {
                        const payload: AffiliatePayload = {
                            full_name: String(data.full_name || "").trim(),
                            email: String(data.email || "").trim(),
                            country_code: String(data.country_code || "").trim() || "+62",
                            phone: String(data.phone || "").trim(),
                            country: String(data.country || "").trim(),
                            gov_or_business_id: String(data.gov_or_business_id || "").trim() || null,
                            strategy: String(data.strategy || "").trim(),
                            portfolio_links: String(data.portfolio_links || "").trim(),
                            motivation: String(data.motivation || "").trim(),
                            other_programs: String(data.other_programs || "").trim(),
                        };

                        await submitAffiliateApplication(payload);
                        setOpenForm(false);
                        setOpenSuccess(true);
                    } catch (err) {
                        alert(getErrorMessage(err));
                    }
                }}
            />

            {/* Success Modal */}
            <AffiliateSuccessModal
                open={openSuccess}
                onClose={() => setOpenSuccess(false)}
            />
        </>
    );
}
