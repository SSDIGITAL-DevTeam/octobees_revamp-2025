import { FormContact } from "@/components/partials/Form";

export default function HeaderContactUs({source} : {source: string}) {
    return (
        <div className="container flex flex-col items-center justify-center py-20 px-8 md:px-10">
            <div className="flex flex-col w-full gap-y-10 items-center justify-center">
                <div className="flex flex-col text-center gap-y-7 w-full max-w-[36rem]">
                    <div className="flex flex-col text-center gap-y-3">
                        <h2 className="font-body font-semibold text-secondary md:text-lg tracking-wider">
                            Octobees <span className="text-dark">• Contact Us</span>
                        </h2>
                        <h1 className="font-heading font-medium text-dark text-4xl md:text-6xl">Contact Us</h1>
                    </div>
                    <p className="">Get in touch and ask us anything - we&apos;ll answer it all.</p>
                </div>
                <FormContact source={source} />
            </div>
        </div>
    )
}