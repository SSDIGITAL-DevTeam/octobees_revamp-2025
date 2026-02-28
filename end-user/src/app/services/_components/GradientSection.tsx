import Image from "next/image";
type Props = {
    data: List[],
    name: string,
    bigText?: boolean
}
type List = {
    title: string;
    image: string;
    subtitle?: string;
}
export default function GradientSection({ data, name, bigText=false }: Props) {
    return (
        <div className="flex flex-wrap gap-7 w-full justify-center items-center">
            {data.map((d, i) => (
                <div key={`${name}-${i+1}`} className="group relative overflow-hidden rounded-2xl w-full lg:w-[600px] h-[50vh] shadow-md hover:shadow-2xl transition-all duration-300">
                    <Image
                        src={d.image}
                        alt="Image"
                        width={1920}
                        height={1080}
                        quality={100}
                        className="w-full h-full object-cover group-hover:scale-110 duration-1000 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-t from-black/90 md:from-black via-black/70 to-transparent rounded-2xl text-white flex justify-start lg:justify-end flex-col gap-1 p-6 lg:px-8 lg:py-12">
                        <h2 className={`font-bold !leading-[130%] ${bigText ? "text-2xl lg:text-4xl md:max-w-[70%]" : "text-xl lg:text-2xl"}`}>{d.title}</h2>
                        {d.subtitle && <p className="text-sm lg:text-base md:text-white/60 text-white/70">{d.subtitle}</p>}
                    </div>
                </div>
            ))}
        </div>
    )
}