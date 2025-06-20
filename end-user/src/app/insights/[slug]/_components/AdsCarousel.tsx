import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

const AdsCarousel = () : JSX.Element => {
  type CarouselType = {
    title: string;
    desc: string;
    textButton: string;
  };

  const carouselData = [
    {
      title: "Supercharge Your Ad Campaign Today!",
      desc: `Unlock the secrets to a high ad campaign that captivates, engages, and converts. With our expert insights, and tailored strategies, we'll help your ad reach and drive real results. Take your marketing to the next level with proven techniques that work.`,
      textButton: "Boost My Campaign Now",
    },
    {
      title: "Bring Your Dream Website to Life!",
      desc: "Stand out online with a stunning, professional website designed to captivate your audience and drive growth. Our team crafts responsive, user-friendly sites tailored to your brand's unique identity. From design to functionality, we’ll make your vision a reality!.",
      textButton: "Start My Website Today",
    },
    {
      title: "Elevate Your Social Media Presence!",
      desc: "Make a lasting impact on social media with a tailored strategy that builds engagement, grows your audience, and boosts your brand. Our social media management service handles everything—from content creation to analytics—so you can focus on what you do best.",
      textButton: "Get Started with Social Success",
    },
  ];

  return (
    <Carousel className="max-w-[90%] lg:max-w-[70%] mx-auto">
      <CarouselContent className="-ml-1">
        {carouselData.map((data : CarouselType, index) => (
          <CarouselItem key={index} className="pl-1 max-w-full lg:max-w-[90%]">
            <div className="p-2">
              <div
                id="bot-bot"
                className="flex flex-col gap-6 lg:gap-8 lg:min-h-[300px] bg-primary/5 rounded-3xl p-8 lg:p-10"
              >
                 <h2 className="text-xl md:text-2xl lg:text-4xl capitalize max-w-[80%] lg:max-w-full text-primary font-bold">
                  {data.title}
                </h2>
                <p className="lg:text-base text-sm text-black/70 !leading-[140%]">
                  {data.desc}
                </p>
                <Link href="/contact-us" className="py-3 px-5 rounded-full bg-primary text-white w-fit font-semibold text-sm lg:text-base ">
                  {data.textButton}
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default AdsCarousel;