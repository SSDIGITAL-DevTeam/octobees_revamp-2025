import Image from "next/image";
import Link from "next/link";
import DottedMap from "dotted-map";

export default function NodeJSDevelopment() {
  return (
    <main className="w-full">
      <section className="w-full relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/png/hero-nodejs-new.jpg"
            alt="NodeJS Development Hero"
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
              NodeJS Development
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light text-white !leading-[1.1]">
              NodeJS Development
            </h1>
            <p className="text-lg lg:text-2xl text-white font-light !leading-[1.4] max-w-2xl mx-auto">
              Scalable, real-time backend solutions built on the efficient V8
              engine.
            </p>
            <p className="text-xs lg:text-sm text-white/90 !leading-[1.7] max-w-3xl mx-auto">
              Node.js is a powerful JavaScript runtime that enables the building
              of fast, scalable network applications. Its event-driven,
              non-blocking I/O model makes it perfect for data-intensive
              real-time applications across distributed devices.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-12 lg:py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              We&apos;re a NodeJS Development Company
            </h2>
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              Based in Singapore
            </h2>
          </div>

          <p className="text-sm lg:text-base text-white/80 !leading-[1.7] max-w-3xl mx-auto">
            We specialize in architecting high-performance backend systems using
            Node.js. Our team builds secure APIs, microservices, and real-time
            platforms that power businesses globally.
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
                NodeJS Development Services
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-2xl mx-auto pt-4 !leading-[1.6]">
                From API development to full-scale microservices, we cover all
                your backend needs.
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
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">API Development</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Robust RESTful and GraphQL API development for seamless
                  integration with any frontend.
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
                    <rect x="2" y="2" width="9" height="9" rx="2" />
                    <rect x="13" y="2" width="9" height="9" rx="2" />
                    <rect x="2" y="13" width="9" height="9" rx="2" />
                    <rect x="13" y="13" width="9" height="9" rx="2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Microservices</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Decompose complex monolithic apps into scalable, independent
                  microservices.
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
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                    <path d="M12 12 8 8" />
                    <path d="M12 12l4 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Real-time Apps</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Build chat apps, live notifications, and collaborative tools
                  using Socket.io and WebSockets.
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
                    <path d="M3 3v18h18" />
                    <path d="M9 8h6" />
                    <path d="M9 12h6" />
                    <path d="M9 16h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Enterprise Backends</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Secure, scalable backend solutions designed to handle high
                  concurrency and large data volumes.
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
                <span className="font-normal">NodeJS Development</span>
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-3xl mx-auto pt-4 !leading-[1.6]">
                We build backends that are efficient, maintainable, and ready to
                scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-x-12 lg:gap-y-16">
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
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                    <path d="M12 14 7 9" />
                    <path d="M12 12 12 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Event-Driven Architecture</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Leveraging Node&apos;s non-blocking I/O to handle thousands of
                  concurrent connections efficiently.
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
                    <path d="M17.5 19c0-1.7-1.3-3-3-3h-1.1c-.1-2.4-2.1-4.4-4.5-4.4-2.2 0-4.1 1.7-4.5 3.9H4c-2.2 0-4 1.8-4 4s1.8 4 4 4h13.5c1.7 0 3-1.3 3-3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Cloud Native</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Designed for deployment on AWS Lambda, Google Cloud Functions,
                  or Docker containers.
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
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Scalable Databases</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Integration with both SQL (PostgreSQL) and NoSQL (MongoDB)
                  databases for optimal data storage.
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
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">CI/CD Pipelines</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Automated testing and deployment workflows to ensure code
                  quality and rapid releases.
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">API Security</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Implementation of JWT authentication, rate limiting, and input
                  validation to protect your data.
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Performance Monitoring</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Real-time monitoring and alerting to ensure your backend is
                  always performing at its best.
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
              Robust backend systems powering consumer applications and
              enterprise tools.
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
                  <span className="font-normal">For NodeJS Development</span>
                </h2>
                <p className="text-sm lg:text-base text-white/80 pt-2 !leading-[1.6]">
                  We deliver secure, scalable, and high-performance backend
                  solutions that form the backbone of your digital business.
                </p>
              </div>

              <div className="space-y-6 lg:pt-8 w-full">
                {[
                  "Deep Node.js Expertise",
                  "Microservices Architecture",
                  "High-concurrency systems",
                  "Cloud-neutral deployment",
                  "Security compliance",
                  "Legacy modernization",
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-24">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-3xl lg:text-5xl font-light">FAQs</h2>
                <p className="text-xs lg:text-sm text-white/80 !leading-[1.7]">
                  Node.js is an open-source, cross-platform JavaScript runtime
                  environment that executes JavaScript code outside a web
                  browser, perfect for building scalable network applications.
                </p>
              </div>

              <div className="lg:col-span-2 w-full space-y-0 divide-y divide-white/20">
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>Why use Node.js over PHP or Java?</span>
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
                    Node.js is event-driven and non-blocking, making it superior
                    for handling multiple concurrent connections and real-time
                    applications. It also allows using the same language (JS) on
                    both frontend and backend.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>Is Node.js scalable?</span>
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
                    Yes, highly. Node.js is designed with scalability in mind,
                    especially when coupled with a microservices architecture
                    and containerization (Docker).
                  </p>
                </details>
                <details className="group py-6 cursor-pointer border-b border-white/20">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>How secure is Node.js?</span>
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
                    While no platform is immune to threats, we implement
                    rigorous security best practices including input validation,
                    secure headers, and dependency auditing to ensure your
                    application is secure.
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
              We partner with visionary companies to build powerful backend
              infrastructure. Our deep Node.js expertise transforms complex
              requirements into elegant, fast, and reliable systems.
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
            src="/png/nodejs-bottom.png"
            alt="NodeJS Development Team"
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
