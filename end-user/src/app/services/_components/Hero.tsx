import ConsultationButton from "@/components/partials/Button/Consultation";
import Image from "next/image";
type Props = {
  image: string;
  title: string;
  alt: string;
  subtitle: string;
};
export default function Hero({ image, title, subtitle, alt }: Props) {
  return (
    <section className="relative h-[75vh] w-full">
      <Image
        src={image}
        alt={alt}
        fill
        quality={100}
        priority
        className="object-cover"
      />
      <div className="lg:max-w-7xl lg:mx-auto relative z-10 h-full p-6 lg:p-8 flex flex-col justify-center text-left text-white">
        <h1 className="relative uppercase !leading-tight text-3xl sm:text-4xl md:text-5xl w-[80vw] lg:w-[50vw]">
          {title}
        </h1>
        <p className="relative mt-4 max-w-3xl text-base md:text-2xl text-white/70">
          {subtitle}
        </p>
        <div className="w-fit mt-10">
          <ConsultationButton />
        </div>
      </div>
    </section>
  );
}
