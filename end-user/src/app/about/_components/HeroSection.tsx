import React from "react";

const HeroSection = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-7 md:py-32 py-28 text-merah-500">
      <h2 className="px-3 text-xs md:text-sm py-2 bg-white font-semibold text-zinc-900 border-[1px] shadow-sm rounded-full">
        ABOUT OCTOBEES
      </h2>
      <h1 className="text-center font-heading text-4xl lg:text-5xl font-semibold">About Us</h1>
      <p className="text-center max-w-[72%] textsm md:text-lg tracking-[1px]">
        We believe that entrepreneurs are the visionaries shaping world’s
        future. They navigate through challenges and uncover opportunities that
        push the boundaries of what’s possible. At Octobees, we ensure that
        entrepreneurs stay focused on innovation and growth. By managing their
        digital presence and marketing strategies, we take care of the
        complexities, allowing them to focus on what matters most — growing
        their business and achieving their goals.
      </p>
    </div>
  );
};

export default HeroSection;