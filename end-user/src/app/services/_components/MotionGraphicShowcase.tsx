import Image from "next/image";
// Gif Asset
import Gif1 from "@/assets/services/gif/mg-1.gif"
import Gif2 from "@/assets/services/gif/mg-2.gif"
import Gif3 from "@/assets/services/gif/mg-3.gif"
const motionGraphic = [Gif1, Gif2, Gif3]

export default function MotionGraphicShowcase() {
    return (
        <div className="md:grid flex flex-wrap items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-10 gap-y-5 lg:max-w-5xl">
            {motionGraphic.map((d, i) => (
                <div key={`motion-grafic-${i + 1}`} className="w-full md:w-[35vw] md:h-[35vw] lg:w-[20vw] lg:h-[20vw]">
                    <Image src={d.src} alt={`motion-graphic-${i + 1}`} width={1920} height={1080} quality={100} className="object-cover h-full w-full" />
                </div>
            ))}
        </div>
    )
}