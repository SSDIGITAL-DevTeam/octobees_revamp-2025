export type NavLink = {
  name: string;
  path?: string;
  menus?: string[];
};

export const navLinks: NavLink[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Insights',
    path: '/insights',
  },
  {
    name: 'Plans',
    menus: [""],
  },
  {
    name: 'Contact us',
    path: '/contact-us',
  },
];
