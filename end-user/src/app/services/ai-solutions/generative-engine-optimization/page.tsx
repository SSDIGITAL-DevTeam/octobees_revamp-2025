"use client";
import React, { JSX } from "react";
import Image from "next/image";
import Header from "../../_components/Header";
import ConsultationButton from "@/components/partials/Button/Consultation";
import OurBrands from "../../_components/OurBrandPartner";
import FormJoin from "../../_components/FormJoin";
import FlyingSection from "../../_components/FlyingSection";
import LeftHeader from "../../_components/LeftHeader";
import GridSection from "../../_components/GridSection";
import GradientSection from "../../_components/GradientSection";
import IconGridSection from "../../_components/IconGridSection";

import HeroImage from "@/assets/services/webp/geo/hero.png";
import FlyingSummaryImage from "@/assets/services/webp/geo/flying-summary.png";

// Hero floating icons (reuse AI symbols)
import Symbol1 from "@/assets/services/webp/ai/Symbol.svg-1.webp";
import Symbol2 from "@/assets/services/webp/ai/Symbol.svg-2.webp";
import Symbol3 from "@/assets/services/webp/ai/Symbol.svg-3.webp";
import Symbol4 from "@/assets/services/webp/ai/Symbol.svg-4.webp";
import Symbol5 from "@/assets/services/webp/ai/Symbol.svg-5.webp";

import {
  geoProblems,
  whoNeedsGEO,
  whatWeCanDo,
  geoProcess,
  geoKeyStrategies,
  seoVsGeoComparison,
} from "@/constants/services/geo";

const GenerativeEngineOptimization: React.FC = (): JSX.Element => {
  return (
    <main>
      {/* Hero Section */}
      <header className="w-full bg-white lg:pt-14">
        <div className="relative lg:max-w-[98%] flex flex-col items-center justify-center gap-5 lg:gap-3 lg:mx-auto py-12 lg:py-16 rounded-3xl bg-gradient-to-l from-[#BED4F3]/40 from-40% to-gray-200/50">
          <p className="text-center p-2 rounded-full bg-white shadow-sm font-bold text-base md:text-lg">
            🧠
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
              {" "}
              AI-Powered Visibility
            </span>
          </p>
          <div className="flex flex-col gap-8 md:gap-7 items-center px-5">
            <h1 className="normal-case lg:max-w-5xl !leading-[140%] text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-6xl text-center w-full bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
              <span className="text-black">Be the Answer</span> — Not Just a
              Result.
              <span className="text-black"> Get Cited by AI Engines</span>
            </h1>
            <p className="max-w-4xl text-center !leading-[150%] lg:text-lg font-medium text-gray-700">
              Optimize your brand to be cited, recommended, and featured by AI
              search engines like ChatGPT, Gemini, Perplexity, and Google AI
              Overviews.
            </p>
          </div>
          <div className="flex w-full justify-center items-center lg:mt-7 mt-5">
            <ConsultationButton />
          </div>

          {/* Bouncing AI Platform Icons */}
          <Image
            src={Symbol2.src}
            quality={100}
            width={1920}
            height={1080}
            priority
            className="hidden lg:block absolute z-[4] h-12 w-12 top-[24%] left-[12%] animate-smoothBounce delay-1000"
            alt="symbol-chatgpt"
          />
          <Image
            src={Symbol3.src}
            quality={100}
            width={1920}
            height={1080}
            priority
            className="hidden lg:block absolute z-[4] h-12 w-12 top-[44%] left-[15%] animate-smoothBounce"
            alt="symbol-gemini"
          />
          <Image
            src={Symbol5.src}
            quality={100}
            width={1920}
            height={1080}
            priority
            className="hidden lg:block absolute z-[4] h-12 w-12 top-[17%] right-[14%] animate-smoothBounce"
            alt="symbol-perplexity"
          />
          <Image
            src={Symbol4.src}
            quality={100}
            width={1920}
            height={1080}
            priority
            className="hidden lg:block absolute z-[4] h-12 w-12 top-[33%] right-[10%] animate-smoothBounce delay-1000"
            alt="symbol-claude"
          />
          <Image
            src={Symbol1.src}
            quality={100}
            width={1920}
            height={1080}
            priority
            className="hidden lg:block absolute z-[4] h-12 w-12 top-[51%] right-[17%] animate-smoothBounce delay-500"
            alt="symbol-ai-overview"
          />
        </div>
      </header>

      {/* Problem Awareness Section */}
      <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
          <h3 className="text-center p-2 rounded-full bg-white shadow-sm font-semibold text-base md:text-lg">
            🔮
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
              {" "}
              The Future of Search is Here
            </span>
          </h3>
          <Header
            title="Traditional SEO alone is no longer enough"
            subtitle="Most businesses are completely invisible to AI-powered search — are you?"
            className="lg:max-w-7xl"
          />
          <GridSection
            list={geoProblems}
            side="left"
            height="lg:min-h-[380px]"
          />
        </div>
      </section>

      {/* Who Needs GEO Section */}
      <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
          <Header
            title="Who Should Use Our GEO Service?"
            subtitle="Whether you're an established brand, a growing startup, or a content-driven business, GEO ensures your visibility in the AI era."
            className="lg:max-w-7xl"
          />
          <GridSection
            list={whoNeedsGEO}
            side="top"
            height="lg:min-h-[360px]"
          />
        </div>
      </section>

      {/* Flying Section — SEO vs GEO Explainer */}
      <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
        <FlyingSection
          image={HeroImage.src}
          side="left"
          title="SEO Gets You Ranked. GEO Gets You Cited."
          subtitle="GEO is the next evolution of search optimization. While SEO ensures your content is found by traditional search engines, GEO ensures your brand is actively cited, referenced, and recommended by AI-powered engines — turning your content into the primary source for AI-generated answers."
        />
      </section>

      {/* What We Can Do Section (Primary BG) */}
      <section className="w-full bg-primary py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-10 lg:gap-16 lg:mx-auto">
          <h1 className="text-white text-3xl lg:text-4xl !leading-[120%] font-bold uppercase lg:text-start text-center">
            What We Do for Your AI Visibility
          </h1>
          <IconGridSection
            list={whatWeCanDo}
            side="left"
            padding="lg:py-8"
            className="lg:text-xl lg:font-semibold text-primary"
          />
          <ConsultationButton color="white" />
        </div>
      </section>

      {/* GEO Process — GradientSection */}
      <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-16 lg:mx-auto">
          <LeftHeader
            title="Our GEO Process — From Invisible to Cited"
            subtitle="A systematic approach to transform your brand's AI visibility, from comprehensive audit to continuous optimization and monitoring."
          />
          <GradientSection data={geoProcess} name="geoProcess" />
        </div>
      </section>

      {/* Key Strategies Section */}
      <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-10 lg:mx-auto">
          <div className="flex lg:flex-row flex-col gap-4 items-center justify-between w-full lg:px-10">
            <h1 className="text-primary text-3xl md:text-4xl !leading-[120%] font-bold uppercase self-center md:self-start">
              Key GEO Strategies
            </h1>
            <div className="hidden lg:flex ">
              <ConsultationButton />
            </div>
          </div>
          <GridSection
            list={geoKeyStrategies}
            side="left"
            height="lg:min-h-[380px]"
          />
          <div className="lg:hidden flex w-full justify-center">
            <ConsultationButton />
          </div>
        </div>
      </section>

      {/* SEO vs GEO Comparison Section */}
      <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
        <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-10 lg:mx-auto">
          <h1 className="text-primary text-3xl md:text-4xl !leading-[120%] font-bold uppercase lg:text-start text-center">
            SEO vs GEO — What&apos;s the Difference?
          </h1>

          {/* Comparison Table */}
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-1 gap-4 w-full">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-bold text-lg">
                <div className="col-span-1"></div>
                <div className="col-span-5 flex items-center">
                  Traditional SEO
                </div>
                <div className="col-span-1 flex items-center justify-center text-white/60">
                  vs
                </div>
                <div className="col-span-5 flex items-center">
                  Generative Engine Optimization
                </div>
              </div>

              {/* Table Rows */}
              {seoVsGeoComparison.map((row, i) => (
                <div
                  key={`comparison-${i}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 px-4 lg:px-6 py-4 lg:py-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white items-center"
                >
                  <div className="hidden lg:flex col-span-1 items-center justify-center">
                    <Image
                      src={row.icon}
                      alt={`comparison-icon-${i}`}
                      width={40}
                      height={40}
                      className="object-contain w-10 h-10"
                    />
                  </div>
                  <div className="lg:col-span-5 flex items-center gap-3">
                    <div className="lg:hidden flex-shrink-0">
                      <Image
                        src={row.icon}
                        alt={`comparison-icon-${i}`}
                        width={32}
                        height={32}
                        className="object-contain w-8 h-8"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-blue-600 lg:hidden">
                        SEO
                      </span>
                      <p className="text-sm lg:text-base font-medium text-gray-600">
                        {row.seo}
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:flex col-span-1 items-center justify-center">
                    <span className="text-gray-300 font-bold text-xl">→</span>
                  </div>
                  <div className="lg:col-span-5 flex items-center lg:pl-0 pl-11">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-purple-600 lg:hidden">
                        GEO
                      </span>
                      <p className="text-sm lg:text-base font-bold text-primary">
                        {row.geo}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Flying Section — In Summary */}
      <section className="w-full bg-[#F5F5F5] lg:py-20 py-12 px-10 md:px-20 lg:px-5">
        <FlyingSection
          image={FlyingSummaryImage.src}
          side="right"
          title="In Summary"
          subtitle="GEO is the next evolution of digital visibility. We help brands shift from just being indexed to being actively cited and recommended by AI. Our comprehensive approach — from AI visibility audits to continuous monitoring — ensures your content becomes the go-to source for AI-generated answers."
        />
      </section>

      {/* Our Brands */}
      <section className="w-full bg-white py-12 lg:py-20">
        <OurBrands />
      </section>

      {/* Form Join / CTA */}
      <section className="w-full bg-primary py-12 lg:py-20">
        <FormJoin />
      </section>
    </main>
  );
};

export default GenerativeEngineOptimization;
