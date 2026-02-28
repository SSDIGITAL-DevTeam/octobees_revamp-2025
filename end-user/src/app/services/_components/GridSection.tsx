import { Props } from "@/constants/services/type"
import Image from "next/image"

export default function GridSection({ list, height, width, side = "center", leading }: Props) {
    return (
        <div className="flex flex-wrap gap-6 w-full justify-center items-stretch">
            {list.map((d, i) => (
                <div
                    key={`grid-${i + 1}`}
                    className={`w-full h-full py-10 lg:py-10 bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col rounded-xl gap-2 md:gap-4 p-10
                        ${side === "top" ? "justify-start lg:pt-16" : "justify-center"} 
                        ${side === "left" ? "items-start" : "items-center"} 
                        ${width ?? "lg:max-w-[400px]"} 
                        ${height ?? "lg:min-h-[360px]"}`}
                >
                    {d.icons && (
                        <Image
                            src={d.icons}
                            alt="icon"
                            width={1000}
                            height={1000}
                            className="object-contain w-16 h-16 lg:w-[72px] lg:h-[72px]"
                        />
                    )}

                    <h2 className={`text-primary text-3xl lg:text-6xl ${side === "left" ? "text-left" : "text-center"}`}>
                        {!d.icons && "0" + (i + 1)}
                        <span className={`block text-lg lg:text-xl text-black ${leading ? leading : 'leading-[130%]'} mt-4`}>{d.title}</span>
                    </h2>

                    {d.desc &&
                        <p className={`!leading-[150%] text-gray-600 text-sm md:text-base ${side === "left" ? "text-left" : "text-center"}`}>
                            {d.desc}
                        </p>
                    }
                </div>
            ))}
        </div>
    )
}

// import { Props } from "@/constants/services/type"
// import Image from "next/image"

// export default function GridSection({ list, height, width, side = "center", leading }: Props) {
//     return (
//         <div className="flex flex-wrap gap-6 w-full justify-center">
//             {list.map((d, i) => (
//                 <div
//                     key={`grid-${i + 1}`}
//                     className={`
//                         flex flex-col justify-between 
//                         p-10 gap-4 rounded-xl border border-gray-200 bg-white 
//                         shadow-md hover:shadow-lg transition-all duration-300 
//                         w-full ${width ?? "lg:basis-[30%]"} 
//                         min-h-[300px] lg:min-h-[380px] 
//                         h-full
//                     `}
//                 >
//                     <div className={`flex flex-col ${side === "left" ? "items-start text-left" : "items-center text-center"} gap-4`}>
//                         {d.icons && (
//                             <Image
//                                 src={d.icons}
//                                 alt="icon"
//                                 width={1000}
//                                 height={1000}
//                                 className="object-contain w-16 h-16 lg:w-[72px] lg:h-[72px]"
//                             />
//                         )}

//                         <h2 className="text-primary text-3xl lg:text-5xl">
//                             {!d.icons && "0" + (i + 1)}
//                             <span className={`block text-lg lg:text-xl text-black ${leading ?? 'leading-[130%]'} mt-2`}>
//                                 {d.title}
//                             </span>
//                         </h2>
//                     </div>

//                     {d.desc && (
//                         <p className={`text-gray-600 text-sm md:text-base leading-[150%] ${side === "left" ? "text-left" : "text-center"}`}>
//                             {d.desc}
//                         </p>
//                     )}
//                 </div>
//             ))}
//         </div>
//     )
// }
