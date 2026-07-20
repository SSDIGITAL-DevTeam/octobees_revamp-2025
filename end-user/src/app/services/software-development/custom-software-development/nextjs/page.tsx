import Image from "next/image";
import Link from "next/link";
import DottedMap from "dotted-map";
import FAQSchema from "@/app/seo/schema/FAQSchema";

const nextjsFAQ = [
  {
    question: "Why choose Next.js over plain React?",
    answer:
      "Next.js provides out-of-the-box File-system Routing, Server-Side Rendering (SSR), and Static Site Generation (SSG), which plain React doesn't offer natively. This means better SEO and faster load times.",
  },
  {
    question: "Does Next.js improve SEO?",
    answer:
      "Absolutely. By pre-rendering pages on the server, search engines can crawl your site content much more effectively than client-side rendered Single Page Applications.",
  },
  {
    question: "Can I migrate my existing React app to Next.js?",
    answer:
      "Yes, migration is common and supported. We can help you move incrementally page-by-page to Next.js without rewriting your entire codebase.",
  },
];

export default function NextJSDevelopment() {
  return (
    <main className="w-full">
      <section className="w-full relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/png/hero-nextjs-new.jpg"
            alt="NextJS Development Hero"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626] via-[#DC2626]/90 to-[#DC2626]/40 mix-blend-multiply opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#DC2626] via-[#DC2626]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 lg:px-10 w-full h-full flex flex-col justify-end pb-20">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-[10px] lg:text-xs tracking-[0.25em] text-white/80 uppercase font-bold">
              NextJS Development
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light text-white !leading-[1.1]">
              NextJS Development
            </h1>
            <p className="text-lg lg:text-2xl text-white font-light !leading-[1.4] max-w-2xl mx-auto">
              Build high-performance, SEO-friendly web applications with the
              React Framework for Production.
            </p>
            <p className="text-xs lg:text-sm text-white/90 !leading-[1.7] max-w-3xl mx-auto">
              Next.js enables you to create full-stack web applications by
              extending the latest React features, integrating powerful
              Rust-based tooling for the fastest builds, and optimizing for Core
              Web Vitals automatically.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-12 lg:py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              We&apos;re a NextJS Development Company
            </h2>
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              Based in Singapore
            </h2>
          </div>

          <p className="text-sm lg:text-base text-white/80 !leading-[1.7] max-w-3xl mx-auto">
            As pioneers in modern web development, we leverage Next.js to
            deliver lightning-fast, scalable, and secure web applications. From
            static sites to complex enterprise platforms, we help businesses
            stay ahead with cutting-edge frontend architecture.
          </p>

          <div className="relative py-8 lg:py-12 w-full flex justify-center text-white/20">
            <DottedMapRenderer />
          </div>
        </div>
      </section>

      <div className="w-full bg-primary text-white">
        <section className="py-12 lg:py-20 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <p className="text-[10px] lg:text-xs tracking-[0.25em] uppercase text-white/60">
                What We Do
              </p>
              <h2 className="text-3xl lg:text-5xl font-light !leading-[1.2]">
                Our Suite of <br />
                NextJS Development Services
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-2xl mx-auto pt-4 !leading-[1.6]">
                Unlock the full potential of the web with our specialized
                Next.js services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">SSR & SSG</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Implement Server-Side Rendering and Static Site Generation for
                  optimal speed and SEO ranking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M12 4v16" />
                    <path d="M4 12h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Headless CMS Integration</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Seamlessly connect Next.js with Contentful, Strapi, or Sanity
                  for dynamic content management.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Performance Optimization</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Achieve perfect Lighthouse scores with image optimization,
                  code splitting, and edge caching.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M3.3 7 8.7 5 8.7 19 3.3 17Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Next.js Migration</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Migrate legacy React or traditional web apps to Next.js for
                  better maintainability and performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20 px-6 lg:px-10 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <p className="text-[10px] lg:text-xs tracking-[0.25em] uppercase text-white/60">
                What We Do
              </p>
              <h2 className="text-3xl lg:text-5xl font-light !leading-[1.2]">
                Our Approach to <br />
                <span className="font-normal">NextJS Development</span>
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-3xl mx-auto pt-4 !leading-[1.6]">
                We don&apos;t just code; we engineer digital products for scale.
                Our development process prioritizes speed, security, and user
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-16">
              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 4L44 40H4L24 4Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Vercel Best Practices</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  We align development with Vercel&apos;s recommended workflows
                  for seamless deployment and scaling.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Core Web Vitals</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  We obsess over LCP, FID, and CLS metrics to ensure your site
                  ranks high on Google.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Edge Computing</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Utilize Middleware and Edge Functions to deliver dynamic
                  content with static-like speed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Scalable Architecture</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Modular component design (Atomic Design) ensures your codebase
                  grows cleanly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Security First</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Implementation of strict CSPs, image optimization to prevent
                  attacks, and secure API handling.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">SEO Mastery</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Built-in SEO tagging, sitemap generation, and metadata
                  management for maximum visibility.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full bg-white py-12 lg:py-20 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="text-[10px] lg:text-xs tracking-[0.25em] uppercase text-gray-500">
              Work
            </p>
            <h2 className="text-3xl lg:text-5xl font-light text-black !leading-[1.2]">
              Our Work in Action
            </h2>
            <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto pt-4 !leading-[1.6]">
              See how we facilitate digital transformation with high-performance
              Next.js applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 group cursor-pointer">
              <h3 className="text-lg lg:text-xl font-medium text-gray-800 group-hover:text-primary transition-colors">
                FnB Point of Sales
              </h3>
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src="/png/project-fnb-pos.png"
                  alt="FnB Point of Sales UI"
                  fill
                  quality={100}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 group cursor-pointer">
              <h3 className="text-lg lg:text-xl font-medium text-gray-800 group-hover:text-primary transition-colors">
                Car Rental System
              </h3>
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src="/png/project-car-rental.png"
                  alt="Car Rental System UI"
                  fill
                  quality={100}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="space-y-4 group cursor-pointer">
              <h3 className="text-lg lg:text-xl font-medium text-gray-800 group-hover:text-primary transition-colors">
                Marketing Voucher System
              </h3>
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src="/png/project-voucher.png"
                  alt="Marketing Voucher System UI"
                  fill
                  quality={100}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-primary text-white">
        <section className="py-12 lg:py-20 px-6 lg:px-10 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
              <div className="space-y-6">
                <p className="text-[10px] lg:text-xs tracking-[0.25em] uppercase text-white/60">
                  What We Do
                </p>
                <h2 className="text-3xl lg:text-5xl font-light !leading-[1.2]">
                  Why DPA <br />
                  <span className="font-normal">For NextJS Development</span>
                </h2>
                <p className="text-sm lg:text-base text-white/80 pt-2 !leading-[1.6]">
                  We deliver enterprise-grade Next.js solutions that are secure,
                  scalable, and optimized for growth. Our expertise ensures you
                  get the most out of the framework.
                </p>
              </div>

              <div className="space-y-6 lg:pt-8 w-full">
                {[
                  "Specialized Next.js Architects",
                  "Vercel Partner Network",
                  "Performance-first methodology",
                  "SEO & Analytics Integration",
                  "Enterprise Security Standards",
                  "Rapid prototyping & delivery",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl font-light">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20 px-6 lg:px-10 border-b border-white/10">
          <FAQSchema items={nextjsFAQ} />
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-3xl lg:text-5xl font-light">FAQs</h2>
                <p className="text-xs lg:text-sm text-white/80 !leading-[1.7]">
                  Next.js is the React Framework for the Web. Used by some of
                  the world&apos;s largest companies, it enables you to create
                  full-stack Web applications by extending the latest React
                  features.
                </p>
              </div>

              <div className="lg:col-span-2 w-full space-y-0 divide-y divide-white/20">
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>Why choose Next.js over plain React?</span>
                    <span className="transition-transform group-open:rotate-45">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-white/80 mt-4 text-sm leading-relaxed">
                    Next.js provides out-of-the-box File-system Routing,
                    Server-Side Rendering (SSR), and Static Site Generation
                    (SSG), which plain React doesn&apos;t offer natively. This
                    means better SEO and faster load times.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>Does Next.js improve SEO?</span>
                    <span className="transition-transform group-open:rotate-45">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-white/80 mt-4 text-sm leading-relaxed">
                    Absolutely. By pre-rendering pages on the server, search
                    engines can crawl your site content much more effectively
                    than client-side rendered Single Page Applications.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer border-b border-white/20">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>Can I migrate my existing React app to Next.js?</span>
                    <span className="transition-transform group-open:rotate-45">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-white/80 mt-4 text-sm leading-relaxed mb-6">
                    Yes, migration is common and supported. We can help you move
                    incrementally page-by-page to Next.js without rewriting your
                    entire codebase.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-32 px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-[10px] lg:text-xs tracking-[0.25em] uppercase text-white/60">
              Built on Strategy
            </p>
            <h2 className="text-4xl lg:text-6xl font-light !leading-[1.1]">
              Partnering with DPA
            </h2>
            <p className="text-sm lg:text-base text-white/80 max-w-3xl mx-auto !leading-[1.7]">
              We partner with businesses to build future-proof web applications.
              Our Deep Next.js expertise ensures that your product is not only
              built for today but scalable for tomorrow&apos;s demands. We
              handle the tech so you can focus on your business.
            </p>

            <div className="pt-8">
              <Link
                href="/contact"
                className="max-w-md mx-auto border-1 border-white hover:bg-white hover:text-primary transition-all duration-300 py-6 px-8 flex items-center justify-between group"
              >
                <div className="text-center w-full">
                  <span className="text-[10px] tracking-[0.2em] uppercase block mb-1 opacity-80 group-hover:opacity-100">
                    Contact Us
                  </span>
                  <span className="text-xl lg:text-2xl font-medium">
                    Get In Touch
                  </span>
                </div>
                <svg
                  className="w-5 h-5 transition-opacity transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="relative w-full h-[300px] lg:h-[500px] overflow-hidden">
          <Image
            src="/png/nextjs-bottom.png"
            alt="NextJS Development Team"
            fill
            quality={100}
            className="object-cover"
          />
          {/* Gradient from top to transparent at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#db1222] to-transparent z-10"></div>
        </div>
      </div>
    </main>
  );
}

function DottedMapRenderer() {
  const map = new DottedMap({ height: 100, grid: "vertical" });

  map.addPin({
    lat: 1.3521,
    lng: 103.8198,
    data: { type: "singapore" },
  });

  const locations = [
    { lat: 40.7128, lng: -74.006 },
    { lat: 51.5074, lng: -0.1278 },
    { lat: 35.6762, lng: 139.6503 },
    { lat: -33.8688, lng: 151.2093 },
  ];

  locations.forEach((loc) => {
    map.addPin({ lat: loc.lat, lng: loc.lng, data: { type: "other" } });
  });

  const points = map.getPoints();

  return (
    <svg viewBox="0 0 220 110" className="w-full h-auto max-w-6xl">
      {points.map((point, i) => {
        const pointData = point.data as { type?: string } | undefined;
        const isSingapore = pointData && pointData.type === "singapore";
        const isOther = pointData && pointData.type === "other";

        if (isSingapore) {
          return (
            <g key={`singapore-${i}`}>
              <circle cx={point.x} cy={point.y} r={1.2} fill="white" />
              <circle
                cx={point.x}
                cy={point.y}
                r={1.2}
                fill="white"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="1.2"
                  to="8"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        }

        if (isOther) {
          return (
            <circle
              key={`dot-${i}`}
              cx={point.x}
              cy={point.y}
              r={0.6}
              fill="white"
              className="opacity-70"
            />
          );
        }

        return (
          <circle
            key={`dot-${i}`}
            cx={point.x}
            cy={point.y}
            r={0.25}
            fill="white"
            className="opacity-40"
          />
        );
      })}
    </svg>
  );
}
