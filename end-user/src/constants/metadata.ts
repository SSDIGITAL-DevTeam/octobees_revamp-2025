import { Metadata } from "next";

const metadataBase = new URL("https://octobees.com");
const defaultImage = `${metadataBase}/assets/png/asset-logo-octobees.png`;
const defaultAuthor = "Octobees";
const defaultColor = "#ffffff";

export type MetadataType = keyof typeof pageMetadata;
export type PageMetadataProps = (typeof pageMetadata)[MetadataType];
export type DefaultMetadataProps = typeof defaultMetadata;

export type MetadataProps = PageMetadataProps & DefaultMetadataProps;

export const defaultMetadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  authors: [{ name: `${defaultAuthor}`, url: `${metadataBase}` }],
  creator: `${defaultAuthor}`,
  publisher: `${defaultAuthor}`,

  // charset: "utf-8",

  alternates: {
    canonical: `${metadataBase}`,
  },

  icons: {
    icon: defaultImage,
    shortcut: defaultImage,
    apple: defaultImage,
    other: [
      {
        rel: defaultImage,
        url: defaultImage,
        color: "#5bbad5",
      },
    ],
  },

  applicationName: `${defaultAuthor}`,
  generator: "Next.js",
};

export const pageMetadata = {
  home: {
    metadataBase,
    title: "OCTOBEES | Branding-focused & Marketing Tech Company",
    description:
      "OCTOBEES helps brands become top-of-mind and trusted by combining marketing technology with creative content and impactful campaigns.",
    keywords: [
      "Digital Marketing Agency",
      "Marketing Automation",
      "Social Media Marketing",
      "SEO Services",
      "Branding Agency",
    ],

    openGraph: {
      title: "OCTOBEES | Branding-focused & Marketing Tech Company",
      description:
        "OCTOBEES helps brands become top-of-mind and trusted by combining marketing technology with creative content and impactful campaigns.",
      url: `${metadataBase}`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "OCTOBEES | Branding-focused & Marketing Tech Company",
      description:
        "OCTOBEES helps brands become top-of-mind and trusted by combining marketing technology with creative content and impactful campaigns.",
      site: `${metadataBase}`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  plans: {
    metadataBase,
    title: "Plan Your Success with OCTOBEES | Martech Strategy & Packages",
    description:
      "Explore strategic marketing and technology packages tailored for business growth. Choose the right plan with OCTOBEES to accelerate your digital success.",
    keywords: [
      "Martech Packages",
      "Marketing Strategy Plans",
      "Digital Growth Plans",
      "Marketing Technology",
      "Business Marketing Packages",
    ],

    openGraph: {
      title: "Plan Your Success with OCTOBEES | Martech Strategy & Packages",
      description:
        "Choose the right strategic plan for your business. OCTOBEES offers marketing and technology packages designed to help you scale.",
      url: `${metadataBase}/plans`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Plan Your Success with OCTOBEES | Martech Strategy & Packages",
      description:
        "Choose the right strategic plan for your business. OCTOBEES offers marketing and technology packages designed to help you scale.",
      site: `${metadataBase}/plans`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  insights: {
    metadataBase,
    title: "Insights & Ideas | Martech Blog by OCTOBEES",
    description:
      "Get the latest insights on marketing technology, automation, SEO, social media, and brand strategy. Stay informed with OCTOBEES blog articles.",
    keywords: [
      "Marketing Blog",
      "Martech Insights",
      "Marketing Automation Tips",
      "SEO Strategies",
      "Brand Building Articles",
      "Digital Marketing Trends",
    ],

    openGraph: {
      title: "Martech Insights | Blog by OCTOBEES",
      description:
        "Explore expert-written articles on marketing tech, trends, strategies, and automation from the team at OCTOBEES.",
      url: `${metadataBase}/insights`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Martech Insights | Blog by OCTOBEES",
      description:
        "Explore expert-written articles on marketing tech, trends, strategies, and automation from the team at OCTOBEES.",
      site: `${metadataBase}/insights`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  career: {
    metadataBase,
    title: "Careers at OCTOBEES | Join Our Martech & Creative Team",
    description:
      "Join OCTOBEES and be part of a forward-thinking team shaping the future of marketing and technology. Check available positions now.",
    keywords: [
      "Careers at Octobees",
      "Marketing Jobs",
      "Technology Careers",
      "Creative Tech Team",
      "Hiring Martech Experts",
      "Digital Marketing Careers",
    ],

    openGraph: {
      title: "Careers at OCTOBEES | Join Our Martech & Creative Team",
      description:
        "We're hiring passionate marketers, technologists, and creatives. Grow your career with OCTOBEES.",
      url: `${metadataBase}/career`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Careers at OCTOBEES | Join Our Martech & Creative Team",
      description:
        "We're hiring passionate marketers, technologists, and creatives. Grow your career with OCTOBEES.",
      site: `${metadataBase}/career`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  about: {
    metadataBase,
    title: "About OCTOBEES | Marketing Technology for Brand Growth",
    description:
      "OCTOBEES is a martech company focused on helping brands grow through data-driven strategies, content, and technology innovation.",
    keywords: [
      "About Octobees",
      "Martech Company Profile",
      "Marketing Technology Firm",
      "Brand Strategy",
      "Digital Innovation",
    ],

    openGraph: {
      title: "About OCTOBEES | Marketing Technology for Brand Growth",
      description:
        "Discover the story behind OCTOBEES - a marketing technology company dedicated to helping brands become top-of-mind and well-trusted.",
      url: `${metadataBase}/about`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "About OCTOBEES | Marketing Technology for Brand Growth",
      description:
        "Discover the story behind OCTOBEES - a marketing technology company dedicated to helping brands become top-of-mind and well-trusted.",
      site: `${metadataBase}/about`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  contact: {
    metadataBase,
    title: "Contact OCTOBEES | Let's Grow Together",
    description:
      "Get in touch with the OCTOBEES team. Whether you have questions or want to collaborate, we’re here to help your business grow.",
    keywords: [
      "Contact Octobees",
      "Marketing Agency Contact",
      "Martech Support",
      "Consult Octobees",
      "Business Inquiry",
      "Digital Marketing Contact",
    ],

    openGraph: {
      title: "Contact OCTOBEES | Let's Grow Together",
      description:
        "Connect with us to explore how OCTOBEES can help your brand grow through technology-driven marketing strategies.",
      url: `${metadataBase}/contact-us`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Contact OCTOBEES | Let's Grow Together",
      description:
        "Connect with us to explore how OCTOBEES can help your brand grow through technology-driven marketing strategies.",
      site: `${metadataBase}/contact-us`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  thanks: {
    metadataBase,
    title: "Thank You | OCTOBEES Has Received Your Message",
    description:
      "Thank you for reaching out to OCTOBEES. We've received your message and will get back to you shortly.",
    keywords: [
      "Thank You Page",
      "Message Received",
      "Form Confirmation",
      "Octobees Thank You",
      "Contact Confirmation",
    ],
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Thank You | OCTOBEES Has Received Your Message",
      description:
        "We appreciate your interest. Your message has been successfully received by the OCTOBEES team.",
      url: `${metadataBase}/thanks`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Thank You | OCTOBEES Has Received Your Message",
      description:
        "We appreciate your interest. Your message has been successfully received by the OCTOBEES team.",
      site: `${metadataBase}/thanks`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },

  increase: {
    metadataBase,
    title: "Increase Your Sales with OCTOBEES | Smart Martech Solutions",
    description:
      "Ready to grow your business? Let OCTOBEES boost your brand visibility and sales through marketing technology and creative strategy.",
    keywords: [
      "Increase My Sales",
      "Grow Business Sales",
      "Marketing for Sales Growth",
      "Digital Marketing Help",
      "Marketing Technology for Business",
      "Octobees Sales Strategy",
    ],

    openGraph: {
      title: "Increase Your Sales with OCTOBEES | Smart Martech Solutions",
      description:
        "Partner with OCTOBEES to boost your sales and brand presence using smart martech solutions.",
      url: `${metadataBase}/increase-my-sales`,
      siteName: `${defaultAuthor}`,
      images: [
        {
          url: `${defaultImage}`,
          width: 1200,
          height: 630,
          alt: "OCTOBEES Logo",
        },
      ],
      type: "website",
      locale: "id_ID",
    },

    twitter: {
      card: "summary_large_image",
      title: "Increase Your Sales with OCTOBEES | Smart Martech Solutions",
      description:
        "Partner with OCTOBEES to boost your sales and brand presence using smart martech solutions.",
      site: `${metadataBase}/increase-my-sales`,
      creator: `${defaultAuthor}`,
      images: [`${defaultImage}`],
    },
  },
};
