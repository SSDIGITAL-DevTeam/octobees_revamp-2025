export type Submenus = {
  name: string;
  path: string;
};

export type Menus = {
  name: string;
  submenu: Submenus[];
};

export type NavLink = {
  name: string;
  path?: string;
  menus?: Menus[];
  hidden?: boolean;
};

export const navLinks: NavLink[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Services",
    path: "/services",
    menus: [
      {
        name: "AI Solutions",
        submenu: [
          {
            name: "AI Automation",
            path: "/services/ai-solutions/ai-automation",
          },
          {
            name: "Generative Engine Optimization",
            path: "/services/ai-solutions/generative-engine-optimization",
          },
        ],
      },
      {
        name: "Software Development",
        submenu: [
          {
            name: "Custom Software Development",
            path: "/services/software-development/custom-software-development",
          },
        ],
      },
      {
        name: "Ads Campaign",
        submenu: [
          {
            name: "Search Engine Optimization",
            path: "/services/ads-campaign/search-engine-optimization",
          },
          {
            name: "Search Engine Marketing",
            path: "/services/ads-campaign/search-engine-marketing",
          },
          {
            name: "SEO Copywriting",
            path: "/services/ads-campaign/seo-copywriting",
          },
        ],
      },
      {
        name: "Social Media Marketing",
        submenu: [
          {
            name: "Social Media Management",
            path: "/services/social-media-marketing/social-media-management",
          },
          {
            name: "Paid Social Ads",
            path: "/services/social-media-marketing/paid-social-ads",
          },
        ],
      },
      {
        name: "Content Marketing",
        submenu: [
          {
            name: "Copywriting",
            path: "/services/content-marketing/copywriting",
          },
          {
            name: "Content Marketing",
            path: "/services/content-marketing/content-marketing",
          },
          {
            name: "Social Media Content",
            path: "/services/content-marketing/social-media-content",
          },
          {
            name: "Blog Article",
            path: "/services/content-marketing/blog-article",
          },
          {
            name: "Infographic Content",
            path: "/services/content-marketing/infographic-content",
          },
          {
            name: "Skyscraper Content",
            path: "/services/content-marketing/skyscraper-content",
          },
        ],
      },
      {
        name: "Software & Website Dev",
        submenu: [
          {
            name: "Website Design & Development",
            path: "/services/website-development/website-design-development",
          },
          {
            name: "Website Maintenance",
            path: "/services/website-development/website-maintenance",
          },
          {
            name: "Custom Software Development",
            path: "/services/software-development/custom-software-development",
          },
        ],
      },
    ],
  },
  {
    name: "Solutions",
    menus: [
      {
        name: "Featured Solutions",
        submenu: [
          {
            name: "VMS Solution",
            path: "/solutions/vms-solution",
          },
          {
            name: "LMS Solution",
            path: "/solutions/lms-solution",
          },
        ],
      },
    ],
  },
  {
    name: "Others",
    menus: [
      {
        name: "Resources & Company",
        submenu: [
          {
            name: "Course",
            path: "/course",
          },
          {
            name: "Insights",
            path: "/insights",
          },
          {
            name: "Career",
            path: "/career",
          },
          {
            name: "Plans",
            path: "/plans",
          },
        ]
      }
    ]
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
];
