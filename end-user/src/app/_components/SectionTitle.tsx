type SectionTitleProps = {
    subheading : string,
    heading: string
}
export default function SectionTitle({subheading, heading}: SectionTitleProps){
    return(
         <div className="flex flex-col w-full items-center justify-center text-center gap-y-4">
                <span className="uppercase text-secondary text-sm lg px-3 py-1 border-[1px] border-secondary shadow-sm rounded-full">{subheading}</span>
                <h2 className="font-heading text-3xl lg:text-4xl xl:text-5xl font-medium !leading-[130%] md:max-w-4xl">{heading}</h2>
            </div>
    )
}