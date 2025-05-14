import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GetStartedButton() {
    return <Link
        href="#contact"
        className="scroll-smooth bg-primary border-2 flex items-center justify-center md:justify-normal gap-3 border-primary hover:bg-primary px-8 py-3 lg:py-3 font-semibold text-light rounded-3xl text-base md:text-lg whitespace-nowrap transition-all duration-500 shadow-md hover:shadow-primary/50 hover:shadow-lg"
    >
        Get Started with Us<ArrowRight />
    </Link>
}