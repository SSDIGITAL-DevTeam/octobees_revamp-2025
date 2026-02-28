"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CheckBoxIcon from "../../_components/CheckBoxIcon";
import OurBrands from "../../_components/OurBrandPartner";
import ConsultationButton from "@/components/partials/Button/Consultation";
import ImageEngginer from "./engineer.png";
import { axiosInstance } from "@/lib/axios";
import FormJoin from "../../_components/FormJoin";

// Business results grid data
const businessResults = [
  {
    title: "Enter new markets with innovative solutions",
    description: "",
    isHighlight: true,
  },
  {
    title: "Drive demand quickly with a robust brand identity",
    description: "",
    isHighlight: true,
  },
  {
    title: "Increase leads by shaping tighter sales funnels",
    description: "",
    isHighlight: true,
  },
  {
    title: "Product Development",
    description:
      "Build enterprise applications like ERP, CRM, and B2B/B2C e-commerce to streamline operations and support business growth.",
    isHighlight: false,
  },
  {
    title: "Digital Transformation",
    description:
      "Drive your business forward with smart digital solutions that modernize processes and enhance customer experiences.",
    isHighlight: false,
  },
  {
    title: "AI & Automation",
    description:
      "Leverage AI-driven analytics and intelligent automation to optimize operations and enable smarter decision-making.",
    isHighlight: false,
  },
];

// Why choose custom software checklist
const customSoftwareBenefits = [
  {
    svg: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25 25H37.5V27.5H25V25ZM25 30H37.5V32.5H25V30ZM25 35H37.5V37.5H25V35ZM20 25C19.3392 25.0154 18.6821 24.8966 18.0685 24.6508C17.4549 24.4049 16.8976 24.0372 16.4302 23.5698C15.9628 23.1024 15.5951 22.5451 15.3492 21.9315C15.1034 21.3179 14.9846 20.6608 15 20C14.9846 19.3392 15.1034 18.6821 15.3492 18.0685C15.5951 17.4549 15.9628 16.8976 16.4302 16.4302C16.8976 15.9628 17.4549 15.5951 18.0685 15.3492C18.6821 15.1034 19.3392 14.9846 20 15C20.6608 14.9846 21.3179 15.1034 21.9315 15.3492C22.5451 15.5951 23.1024 15.9628 23.5698 16.4302C24.0372 16.8976 24.4049 17.4549 24.6508 18.0685C24.8966 18.6821 25.0154 19.3392 25 20H27.5C27.5 18.5166 27.0601 17.0666 26.236 15.8332C25.4119 14.5999 24.2406 13.6386 22.8701 13.0709C21.4997 12.5032 19.9917 12.3547 18.5368 12.6441C17.082 12.9335 15.7456 13.6478 14.6967 14.6967C13.6478 15.7456 12.9335 17.082 12.6441 18.5368C12.3547 19.9917 12.5032 21.4997 13.0709 22.8701C13.6386 24.2406 14.5999 25.4119 15.8332 26.236C17.0666 27.0601 18.5166 27.5 20 27.5V25Z"
          fill="black"
        />
        <path
          d="M36.631 13.805L33.681 8.695C33.392 8.1941 32.9384 7.80885 32.3973 7.60486C31.8562 7.40087 31.2612 7.39076 30.7135 7.57625L27.671 8.60625C27.1467 8.2531 26.5988 7.93651 26.031 7.65875L25.401 4.50875C25.2874 3.94224 24.9812 3.43255 24.5343 3.06634C24.0874 2.70012 23.5275 2.5 22.9497 2.5H17.0497C16.4718 2.50006 15.9117 2.70036 15.4648 3.06682C15.0179 3.43328 14.7117 3.94326 14.5985 4.51L13.9685 7.65875C13.3944 7.93373 12.8402 8.24824 12.3097 8.6L9.28472 7.57625C8.73735 7.39141 8.14285 7.40185 7.60231 7.60581C7.06177 7.80977 6.60855 8.19464 6.31972 8.695L3.36972 13.805C3.08073 14.3054 2.97399 14.8904 3.06766 15.4606C3.16132 16.0307 3.4496 16.5509 3.88347 16.9325L6.29722 19.0537C6.27597 19.3687 6.24972 19.6812 6.24972 20C6.24972 20.3225 6.26138 20.6417 6.28472 20.9575L3.88472 23.0675C3.45044 23.4488 3.16168 23.9688 3.06756 24.539C2.97344 25.1092 3.07977 25.6944 3.36847 26.195L6.31847 31.305C6.6074 31.8059 7.06104 32.1912 7.60212 32.3951C8.1432 32.5991 8.73827 32.6092 9.28597 32.4237L12.3285 31.3937C12.8527 31.7473 13.4006 32.0643 13.9685 32.3425L14.5972 35.49C14.7105 36.0569 15.0169 36.5671 15.464 36.9336C15.9112 37.3001 16.4716 37.5002 17.0497 37.5H19.9997V35H17.0497L16.1622 30.5625C14.9346 30.1063 13.7949 29.4415 12.7935 28.5975L8.48472 30.055L5.53472 24.945L8.94097 21.9513C8.70724 20.6587 8.70428 19.3349 8.93222 18.0412L5.53472 15.0538L8.48472 9.945L12.7685 11.395C13.7765 10.549 14.9252 9.88648 16.1622 9.4375L17.0497 5H22.9497L23.8372 9.4375C25.0649 9.89368 26.2045 10.5585 27.206 11.4025L31.5147 9.945L34.4647 15.055L30.9672 18.12L32.6147 20L36.1147 16.9325C36.549 16.5512 36.8378 16.0312 36.9319 15.461C37.026 14.8908 36.9197 14.3056 36.631 13.805Z"
          fill="black"
        />
      </svg>
    ),
    title: "Fully tailored to your operations",
  },
  {
    svg: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 7.42857C10 8.47049 9.57857 9.46974 8.82843 10.2065C8.07828 10.9432 7.06087 11.3571 6 11.3571C4.93913 11.3571 3.92172 10.9432 3.17157 10.2065C2.42143 9.46974 2 8.47049 2 7.42857C2 6.38665 2.42143 5.3874 3.17157 4.65065C3.92172 3.9139 4.93913 3.5 6 3.5C7.06087 3.5 8.07828 3.9139 8.82843 4.65065C9.57857 5.3874 10 6.38665 10 7.42857ZM10 7.42857H18M18 7.42857C18 8.47049 18.4214 9.46974 19.1716 10.2065C19.9217 10.9432 20.9391 11.3571 22 11.3571C23.0609 11.3571 24.0783 10.9432 24.8284 10.2065C25.5786 9.46974 26 8.47049 26 7.42857M18 7.42857C18 6.38665 18.4214 5.3874 19.1716 4.65065C19.9217 3.9139 20.9391 3.5 22 3.5C23.0609 3.5 24.0783 3.9139 24.8284 4.65065C25.5786 5.3874 26 6.38665 26 7.42857M26 7.42857C29.1826 7.42857 32.2348 8.67028 34.4853 10.8805C36.7357 13.0908 38 16.0885 38 19.2143C38 22.3401 36.7357 25.3378 34.4853 27.548C32.2348 29.7583 29.1826 31 26 31M18 31C18 32.0419 18.4214 33.0412 19.1716 33.7779C19.9217 34.5147 20.9391 34.9286 22 34.9286C23.0609 34.9286 24.0783 34.5147 24.8284 33.7779C25.5786 33.0412 26 32.0419 26 31M18 31C18 29.9581 18.4214 28.9588 19.1716 28.2221C19.9217 27.4853 20.9391 27.0714 22 27.0714C23.0609 27.0714 24.0783 27.4853 24.8284 28.2221C25.5786 28.9588 26 29.9581 26 31M18 31H6M10.8 25.5L5.2 31L10.8 36.5"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    title: "Faster workflows & reduced manual work",
  },
  {
    svg: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5399 29.2422C17.7157 30.0183 17.9618 30.7597 18.2781 31.4664H4.25137C3.93498 31.4664 3.64202 31.4084 3.3725 31.2926C3.10298 31.1768 2.86862 31.0204 2.66941 30.8234C2.4702 30.6265 2.30614 30.389 2.17724 30.111C2.04834 29.833 1.98975 29.5433 2.00146 29.2422C2.00146 29.0568 2.01904 28.8599 2.0542 28.6513C2.08935 28.4428 2.13622 28.2227 2.19482 27.991C2.25341 27.7593 2.33544 27.5566 2.4409 27.3828C2.54636 27.2091 2.66941 27.0411 2.81003 26.8789L6.50128 23.2124V7H33.5002V17.6172C33.1486 17.4202 32.7854 17.258 32.4104 17.1306C32.0354 17.0032 31.6487 16.8931 31.2503 16.8004V9.22422H8.75119V22.5695H17.1883V24.7937H8.10083L4.47988 28.3559C4.44472 28.3907 4.41543 28.4486 4.39199 28.5297C4.36856 28.6108 4.34512 28.6919 4.32168 28.773C4.29825 28.8541 4.28067 28.941 4.26895 29.0336C4.25723 29.1263 4.25137 29.1958 4.25137 29.2422H3.12642H17.5399ZM29.0004 19.3201C29.6917 19.3201 30.3245 19.4012 30.8987 19.5633C31.4729 19.7255 32.0588 19.9746 32.6565 20.3105C33.1486 20.6001 33.7111 20.7797 34.3439 20.8492C34.9767 20.9187 35.6095 20.9593 36.2423 20.9709H37.1387C37.4317 20.9709 37.7188 20.9651 38 20.9535V26.6009C38 27.8173 37.7774 28.9641 37.3321 30.0415C36.8868 31.1188 36.295 32.1209 35.5567 33.0476C34.8185 33.9744 33.9689 34.8085 33.008 35.5499C32.0471 36.2913 31.0569 36.9284 30.0374 37.4613L29.0004 38L27.9457 37.4613C26.9262 36.94 25.9419 36.3087 24.9927 35.5673C24.0435 34.8259 23.194 33.986 22.444 33.0476C21.694 32.1093 21.1023 31.1073 20.6687 30.0415C20.2351 28.9757 20.0125 27.8288 20.0007 26.6009V20.9535H20.8796C21.1843 20.9535 21.5007 20.9593 21.8288 20.9709C22.4499 20.9709 23.0709 20.9361 23.692 20.8666C24.3131 20.7971 24.8755 20.6059 25.3794 20.2932C25.9653 19.9572 26.5454 19.7139 27.1196 19.5633C27.6938 19.4127 28.3207 19.3317 29.0004 19.3201ZM35.7501 23.1777C34.9767 23.1777 34.2326 23.1082 33.5178 22.9692C32.8029 22.8302 32.1116 22.5695 31.4436 22.1872C31.0452 21.9555 30.6585 21.7933 30.2835 21.7007C29.9085 21.608 29.4808 21.5559 29.0004 21.5443C28.5551 21.5443 28.1391 21.5906 27.7524 21.6833C27.3657 21.776 26.979 21.9382 26.5923 22.1698C25.9126 22.5521 25.2154 22.8128 24.5006 22.9518C23.7857 23.0908 23.0358 23.1661 22.2506 23.1777V26.6009C22.2506 27.5972 22.444 28.5355 22.8307 29.4159C23.2174 30.2963 23.733 31.1188 24.3775 31.8834C25.022 32.648 25.7427 33.3315 26.5395 33.9339C27.3364 34.5362 28.1567 35.0575 29.0004 35.4978C29.8206 35.0691 30.6351 34.5536 31.4436 33.9512C32.2522 33.3488 32.9729 32.6654 33.6056 31.9008C34.2384 31.1362 34.754 30.3137 35.1525 29.4333C35.5509 28.5529 35.7501 27.6087 35.7501 26.6009V23.1777Z"
          fill="black"
        />
      </svg>
    ),
    title: "Secure, reliable, and built to scale",
  },
];

// Feature cards data
const featureCards = [
  {
    category: "RELIABLE",
    title: "Fully-managed service",
    description:
      "Back-end infrastructure for integrating, managing, and securing data of any kind, from any source, at massive scale.",
  },
  {
    category: "OPEN COMMUNICATION",
    title: "Direct ownership",
    description:
      "Work with a dedicated team that is committed to delivering effective and value-driven innovations.",
  },
  {
    category: "QUALITY",
    title: "Built to order",
    description:
      "Custom-made for businesses according to the specific challenges and goals of the company in order to ensure accurate, quality delivery.",
  },
];

// Services for Build Custom Solutions (carousel data) - Consolidated with What We Build offerings
const customServicesCarousel = [
  // Original SERVICES items
  {
    title: "Web Design",
    description:
      "A conversion centred approach to creating web and product designs that drive action. Our design team crafts visually stunning, user-centric interfaces that captivate your audience and drive conversions.",
    image: "/png/showcase-1.png",
  },
  {
    title: "Web Development",
    description:
      "Build tailor-made websites and high-performance web applications that drive leads and sales. Using JavaScript, Node.js, and Next.js, we develop responsive platforms that scale with your business needs.",
    image: "/png/showcase-2.png",
  },
  {
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile solutions that deliver smooth and intuitive experiences on iOS and Android. Accelerate business agility with enterprise-grade mobile applications.",
    image: "/png/showcase-3.png",
  },
  {
    title: "Application Development",
    description:
      "Accelerate business agility across your organisation with scalable enterprise apps. From mobile to desktop, we build applications that streamline operations and enhance productivity.",
    image: "/png/showcase-4.png",
  },
  {
    title: "Digital Strategy",
    description:
      "Transform your business with comprehensive digital strategies. We help you navigate the digital landscape, identifying opportunities and implementing solutions that drive growth.",
    image: "/png/showcase-5.png",
  },
  {
    title: "API Development & System Integration",
    description:
      "Connect your tools, unify data, and improve efficiency with reliable, perfectly-documented APIs. We build robust middleware solutions that enable your systems to work together seamlessly.",
    image: "/png/showcase-6.png",
  },
  // Items from What We Build
  {
    title: "Internal Systems & Automation",
    description:
      "From inventory systems to workflow automation, we build tools that streamline operations and reduce operational costs. Custom automation solutions that help you do more with less.",
    image: "/png/showcase-3.png",
  },
  {
    title: "Custom Dashboards & Analytics",
    description:
      "Real-time analytics, dashboards, and reporting systems tailored to your business metrics. Transform data into actionable insights with visually stunning interfaces.",
    image: "/png/showcase-4.png",
  },
];

// Our Work in Action projects
const workProjects = [
  {
    title: "FnB Point of Sales",
    image: "/png/project-fnb-pos.png",
  },
  {
    title: "Car Rental System",
    image: "/png/project-car-rental.png",
  },
  {
    title: "Marketing Voucher System",
    image: "/png/project-voucher.png",
  },
];

// Build Custom Solutions Carousel Component - Infinite Loop Marquee Style
function BuildCustomSolutionsCarousel() {
  // First row images (slides left)
  const rowOneImages = [
    "/png/showcase-1.png",
    "/png/showcase-2.png",
    "/png/showcase-3.png",
    "/png/showcase-4.png",
    "/png/showcase-5.png",
    "/png/showcase-6.png",
  ];

  // Second row images (slides right) - different order for variety
  const rowTwoImages = [
    "/png/showcase-4.png",
    "/png/showcase-1.png",
    "/png/showcase-6.png",
    "/png/showcase-2.png",
    "/png/showcase-5.png",
    "/png/showcase-3.png",
  ];

  return (
    <section className="w-full bg-primary py-12 lg:py-20 overflow-hidden">
      <div className="lg:max-w-7xl mx-auto flex flex-col gap-10 lg:gap-12 px-6 lg:px-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-4">
          <p className="text-sm tracking-[0.2em] text-white/70 uppercase">
            Services
          </p>
          <h2 className="text-3xl lg:text-5xl font-normal text-white !leading-[130%]">
            Build Custom Solutions
          </h2>
          <p className="text-sm lg:text-base text-white/80 !leading-[160%] max-w-3xl mx-auto">
            We assist enterprise clients in their digital transformation by
            applying established and emerging technologies into their core
            business models.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Carousel */}
      <div className="flex flex-col gap-4 mt-10 relative">
        {/* Row 1 - Slides Left */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 marquee-left">
            {/* Original set */}
            {rowOneImages.map((img, index) => (
              <div
                key={`row1-${index}`}
                className="relative flex-shrink-0 w-[280px] lg:w-[350px] h-[160px] lg:h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {rowOneImages.map((img, index) => (
              <div
                key={`row1-dup-${index}`}
                className="relative flex-shrink-0 w-[280px] lg:w-[350px] h-[160px] lg:h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Slides Right */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 marquee-right">
            {/* Original set */}
            {rowTwoImages.map((img, index) => (
              <div
                key={`row2-${index}`}
                className="relative flex-shrink-0 w-[280px] lg:w-[350px] h-[160px] lg:h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {rowTwoImages.map((img, index) => (
              <div
                key={`row2-dup-${index}`}
                className="relative flex-shrink-0 w-[280px] lg:w-[350px] h-[160px] lg:h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Project ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={100}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary via-primary/80 to-transparent pointer-events-none" />
      </div>

      {/* Service Icons */}
      <div className="lg:max-w-7xl mx-auto px-6 lg:px-10 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pt-4 relative z-10">
          {customServicesCarousel.map((service, index) => (
            <div
              key={`service-${index + 1}`}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  {/* Web Design - X icon */}
                  {index === 0 && (
                    <>
                      <rect
                        width="50"
                        height="50"
                        fill="url(#pattern0_12909_24412)"
                      />
                      <defs>
                        <pattern
                          id="pattern0_12909_24412"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_12909_24412"
                            transform="scale(0.01)"
                          />
                        </pattern>
                        <image
                          id="image0_12909_24412"
                          width="100"
                          height="100"
                          preserveAspectRatio="none"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </>
                  )}
                  {/* Web Development - Code icon */}
                  {index === 1 && (
                    <>
                      <rect
                        width="50"
                        height="50"
                        fill="url(#pattern0_12909_24426)"
                      />
                      <defs>
                        <pattern
                          id="pattern0_12909_24426"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_12909_24426"
                            transform="matrix(0.01 0 0 0.01 0 0.1)"
                          />
                        </pattern>
                        <image
                          id="image0_12909_24426"
                          width="100"
                          height="80"
                          preserveAspectRatio="none"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </>
                  )}
                  {/* Mobile Apps - Phone icon */}
                  {index === 2 && (
                    <g transform="scale(0.625)">
                      <path
                        d="M35 20H45M54.2867 10H25.7133C22.56 10 20 12.6867 20 16V64C20 67.3133 22.56 70 25.7133 70H54.2867C57.4433 70 60 67.3133 60 64V16C60 12.6867 57.4433 10 54.2867 10Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </g>
                  )}
                  {/* Application Development - Browser icon */}
                  {index === 3 && (
                    <g transform="scale(0.625)">
                      <path
                        d="M68.3337 13.334H11.667C8.90557 13.334 6.66699 15.5726 6.66699 18.334V61.6673C6.66699 64.4287 8.90557 66.6673 11.667 66.6673H68.3337C71.0951 66.6673 73.3337 64.4287 73.3337 61.6673V18.334C73.3337 15.5726 71.0951 13.334 68.3337 13.334Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        fill="none"
                      />
                      <path
                        d="M6.66699 18.334C6.66699 17.0079 7.19378 15.7361 8.13146 14.7984C9.06914 13.8608 10.3409 13.334 11.667 13.334H68.3337C69.6597 13.334 70.9315 13.8608 71.8692 14.7984C72.8069 15.7361 73.3337 17.0079 73.3337 18.334V33.334H6.66699V18.334Z"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                      <path
                        d="M13.3333 23.3346C13.3333 21.4937 14.8257 20.0013 16.6667 20.0013C18.5076 20.0013 20 21.4937 20 23.3346C20 25.1756 18.5076 26.668 16.6667 26.668C14.8257 26.668 13.3333 25.1756 13.3333 23.3346Z"
                        fill="white"
                      />
                      <path
                        d="M23.3333 23.3346C23.3333 21.4937 24.8257 20.0013 26.6667 20.0013C28.5076 20.0013 30 21.4937 30 23.3346C30 25.1756 28.5076 26.668 26.6667 26.668C24.8257 26.668 23.3333 25.1756 23.3333 23.3346Z"
                        fill="white"
                      />
                    </g>
                  )}
                  {/* Digital Strategy - Lightbulb (same as browser for now) */}
                  {index === 4 && (
                    <>
                      <circle
                        cx="25"
                        cy="18"
                        r="12"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M21 30 L29 30 L29 35 L21 35 Z"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <path
                        d="M22 38 L28 38"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M23 41 L27 41"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path d="M25 6 L25 10" stroke="white" strokeWidth="1.5" />
                      <path
                        d="M35 10 L32 14"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 10 L18 14"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </>
                  )}
                  {/* API Development & System Integration - Code brackets */}
                  {index === 5 && (
                    <g transform="scale(0.625)">
                      <path
                        d="M51.0049 3L32.6426 77H28.5205L46.8838 3H51.0049ZM76.8379 39.9902L60.6357 60.833L57.4775 58.3779L71.5332 40.2979L71.7715 39.9912L71.5332 39.6846L57.4863 21.6221L60.6436 19.167L76.8379 39.9902ZM22.5205 21.6221L8.46582 39.6924L8.22754 40L8.46582 40.3066L22.5127 58.3779L19.3545 60.832L3.16016 39.999L19.3643 19.166L22.5205 21.6221Z"
                        fill="white"
                        stroke="white"
                      />
                    </g>
                  )}
                  {/* Internal Systems & Automation - Gear icon */}
                  {index === 6 && (
                    <g transform="scale(0.625)">
                      <path
                        d="M70.85 23.7793L69.2033 20.9227C67.96 18.7627 67.3367 17.6827 66.28 17.256C65.22 16.8227 64.0233 17.1627 61.63 17.8427L57.5633 18.986C56.0333 19.3393 54.43 19.1393 53.0333 18.4227L51.91 17.776C50.7126 17.0082 49.7922 15.8776 49.2833 14.5493L48.17 11.226C47.4367 9.02602 47.07 7.92602 46.2033 7.29268C45.3267 6.66602 44.1666 6.66602 41.8533 6.66602H38.14C35.8233 6.66602 34.6667 6.66602 33.7967 7.29602C32.9233 7.92602 32.56 9.02602 31.8267 11.226L30.7133 14.5493C30.2044 15.8776 29.284 17.0082 28.0866 17.776L26.9633 18.4227C25.5671 19.1388 23.9629 19.3395 22.4333 18.9893L18.3667 17.8427C15.9733 17.1627 14.7766 16.8227 13.7166 17.2527C12.66 17.686 12.0366 18.7627 10.7933 20.9227L9.14665 23.7793C7.97998 25.8027 7.39665 26.8127 7.51332 27.8927C7.62332 28.9693 8.40332 29.836 9.96665 31.5727L13.4 35.416C14.2433 36.4793 14.84 38.3327 14.84 39.9993C14.84 41.666 14.24 43.5193 13.4033 44.5827L9.96665 48.426C8.40332 50.1593 7.62332 51.0293 7.50998 52.106C7.39665 53.1827 7.97998 54.196 9.14665 56.2193L10.7933 59.076C12.0366 61.236 12.66 62.316 13.7166 62.7427C14.7766 63.176 15.9733 62.836 18.3667 62.156L22.4333 61.0127C23.9667 60.6594 25.5667 60.8593 26.9667 61.576L28.0866 62.2227C29.2833 62.9893 30.2033 64.1227 30.7133 65.4493L31.8267 68.7727C32.56 70.9727 32.9266 72.0727 33.7933 72.706C34.6666 73.3327 35.8267 73.3327 38.14 73.3327H41.8533C44.17 73.3327 45.3267 73.3327 46.1967 72.7027C47.07 72.0727 47.4366 70.976 48.1666 68.776L49.28 65.4493C49.79 64.1193 50.71 62.9893 51.9066 62.2227L53.03 61.576C54.4262 60.8599 56.0304 60.6592 57.56 61.0093L61.6267 62.156C64.02 62.836 65.2167 63.176 66.2767 62.746C67.3333 62.3127 67.9567 61.236 69.2 59.076L70.8467 56.2193C72.0133 54.196 72.5967 53.186 72.48 52.106C72.37 51.0293 71.59 50.1627 70.0267 48.426L66.5933 44.5827C65.75 43.516 65.1533 41.666 65.1533 39.9993C65.1533 38.3327 65.7533 36.4793 66.59 35.416L70.0267 31.5727C71.59 29.8393 72.37 28.9693 72.4833 27.8927C72.5967 26.816 72.0167 25.8027 70.85 23.7793Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M46.873 38.3323L48.5397 36.6657C50.0097 35.1957 50.7464 34.459 51.7097 34.7657C52.6764 35.069 52.8297 35.9423 53.133 37.689C53.2664 38.4401 53.333 39.2101 53.333 39.999C53.3341 42.1828 52.7987 44.3335 51.7739 46.262C50.7491 48.1905 49.2664 49.8377 47.4559 51.059C45.6454 52.2802 43.5627 53.0381 41.3908 53.2659C39.2188 53.4937 37.0242 53.1846 34.9997 52.3657M33.333 41.7823L31.5197 43.5957C30.073 45.0423 29.3464 45.769 28.393 45.479C27.4364 45.189 27.2664 44.3323 26.9264 42.6223C26.4521 40.262 26.6257 37.8174 27.4287 35.5478C28.2318 33.2782 29.6343 31.2684 31.4876 29.7317C33.3408 28.195 35.5755 27.1887 37.9545 26.8197C40.3335 26.4507 42.768 26.7326 44.9997 27.6357"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </g>
                  )}
                  {/* Custom Dashboards & Analytics - Grid dashboard */}
                  {index === 7 && (
                    <g transform="scale(0.625)">
                      <path
                        d="M13.333 16.6673C13.333 15.7833 13.6842 14.9354 14.3093 14.3103C14.9344 13.6852 15.7823 13.334 16.6663 13.334H29.9997C30.8837 13.334 31.7316 13.6852 32.3567 14.3103C32.9818 14.9354 33.333 15.7833 33.333 16.6673V33.334C33.333 34.218 32.9818 35.0659 32.3567 35.691C31.7316 36.3161 30.8837 36.6673 29.9997 36.6673H16.6663C15.7823 36.6673 14.9344 36.3161 14.3093 35.691C13.6842 35.0659 13.333 34.218 13.333 33.334V16.6673ZM46.6663 16.6673C46.6663 15.7833 47.0175 14.9354 47.6427 14.3103C48.2678 13.6852 49.1156 13.334 49.9997 13.334H63.333C64.2171 13.334 65.0649 13.6852 65.69 14.3103C66.3152 14.9354 66.6663 15.7833 66.6663 16.6673V23.334C66.6663 24.218 66.3152 25.0659 65.69 25.691C65.0649 26.3161 64.2171 26.6673 63.333 26.6673H49.9997C49.1156 26.6673 48.2678 26.3161 47.6427 25.691C47.0175 25.0659 46.6663 24.218 46.6663 23.334V16.6673ZM13.333 53.334C13.333 52.4499 13.6842 51.6021 14.3093 50.977C14.9344 50.3518 15.7823 50.0007 16.6663 50.0007H29.9997C30.8837 50.0007 31.7316 50.3518 32.3567 50.977C32.9818 51.6021 33.333 52.4499 33.333 53.334V63.334C33.333 64.218 32.9818 65.0659 32.3567 65.691C31.7316 66.3161 30.8837 66.6673 29.9997 66.6673H16.6663C15.7823 66.6673 14.9344 66.3161 14.3093 65.691C13.6842 65.0659 13.333 64.218 13.333 63.334V53.334ZM46.6663 43.334C46.6663 42.4499 47.0175 41.6021 47.6427 40.977C48.2678 40.3518 49.1156 40.0007 49.9997 40.0007H63.333C64.2171 40.0007 65.0649 40.3518 65.69 40.977C66.3152 41.6021 66.6663 42.4499 66.6663 43.334V63.334C66.6663 64.218 66.3152 65.0659 65.69 65.691C65.0649 66.3161 64.2171 66.6673 63.333 66.6673H49.9997C49.1156 66.6673 48.2678 66.3161 47.6427 65.691C47.0175 65.0659 46.6663 64.218 46.6663 63.334V43.334Z"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                    </g>
                  )}
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-white">
                {service.title}
              </h3>
              <p className="text-sm text-white/70 !leading-[160%]">
                {service.description.split(".")[0]}.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-left {
          animation: scroll-left 30s linear infinite;
        }

        .marquee-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default function CustomSoftwareDevelopment() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axiosInstance.get("/blog", {
          params: {
            status: "Published",
            favorite: false,
            limit: 4,
            orderBy: "createdAt:desc",
          },
        });
        setBlogPosts(response.data.data || []);
      } catch (error) {
        console.log("Error fetching blog posts:", error);
      }
    };
    fetchBlogPosts();
  }, []);

  return (
    <main>
      <section className="w-full bg-white relative z-10 overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/png/hero-video-poster.png"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/mp4/dpa-custom-software-vid.mp4" type="video/mp4" />
        </video>

        <div className="py-32 lg:py-72 px-6 lg:px-10 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center -mt-16 lg:-mt-32">
            <div className="flex flex-col gap-6">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-light !leading-[120%]">
                We design & develop custom software for businesses
              </h1>
            </div>
            <div className="flex justify-center lg:justify-end"></div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_3fr] mt-0 lg:-mt-40 relative z-[2]">
          <div className="bg-black/50 text-white p-8 lg:p-12 flex items-center">
            <h2 className="text-xl lg:text-2xl font-light !leading-[140%]">
              What business results do you want to achieve?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {businessResults.map((item, index) => (
              <div
                key={`business-result-${index + 1}`}
                className={`p-6 lg:p-8 flex flex-col backdrop-blur-sm gap-3 border border-gray-200/20 ${
                  item.isHighlight ? "bg-black/50" : "bg-black/70"
                }`}
              >
                <h3
                  className={`text-base lg:text-lg font-bold text-white !leading-[140%]`}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p className={`text-sm text-white !leading-[150%]`}>
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-10">
        <div className="lg:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[300px] lg:h-[450px] w-full rounded-lg overflow-hidden">
            <Image
              src={ImageEngginer}
              alt="Development Team"
              fill
              quality={100}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl lg:text-4xl font-bold text-black !leading-[120%]">
              Why Choose Custom Software?
            </h2>
            <p className="text-primary text-lg lg:text-xl font-semibold">
              Tailored. Scalable. Future-Ready.
            </p>
            <p className="text-gray-700 text-sm lg:text-base !leading-[160%]">
              <span className="font-bold">No more limitations.</span> Custom
              software gives your team the exact tools they need to work faster,
              smarter, and more efficiently. From automating manual tasks to
              building complex platforms, we create solutions that align
              perfectly with your business goals.
            </p>
            <ul className="flex flex-col gap-4 mt-4">
              {customSoftwareBenefits.map((benefit, index) => (
                <li
                  key={`benefit-${index + 1}`}
                  className="flex items-center gap-3 text-base lg:text-lg font-semibold text-black"
                >
                  {benefit.svg || <CheckBoxIcon />}
                  {benefit.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 lg:py-20">
        <OurBrands />
      </section>

      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-10">
        <div className="lg:max-w-4xl mx-auto text-center flex flex-col gap-6">
          <p className="text-sm tracking-[0.2em] text-gray-500 uppercase">
            Greetings, we are Octobees
          </p>
          <h2 className="text-2xl lg:text-4xl font-normal text-black !leading-[140%]">
            People don&apos;t want software, they want results. And so we do
            software differently - simply by paying attention to quality, design
            and your business.
          </h2>
        </div>
      </section>

      <section className="w-full bg-white px-6 lg:px-10 border-y border-gray-200">
        <div className="lg:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featureCards.map((card, index) => (
            <div
              key={`feature-${index + 1}`}
              className={`flex flex-col py-12 lg:py-20 gap-4 ${index !== 0 ? "border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-8" : ""}`}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                {index === 0 && (
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 70 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_12909_24327)">
                      <g clip-path="url(#clip1_12909_24327)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M28.1055 4.89453L46.6661 66.4097H9.54492L28.1055 4.89453Z"
                          stroke="#23516E"
                          stroke-width="1.06061"
                        />
                        <path
                          d="M16.9689 47.3187C18.7262 47.3187 20.1507 45.8942 20.1507 44.1369C20.1507 42.3796 18.7262 40.9551 16.9689 40.9551C15.2117 40.9551 13.7871 42.3796 13.7871 44.1369C13.7871 45.8942 15.2117 47.3187 16.9689 47.3187Z"
                          fill="#010101"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M46.6657 66.4099L60.6498 0L16.5381 44.1371L46.6657 66.4099Z"
                          stroke="#23516E"
                          stroke-width="1.06061"
                        />
                        <path
                          d="M16.5381 44.1367H39.9976L55.5779 23.1611"
                          stroke="#23516E"
                          stroke-width="1.06061"
                          stroke-linecap="square"
                        />
                        <path
                          d="M45.6056 69.5921C47.3629 69.5921 48.7875 68.1676 48.7875 66.4103C48.7875 64.6531 47.3629 63.2285 45.6056 63.2285C43.8484 63.2285 42.4238 64.6531 42.4238 66.4103C42.4238 68.1676 43.8484 69.5921 45.6056 69.5921Z"
                          fill="#010101"
                        />
                        <path
                          d="M55.1506 26.1068C56.9078 26.1068 58.3324 24.6823 58.3324 22.925C58.3324 21.1677 56.9078 19.7432 55.1506 19.7432C53.3933 19.7432 51.9688 21.1677 51.9688 22.925C51.9688 24.6823 53.3933 26.1068 55.1506 26.1068Z"
                          fill="#010101"
                        />
                        <path
                          d="M34.9992 29.2884C36.7565 29.2884 38.181 27.8639 38.181 26.1066C38.181 24.3494 36.7565 22.9248 34.9992 22.9248C33.2419 22.9248 31.8174 24.3494 31.8174 26.1066C31.8174 27.8639 33.2419 29.2884 34.9992 29.2884Z"
                          fill="#010101"
                        />
                        <path
                          d="M39.2424 46.2582C40.9996 46.2582 42.4242 44.8336 42.4242 43.0763C42.4242 41.3191 40.9996 39.8945 39.2424 39.8945C37.4851 39.8945 36.0605 41.3191 36.0605 43.0763C36.0605 44.8336 37.4851 46.2582 39.2424 46.2582Z"
                          fill="#010101"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_12909_24327">
                        <rect width="70" height="70" fill="white" />
                      </clipPath>
                      <clipPath id="clip1_12909_24327">
                        <rect
                          width="53.0303"
                          height="70"
                          fill="white"
                          transform="translate(8.48438)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {index === 1 && (
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 70 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_12909_24343)">
                      <path
                        d="M35.0005 65.8213C52.3109 65.8213 66.3438 51.7885 66.3438 34.478C66.3438 17.1676 52.3109 3.13477 35.0005 3.13477C17.6901 3.13477 3.65723 17.1676 3.65723 34.478C3.65723 51.7885 17.6901 65.8213 35.0005 65.8213Z"
                        stroke="#242323"
                        stroke-width="1.04478"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.4482 17.2393V53.3028L57.8341 56.9021L60.5609 17.2393H10.4482Z"
                        stroke="#242323"
                        stroke-width="1.04478"
                      />
                      <path
                        d="M35.0005 6.26866C36.7316 6.26866 38.1349 4.86537 38.1349 3.13433C38.1349 1.40329 36.7316 0 35.0005 0C33.2695 0 31.8662 1.40329 31.8662 3.13433C31.8662 4.86537 33.2695 6.26866 35.0005 6.26866Z"
                        fill="#010101"
                      />
                      <path
                        d="M35.0005 70.0001C36.7316 70.0001 38.1349 68.5968 38.1349 66.8658C38.1349 65.1347 36.7316 63.7314 35.0005 63.7314C33.2695 63.7314 31.8662 65.1347 31.8662 66.8658C31.8662 68.5968 33.2695 70.0001 35.0005 70.0001Z"
                        fill="#010101"
                      />
                      <path
                        d="M19.3287 39.7013C21.0597 39.7013 22.463 38.298 22.463 36.5669C22.463 34.8359 21.0597 33.4326 19.3287 33.4326C17.5976 33.4326 16.1943 34.8359 16.1943 36.5669C16.1943 38.298 17.5976 39.7013 19.3287 39.7013Z"
                        fill="#010101"
                      />
                      <path
                        d="M50.6724 39.7013C52.4035 39.7013 53.8067 38.298 53.8067 36.5669C53.8067 34.8359 52.4035 33.4326 50.6724 33.4326C48.9414 33.4326 47.5381 34.8359 47.5381 36.5669C47.5381 38.298 48.9414 39.7013 50.6724 39.7013Z"
                        fill="#010101"
                      />
                      <path
                        d="M57.9859 60.5968C59.7169 60.5968 61.1202 59.1935 61.1202 57.4625C61.1202 55.7314 59.7169 54.3281 57.9859 54.3281C56.2548 54.3281 54.8516 55.7314 54.8516 57.4625C54.8516 59.1935 56.2548 60.5968 57.9859 60.5968Z"
                        fill="#010101"
                      />
                      <path
                        d="M9.92632 57.463C11.6574 57.463 13.0606 56.0597 13.0606 54.3287C13.0606 52.5976 11.6574 51.1943 9.92632 51.1943C8.19528 51.1943 6.79199 52.5976 6.79199 54.3287C6.79199 56.0597 8.19528 57.463 9.92632 57.463Z"
                        fill="#010101"
                      />
                      <path
                        d="M9.72949 16.7167L35.0005 66.866V3.67476M35.2304 3.93491L9.72949 53.5283M35.2722 3.40625L59.2571 57.1913M61.1199 16.7167L35.0005 65.8212"
                        stroke="#242323"
                        stroke-width="1.04478"
                        stroke-linecap="square"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_12909_24343">
                        <rect width="70" height="70" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {index === 2 && (
                  <svg
                    width="70"
                    height="70"
                    viewBox="0 0 70 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_12909_24359)">
                      <g clip-path="url(#clip1_12909_24359)">
                        <g clip-path="url(#clip2_12909_24359)">
                          <path
                            d="M5.65146 16.6477C1.2025 24.3536 10.7357 38.1866 26.9445 47.5448C43.1534 56.903 59.8998 58.2424 64.3487 50.5366C68.7977 42.8308 59.2645 28.9977 43.0557 19.6395C26.8469 10.2814 10.1004 8.9419 5.65146 16.6477Z"
                            stroke="black"
                            stroke-width="1.11111"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.62078 40.9253C3.25078 49.8476 19.5174 54.542 37.953 51.4131C56.3874 48.2831 70.0097 38.5131 68.3774 29.592C66.7474 20.6698 50.4808 15.9753 32.0452 19.1042C13.6119 22.2342 -0.0114451 32.0042 1.62078 40.9253Z"
                            stroke="#23526E"
                            stroke-width="1.11111"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13.2778 60.9945C20.1089 66.8167 35.3711 59.7645 47.3678 45.2434C59.3645 30.7234 63.5523 14.2323 56.7211 8.41228C49.8911 2.59006 34.6289 9.64228 22.6323 24.1634C10.6356 38.6834 6.44781 55.1745 13.2789 60.9945H13.2778Z"
                            stroke="#2A2828"
                            stroke-width="1.11111"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M34.1487 68.8065C43.1232 68.8743 50.2821 53.6621 50.1376 34.8276C49.9943 15.9932 42.6032 0.668724 33.6287 0.599835C24.6543 0.532057 17.4954 15.7443 17.6398 34.5787C17.7832 53.4132 25.1743 68.7376 34.1487 68.8065Z"
                            stroke="#23526E"
                            stroke-width="1.11111"
                          />
                          <path
                            d="M10.0003 16.3698C11.8413 16.3698 13.3337 14.8774 13.3337 13.0365C13.3337 11.1955 11.8413 9.70312 10.0003 9.70312C8.15938 9.70312 6.66699 11.1955 6.66699 13.0365C6.66699 14.8774 8.15938 16.3698 10.0003 16.3698Z"
                            fill="#010101"
                          />
                          <path
                            d="M24.4447 64.1471C26.2856 64.1471 27.778 62.6548 27.778 60.8138C27.778 58.9729 26.2856 57.4805 24.4447 57.4805C22.6037 57.4805 21.1113 58.9729 21.1113 60.8138C21.1113 62.6548 22.6037 64.1471 24.4447 64.1471Z"
                            fill="#010101"
                          />
                          <path
                            d="M56.6663 48.5924C58.5073 48.5924 59.9997 47.1001 59.9997 45.2591C59.9997 43.4182 58.5073 41.9258 56.6663 41.9258C54.8254 41.9258 53.333 43.4182 53.333 45.2591C53.333 47.1001 54.8254 48.5924 56.6663 48.5924Z"
                            fill="#23526E"
                          />
                        </g>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_12909_24359">
                        <rect width="70" height="70" fill="white" />
                      </clipPath>
                      <clipPath id="clip1_12909_24359">
                        <rect width="70" height="70" fill="white" />
                      </clipPath>
                      <clipPath id="clip2_12909_24359">
                        <rect width="70" height="70" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )}
              </div>
              <p className="text-xs tracking-[0.15em] text-gray-500 uppercase">
                {card.category}
              </p>
              <h3 className="text-xl lg:text-2xl font-normal text-black">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 !leading-[160%] text-pretty">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white py-12 lg:py-32 px-6 lg:px-10">
        <div className="lg:max-w-5xl mx-auto text-center flex flex-col gap-8 lg:gap-12">
          <div className="flex flex-col gap-4">
            <p className="text-sm tracking-[0.2em] text-gray-500 uppercase">
              Technology
            </p>
            <h2 className="text-2xl lg:text-5xl font-normal text-black !leading-[130%]">
              Modern Stack. Expertly Engineered.
            </h2>
            <p className="text-sm lg:text-base text-gray-600 !leading-[160%] max-w-3xl mx-auto">
              Using <b>JavaScript</b>, <b>Node.js</b>, and <b>Next.js</b>, we
              build high-performance, secure digital experiences designed to
              scale and evolve with your business.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-6 lg:gap-24">
            <Link
              href="/services/software-development/custom-software-development/javascript"
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-32 h-32 lg:w-52 lg:h-52 flex items-center justify-center transition-transform group-hover:scale-110">
                {/* JavaScript Outline Logo - using original proportions with thin stroke */}
                <svg
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M12.5 8V7.83333C12.5 7.09695 11.903 6.5 11.1667 6.5H10C9.17157 6.5 8.5 7.17157 8.5 8C8.5 8.82843 9.17157 9.5 10 9.5H11C11.8284 9.5 12.5 10.1716 12.5 11C12.5 11.8284 11.8284 12.5 11 12.5H10C9.17157 12.5 8.5 11.8284 8.5 11M6.5 6V11C6.5 11.8284 5.82843 12.5 5 12.5C4.17157 12.5 3.5 11.8284 3.5 11M0.5 0.5H14.5V14.5H0.5V0.5Z"
                    stroke="#000000"
                    strokeWidth="0.25"
                  />
                </svg>
              </div>
              <p className="text-lg lg:text-xl font-medium text-black group-hover:text-primary transition-colors">
                Javascript
              </p>
            </Link>

            <Link
              href="/services/software-development/custom-software-development/nextjs"
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-32 h-32 lg:w-52 lg:h-52 flex items-center justify-center transition-transform group-hover:scale-110">
                {/* Next.js Outline Logo - Clean stroke version */}
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Circle outline */}
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="#000000"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  {/* N letter - left vertical */}
                  <path
                    d="M32 28V72"
                    stroke="#000000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* N diagonal extending out */}
                  <path
                    d="M32 28L72 82"
                    stroke="#000000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* I vertical bar */}
                  <path
                    d="M68 28V58"
                    stroke="#000000"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-lg lg:text-xl font-medium text-black group-hover:text-primary transition-colors">
                Next JS
              </p>
            </Link>

            <Link
              href="/services/software-development/custom-software-development/nodejs"
              className="flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-32 h-32 lg:w-52 lg:h-52 flex items-center justify-center transition-transform group-hover:scale-110">
                {/* Node.js Outline Logo - Clean stroke version like JS and Next.js */}
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Hexagon outline */}
                  <path
                    d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z"
                    stroke="#000000"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinejoin="round"
                  />
                  {/* J letter */}
                  <path
                    d="M40 35V58C40 64 36 68 30 68C25 68 22 65 22 60"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* S letter */}
                  <path
                    d="M78 42C78 38 74 35 68 35C62 35 58 38 58 42C58 46 62 48 68 50C74 52 78 55 78 60C78 65 74 68 68 68C62 68 58 65 58 60"
                    stroke="#000000"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-lg lg:text-xl font-medium text-black group-hover:text-primary transition-colors">
                Node JS
              </p>
            </Link>
          </div>
        </div>
      </section>

      <BuildCustomSolutionsCarousel />

      {/* What We Build section removed - consolidated into SERVICES section above */}

      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-10 border-t border-gray-200">
        <div className="lg:max-w-7xl mx-auto flex flex-col gap-10 lg:gap-16">
          <div className="text-center flex flex-col gap-4">
            <p className="text-sm tracking-[0.2em] text-gray-500 uppercase">
              Work
            </p>
            <h2 className="text-3xl lg:text-5xl font-normal text-black !leading-[130%]">
              Our Work in Action
            </h2>
            <p className="text-sm lg:text-base text-gray-600 !leading-[160%] max-w-3xl mx-auto">
              Driving business value with the best technological innovations for
              our enterprise clients. Browse the work to find out how you can
              transform your business with technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {workProjects.map((project, index) => (
              <div
                key={`project-${index + 1}`}
                className="flex flex-col gap-4 border border-gray-200 rounded-lg overflow-hidden p-6"
              >
                <h3 className="text-lg lg:text-xl font-semibold text-black">
                  {project.title}
                </h3>
                <div className="relative h-[200px] lg:h-[250px] w-full bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    quality={100}
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-12 lg:py-20 px-6 lg:px-10 hidden">
        <div className="lg:max-w-7xl mx-auto relative">
          <div className="flex flex-col gap-2 lg:w-1/3 pt-0 lg:absolute lg:top-0 lg:left-0 z-10 mb-10 lg:mb-0">
            <h2 className="text-3xl lg:text-4xl font-light text-white !leading-[120%]">
              Our Insights
            </h2>
            <p className="text-xl lg:text-3xl text-white/50 !leading-[140%] font-light">
              On the issues that matter most in business and technology
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start w-full">
            {blogPosts.map((post, index) => {
              let marginClass = "lg:mt-0";
              if (index === 0) marginClass = "lg:mt-[280px]";
              else if (index === 1) marginClass = "lg:mt-[180px]";
              else if (index === 2) marginClass = "lg:mt-[90px]";

              // Format date from API
              const formattedDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "";

              return (
                <Link
                  href={`/insights/${post.slug || post.id}`}
                  key={`insight-${index + 1}`}
                  className={`bg-white flex flex-col justify-between ${marginClass} rounded-lg overflow-hidden shadow-sm h-[360px] lg:h-[360px] hover:shadow-lg transition-shadow`}
                >
                  <div className="p-6 flex flex-col justify-between">
                    <h4 className="text-base lg:text-lg font-bold text-black !leading-[130%] line-clamp-3">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-4">
                      {formattedDate}
                    </p>
                  </div>
                  <div className="relative h-[200px] w-full mt-auto">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${post.thumbnail || post.image || "/png/insight-1.png"}`}
                      alt={post.title}
                      fill
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-12 lg:py-20 px-6 lg:px-10">
        <FormJoin />
      </section>

      <section className="w-full bg-white py-16 lg:py-32 px-6 lg:px-10">
        <div className="lg:max-w-4xl mx-auto text-center flex flex-col gap-3 items-center">
          <h2 className="text-2xl lg:text-4xl font-light text-black !leading-[130%]">
            Ready to transform your business?
          </h2>
          <p className="text-lg font-light lg:text-xl text-gray-500 !leading-[140%]">
            Explore the faster way to get software done
          </p>
          <div className="mt-4">
            <ConsultationButton text="Contact us" />
          </div>
        </div>
      </section>
    </main>
  );
}
