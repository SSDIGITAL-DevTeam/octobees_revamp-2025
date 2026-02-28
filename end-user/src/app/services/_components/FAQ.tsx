"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Header from "./Header";
import { Faq } from "@/constants/services/faq";


export default function FAQ({ value }: { value: Faq }) {
    return (
        <div className="lg:max-w-7xl px-10 lg:px-0 flex flex-col justify-center items-center gap-8 lg:gap-16 lg:mx-auto">
            <Header title="Frequently Asked Questions"/>
            <Accordion type="single" collapsible className="w-full max-w-3xl md:space-y-2">
                {
                    value?.map((d, i) => (
                        <AccordionItem key={`FAQ-${i + 1}`} value={`items-${i + 1}`}>
                            <AccordionTrigger>
                                <h2 className="font-semibold text-base py-5 lg:text-xl transition-colors duration-300 flex gap-2">
                                    <span className="text-primary hover:none">0{i + 1}</span>
                                    <span className="mr-4 hover:text-primary">{d.title}</span>
                                </h2>
                            </AccordionTrigger>
                            <AccordionContent className="md:pt-3">
                                <p className="ml-8 text-sm md:text-base !leading-[160%] text-gray-600">{d.desc}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }

            </Accordion>
        </div>
    )
}
