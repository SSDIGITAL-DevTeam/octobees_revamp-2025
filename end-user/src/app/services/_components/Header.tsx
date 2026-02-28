import React from "react";

type Props = {
    title: string | React.ReactNode,
    subtitle?: string,
    className?: string,
    subClassName?: string
}

export default function Header({ title, subtitle, className, subClassName }: Props) {
    return (
        <div className="flex flex-col gap-5 items-center lg:px-0 px-5">
            <h2 data-scroll data-scroll-speed="0.05" className={`uppercase !leading-[140%] text-3xl sm:text-4xl text-center w-full text-primary ${className}`}>{title}</h2>
            {subtitle && <p data-scroll data-scroll-speed="0.03" className={`w-full max-w-3xl text-center !leading-[150%] text-gray-800 text-base md:text-lg ${subClassName}`}>{subtitle}</p>}
        </div>
    )
}