const url = process.env.NEXT_PUBLIC_DOMAIN_URL;
const metadataBase = new URL(url || "https://octobees.com");
const defaultImage = `${metadataBase}assets/png/asset-logo-octobees.png`;
export type MetadataType = keyof typeof pageMetadata;
export type MetadataProps = (typeof pageMetadata)[MetadataType];

export const pageMetadata = {
  home: {
    metadataBase,
    title: "OCTOBEES | Branding-focused & marketing tech company",
    description: "OCTOBEES is a Branding-focused & marketing tech company",
    keywords: [
      "Digital Marketing",
      "Marketing Automation",
      "Social Media Marketing",
      "SEO",
    ],
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Octobees | Octobees",
      description:
        "OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.",
      url: `${metadataBase}`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Plan Your Success with OCTOBEES",
      description:
        "Choose the right strategic plan for your business. OCTOBEES offers marketing and technology packages designed to help you scale.",
      url: `${metadataBase}/plans`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Martech Insights | Blog by OCTOBEES",
      description:
        "Explore expert-written articles on marketing tech, trends, strategies, and automation from the team at OCTOBEES.",
      url: `${metadataBase}/insights`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Careers at OCTOBEES",
      description:
        "We're hiring passionate marketers, technologists, and creatives. Grow your career with OCTOBEES.",
      url: `${metadataBase}/career`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "About OCTOBEES",
      description:
        "Discover the story behind OCTOBEES – a marketing technology company dedicated to helping brands become top-of-mind and well-trusted.",
      url: `${metadataBase}/about`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Contact OCTOBEES",
      description:
        "Connect with us to explore how OCTOBEES can help your brand grow through technology-driven marketing strategies.",
      url: `${metadataBase}/contact-us`,
      images: defaultImage,
    },
  },

  thanks: {
    metadataBase,
    title: "Thank You | OCTOBEES Has Received Your Message",
    description:
      "Thank you for reaching out to OCTOBEES. We’ve received your message and will get back to you shortly.",
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
      title: "Thank You | OCTOBEES",
      description:
        "We appreciate your interest. Your message has been successfully received by the OCTOBEES team.",
      url: `${metadataBase}/thanks`,
      images: defaultImage,
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
    icons: {
      icon: defaultImage,
    },
    openGraph: {
      title: "Increase Your Sales | OCTOBEES",
      description:
        "Partner with OCTOBEES to boost your sales and brand presence using smart martech solutions.",
      url: `${metadataBase}/increase-my-sales`,
      images: defaultImage,
    },
  },
};
