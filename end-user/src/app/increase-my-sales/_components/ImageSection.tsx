import Image from "next/image"
import { imageAsset } from "@/constants/increase"

export default function ImageSection() {
    return (
        <>
            {
                imageAsset.map((data, index) => {
                    return (
                        <div key={index} className={`flex flex-col items-center justify-between gap-4 w-full h-full md:h-[50vh] bg-white border-[1px] border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${index % 2 == 0 ? "md:flex-row-reverse" : "md:flex-row"}`}>
                            <div className="flex flex-col gap-6 p-10 w-full md:w-[60%] lg:w-[45%]">
                                <span className="text-3xl md:text-5xl">{data.icon}</span>
                                <h3 className="font-heading text-xl md:text-2xl font-semibold">{data.title}</h3>
                                <p className="!leadsing-[150%] text-sm md:text-base text-gray-700">{data.desc}</p>
                            </div>
                            <div className="w-full md:w-[40%] lg:w-[55%]">
                                <Image
                                    src={data.image}
                                    alt={`image-${index + 1}`}
                                    width={1000}
                                    height={1000}
                                    className="w-auto h-full object-cover lg:object-contain pt-0 p-10 md:p-0"
                                />
                            </div>
                        </div>
                    )
                })}
        </>
    )
}