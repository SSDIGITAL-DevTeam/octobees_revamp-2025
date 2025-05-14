'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { Instagram } from 'iconsax-react';
import ContactForm from '@/components/partials/ContactForm/ContactForm';

export default function ContactUs(): JSX.Element {
  return (
    <main className="">
      <header className="flex flex-col overflow-x-hidden py-[50px] lg:pt-[80px] bg-[#F2EDE6]">
        <div className="container flex flex-col items-center justify-center py-20 md:px-10">
          <div className="flex flex-col w-full gap-y-10 items-center justify-center">
            <div className="flex flex-col text-center gap-y-7 w-full max-w-[36rem]">
              <div className="flex flex-col text-center gap-y-3">
                <h2 className="font-body font-semibold text-secondary md:text-lg tracking-wider">
                  Octobees <span className="text-dark">• Contact Us</span>
                </h2>
                <h1 className="font-heading font-medium text-dark text-4xl md:text-6xl">Contact Us</h1>
              </div>
              <p className="">Get in touch and ask us anything - we&apos;ll answer it all.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </header>

      <section className="flex flex-col overflow-x-hidden bg-white py-10">
        <div className="container flex flex-col items-center justify-center py-12 md:px-10">
          <div className="flex flex-col w-full gap-y-2 items-center justify-center">
            <div className="flex flex-col text-center gap-y-6 w-full max-w-[39rem]">
              <h1 className="font-heading font-medium text-dark text-4xl md:text-5xl !leading-[120%] max-w-3xl">Get in touch with <br /><span>OCTOBEES</span></h1>
            </div>
            <div className="mt-3 lg:mt-12 flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 gap-x-0 lg:gap-x-7 w-full h-full">
            <iframe
             src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d995.5112568363255!2d98.66427102671983!3d3.5771250695232992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zM8KwMzQnMzguOCJOIDk4wrAzOSc1Mi41IkU!5e0!3m2!1sen!2sid!4v1745895995734!5m2!1sen!2sid"
                className="w-full min-h-[420px] lg:max-h-[490px] rounded-3xl border-0"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-col py-8 px-10 gap-y-14 lg:gap-y-24 bg-primary w-full lg:w-2/5 rounded-3xl">
                <div className="flex flex-col gap-y-5">
                  <Link href="https://maps.app.goo.gl/37qh1YHpkE9g1XJ86" className="flex flex-col gap-y-2">
                    <h3 className="text-base text-gray-300">Operation Office</h3>
                    <h2 className="text-xl text-white font-semibold">Medan - Yogyakarta</h2>
                  </Link>
                  <div className="flex flex-col gap-y-2">
                    <h3 className="text-base text-gray-300">Regional Partner</h3>
                    <h2 className="text-xl text-white font-semibold">Singapore</h2>
                  </div>
                  <Link href="mailto:contact@octobees.com" className="flex flex-col gap-y-2">
                    <h3 className="text-base text-gray-300">Email address</h3>
                    <h2 className="text-xl text-white font-semibold">contact@octobees.com</h2>
                  </Link>
                </div>
                <div className="flex flex-row gap-x-5">
                  <Link href="https://www.instagram.com/octobees.id/" className="bg-white p-3 rounded-full">
                    <Instagram size="30" className='text-primary' variant="Bold" />
                  </Link>
                  <Link href="https://www.linkedin.com/company/octobees/" className="bg-white p-3 rounded-full">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21.6287 2.8125H8.37125C6.89698 2.8125 5.48309 3.39815 4.44062 4.44062C3.39815 5.48309 2.8125 6.89698 2.8125 8.37125V21.6287C2.8125 23.103 3.39815 24.5169 4.44062 25.5594C5.48309 26.6018 6.89698 27.1875 8.37125 27.1875H21.6287C23.103 27.1875 24.5169 26.6018 25.5594 25.5594C26.6018 24.5169 27.1875 23.103 27.1875 21.6287V8.37125C27.1875 6.89698 26.6018 5.48309 25.5594 4.44062C24.5169 3.39815 23.103 2.8125 21.6287 2.8125ZM11.0538 22.49C11.0577 22.558 11.0476 22.6262 11.0243 22.6902C11.0009 22.7542 10.9647 22.8128 10.9179 22.8623C10.871 22.9118 10.8146 22.9512 10.752 22.9781C10.6894 23.005 10.6219 23.0189 10.5538 23.0188H8.32875C8.19457 23.0155 8.06703 22.9597 7.97354 22.8634C7.88004 22.7671 7.82806 22.638 7.82875 22.5037V13.25C7.82691 13.1832 7.83849 13.1167 7.86279 13.0544C7.88709 12.9922 7.92363 12.9354 7.97024 12.8875C8.01686 12.8396 8.0726 12.8016 8.13418 12.7756C8.19575 12.7496 8.26192 12.7362 8.32875 12.7362H10.5538C10.6206 12.7362 10.6867 12.7496 10.7483 12.7756C10.8099 12.8016 10.8656 12.8396 10.9123 12.8875C10.9589 12.9354 10.9954 12.9922 11.0197 13.0544C11.044 13.1167 11.0556 13.1832 11.0538 13.25V22.49ZM9.4 10.79C9.15911 10.7882 8.92093 10.739 8.69906 10.6451C8.4772 10.5513 8.27599 10.4146 8.10693 10.243C7.93787 10.0714 7.80426 9.86815 7.71375 9.64491C7.62323 9.42166 7.57757 9.18277 7.57937 8.94187C7.58118 8.70098 7.63042 8.4628 7.72427 8.24094C7.81812 8.01907 7.95476 7.81786 8.12637 7.6488C8.29799 7.47974 8.50122 7.34614 8.72447 7.25562C8.94772 7.1651 9.18661 7.11944 9.4275 7.12125C9.90565 7.1368 10.3588 7.33859 10.6902 7.68357C11.0217 8.02855 11.2052 8.4894 11.2016 8.96779C11.198 9.44617 11.0076 9.90422 10.671 10.2442C10.3344 10.5842 9.87833 10.7791 9.4 10.7875M22.9212 22.475C22.9207 22.6013 22.8711 22.7224 22.7829 22.8129C22.6948 22.9034 22.575 22.9561 22.4487 22.96H20.1C19.9735 22.9561 19.8535 22.9032 19.7654 22.8125C19.6772 22.7217 19.6278 22.6003 19.6275 22.4738V18.1938C19.6275 17.555 19.8225 15.415 17.9325 15.415C16.4587 15.415 16.1675 16.915 16.1112 17.5825V22.5712C16.1113 22.698 16.062 22.8198 15.9738 22.9108C15.8856 23.0018 15.7654 23.0549 15.6388 23.0588H13.36C13.2309 23.0584 13.1072 23.0069 13.0161 22.9155C12.9249 22.8241 12.8737 22.7003 12.8737 22.5712V13.205C12.8776 13.0783 12.9307 12.9581 13.0217 12.8699C13.1127 12.7817 13.2345 12.7324 13.3612 12.7325H15.6388C15.7655 12.7324 15.8873 12.7817 15.9783 12.8699C16.0693 12.9581 16.1224 13.0783 16.1263 13.205V14.0112C16.4588 13.5245 16.9179 13.1378 17.4541 12.8929C17.9902 12.6479 18.5831 12.554 19.1688 12.6213C22.9625 12.6213 22.9487 16.165 22.9487 18.18L22.9212 22.475Z"
                        fill="#B3000B"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
