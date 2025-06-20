'use client';

import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function ButtonFloatingCTA(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const footer = document.getElementById('footer');
      const footerRect = footer?.getBoundingClientRect();

      // Memeriksa jika scroll telah melewati 700px
      if (window.pageYOffset >= 700) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Memeriksa apakah footer terlihat di viewport
      if (footerRect && footerRect.top < window.innerHeight) {
        setIsFooterVisible(true);
      } else {
        setIsFooterVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && !isFooterVisible && (
        <aside id="float-button" aria-label='Quick Button' className={`fixed bottom-3 right-3 lg:bottom-7 lg:right-7 z-[51] flex justify-center items-center p-4 transition-transform duration-300 transform ${isVisible ? 'translate-y-0 animate-slide-up' : 'translate-y-full animate-slide-down'} z-50`}>
          <div className="bg-white rounded-full shadow-lg overflow-hidden px-4 py-3 hidden md:block">
            <div className="flex flex-row gap-x-3">
              <Link
                href="/increase-my-sales"
                aria-label="Go to increase my sales page"
                className="bg-primary border-2 flex gap-3 border-primary px-10 md:px-12 py-3 lg:py-4 font-semibold text-light rounded-full text-sm lg:text-xl xl:text-xl whitespace-nowrap transition-colors duration-300 hover:bg-red-800"
              >
                Increase Your Sales <Rocket/>
              </Link>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
