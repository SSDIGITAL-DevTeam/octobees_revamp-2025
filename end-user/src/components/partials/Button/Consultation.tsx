import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
type Props = { color?: "white" | "full-white", size?: "small" | "large", text?: string, className?: string }
export default function ConsultationButton({ color, size, text, className }: Props ) {
    let textColor = "";
    if(color == "white") textColor = "border-[2px] border-white py-3 px-8 text-white"; 
    else if(color == "full-white") textColor = "bg-white py-3 px-4 md:px-8 text-primary";
    else textColor = "text-white py-4 px-6 md:px-8";
    return (
        <Link href={"#consultation"}>
            <button className={`mt-0 w-fit text-center font-semibold rounded-xl flex gap-2 items-center bg-primary py-3 px-6 md:py-4
                ${textColor}  
                ${size == "small"
                    ? "text-xs lg:text-sm md:px-4"
                    : "text-sm lg:text-base md:px-12"
                }  
                ${className}
            `}
            >
                {text ? text : "Free Consultation"} <ArrowRightIcon className="h-5 w-5" />
            </button>
        </Link>
    )
}