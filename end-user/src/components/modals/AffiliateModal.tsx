"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AffiliateModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: Record<string, FormDataEntryValue>) => Promise<void> | void;
};

export default function AffiliateModal({ open, onClose, onSubmit }: AffiliateModalProps) {
    // Lock scroll + ESC to close
    useEffect(() => {
        if (!open) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = original;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        try {
            await onSubmit?.(data);
        } catch {
            // TODO: tampilkan toast error jika perlu
        }
    };

    const modal = (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center px-3 sm:px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="affiliate-title"
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* panel */}
            <div className="relative w-full max-w-[980px] bg-white rounded-[28px] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.35)] overflow-hidden">
                {/* close btn */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* content scroll area */}
                <div className="max-h-[85vh] flex flex-col">
                    {/* header */}
                    <div className="pt-6 sm:pt-8 px-5 sm:px-8 pb-3">
                        <h2 id="affiliate-title" className="text-xl sm:text-2xl font-semibold text-center">
                            Become an Affiliate Partner
                        </h2>
                        <p className="mt-1 text-center text-gray-600 text-sm">
                            Fill out the form below to join our affiliate program and unlock your earning potential.
                        </p>
                    </div>

                    {/* form (scrollable) */}
                    <form onSubmit={handleSubmit} className="relative flex-1 overflow-y-auto px-5 sm:px-8 pb-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {/* Full Name */}
                            <FormField
                                label="Full Name (Legal)"
                                name="full_name"
                                placeholder="Enter your full name"
                                required
                            />

                            {/* Email */}
                            <FormField
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                required
                            />

                            {/* Phone / WhatsApp */}
                            <div className="flex flex-col">
                                <Label text="Phone / WhatsApp Number" required />
                                <div className="flex">
                                    <select
                                        name="country_code"
                                        defaultValue="+62"
                                        className="h-10 rounded-l-md border border-gray-300 bg-white px-2 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    >
                                        <option value="+62">🇮🇩 +62</option>
                                        <option value="+65">🇸🇬 +65</option>
                                        <option value="+60">🇲🇾 +60</option>
                                        <option value="+1">🇺🇸 +1</option>
                                    </select>
                                    <input
                                        name="phone"
                                        required
                                        placeholder="e.g. 8123456789"
                                        className="h-10 w-full rounded-r-md border border-l-0 border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    />
                                </div>
                            </div>

                            {/* Country */}
                            <FormField
                                label="Country of Residence"
                                name="country"
                                placeholder="Enter your country of residence"
                                required
                            />

                            {/* Gov / Business ID */}
                            <FormField
                                label="Government ID / Business ID"
                                name="gov_or_business_id"
                                placeholder="Enter your government ID / business ID"
                            />

                            {/* Strategy short answer */}
                            <FormField
                                label="Promotion Strategy Description (short answer)"
                                name="strategy"
                                placeholder="Enter your strategy description"
                                required
                            />

                            {/* Portfolio / Social links */}
                            <FormField
                                label="Portfolio / Social Media Links"
                                name="portfolio_links"
                                placeholder="Enter your portfolio / social media links"
                                required
                            />

                            {/* Motivation */}
                            <FormField
                                label="Motivation / Reason for Joining"
                                name="motivation"
                                placeholder="Enter your motivation / reason for joining"
                                required
                            />

                            {/* Other programs (full width) */}
                            <FormField
                                label="Are You Currently Part of Any Other Affiliate Programs? If Yes, Which Ones?"
                                name="other_programs"
                                placeholder="Enter your answer"
                                required
                                className="md:col-span-2"
                            />
                        </div>

                        {/* sticky submit (inside panel) */}
                        <div className="pointer-events-none">
                            {/* sinkronkan gutter: padding konten sm:px-8 -> gunakan sm:-mx-8 */}
                            <div className="sticky bottom-0 -mx-5 sm:-mx-8 pt-4 pb-5 bg-gradient-to-t from-white via-white/95 to-white/0">
                                <div className="px-5 sm:px-8">
                                    <Button
                                        type="submit"
                                        variant="increasesales"
                                        size="lg"
                                        className="w-full pointer-events-auto text-base sm:text-lg py-3"
                                    >
                                        Submit Application
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

/* === small helpers for clean JSX === */
function Label({ text, required }: { text: string; required?: boolean }) {
    return (
        <label className="mb-1 text-sm font-medium">
            {text}
            {required && <span className="text-red-600">*</span>}
        </label>
    );
}

function FormField(
    props: React.InputHTMLAttributes<HTMLInputElement> & {
        label: string;
        className?: string;
        required?: boolean;
    }
) {
    const { label, className: containerClass, required, ...inputProps } = props;

    return (
        <div className={"flex flex-col " + (containerClass ?? "")}>
            <Label text={label} required={required} />
            {/* input field */}
            <input
                {...inputProps}
                required={required}
                className="h-10 rounded-md border border-gray-300 px-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
        </div>
    );
}
