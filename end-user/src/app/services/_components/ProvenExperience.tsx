import Header from "./Header";

type Experience = {
    number: string;
    title: React.ReactNode;
    desc: string;
}

const experience: Experience[] = [
    {
        number: "20+",
        title: "Client Worldwide",
        desc: "Trusted by businesses across multiple continents"
    },
    {
        number: "40+",
        title: "Companies we've helped to upscale",
        desc: "Proven success in transforming businesses to reach their growth potential"
    },
    {
        number: "2 years",
        title: "of operations",
        desc: "Young, innovative, and already delivering exceptional results"
    },
]

export default function ProvenExperience(){
    return(
        <div className="lg:max-w-7xl flex flex-col gap-16 lg:mx-auto">
                    <Header title="Proven Experience and Trust" className="md:max-w-6xl"/>
                    <div className="grid grid-cols-1 lg:grid-cols-3 w-full bg-white border-gray-200 border-[1px] shadow-md hover:shadow-lg duration-300 transition-all rounded-md py-10">
                        {experience.map((d, i) => (
                            <div key={`experience-${i+1}`} className="w-full justify-center items-center flex flex-col gap-4 p-8 border-b-[1px] lg:border-e-[1px]">
                                <h2 className="text-center text-sm"> <span className="text-primary text-4xl font-bold">{d.number}</span><br /> <br />{d.title}</h2>
                                <p className="!leading-[150%] text-sm line-clamp-2 text-center">{d.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
    )
}