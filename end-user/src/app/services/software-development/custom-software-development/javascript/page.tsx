import Image from "next/image";
import Link from "next/link";
import DottedMap from "dotted-map";

export default function JavascriptDevelopment() {
  return (
    <main className="w-full">
      <section className="w-full relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/png/hero-javascript-new.jpg"
            alt="Mobile dashboard app in office setting"
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
              Javascript Development
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-light text-white !leading-[1.1]">
              Javascript Development
            </h1>
            <p className="text-lg lg:text-2xl text-white font-light !leading-[1.4] max-w-2xl mx-auto">
              Build amazing web applications using the world&apos;s leading
              frontend technology.
            </p>
            <p className="text-xs lg:text-sm text-white/90 !leading-[1.7] max-w-3xl mx-auto">
              JavaScript (JS) is a lightweight, interpreted, or just-in-time
              compiled programming language with first-class functions. While it
              is most well-known as the scripting language for Web pages, many
              non-browser environments also use it, such as Node.js, Apache
              CouchDB and Adobe Acrobat.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-primary py-12 lg:py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              We&apos;re a Javascript Development Company
            </h2>
            <h2 className="text-2xl lg:text-4xl font-light text-white !leading-[1.3]">
              Based in Singapore
            </h2>
          </div>

          <p className="text-sm lg:text-base text-white/80 !leading-[1.7] max-w-3xl mx-auto">
            As early adopters of Javascript, we&apos;ve already developed
            diverse reusable ReactJS components, full-scale web applications,
            and React Native mobile apps. Using our best in-house resources, we
            deliver the following services:
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
                Javascript Development Services
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-2xl mx-auto pt-4 !leading-[1.6]">
                Whether designing and developing a new application for an
                ambitious idea, or upgrading an existing tool, we&apos;re the
                right team to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    width="54"
                    height="48"
                    viewBox="0 0 54 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9999 27C28.5912 27 30.1174 26.3679 31.2426 25.2426C32.3678 24.1174 32.9999 22.5913 32.9999 21C32.9999 19.4087 32.3678 17.8826 31.2426 16.7574C30.1174 15.6321 28.5912 15 26.9999 15C26.9062 15 26.8237 15.0225 26.7328 15.0272C27.0219 15.8234 27.0779 16.6856 26.8943 17.5126C26.7106 18.3395 26.2949 19.0969 25.6959 19.6959C25.0969 20.2949 24.3395 20.7106 23.5125 20.8943C22.6856 21.078 21.8234 21.0219 21.0271 20.7328C21.0271 20.8266 20.9999 20.9091 20.9999 21C20.9999 21.7879 21.1551 22.5681 21.4567 23.2961C21.7582 24.0241 22.2002 24.6855 22.7573 25.2426C23.8825 26.3679 25.4086 27 26.9999 27ZM53.6737 22.6312C48.5896 12.7116 38.5246 6 26.9999 6C15.4753 6 5.40745 12.7163 0.326199 22.6322C0.111738 23.0564 0 23.5251 0 24.0005C0 24.4758 0.111738 24.9445 0.326199 25.3688C5.41026 35.2884 15.4753 42 26.9999 42C38.5246 42 48.5924 35.2837 53.6737 25.3678C53.8882 24.9436 53.9999 24.4749 53.9999 23.9995C53.9999 23.5242 53.8882 23.0555 53.6737 22.6312ZM26.9999 9C29.3733 9 31.6934 9.70379 33.6668 11.0224C35.6402 12.3409 37.1783 14.2151 38.0865 16.4078C38.9948 18.6005 39.2324 21.0133 38.7694 23.3411C38.3064 25.6689 37.1635 27.8071 35.4852 29.4853C33.807 31.1635 31.6688 32.3064 29.341 32.7694C27.0133 33.2324 24.6005 32.9948 22.4077 32.0866C20.215 31.1783 18.3409 29.6402 17.0223 27.6668C15.7037 25.6935 14.9999 23.3734 14.9999 21C15.0034 17.8185 16.2688 14.7682 18.5185 12.5186C20.7682 10.2689 23.8184 9.00347 26.9999 9ZM26.9999 39C16.9349 39 7.73807 33.2522 2.99995 24C5.66473 18.7687 9.92627 14.5219 15.1668 11.8753C13.2103 14.4084 11.9999 17.5472 11.9999 21C11.9999 24.9782 13.5803 28.7936 16.3933 31.6066C19.2064 34.4196 23.0217 36 26.9999 36C30.9782 36 34.7935 34.4196 37.6066 31.6066C40.4196 28.7936 41.9999 24.9782 41.9999 21C41.9999 17.5472 40.7896 14.4084 38.8331 11.8753C44.0736 14.5219 48.3352 18.7687 50.9999 24C46.2628 33.2522 37.0649 39 26.9999 39Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Project Supervision</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  We will help you define the user journeys and outcomes and
                  ensure the team stays on track with deliverables and KPIs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25.9969 39H21.9938C19.7812 39 17.9906 40.7906 17.9906 43.0031V47.25C17.9906 47.6625 18.3281 48 18.7406 48H20.2406C20.6531 48 20.9906 47.6625 20.9906 47.25V43.0031C20.9906 42.45 21.4406 42 21.9938 42H25.9969C26.55 42 27 42.45 27 43.0031V47.25C27 47.6625 27.3375 48 27.75 48H29.25C29.6625 48 30 47.6625 30 47.25V43.0031C30 40.7906 28.2094 39 25.9969 39ZM46.5 33H45V22.5C45 21.675 44.325 21 43.5 21H42V13.5C42 12.675 41.325 12 40.5 12H39V1.5C39 0.675 38.325 0 37.5 0C36.675 0 36 0.675 36 1.5V3H30V1.5C30 0.675 29.325 0 28.5 0C27.675 0 27 0.675 27 1.5V3H21V1.5C21 0.675 20.325 0 19.5 0C18.675 0 18 0.675 18 1.5V3H12V1.5C12 0.675 11.325 0 10.5 0C9.675 0 9 0.675 9 1.5V12H7.5C6.675 12 6 12.675 6 13.5V21H4.5C3.675 21 3 21.675 3 22.5V33H1.5C0.675 33 0 33.675 0 34.5V47.25C0 47.6625 0.3375 48 0.75 48H2.25C2.6625 48 3 47.6625 3 47.25V36H9V47.25C9 47.6625 9.3375 48 9.75 48H11.25C11.6625 48 12 47.6625 12 47.25V36H36V47.25C36 47.6625 36.3375 48 36.75 48H38.25C38.6625 48 39 47.6625 39 47.25V36H45V47.25C45 47.6625 45.3375 48 45.75 48H47.25C47.6625 48 48 47.6625 48 47.25V34.5C48 33.675 47.325 33 46.5 33ZM12 6H36V12H12V6ZM24.4969 18H23.4938C22.9406 18 22.4906 18.45 22.4906 19.0031V21H17.9906V15H29.9906V21H25.4906V19.0031C25.5 18.45 25.05 18 24.4969 18ZM12 33H6V24H12V33ZM15 21H9V15H15V21ZM25.5 33H22.5V30.4969C22.5 30.2156 22.725 30 22.9969 30H24.9938C25.275 30 25.4906 30.225 25.4906 30.4969V33H25.5ZM33 33H28.5V30.4969C28.5 28.5656 26.925 27 25.0031 27H23.0062C21.075 27 19.5094 28.575 19.5094 30.4969V33H15.0094V24H33.0094V33H33ZM33 21V15H39V21H33ZM42 33H36V24H42V33Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Architecture Review</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Our experienced DevOps will advise you on how to create and
                  help you set up a stable and secure infrastructure that will
                  support your digital products.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M47.7386 25.7812C45.7754 21.3638 43.1973 11.5566 40.8873 8.27344C37.2826 3.15 31.3651 0 24.9461 0H18.7511C8.95044 0 0.386379 7.5075 0.0132541 17.3016C-0.199558 22.9059 2.16575 27.9506 6.00013 31.3894V47.25C6.00013 47.6644 6.33575 48 6.75013 48H8.25013C8.6645 48 9.00013 47.6644 9.00013 47.25V30.0506L8.00263 29.1562C4.66044 26.1591 2.84075 21.8794 3.01044 17.4159C3.31419 9.46688 10.3745 3 18.7511 3H24.9461C30.3076 3 35.3495 5.61656 38.4329 9.99938C39.6067 11.6681 41.162 16.2562 42.4126 19.9434C43.3248 22.635 44.1873 25.1775 44.9973 27H39.0001V36C39.0001 37.6538 37.6539 39 36.0001 39H27.0001V47.25C27.0001 47.6644 27.3358 48 27.7501 48H29.2501C29.6645 48 30.0001 47.6644 30.0001 47.25V42H36.0001C39.3142 42 42.0001 39.3141 42.0001 36V30H44.9964C47.1676 30 48.6198 27.765 47.7386 25.7812ZM33.0001 18C33.0001 16.3434 31.6567 15 30.0001 15C28.3436 15 27.0001 16.3434 27.0001 18C27.0001 19.6566 28.3436 21 30.0001 21C31.6567 21 33.0001 19.6566 33.0001 18Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Staff Augmentation</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Build an organizational culture that supports innovation,
                  introduce coding standards, show you tools and processes to
                  help you grow sustainably in the future.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 text-white">
                  <svg
                    width="60"
                    height="48"
                    viewBox="0 0 60 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.35 16.5564L30.1406 9.4127C30.4219 9.15957 30.7781 9.01895 31.1531 9.01895H40.6219C41.025 9.01895 41.4 9.17832 41.6906 9.46895L47.3812 15.0096H59.25C59.6625 15.0096 60 14.6721 60 14.2596V12.7596C60 12.3471 59.6625 12.0096 59.25 12.0096H48.6094L43.8094 7.33145C42.9562 6.47832 41.8312 6.00957 40.6312 6.00957H31.1625C30.1875 6.00957 29.2781 6.3752 28.5094 6.94707C27.7219 6.3377 26.7562 5.98145 25.7625 5.98145H19.2469C18.0562 5.98145 16.9125 6.45957 16.0594 7.30332L11.3813 12.0002H0.75C0.3375 12.0002 0 12.3377 0 12.7502V14.2502C0 14.6627 0.3375 15.0002 0.75 15.0002H12.6188L18.1781 9.44082C18.4594 9.15957 18.8438 9.0002 19.2375 9.0002H25.7531C25.8375 9.20645 25.7812 9.06582 25.8562 9.27207L20.325 14.3439C17.6812 16.7721 17.55 20.8314 19.9313 23.4283C21.2719 24.8908 25.425 27.1127 29.0156 23.8221L31.1531 21.8627L42.9281 31.4158C43.5656 31.9314 43.6688 32.8877 43.1438 33.5252L42.2531 34.6221C41.7469 35.2408 40.8094 35.3814 40.1438 34.8377L38.475 33.4877L34.5844 38.269C33.8812 39.1408 32.6156 39.2252 31.8281 38.5877L28.9594 36.1408L27.9844 37.3408C26.4188 39.2627 23.5781 39.5627 21.7406 38.0815L13.3125 30.0096H0.75C0.3375 30.0096 0 30.3471 0 30.7596V32.2596C0 32.6721 0.3375 33.0096 0.75 33.0096H12.1125L19.7531 40.3221C22.5469 42.5815 26.4844 42.5158 29.2219 40.3033L29.8969 40.8846C30.7969 41.6158 31.8937 42.0002 33.0375 42.0002C34.5375 42.0002 35.9531 41.3439 36.9187 40.1627L38.9719 37.6408C40.5094 38.4752 42.9938 38.4846 44.5969 36.5158L45.4875 35.4189C46.0688 34.7064 46.3875 33.8627 46.4719 33.0096H59.25C59.6625 33.0096 60 32.6721 60 32.2596V30.7596C60 30.3471 59.6625 30.0096 59.25 30.0096H45.6375C45.4031 29.6814 45.1406 29.3627 44.8125 29.0908L33.3844 19.8096L36.0469 17.3627C36.6562 16.8002 36.7031 15.8533 36.1406 15.2439C35.5781 14.6346 34.6312 14.5971 34.0219 15.1502L26.9812 21.6002C25.6312 22.8283 23.3625 22.7252 22.1344 21.3939C20.8688 20.0158 20.9531 17.8408 22.35 16.5564Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Coaching</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Depending on your individual needs, we use a variety of
                  techniques and tools to help you achieve your business goals.
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
                <span className="font-normal">Javascript Development</span>
              </h2>
              <p className="text-sm lg:text-base text-white/80 max-w-3xl mx-auto pt-4 !leading-[1.6]">
                To deliver products of the highest quality, we follow Extreme
                Programming best practices that include code review, pair
                programming, test-driven development, continuous integration,
                and automated testing. See what you get with us:
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
                      d="M47.5709 10.7336C47.3515 9.84575 46.6652 9.14169 45.784 8.89513C44.8962 8.65044 43.9418 8.89513 43.2855 9.5495L37.2977 15.5373L33.1493 14.8473L32.4574 10.6998L38.4452 4.712C39.0959 4.06325 39.3471 3.10982 39.1015 2.22388C38.8559 1.33607 38.1462 0.646066 37.2499 0.423878C32.4002 -0.778934 27.3705 0.613253 23.8259 4.15325C20.2784 7.70357 18.9312 12.827 20.2052 17.7189L2.08055 35.8398C-0.693516 38.6176 -0.693516 43.1364 2.08055 45.9133C3.42586 47.2586 5.21555 48.0001 7.11961 48.0001C9.02367 48.0001 10.8105 47.2586 12.1549 45.9133L30.2618 27.8092C35.1396 29.0964 40.2743 27.7417 43.8452 24.1698C47.3899 20.6251 48.784 15.602 47.5709 10.7336ZM41.7246 22.0492C38.7368 25.0314 34.3718 26.0458 30.3087 24.6958L29.4293 24.4014L10.0343 43.7926C8.47617 45.3508 5.76023 45.3508 4.20211 43.7926C2.59711 42.1858 2.59711 39.5683 4.20211 37.9604L23.6093 18.5561L23.3196 17.6804C21.978 13.607 22.9859 9.23732 25.9474 6.27388C28.0765 4.14388 30.8852 3.00013 33.8027 3.00013C34.4468 3.00013 35.0974 3.05544 35.7452 3.16982L29.2474 9.67138L30.5421 17.4545L38.329 18.7501L44.8259 12.2486C45.4559 15.8345 44.3252 19.4476 41.7246 22.0492ZM7.50023 39.0001C6.67148 39.0001 6.00023 39.6714 6.00023 40.5001C6.00023 41.3289 6.67148 42.0001 7.50023 42.0001C8.32898 42.0001 9.00023 41.3289 9.00023 40.5001C9.00023 39.6714 8.32898 39.0001 7.50023 39.0001Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Modularity</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Develop new features in Javascript without rewriting existing
                  code. Embrace the agile approach with Javascript components.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="60"
                    height="48"
                    viewBox="0 0 60 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24.9694 26.0297L26.0297 24.9694C26.3222 24.6769 26.3222 24.2016 26.0297 23.9091L21.6206 19.5L26.0297 15.0909C26.3222 14.7984 26.3222 14.3231 26.0297 14.0306L24.9694 12.9703C24.6769 12.6778 24.2016 12.6778 23.9091 12.9703L17.9091 18.9703C17.6166 19.2628 17.6166 19.7381 17.9091 20.0306L23.9091 26.0306C24.2025 26.3231 24.6769 26.3231 24.9694 26.0297ZM33.9694 24.9694L35.0297 26.0297C35.3222 26.3222 35.7975 26.3222 36.09 26.0297L42.09 20.0297C42.3825 19.7372 42.3825 19.2619 42.09 18.9694L36.09 12.9694C35.7975 12.6769 35.3222 12.6769 35.0297 12.9694L33.9694 14.0297C33.6769 14.3222 33.6769 14.7975 33.9694 15.09L38.3794 19.5L33.9703 23.9091C33.9006 23.9786 33.8453 24.0612 33.8075 24.1521C33.7697 24.2431 33.7502 24.3406 33.7501 24.439C33.75 24.5375 33.7693 24.635 33.807 24.726C33.8446 24.817 33.8998 24.8997 33.9694 24.9694ZM58.5 34.5H54V9C54 5.69063 51.3075 3 48 3H12C8.6925 3 6 5.69063 6 9V34.5H1.5C0.67125 34.5 0 35.1712 0 36V40.5C0 44.6353 3.36375 48 7.5 48H52.5C56.6362 48 60 44.6353 60 40.5V36C60 35.1712 59.3288 34.5 58.5 34.5ZM9 9C9 7.34344 10.3434 6 12 6H48C49.6566 6 51 7.34344 51 9V34.5H36.6684C36.2878 34.5 36.0103 34.7934 35.9259 35.1647C35.6231 36.5016 34.4278 37.5 33 37.5H27C25.5722 37.5 24.3769 36.5016 24.0741 35.1647C23.9897 34.7934 23.7122 34.5 23.3316 34.5H9V9ZM57 40.5C57 42.9816 54.9816 45 52.5 45H7.5C5.01844 45 3 42.9816 3 40.5V37.5H21.2578C21.8756 39.2456 23.5434 40.5 25.5 40.5H34.5C36.4575 40.5 38.1244 39.2456 38.7422 37.5H57V40.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Test-driven Development</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  All sprints will have user testing built in, so we check our
                  work and thinking as we progress.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="54"
                    height="48"
                    viewBox="0 0 54 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.3344 18H25.5V23.25C25.5 23.6625 25.8375 24 26.25 24H27.75C28.1625 24 28.5 23.6625 28.5 23.25V18H30.6656C38.5688 18 45 10.5938 45 1.5V0H39.8344C34.2094 0 29.3438 3.75937 27 9.19687C24.6562 3.75937 19.7906 0 14.1656 0H9V1.5C9 10.5938 15.4312 18 23.3344 18ZM39.8344 3H41.9344C41.3062 9.74063 36.4969 15 30.675 15H28.575C29.1937 8.25937 34.0125 3 39.8344 3ZM14.1656 3C19.9875 3 24.7969 8.25937 25.425 15H23.325C17.5031 15 12.6937 9.74063 12.0656 3H14.1656ZM52.3406 31.275C51.4406 30.4688 50.2687 30.0188 49.0406 30.0188C47.8687 30.0188 46.7156 30.4219 45.7969 31.1625L40.0219 35.7844C39.8438 35.925 39.6281 36 39.3938 36H35.4938C35.925 35.1 36.1031 34.0594 35.9437 32.9719C35.5687 30.3563 33.1688 28.5 30.525 28.5H16.9969C15.0469 28.5 13.1531 29.1281 11.5969 30.3L7.99688 33H0.75C0.3375 33 0 33.3375 0 33.75V35.25C0 35.6625 0.3375 36 0.75 36H9L13.3969 32.7C14.4375 31.9219 15.7031 31.5 16.9969 31.5H30.75C31.9969 31.5 33 32.5031 33 33.75C33 34.9969 31.9969 36 30.75 36H22.5C21.675 36 21 36.675 21 37.5C21 38.325 21.675 39 22.5 39H39.3938C40.3031 39 41.1844 38.6906 41.8969 38.1281L47.6719 33.5156C48.0656 33.1969 48.5625 33.0281 49.0406 33.0281C49.5094 33.0281 49.9688 33.1875 50.3344 33.5156C51.2813 34.3688 51.2062 35.8125 50.25 36.5719L40.8 44.1375C40.0875 44.7094 39.2062 45.0094 38.2969 45.0094H0.75C0.3375 45.0094 0 45.3469 0 45.7594V47.2594C0 47.6719 0.3375 48.0094 0.75 48.0094H38.2969C39.8906 48.0094 41.4281 47.4656 42.6656 46.4719L52.125 38.9062C53.2687 37.9875 53.9531 36.6188 54 35.1562C54.0469 33.6937 53.4375 32.2687 52.3406 31.275Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Optimum Speed</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Modify and deliver products at start-up speed with modular
                  components that can be changed without breaking others.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white flex items-center">
                  <svg
                    width="42"
                    height="48"
                    viewBox="0 0 42 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M39.75 42H36.3187L23.1684 4.00969C23.0664 3.71475 22.875 3.45897 22.6207 3.27798C22.3665 3.097 22.0621 2.99983 21.75 3H20.25C19.9381 3.00002 19.6339 3.09728 19.3799 3.27825C19.1258 3.45922 18.9345 3.7149 18.8325 4.00969L5.68125 42H2.25C2.05109 42 1.86032 42.079 1.71967 42.2197C1.57902 42.3603 1.5 42.5511 1.5 42.75V44.25C1.5 44.4489 1.57902 44.6397 1.71967 44.7803C1.86032 44.921 2.05109 45 2.25 45H12.75C12.9489 45 13.1397 44.921 13.2803 44.7803C13.421 44.6397 13.5 44.4489 13.5 44.25V42.75C13.5 42.5511 13.421 42.3603 13.2803 42.2197C13.1397 42.079 12.9489 42 12.75 42H8.8575L13.0106 30H28.9894L33.1434 42H29.25C29.0511 42 28.8603 42.079 28.7197 42.2197C28.579 42.3603 28.5 42.5511 28.5 42.75V44.25C28.5 44.4489 28.579 44.6397 28.7197 44.7803C28.8603 44.921 29.0511 45 29.25 45H39.75C39.9489 45 40.1397 44.921 40.2803 44.7803C40.421 44.6397 40.5 44.4489 40.5 44.25V42.75C40.5 42.5511 40.421 42.3603 40.2803 42.2197C40.1397 42.079 39.9489 42 39.75 42ZM14.0494 27L21 6.91875L27.9506 27H14.0494Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">High Performance</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Javascript performs updates of the browser content only when
                  necessary. Composable architecture makes even the most complex
                  remain highly interactive.
                </p>
              </div>

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
                      d="M47.1293 34.5131L35.614 22.9978L40.2453 18.3666L46.6812 11.9297C48.44 10.1709 48.439 7.32 46.6812 5.56125L42.439 1.31906C41.5597 0.439687 40.4065 0 39.2543 0C38.1022 0 36.949 0.439687 36.0697 1.31906L29.6337 7.75406L25.0025 12.3853L13.4881 0.870937C12.9078 0.290625 12.1465 0 11.3853 0C10.624 0 9.86373 0.290625 9.28248 0.870937L0.873102 9.28125C-0.287523 10.4428 -0.288461 12.3253 0.873102 13.4869L12.3856 24.9994L1.79091 35.5931L0.0321641 45.6666C-0.222836 47.1319 1.08404 48.1884 2.33748 47.9691L12.41 46.2028L22.9981 35.6128L34.5134 47.1281C34.7891 47.4046 35.1168 47.6238 35.4775 47.7733C35.8382 47.9227 36.2248 47.9995 36.6153 47.9991C37.3765 47.9991 38.1378 47.7084 38.7181 47.1281L47.1293 38.7188C48.2909 37.5572 48.2909 35.6747 47.1293 34.5131ZM38.1903 3.44063C38.5737 3.05719 39.934 3.05719 40.3175 3.44063L44.5597 7.68188C45.1456 8.26781 45.1456 9.22125 44.5597 9.80719L40.2444 14.1225L33.875 7.75312L38.1903 3.44063ZM2.99373 11.4028L11.3853 3.01031L16.6306 8.25L12.9715 11.9091C12.679 12.2016 12.679 12.6769 12.9715 12.9694L14.0319 14.0297C14.3244 14.3222 14.7997 14.3222 15.0922 14.0297L18.7522 10.3697L22.8865 14.4994L14.4959 22.8891L2.99373 11.4028ZM10.9587 43.4119L3.23466 44.7666L4.58185 37.0444L31.7534 9.87562L38.1228 16.245L10.9587 43.4119ZM36.635 45.0075L25.1169 33.495L33.5047 25.1062L37.6409 29.2378L33.9706 32.9091C33.6781 33.2016 33.6781 33.6769 33.9706 33.9694L35.0309 35.0297C35.3234 35.3222 35.7987 35.3222 36.0912 35.0297L39.7634 31.3575L45.0078 36.5962L36.635 45.0075Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Versatility</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Javascript is great for building interfaces regardless of
                  application&apos;s size and complexity. It has the flexibility
                  to integrate with several other tools.
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-10 w-10 text-white">
                  <svg
                    width="60"
                    height="48"
                    viewBox="0 0 60 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M58.2469 19.2469L52.7625 13.7625C51.6375 12.6375 50.1094 12.0094 48.5156 12.0094H43.5V6C43.5 4.34062 42.1594 3 40.5 3H3C1.34062 3 0 4.34062 0 6V37.5C0 41.6438 3.35625 45 7.5 45C9.96562 45 12.1312 43.7906 13.5 41.9625C14.8688 43.8 17.0344 45 19.5 45C23.6438 45 27 41.6438 27 37.5C27 36.9844 26.9437 36.4875 26.85 36H42.15C42.0469 36.4875 42 36.9844 42 37.5C42 41.6438 45.3562 45 49.5 45C53.6438 45 57 41.6438 57 37.5C57 36.9844 56.9438 36.4875 56.85 36H58.5C59.325 36 60 35.325 60 34.5V23.4844C60 21.8906 59.3719 20.3719 58.2469 19.2469ZM7.5 42C5.01562 42 3 39.9844 3 37.5C3 35.0156 5.01562 33 7.5 33C9.98438 33 12 35.0156 12 37.5C12 39.9844 9.98438 42 7.5 42ZM19.5 42C17.0156 42 15 39.9844 15 37.5C15 35.0156 17.0156 33 19.5 33C21.9844 33 24 35.0156 24 37.5C24 39.9844 21.9844 42 19.5 42ZM40.5 33H25.4625C24.0938 31.1906 21.9469 30 19.5 30C17.0531 30 14.9062 31.1906 13.5375 33H13.4719C12.0937 31.1906 9.9375 30 7.5 30C5.80312 30 4.25625 30.5812 3 31.5375V6H40.5V33ZM43.5 15H48.5156C49.3125 15 50.0719 15.3094 50.6344 15.8812L55.7531 21H43.5V15ZM49.5 42C47.0156 42 45 39.9844 45 37.5C45 35.0156 47.0156 33 49.5 33C51.9844 33 54 35.0156 54 37.5C54 39.9844 51.9844 42 49.5 42ZM57 33H55.4625C54.0937 31.1906 51.9469 30 49.5 30C47.0531 30 44.9062 31.1906 43.5375 33H43.5V24H57V33Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Ecosystem</h3>
                <p className="text-xs text-white/80 !leading-[1.6]">
                  Javascript&apos;s ecosystem is one of the most rapidly growing
                  open-source environments in web development history.
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
              Driving business value with the best technological innovations for
              our enterprise clients. Browse the work to find out how you can
              transform your business with technology.
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
                  <span className="font-normal">
                    For Javascript Development
                  </span>
                </h2>
                <p className="text-sm lg:text-base text-white/80 pt-2 !leading-[1.6]">
                  To deliver products of the highest quality, we follow Extreme
                  Programming best practices that include code review, pair
                  programming, test-driven development, continuous integration,
                  and automated testing. See what you get with us:
                </p>
              </div>

              <div className="space-y-6 lg:pt-8 w-full">
                {[
                  "Full suite of services",
                  "Unrivaled Javascript knowledge",
                  "Quality and best practices baked in",
                  "Deep Javascript community involvement",
                  "Support for Javascript's ongoing development",
                  "Hired by Fortune 500 brands",
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
                  JavaScript (JS) is a lightweight, interpreted, or just-in-time
                  compiled programming language with first-class functions. It
                  is the most well-known scripting language for Web pages.
                </p>
              </div>

              <div className="lg:col-span-2 w-full space-y-0 divide-y divide-white/20">
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>
                      What are the advantages of developing web apps with
                      Javascript?
                    </span>
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
                    Javascript allows for faster development, rich user
                    interfaces, and can be used for both frontend and backend
                    (Node.js), unifying the development stack.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>
                      How can Javascript development benefit my existing system?
                    </span>
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
                    It can improve interactivity, performance, and allow for
                    gradual modernization of legacy systems through
                    micro-frontends or API layers.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>What is the future of Javascript?</span>
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
                    Javascript continues to evolve with TypeScript, new
                    frameworks, and better tooling, remaining the dominant
                    language for web and increasingly mobile/desktop apps.
                  </p>
                </details>
                <details className="group py-6 cursor-pointer border-b border-white/20">
                  <summary className="flex justify-between items-center font-medium list-none text-lg lg:text-xl">
                    <span>
                      How much does it cost to hire Javascript developers?
                    </span>
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
                    Costs vary based on seniority and location. We offer
                    flexible engagement models tailored to your budget and
                    project requirements.
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
              DPA partners with clients from startups to global MNCs to create
              solutions to the toughest software problems. Focusing on
              JavaScript as our core technology, we utilize ReactJS, React
              Native, NodeJS, GraphQL, and the extended JavaScript ecosystem to
              build web apps, mobile apps, cloud services, open source software,
              and more. Our approach is tailored to each product, so we will
              always work with your team to select the technologies best suited
              to your needs. We excel in web, mobile and cloud platform
              development and can apply our expertise to your product, no matter
              where it is in the product lifecycle.
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
            src="/png/bottom-banner-engineers.png"
            alt="Asian software engineers coding"
            fill
            quality={100}
            className="object-cover"
          />
          {/* Gradient from top (solid red covering ~30%) to transparent at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#db1222]  to-transparent z-10"></div>
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
