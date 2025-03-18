'use client';

import { JSX } from 'react';
import Link from 'next/link';
import LogoLight from '@/components/partials/Logo/LogoLight';

import { Instagram, Call } from 'iconsax-react';

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#212833]" id="footer">
      <div className="flex flex-col container pt-[60px] pb-[30px] px-10 items-center justify-center gap-y-14">
        <div className="flex flex-col gap-y-6 items-center lg:items-start w-full">
          <LogoLight />
          <div className="flex flex-col-reverse gap-y-6 lg:gap-y-0 lg:flex-row justify-between items-center w-full">
            <p className="text-light text-base text-center lg:text-left lg:w-[30%]">Your personal digital sales assistant & The ultimate sales ecosystem</p>
            <div className="flex flex-row gap-x-3 items-center">
              <Link href="tel:+6289515216251" className="text-light">
                <Call variant="Bold" className='w-5 h-5 lg:w-10 lg:h-10' />
              </Link>
              <Link href="https://www.instagram.com/octobees.id/" className="text-light">
                <Instagram variant="Bold" className='w-5 h-5 lg:w-10 lg:h-10' />
              </Link>
              <Link href="https://www.linkedin.com/company/octobees/" className="text-light">
                <svg className='w-5 h-5 lg:w-10 lg:h-10' viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.1667 24.5H10.5V10.5H15.1667V12.8333C16.1614 11.5678 17.6699 10.8133 19.2792 10.7765C22.1732 10.7926 24.5084 13.1476 24.5 16.0417V24.5H19.8333V16.625C19.6467 15.3214 18.5287 14.3542 17.2118 14.357C16.6358 14.3752 16.0921 14.6274 15.7062 15.0554C15.3202 15.4834 15.1254 16.0502 15.1667 16.625V24.5ZM8.16667 24.5H3.5V10.5H8.16667V24.5ZM5.83333 8.16667C4.54467 8.16667 3.5 7.122 3.5 5.83333C3.5 4.54467 4.54467 3.5 5.83333 3.5C7.122 3.5 8.16667 4.54467 8.16667 5.83333C8.16667 6.45217 7.92083 7.04566 7.48325 7.48325C7.04566 7.92083 6.45217 8.16667 5.83333 8.16667Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <p className="text-xs lg:text-sm text-light text-center">Copyright © 2023 - {year} Octobees. All rights reserved</p>
      </div>
    </footer>
  );
}
