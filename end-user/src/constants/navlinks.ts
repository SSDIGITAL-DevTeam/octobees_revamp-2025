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
    name: 'Career',
    path: '/career',
  },
  {
    name: 'Plans',
    path: '/plans',
    menus: [""],
  },
  {
    name: 'Contact Us',
    path: '/contact-us',
  },
];
