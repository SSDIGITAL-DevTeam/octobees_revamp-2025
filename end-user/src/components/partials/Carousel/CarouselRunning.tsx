"use client"
import React from "react"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import Image, { StaticImageData } from "next/image"

type Props = {
  side?: "left" | "right"
  slides: StaticImageData[] | React.ReactNode[]
}

const CarouselRunning: React.FC<Props> = ({ side = "right", slides }) => {
  const direction: "ltr" | "rtl" = side === "left" ? "rtl" : "ltr"

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      direction,
    },
    [
    AutoScroll({
      playOnInit: true,
      speed: 1,
    }) as any,
  ]
  )

  return (
    <div className="w-full mx-auto relative">
            <div className="bg-transparent h-full w-full absolute z-10" />
            <div className="overflow-hidden" ref={emblaRef}>
                <ul className={`flex -ml-4 ${side === "left" ? "flex-row-reverse" : ""}`}>
                    {slides.map((d, i) => {
                        return (
                            <li
                                key={i}
                                className="flex-none w-fit lg:w-[30%] min-w-0 pl-7 transform-gpu"
                            >
                                {React.isValidElement(d) ? (
                                    d
                                ) : (
                                    <Image
                                        src={d as StaticImageData}
                                        alt={`carousel-image-${i + 1}`}
                                        width={1920}
                                        height={1080}
                                        quality={100}
                                        className="object-contain h-fit w-full self-center"
                                    />
                                )}
                            </li>
                        );
                    })}

                </ul>
            </div>
        </div>
  )
}

export default CarouselRunning
