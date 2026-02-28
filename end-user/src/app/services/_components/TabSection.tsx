"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import ConsultationButton from "@/components/partials/Button/Consultation";
import TabImage01 from '@/assets/services/webp/ai/all-in-one-tab.webp'
import TabImage02 from '@/assets/services/webp/ai/crm-tab.webp'
import TabImage03 from '@/assets/services/webp/ai/appointment-tab.webp'
import TabImage04 from '@/assets/services/webp/ai/marketing-tab.webp'
import TabImage05 from '@/assets/services/webp/ai/reputation-tab.webp'
import TabImage06 from '@/assets/services/webp/ai/other-tab.webp'
import CheckBoxIcon from "./CheckBoxIcon";

type Section = {
    id: string;
    name: string;
    sub: React.ReactNode;
    list?: string[]
    sub2?: string;
    image: string;
}
const sections: Section[] = [
    {
        id: "all-in-one-system",
        name: "All-in-One System",
        sub: "The #1 benefit is convenience. Instead of trying to piece together various software tools, you get everything you need in one place",
        list: [
            "CRM for capturing leads and managing customers",
            "Website and funnel builder to convert visitors into leads",
            "Email and SMS marketing to nurture leads",
            "Appointment scheduling and reminders",
            "Reputation management to collect reviews",
            "Payment processing to get paid"
        ],
        sub2: "With the unified platform, your sales and marketing data flows into one centralized hub. You save significant time by not having to switch between different tools.",
        image: TabImage01.src
    },
    {
        id: "crm-and-lead-management",
        name: "CRM and Lead Management",
        sub:
            <>
                <span className="inline-block">The integrated CRM provides robust contact management and lead nurturing capabilities. You can track leads through the entire sales funnel from first contact to closed customer. </span>
                <span className="inline-block">Segment your lists, set up automation rules, and launch targeted campaigns to leads based on their profile and engagement. Identify hot leads, nurture cold leads, and analyze the sales funnel. </span>
                <span className="inline-block">The CRM pulls data from forms, your website, and campaigns to build a complete profile for each lead. You get a centralized hub to oversee entire lead lifecycles from acquisition to retention.</span>
            </>,
        image: TabImage02.src
    },
    {
        id: "appointment-scheduling",
        name: "Appointment Scheduling",
        sub:
            <>
                <span className="inline-block">We have built-in appointment scheduling tools to make it easy for prospects to book calls, consultations, or other meetings. </span>
                <span className="inline-block">You can embed booking forms on your website or send direct scheduling links via email and text. Customers then pick a convenient time from your availability calendar. </span>
                <span className="inline-block">The software automatically sends appointment reminders and follow-ups to reduce no-shows. The reminders can contain links to intake forms, questionnaires, and other prep material</span>
            </>,
        image: TabImage03.src
    },
    {
        id: "marketing-automation",
        name: "Marketing Automation",
        sub: "Take your marketing efforts up a notch with o ur automation capabilities. Automate messages across multiple channels like:",
        list: [
            "Email automation",
            "SMS automation",
            "Voicemail drops",
            "Facebook Messenger",
            "Text-to-call",
        ],
        sub2: "Triggers and workﬂows make the automation highly customizable. For example, you can send different follow-up sequences if a prospect downloads a particular offer versus requesting a quote.",
        image: TabImage04.src

    },
    {
        id: "reputation-management",
        name: "Reputation Management",
        sub:
            <>
                <span className="inline-block">The reputation management feature offers a full panoramic view of your online brand reputation! </span>
                <span className="inline-block">With our solution, you can essentially monitor your average ratings and review counts and quickly request, respond to, and review customer feedback. </span>
                <span className="inline-block">All reviews are housed in one handy location, so you can monitor, interact with, and even contest your reviews effortlessly.</span>
            </>,
        image: TabImage05.src
    },
    {
        id: "other-software-integrations",
        name: "Other Software Integrations",
        sub: "Our solution connects with 1 000+ popular third-party software tools through APIs and Zapier. Some of the top integrations include",
        list: [
            "Payment Processing",
            "Email Marketing",
            "Calendar",
            "Webinar Software",
            "CRM",
            "Helpdesk",
            "Productivity",
            "Accounting",
            "E-commerce Store",
            "Ads",
            "Document Signing",
            "Appointment Scheduling",
            "Surveys",
        ],
        sub2: "These integrations allow you to incorporate data from your other systems for reporting. You can also trigger marketing automations based on events happening in those tools.",
        image: TabImage06.src
    }
]


export default function TabSection() {
    const [activeSection, setActiveSection] = useState<string>(sections[0].id);

    useEffect(() => {
        const handleScroll = () => {
            let currentSection = sections[0].id;

            sections.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    if (rect.top <= viewportHeight * 0.5 && rect.bottom >= viewportHeight * 0.3) {
                        currentSection = section.id;
                    }
                }
            });

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -240;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };


    return (
        <div className="relative w-full flex flex-col items-center justify-center">
            <div className="md:sticky md:pt-24 top-0 bg-white z-50 md:border-b-[1px] w-full">
                <div className="md:max-w-7xl md:mx-auto py-12 md:py-8 px-10 lg:px-5 flex flex-col gap-8">
                    <div className='flex gap-4 flex-col w-full pb-2'>
                        <h1 className="text-primary capitalize text-3xl md:text-4xl !leading-[120%] font-bold md:text-left text-center">Benefits <span className="text-black">of our Solution</span></h1>
                        <p className="max-w-3xl text-sm md:text-lg !leading-[150%] md:text-left text-center text-gray-700">Now, let&apos;s explore the key features and benefits of our platform</p>
                    </div>
                    <div className="hidden md:flex justify-between w-full">
                        {sections.map(({ id, name }) => (
                            <button
                                key={id}
                                onClick={() => scrollToSection(id)}
                                className={`text-sm transition-all border-b-[2px] pb-2 ${activeSection === id ? "text-primary border-primary font-semibold " : "text-gray-500 font-semibold border-transparent"
                                    }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="md:mt-8 space-y-20 md:space-y-16 w-full md:max-w-7xl md:mx-auto px-10 lg:px-5">
                {sections.map(({ id, name, sub, list, sub2, image }) => (
                    <section
                        key={id}
                        id={id}
                        className="lg:h-[70vh] grid grid-cols-1 lg:grid-cols-2 gap-y-6"
                    >
                        <h2 className="md:hidden block text-2xl !leading-[120%] text-center">{name}</h2>
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <Image src={image} alt={`tab-image-${id}`} width={1920} height={1080} quality={100} className="object-contain w-full max-h-[55vh]" />
                        </div>
                        <div className="flex flex-col gap-6 lg:ps-24 lg:py-5 justify-center">
                            <h2 className="hidden md:block text-3xl !leading-[120%]">{name}</h2>
                            <p className="text-sm md:text-base text-gray-800 !leading-[150%] space-y-5">{sub}</p>
                            <ul className="font-semibold flex flex-col flex-wrap gap-2 lg:max-h-[28vh] pl-4 md:pl-0 w-full">
                                {
                                    list?.map((item, index) => (
                                        <li key={`list-${index + 1}`} className="text-sm lg:text-base flex items-center gap-2"><CheckBoxIcon />{item}</li>
                                    ))
                                }
                            </ul>
                            {sub2 && <p className="text-sm md:text-base text-gray-800 !leading-[150%]">{sub2}</p>}
                            <div className="w-full flex justify-center items-center">
                                <ConsultationButton />
                            </div>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
