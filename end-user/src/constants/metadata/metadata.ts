const metadataBase = new URL('https://digital-pa.com.sg')
const defaultImage = `${metadataBase}/webp/asset-logo.webp`
export type MetadataKeys = keyof typeof seoMetadata

export const seoMetadata = {
    home: {
        metadataBase,
        title: 'Octobees | Digital Marketing Experts',
        description:
            'Discover how Octobees helps businesses grow with expert digital marketing solutions tailored for success.',
        keywords: [
            'Octobees',
            'Digital Marketing Singapore',
            'Marketing Solutions',
            'SEO',
            'Social Media Marketing',
            'Marketing Automation',
        ],
        openGraph: {
            title: 'Octobees | Digital Marketing Experts',
            description:
                'Discover how Octobees helps businesses grow with expert digital marketing solutions tailored for success.',
            url: `${metadataBase}`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}`,
        },
    },

    about: {
        metadataBase,
        title: 'About Octobees | Trusted Marketing Partner',
        description:
            'Learn about Octobees, our mission, and how we help businesses grow with tailored digital marketing solutions.',
        keywords: [
            'About Octobees',
            'Our Team',
            'Digital Marketing Partner',
            'Company Overview',
        ],
        openGraph: {
            title: 'About Octobees | Trusted Marketing Partner',
            description:
                'Learn about Octobees, our mission, and how we help businesses grow with tailored digital marketing solutions.',
            url: `${metadataBase}/about-us`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/about-us`,
        },
    },

    contact: {
        metadataBase,
        title: 'Contact Octobees | Reach Our Marketing Experts',
        description:
            'Reach out to Octobees for expert advice on digital marketing, automation, SEO, and more.',
        keywords: [
            'Contact Octobees',
            'Get in Touch',
            'Digital Marketing Consultation',
            'Marketing Support',
        ],
        openGraph: {
            title: 'Contact Octobees | Reach Our Marketing Experts',
            description:
                'Reach out to Octobees for expert advice on digital marketing, automation, SEO, and more.',
            url: `${metadataBase}/contact-us`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/contact-us`,
        },
    },

    insights: {
        metadataBase,
        title: 'Insights | Trends & Tips by Octobees',
        description:
            'Stay updated with the latest digital marketing trends, guides, and case studies curated by our team.',
        keywords: [
            'Marketing Insights',
            'Digital Trends',
            'Growth Strategies',
            'Case Studies',
        ],
        openGraph: {
            title: 'Insights | Trends & Tips by Octobees',
            description:
                'Stay updated with the latest digital marketing trends, guides, and case studies curated by our team.',
            url: `${metadataBase}/insights`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/insights`,
        },
    },

    sem: {
        metadataBase,
        title: 'SEM Services in Singapore | Octobees',
        description:
            'Maximize your online visibility with paid ads and expert SEM strategies tailored to your goals.',
        keywords: [
            'Search Engine Marketing',
            'SEM Services',
            'Google Ads',
            'Paid Search',
        ],
        openGraph: {
            title: 'SEM Services in Singapore | Octobees',
            description:
                'Maximize your online visibility with paid ads and expert SEM strategies tailored to your goals.',
            url: `${metadataBase}/services/ads-campaign/search-engine-marketing`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/ads-campaign/search-engine-marketing`,
        },
    },

    seo: {
        metadataBase,
        title: 'SEO Services in Singapore | Octobees',
        description:
            'Grow your organic traffic and improve search rankings with our proven SEO strategies.',
        keywords: [
            'Search Engine Optimization',
            'SEO Services',
            'On-Page SEO',
            'Technical SEO',
        ],
        openGraph: {
            title: 'SEO Services in Singapore | Octobees',
            description:
                'Grow your organic traffic and improve search rankings with our proven SEO strategies.',
            url: `${metadataBase}/services/ads-campaign/search-engine-optimization`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/ads-campaign/search-engine-optimization`,
        },
    },

    seoCopywriting: {
        metadataBase,
        title: 'SEO Copywriting Services | Octobees',
        description:
            'We create optimized content that engages your audience and ranks high on search engines.',
        keywords: [
            'SEO Copywriting',
            'Content Writing',
            'Search Optimized Content',
            'SEO Blog',
        ],
        openGraph: {
            title: 'SEO Copywriting Services | Octobees',
            description:
                'We create optimized content that engages your audience and ranks high on search engines.',
            url: `${metadataBase}/services/ads-campaign/seo-copywriting`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/ads-campaign/seo-copywriting`,
        },
    },

    blog: {
        metadataBase,
        title: 'Blog Articles & Resources | Octobees',
        description:
            'Explore our blog to find expert tips, industry trends, and digital growth strategies.',
        keywords: [
            'Digital Marketing Blog',
            'Marketing Tips',
            'SEO Blog',
            'Growth Hacking',
        ],
        openGraph: {
            title: 'Blog Articles & Resources | Octobees',
            description:
                'Explore our blog to find expert tips, industry trends, and digital growth strategies.',
            url: `${metadataBase}/services/content-marketing/blog-article`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/blog-article`,
        },
    },

    contentMarketing: {
        metadataBase,
        title: 'Content Marketing Services | Octobees',
        description:
            'Drive traffic and engagement with strategic content marketing tailored to your business goals.',
        keywords: [
            'Content Marketing',
            'Content Strategy',
            'Inbound Marketing',
            'Content Creation',
        ],
        openGraph: {
            title: 'Content Marketing Services | Octobees',
            description:
                'Drive traffic and engagement with strategic content marketing tailored to your business goals.',
            url: `${metadataBase}/services/content-marketing/content-marketing`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/content-marketing`,
        },
    },

    copywriting: {
        metadataBase,
        title: 'Copywriting Services | Octobees',
        description:
            'Engage your audience and drive action with persuasive, brand-focused copywriting services.',
        keywords: [
            'Copywriting Services',
            'Marketing Copy',
            'Sales Copy',
            'Website Copy',
        ],
        openGraph: {
            title: 'Copywriting Services | Octobees',
            description:
                'Engage your audience and drive action with persuasive, brand-focused copywriting services.',
            url: `${metadataBase}/services/content-marketing/copywriting`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/copywriting`,
        },
    },

    infographic: {
        metadataBase,
        title: 'Infographic Design Services | Octobees',
        description:
            'Turn complex data into engaging visual stories with our infographic content services.',
        keywords: [
            'Infographic Content',
            'Data Visualization',
            'Graphic Design',
            'Content Marketing',
        ],
        openGraph: {
            title: 'Infographic Design Services | Octobees',
            description:
                'Turn complex data into engaging visual stories with our infographic content services.',
            url: `${metadataBase}/services/content-marketing/infographic-content`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/infographic-content`,
        },
    },

    skyscraper: {
        metadataBase,
        title: 'Skyscraper Content Services | Octobees',
        description:
            'Dominate your niche with comprehensive, high-quality skyscraper content that ranks.',
        keywords: [
            'Skyscraper Content',
            'SEO Content',
            'Long-Form Articles',
            'Authority Building',
        ],
        openGraph: {
            title: 'Skyscraper Content Services | Octobees',
            description:
                'Dominate your niche with comprehensive, high-quality skyscraper content that ranks.',
            url: `${metadataBase}/services/content-marketing/skyscraper-content`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/skyscraper-content`,
        },
    },

    socialContent: {
        metadataBase,
        title: 'Social Media Content Solutions | Octobees',
        description:
            'We create thumb-stopping, brand-focused content for all your social platforms.',
        keywords: [
            'Social Media Content',
            'Social Graphics',
            'Instagram Posts',
            'Facebook Content',
        ],
        openGraph: {
            title: 'Social Media Content Solutions | Octobees',
            description:
                'We create thumb-stopping, brand-focused content for all your social platforms.',
            url: `${metadataBase}/services/content-marketing/social-media-content`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/content-marketing/social-media-content`,
        },
    },

    paidSocialAds: {
        metadataBase,
        title: 'Paid Social Ads Management | Octobees',
        description:
            'Maximize your ROI with strategic paid campaigns on Facebook, Instagram, LinkedIn, and more.',
        keywords: [
            'Paid Social Ads',
            'Facebook Ads',
            'Instagram Ads',
            'Social PPC',
        ],
        openGraph: {
            title: 'Paid Social Ads Management | Octobees',
            description:
                'Maximize your ROI with strategic paid campaigns on Facebook, Instagram, LinkedIn, and more.',
            url: `${metadataBase}/services/social-media-marketing/paid-social-ads`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/social-media-marketing/paid-social-ads`,
        },
    },

    socialManagement: {
        metadataBase,
        title: 'Social Media Management Services | Octobees',
        description:
            'We handle your strategy, content, and community management across all major platforms.',
        keywords: [
            'Social Media Management',
            'Community Management',
            'Social Strategy',
            'Social Branding',
        ],
        openGraph: {
            title: 'Social Media Management Services | Octobees',
            description:
                'We handle your strategy, content, and community management across all major platforms.',
            url: `${metadataBase}/services/social-media-marketing/social-media-management`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/social-media-marketing/social-media-management`,
        },
    },

    webDesign: {
        metadataBase,
        title: 'Website Design & Development Services | Octobees',
        description:
            'Create stunning, responsive websites that align with your business goals and drive results.',
        keywords: [
            'Website Design',
            'Web Development',
            'Responsive Website',
            'Business Website',
        ],
        openGraph: {
            title: 'Website Design & Development Services | Octobees',
            description:
                'Create stunning, responsive websites that align with your business goals and drive results.',
            url: `${metadataBase}/services/website-development/website-design-development`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/website-development/website-design-development`,
        },
    },

    webMaintenance: {
        metadataBase,
        title: 'Website Maintenance Services | Octobees',
        description:
            'Ensure your site remains fast, secure, and up-to-date with our reliable maintenance services.',
        keywords: [
            'Website Maintenance',
            'Web Updates',
            'Site Security',
            'Backup & Support',
        ],
        openGraph: {
            title: 'Website Maintenance Services | Octobees',
            description:
                'Ensure your site remains fast, secure, and up-to-date with our reliable maintenance services.',
            url: `${metadataBase}/services/website-development/website-maintenance`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/website-development/website-maintenance`,
        },
    },

    aiAutomation: {
        metadataBase,
        title: 'AI Automation Solutions | Your Octobeesrtner in Digital Products',
        description:
            'Discover how Octobees’s AI automation services help businesses in Singapore streamline operations, reduce costs, and enhance efficiency through intelligent automation and digital transformation.',
        keywords: [
            'AI Automation',
            'Automation Services',
            'Digital Transformation',
            'Automation Tools',
        ],
        openGraph: {
            title: 'AI Automation Solutions | Your Octobeesrtner in Digital Products',
            description:
                'Discover how Octobees’s AI automation services help businesses in Singapore streamline operations, reduce costs, and enhance efficiency through intelligent automation and digital transformation.',
            url: `${metadataBase}/services/ai-solutions/ai-automation`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/ai-solutions/ai-automation`,
        },
    },

    geo: {
        metadataBase,
        title: 'Generative Engine Optimization (GEO) Services | Octobees',
        description:
            'Get your brand cited and recommended by AI search engines like ChatGPT, Gemini, and Google AI Overviews. Our GEO services optimize your content for AI-powered visibility.',
        keywords: [
            'Generative Engine Optimization',
            'GEO Services',
            'AI Search Optimization',
            'AI Visibility',
            'LLM Content Optimization',
            'AI Citation',
        ],
        openGraph: {
            title: 'Generative Engine Optimization (GEO) Services | Octobees',
            description:
                'Get your brand cited and recommended by AI search engines like ChatGPT, Gemini, and Google AI Overviews. Our GEO services optimize your content for AI-powered visibility.',
            url: `${metadataBase}/services/ai-solutions/generative-engine-optimization`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/services/ai-solutions/generative-engine-optimization`,
        },
    },

    success: {
        metadataBase,
        title: 'Thank You for Reaching Out | Octobees',
        description:
            'We’ve successfully received your inquiry. Our team will get back to you shortly to assist with your automation needs.',
        keywords: [
            'Lead Submitted',
            'Thank You Page',
            'AI Automation Contact',
            'Octobees Success Page',
        ],
        openGraph: {
            title: 'Thank You for Reaching Out | Octobees',
            description:
                'We’ve successfully received your inquiry. Our team will get back to you shortly.',
            url: `${metadataBase}/thanks`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/thanks`,
        },
    },

    tuition: {
        metadataBase,
        title: 'DPA Tuition Centre | Singapore Learning Support',
        description:
            'Learn about DPA Tuition Centre’s academic coaching, teaching philosophy, and the services we offer to help students thrive in their studies and mindset development.',
        keywords: [
            'Academic Coaching',
            'DPA Tuition Centre Services',
            'Tuition Singapore',
            'Mindset Development',
            'Game-based Learning',
            'Mock Exams',
        ],
        openGraph: {
            title: 'DPA Tuition Centre | Singapore Learning Support',
            description:
                'Explore the comprehensive academic coaching services offered by DPA Tuition Centre, focused on academic success and personal development.',
            url: `${metadataBase}/tuition-center-knowledge-base`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/tuition-center-knowledge-base`,
        },
    },

    privacyPolicy: {
        metadataBase,
        title: 'Privacy Policy | Octobees',
        description:
            'Read how Octobees collects, uses, and protects your personal data in accordance with the PDPA. Your privacy and trust are our top priority.',
        keywords: [
            'Octobees Privacy Policy',
            'PDPA Singapore',
            'Data Protection',
            'Personal Data Usage',
            'Privacy Compliance',
            'Website Privacy Policy',
        ],
        openGraph: {
            title: 'Privacy Policy | Octobees',
            description:
                'Read how Octobees collects, uses, and protects your personal data in accordance with the PDPA. Your privacy and trust are our top priority.',
            url: `${metadataBase}/privacy-policy`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/privacy-policy`,
        },
    },

    aiMarketingAutomation: {
        metadataBase,
        title: 'AI Marketing Automation | Smarter Digital Strategy',
        description:
            'Explore how Octobees’s AI marketing automation services empower businesses in Singapore to optimize campaigns, boost engagement, and increase ROI through advanced automation and intelligent marketing strategies.',
        keywords: [
            'AI Marketing Automation',
            'Marketing Automation Services',
            'Digital Marketing',
            'Campaign Optimization',
            'Intelligent Marketing Tools',
        ],
        openGraph: {
            title: 'AI Marketing Automation | Smarter Digital Strategy',
            description:
                'Explore how Octobees’s AI marketing automation services empower businesses in Singapore to optimize campaigns, boost engagement, and increase ROI through advanced automation and intelligent marketing strategies.',
            url: `${metadataBase}/dpa-leads-ai-automation`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/dpa-leads-ai-automation`,
        },
    },

    terms: {
        metadataBase,
        title: 'Terms and Conditions | Octobees',
        description:
            'Discover how Octobees’s AI-powered marketing automation helps businesses in Singapore streamline campaigns, enhance customer engagement, and drive higher ROI through smart and scalable automation strategies.',
        keywords: [
            'AI-Powered Marketing',
            'Marketing Automation Solutions',
            'Digital Advertising',
            'Campaign Efficiency',
            'Smart Marketing Platforms',
        ],
        openGraph: {
            title: 'Terms and Conditions | Octobees',
            description:
                'Discover how Octobees empowers businesses in Singapore with AI-driven marketing automation to refine campaigns, boost engagement, and achieve measurable results through intelligent digital solutions.',
            url: `${metadataBase}/terms-and-conditions`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/terms-and-conditions`,
        },
    },

    isunChatbot: {
        metadataBase,
        title: 'iSun Chatbot Services | Octobees',
        description:
            'Chat about your marketing automation needs. Our chatbot is here to help you with your automation needs',
        keywords: [
            'Chatbot',
            'iSun Chatbot',
            'Chatbot Services',
            'AI-Powered Marketing',
        ],
        openGraph: {
            title: 'iSun Chatbot Services | Octobees',
            description:
                'Chat about your marketing automation needs. Our chatbot is here to help you with your automation needs',
            url: `${metadataBase}/isun-chatbot-ai-testing`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/isun-chatbot-ai-testing`,
        },
    },

    dpaChatbot: {
        metadataBase,
        title: 'DPA Chatbot Services | Octobees',
        description:
            'Chat about your marketing automation needs. Our chatbot is here to help you with your automation needs',
        keywords: [
            'Chatbot',
            'Octobees Chatbot',
            'Chatbot Services',
            'AI-Powered Marketing',
        ],
        openGraph: {
            title: 'DPA Chatbot Services | Octobees',
            description:
                'Chat about your marketing automation needs. Our chatbot is here to help you with your automation needs',
            url: `${metadataBase}/demo-dpa-tuition-agency`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}/demo-dpa-tuition-agency`,
        },
    },

    maintenance: {
        metadataBase,
        title: 'Site Under Maintenance | Octobees',
        description:
            'We are currently performing scheduled maintenance to improve your experience. We will be back shortly.',
        keywords: [
            'Maintenance',
            'Under Construction',
            'Octobees',
        ],
        robots: {
            index: false,
            follow: false,
        },
        openGraph: {
            title: 'Site Under Maintenance | Octobees',
            description:
                'We are currently performing scheduled maintenance to improve your experience. We will be back shortly.',
            url: `${metadataBase}`,
            images: [
                {
                    url: defaultImage,
                    alt: 'Octobees Logo',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        alternates: {
            canonical: `${metadataBase}`,
        },
    },
}
