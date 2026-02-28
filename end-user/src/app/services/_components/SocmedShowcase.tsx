import Image from "next/image";
import Grid1 from "@/assets/services/webp/smm-sosmed-1.webp"
import Grid2 from "@/assets/services/webp/smm-sosmed-2.webp"
import Grid3 from "@/assets/services/webp/smm-sosmed-3.webp"
import Grid4 from "@/assets/services/webp/smm-sosmed-4.webp"
import Grid5 from "@/assets/services/webp/smm-sosmed-5.webp"
import Grid6 from "@/assets/services/webp/smm-sosmed-6.webp"

const showCase = [Grid1, Grid2, Grid3, Grid4, Grid5, Grid6]
export default function SocmedShowcase() {
    return (
        <div className="md:grid flex flex-wrap items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-8 gap-y-3 lg:max-w-5xl">
            {showCase.map((d, i) => (
                <div key={`motion-grafic-${i + 1}`} className="w-full md:w-[35vw] md:h-[35vw] lg:w-[20vw] lg:h-[25vw]">
                    <Image src={d.src} alt={`motion-graphic-${i + 1}`} width={1920} height={1080} quality={100} className="object-contain h-full w-full" />
                </div>
            ))}
        </div>
    )
}