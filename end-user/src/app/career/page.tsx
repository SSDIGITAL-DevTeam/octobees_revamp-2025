"use client"
import FormCareer from "@/components/partials/Form/FormCareer";

export default function PageCareer() {
    return (
        <main>
            <header className="flex flex-col overflow-x-hidden py-[80px] pt-[140px] md:py-[160px] md:pt-[240px] bg-[#F7E6E7] items-center justify-center">
                <div className="flex flex-col items-center justify-center text-justify lg:text-center w-full gap-y-5 px-10">
                    <div className="flex flex-col items-center justify-center text-center gap-y-5">
                        <span className="font-body font-semibold text-secondary text-xs md:text-base tracking-wider">
                            Octobees • <span className="text-black">Career</span>
                        </span>
                        <h1 className="font-heading font-medium text-dark text-3xl sm:text-4xl md:text-6xl w-full max-w-[45rem] !leading-[120%]">
                            Career at Octobees
                        </h1>
                    </div>
                </div>
            </header>

            <section className="bg-gray-100">
                <div className="flex flex-col items-center justify-center gap-y-6 md:gap-y-10 lg:min-h-screen md:max-w-7xl md:mx-auto py-20 px-5">
                    <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl text-black font-semibold max-w-xl text-center">
                        <span className="text-primary">Join{" "}</span>Our Team
                    </h1>
                    <p className="text-center max-w-4xl mx-auto text-gray-700 text-sm sm:text-base md:text-lg !leading-[150%]">We’re always looking for passionate and talented people to grow with us.<br /> Whether you’re a designer or developer, if you’re ready to build great things — we’d love to hear from you.</p>
                    <div className="flex flex-col items-center justify-center gap-y-6 md:gap-y-16 bg-white px-6 py-12 md:p-20 rounded-[25px] shadow-md w-full">
                        <h2 className="text-center w-full text-base md:text-3xl font-semibold">Fill out the form below and let’s create something amazing together.</h2>
                        <FormCareer />
                    </div>
                </div>
            </section>
            <section className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-y-8 md:gap-y-4 md:gap-x-5 md:max-w-7xl md:mx-auto py-20 md:py-32 px-8">
                    <span className="md:col-span-2"><span className="w-fit py-2 px-5 text-primary border-primary border-2 rounded-full text-xs md:text-base">BENEFITS</span></span>
                    <h2 className="text-primary text-3xl md:text-4xl font-heading font-semibold !leading-[135%]"><span className="text-black">We Build a Team That</span> Grows, Learns, and Delivers Impact</h2>
                    <p className="text-gray-700 text-sm md:text-base">At our agency, growth is part of the culture. We create an environment where creativity is valued, ideas are shared, and skills are constantly evolving. Flexibility, trust, and support are at the core of how we work.<br /><br />Whether starting a journey or advancing a career, this is a place to thrive.</p>
                </div>
            </section>
        </main>
    )
}   