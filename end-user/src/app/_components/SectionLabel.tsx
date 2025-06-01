import Image from "next/image";
import LogoOctobees from "@/assets/logo/webp/logo-octobees-white.webp";
import { CarouselRunning } from "@/components/partials/Carousel";

const labelTitle = [
  "Website Development",
  "Search Engine Optimalization",
  "Search Engine Marketing",
  "Social Media Management",
  "Website Development",
  "Search Engine Optimalization",
  "Search Engine Marketing",
  "Social Media Management",
]

const labelMap = labelTitle.map((title, index) => {
  return (
    <div className="flex gap-x-5 text-white w-full">
      <Image
        src={LogoOctobees.src}
        alt={`label-image-${index + 1}`}
        width={400}
        height={400}
        className="w-10 h-6 object-contain"
      />
      <span className="font-bold text-sm md:text-xl w-full">{title}</span>
    </div>
  )
})

export default function SectionLabel({side} : {side?: "left" | "right"}) {
  return (
      <CarouselRunning slides={labelMap} side={side}/>
  )
}