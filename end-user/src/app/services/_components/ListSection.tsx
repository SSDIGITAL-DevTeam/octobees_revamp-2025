import ConsultationButton from "@/components/partials/Button/Consultation";
import Image from "next/image";
import CheckBoxIcon from "./CheckBoxIcon";

export default function ListSection({ image, title, subtitle, list }: { image: string, title: string, subtitle?: string, list: string[]}) {
    return (
        <div className="w-full lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10">
            <div className="flex flex-col gap-3 items-center h-[35vh] lg:h-[60vh] lg:col-span-6 col-span-1 relative">
                <Image src={image} quality={100} alt="SEO-Agent" width={1920} height={1080} className="object-cover z-[52] h-full w-full rounded-md shadow-sm" />
            </div>
            <div className="flex flex-col gap-3 items-center justify-center lg:h-[60vh] lg:col-span-6 relative">
                <div className="py-10 lg:p-10 flex flex-col gap-5">
                    <h2 className="text-primary text-lg font-bold md:text-2xl uppercase">{title}</h2>
                    {subtitle && <p className="text-sm lg:max-w-lg">{subtitle}</p>}
                    <ul className="font-semibold flex flex-col gap-3  mb-10 lg:mb-0">
                        {
                            list.map((item :string, index : number) => (
                                <li key={`list-${index + 1}`} className="flex items-center gap-2"><CheckBoxIcon />{item}</li>
                            ))
                        }
                    </ul>
                    <ConsultationButton />
                </div>
            </div>
        </div>
    )
}