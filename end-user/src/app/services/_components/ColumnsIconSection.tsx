import Image from "next/image";

type List ={
    icon: string,
    desc: string
}

export default function ColumnsIconSection({data, name} : {data: List[], name: string}) {
    return (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 justify-center items-center w-full mx-auto">
            <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-11 gap-8">
                {data.slice(0, 3).map((d, i) => (
                    <div key={`${name}-${i + 1}`} className="flex-row flex gap-8 items-center">
                        <Image src={d.icon} alt={name + i + 1} width={1920} height={1080} quality={100} priority className="object-contain w-12 h-12 lg:w-[50px] lg:h-[50px]" />
                        <p className="!leading-[150%] text-base font-bold lg:max-w-[60%]">{d.desc}</p>
                    </div>
                ))}
            </div>
            <div className="w-full rounded-md bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all flex flex-col p-11 gap-8">
                {data.slice(3, 6).map((d, i) => (
                    <div key={`${name}-${i + 3}`} className="flex-row flex gap-8 items-center">
                        <Image src={d.icon} alt={name + i + 1} width={1920} height={1080} quality={100} priority className="object-contain w-12 h-12 lg:w-[50px] lg:h-[50px]" />
                        <p className="!leading-[150%] text-base font-bold lg:max-w-[60%]">{d.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}