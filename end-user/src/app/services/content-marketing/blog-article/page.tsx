//image asset
import HeroImage from '@/assets/services/webp/ba/hero-ba.webp'
import BlogArticleImage from '@/assets/services/webp/ba/blogarticleis.webp'
import InhouseExpertImage from '@/assets/services/webp/ba/inhouse-expert.webp'
import MakeGoodBlogImage from '@/assets/services/webp/ba/make-good-blog.webp'

//components
import Hero from '@/app/services/_components/Hero'
import OurBrands from "../../_components/OurBrandPartner"
// import ProvenExperience from "../../_components/ProvenExperience"
import FormJoin from "../../_components/FormJoin"
import FlyingSection from "../../_components/FlyingSection"
import LeftHeader from "../../_components/LeftHeader"
import Header from "../../_components/Header"
import GridSection from "../../_components/GridSection"

// icon asset

export type GridType = {
    title: string;
    desc: string;
}

const benefitsWebiste: GridType[] = [
    {
        title: "Boosts SEO",
        desc: "Blog articles with relevant keywords improve search engine rankings, driving more organic traffic to your website."
    },
    {
        title: "Establishes Authority",
        desc: "Regularly publishing quality content positions you as an expert in your industry, building trust with your audience."
    },
    {
        title: "Engages Audience",
        desc: "Blogs provide valuable information, encouraging visitors to spend more time on your site and interact with your content."
    },
    {
        title: "Generates Leads",
        desc: "Including calls-to-action (CTAs) in blogs can convert readers into potential customers or subscribers."
    },
    {
        title: "Supports Social Media",
        desc: "Blog content can be shared on social platforms, increasing visibility and attracting new audiences."
    },
    {
        title: "Improves Conversions",
        desc: "Educating visitors through blogs helps them make informed decisions, increasing the likelihood of conversions."
    },
]
const blogArticleContent: GridType[] = [
    {
        title: "How-To Guides",
        desc: "They provide step-by-step solutions to problems, making them highly valuable to readers. They establish your authority and are often shared, driving traffic."
    },
    {
        title: "Case Studies",
        desc: "They showcase real-world examples of success, building credibility and trust with your audience by demonstrating tangible results."
    },
    {
        title: "Latest Industry News",
        desc: "Keeps your audience informed about trends and developments, positioning your website as a go-to resource for up-to-date information."
    },
    {
        title: "Infographics",
        desc: "Visual content is highly engaging and easily shareable, making complex information more digestible and increasing social media visibility."
    },
    {
        title: "Frequently Asked Questions",
        desc: "Addresses common queries, improving user experience and reducing customer support requests while boosting SEO through long-tail keywords."
    },
    {
        title: "Reviews of “Top 20” Posts",
        desc: "These are highly shareable and attract readers looking for curated, actionable recommendations, driving traffic and engagement."
    },
]

export default function BlogArticle() {
    return (
        <main className="">
            <Hero image={HeroImage.src} alt="Hero Section Image" title="Leading BLOG ARTICLE creation Agency in Singapore"
                subtitle="Top blog article creation agency in Singapore, delivering high-quality, engaging content tailored to your needs." />

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={BlogArticleImage.src} title="What is a Blog Article?" subtitle="A blog article or blog post allows you to publish insights or information on your website that your readers find useful. When you blog regularly, it establishes your thought leadership and increases the overall credibility of your company." side="left" />
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <LeftHeader title="Benefits of Regular Website Blogging" subtitle="Having blog articles on your website offers significant advantages. Regular blogging is one of the most effective methods for building brand recognition, while well-crafted articles provide valuable information to your audience" />
                    <GridSection list={benefitsWebiste} side="left" height="lg:min-h-[34vh]" />
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={MakeGoodBlogImage.src} title="What Makes a Good Blog Post?" subtitle="A good blog post adds value by being interesting, educational, and useful. Start with a captivating title and an engaging introduction to hook readers. Understand your audience’s interests to create relevant and appealing content." side="right" />
            </section>

            <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <div className="lg:max-w-7xl flex flex-col items-center justify-center gap-12 lg:gap-16 lg:mx-auto">
                    <Header title="Types of Blog Article Content" subtitle="There are numerous ways to create blog content. Some of the most popular types include:" />
                    <GridSection list={blogArticleContent} side="center" height="lg:min-h-[34vh]" />
                </div>
            </section>

            <section className="w-full bg-white py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <FlyingSection image={InhouseExpertImage.src} title="In-House Expert Digital Copywriters and Designers" subtitle="To ensure the highest quality blog articles for our clients, we employ an in-house team of skilled digital copywriters and designers. We never outsource our work, allowing us to maintain complete control over the quality of the content we create for you." side="left" />
            </section>

            <section className="w-full bg-white py-12 lg:py-20">
                <OurBrands />
            </section>

            {/* <section className="w-full bg-[#F5F5F5] py-12 lg:py-20 px-10 md:px-20 lg:px-5">
                <ProvenExperience />
            </section> */}

            <section className="w-full bg-primary py-12 lg:py-20">
                <FormJoin />
            </section>
        </main>
    )

}
