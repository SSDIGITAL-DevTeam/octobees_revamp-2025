'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';
import { usePathname } from 'next/navigation';
import { NavLink, navLinks } from '@/constants/navlinks';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Logo from '@/components/partials/Logo/Logo';
// import axios from 'axios'
import { axiosInstance } from '@/lib/axios';

export default function Navbar() {
  const [toggle, setToggle] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const matches = useMediaQuery('(min-width: 1024px)');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [linkNav, setLinkNav] = useState([]);


  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axiosInstance.get('/service-category',{
          params : {status : "Active"}
        });
        setLinkNav(response.data.data);
      }
      catch (e) {
        console.log(e)
      }
    }
    fetchPlan();
  }, [pathname])


  const renderSubMenu = linkNav?.map((item: any) => ({
    name: item?.name,
    path: `/plans/${item?.slug}`
  }))

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        if (currentScrollY > 0 && currentScrollY <= 800 && scrollDirection === 'down') {
          setIsVisible(false);
        } else if (currentScrollY >= 800 && scrollDirection === 'down') {
          setIsVisible(true);
        } else if (scrollDirection === 'up') {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, scrollDirection]);

  const NavbarColor = 'bg-light shadow-sm';
  const NavbarPosition = isVisible ? 'top-0' : '-top-full';

  if (!isClient) {
    return null;
  }

  const handleMenuItemClick = () => {
    setToggle(false);
    setOpenDropdown(null);
  };

  return (
    <nav className={`${NavbarColor} ${NavbarPosition} fixed left-0 right-0 w-full z-[100] transition-all duration-700 ease-out`}>
      <div className="max-w-7xl py-7 mx-auto px-7 md:px-2 flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Logo />
        </Link>


        {matches && (
          <div className="flex justify-between items-center flex-grow mx-4">
            <div className="flex-grow" />
            <div className="flex gap-x-3 justify-center py-2 px-4 rounded-full shadow-sm border-border border-[1px]">
              {navLinks.slice(0, 4).map((navlink: NavLink, index: number) => (
                <div key={index} className="relative group rounded-full" ref={dropdownRef}>
                  <Link
                    href={navlink.path || '#'}
                    onClick={(e) => {
                      if (navlink.menus) {
                        e.preventDefault();
                        handleDropdownToggle(navlink.name);
                      }
                    }}
                    className={`flex items-center gap-1 text-lg px-4 py-1 rounded-lg transition-colors duration-300 ${pathname === navlink.path ? 'text-primary/80 font-semibold' : 'text-dark'} hover:bg-gray-500/5 hover:text-primary `}
                  >
                    {navlink.name}
                    {navlink.menus && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === navlink.name ? 'rotate-180' : ''}`} />}
                  </Link>

                  {navlink.menus && (
                    <AnimatePresence>
                      {openDropdown === navlink.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        >
                          <div className="py-1">
                            {renderSubMenu.map((submenu, subIndex) => (
                              <Link
                                key={subIndex}
                                href={submenu.path}
                                className={`block px-4 py-2 text-base hover:bg-gray-100 hover:text-gray-900 ${pathname === submenu.path ? 'text-primary font-medium' : 'text-gray-700'}`}
                                onClick={handleMenuItemClick}
                              >
                                {submenu.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-grow" />
          </div>
        )}

        {matches && (
          <Link href="/contact-us" className="bg-primary py-3 px-8 text-light font-semibold rounded-full hover:bg-[#EB9085] transition-colors duration-300 flex-shrink-0">
            Contact us
          </Link>
        )}

        {!matches && (
          <div className="space-y-1.5 cursor-pointer z-50" onClick={() => setToggle((prevToggle) => !prevToggle)}>
            <motion.span animate={{ rotateZ: toggle ? 45 : 0, y: toggle ? 8 : 0 }} className="block h-0.5 w-8 bg-dark" />
            <motion.span animate={{ width: toggle ? 0 : 32 }} className="block h-0.5 w-8 bg-dark" />
            <motion.span animate={{ rotateZ: toggle ? -45 : 0, y: toggle ? -8 : 0 }} className="block h-0.5 w-8 bg-dark" />
          </div>
        )}

        <AnimatePresence>
          {!matches && toggle && (
            <motion.div
              className="fixed inset-0 z-40 bg-light flex justify-center items-center h-[100vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-y-4 text-dark">
                {navLinks.map((navlink: NavLink, index: number) => (
                  <div key={index}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                      {navlink.menus ? (
                        <>
                          <div className={`flex items-center gap-1 text-lg cursor-pointer ${openDropdown === navlink.name ? 'text-dark font-bold' : 'text-dark'}`} onClick={() => handleDropdownToggle(navlink.name)}>
                            {navlink.name}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === navlink.name ? 'rotate-180' : ''}`} />
                          </div>
                          <AnimatePresence>
                            {openDropdown === navlink.name && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                <div className="pt-2 pl-4">
                                  {renderSubMenu.map((submenu, subIndex) => (
                                    <Link key={subIndex} href={submenu.path} className={`block py-2 text-sm hover:text-gray-900 ${pathname === submenu.path ? 'text-primary font-medium' : 'text-gray-700'}`} onClick={handleMenuItemClick}>
                                      {submenu.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link href={navlink.path || '#'} className={`text-lg hover:font-bold transition-all duration-300 ${pathname === navlink.path ? 'text-dark font-bold' : 'text-dark'}`} onClick={handleMenuItemClick}>
                          {navlink.name}
                        </Link>
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
