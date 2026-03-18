//asset icons
import EyesIcon from '@/assets/services/svg/eyes.svg'
import GraphIcon from '@/assets/services/svg/graph.svg'
import GlobeIcon from '@/assets/services/svg/globe.svg'
import RobotIcon from '@/assets/services/svg/robot.svg'
import SparclesIcon from '@/assets/services/svg/sparcles.svg'
import RankIcon from '@/assets/services/svg/rank.svg'
import SeoIcon from '@/assets/services/svg/seo.svg'
import SettingIcon from '@/assets/services/svg/setting.svg'
import DatabaseIcon from '@/assets/services/svg/database.svg'
import DriveTrafficIcon from '@/assets/services/svg/drive-traffic.svg'
import CrownIcon from '@/assets/services/svg/crown.svg'
import KeyIcon from '@/assets/services/svg/key.svg'
import FakeIcon from '@/assets/services/svg/fake.svg'
import OverpricedIcon from '@/assets/services/svg/overpriced.svg'
import NoControlIcon from '@/assets/services/svg/no-control.svg'

// GEO process images
import ProcessAudit from '@/assets/services/webp/geo/process-audit.png'
import ProcessContent from '@/assets/services/webp/geo/process-content.png'
import ProcessTechnical from '@/assets/services/webp/geo/process-technical.png'
import ProcessMonitor from '@/assets/services/webp/geo/process-monitor.png'

// ===== TYPES =====
export type ListWithImage = {
    title: string;
    image: string;
    subtitle: string;
}[]

// ===== HERO SECTION =====
// (No constants needed — hero is inline JSX)

// ===== PROBLEM AWARENESS SECTION =====
export const geoProblems: { title: string; desc: string; icons: string }[] = [
    {
        title: "Invisible to AI Answers",
        icons: FakeIcon.src,
        desc: "Your content never appears in ChatGPT, Gemini, or Google AI Overviews responses — even though you rank on Google.",
    },
    {
        title: "Zero-Click Search Crisis",
        icons: OverpricedIcon.src,
        desc: "Users get direct answers from AI without ever visiting your website. Your traffic is declining despite good SEO rankings.",
    },
    {
        title: "Competitors Getting Cited Instead",
        icons: NoControlIcon.src,
        desc: "Other brands are being recommended by AI engines as trusted sources, while yours remains invisible in AI-generated answers.",
    },
]

// ===== WHO NEEDS GEO =====
export const whoNeedsGEO: { title: string; desc: string }[] = [
    {
        title: "SEO-Invested Brands Losing Traffic",
        desc: "If your SEO is strong but traffic is declining, AI is likely diverting your potential visitors. GEO ensures you're cited in AI answers.",
    },
    {
        title: "Brands Wanting AI-Generated Visibility",
        desc: "If you want your brand to appear when users ask ChatGPT, Gemini, or Perplexity for recommendations, GEO makes it happen.",
    },
    {
        title: "E-Commerce & Product-Based Businesses",
        desc: "AI increasingly recommends products directly. GEO ensures your products are featured when users ask AI for buying advice.",
    },
    {
        title: "SaaS & Technology Companies",
        desc: "Position your software as the go-to recommendation when prospects ask AI about solutions in your category.",
    },
    {
        title: "Agencies Offering Digital Services",
        desc: "Stay ahead of the curve and offer cutting-edge GEO services to your clients alongside traditional SEO packages.",
    },
    {
        title: "Content-Heavy Businesses & Publishers",
        desc: "Media outlets, bloggers, and content creators can ensure their content is the source AI references and cites.",
    },
]

// ===== WHAT WE CAN DO (Icon-based, for bg-primary section) =====
export const whatWeCanDo: { title: string; desc: string; icon: string }[] = [
    {
        icon: EyesIcon.src,
        title: "AI Visibility Audit",
        desc: "Analyze how often your brand is cited across AI platforms",
    },
    {
        icon: SeoIcon.src,
        title: "AI-Optimized Content Strategy",
        desc: "Structured content designed to be understood by LLMs",
    },
    {
        icon: SettingIcon.src,
        title: "Schema & Structured Data",
        desc: "Technical markup so AI can easily extract your information",
    },
    {
        icon: GraphIcon.src,
        title: "Citation Gap Analysis",
        desc: "Identify where competitors are cited but you are not",
    },
    {
        icon: RobotIcon.src,
        title: "AI Engine Monitoring",
        desc: "Track how AI engines treat and reference your content",
    },
    {
        icon: CrownIcon.src,
        title: "E-E-A-T Authority Building",
        desc: "Build content authority to become AI's trusted source",
    },
]

// ===== GEO PROCESS (GradientSection data) =====
export const geoProcess: ListWithImage = [
    {
        title: "AI Visibility Audit",
        subtitle: "We evaluate your brand's current position in the eyes of AI engines — analyzing citation frequency, content gaps, and competitor visibility across ChatGPT, Gemini, Perplexity, and Google AI Overviews.",
        image: ProcessAudit.src,
    },
    {
        title: "Content Architecture",
        subtitle: "We restructure and create content designed to be easily understood, extracted, and cited by Large Language Models — using answer-first formats, conversational tone, and comprehensive topic coverage.",
        image: ProcessContent.src,
    },
    {
        title: "Technical Optimization",
        subtitle: "We implement schema markup, structured data (FAQPage, HowTo, Article), optimize crawlability for AI bots, and ensure your technical foundation supports AI engine discovery.",
        image: ProcessTechnical.src,
    },
    {
        title: "Monitor & Iterate",
        subtitle: "We continuously track your brand's AI citation performance, generate visibility reports, identify new opportunities, and optimize your strategy based on real-time data from AI platforms.",
        image: ProcessMonitor.src,
    },
]

// ===== KEY STRATEGIES (GridSection data) =====
export const geoKeyStrategies: { title: string; desc: string }[] = [
    {
        title: "Conversational Content Optimization",
        desc: "Content crafted with an answer-first approach — clear, conversational, and context-rich — so AI engines can easily extract and present your information as direct answers to user queries.",
    },
    {
        title: "Topical Authority Clustering",
        desc: "Building interconnected content clusters that demonstrate deep expertise on specific topics. This signals to AI that your brand is the definitive source worth citing.",
    },
    {
        title: "Structured Data & Schema Markup",
        desc: "Strategic implementation of FAQPage, HowTo, and Article schemas that help AI systems accurately categorize, understand, and highlight your content in generated responses.",
    },
    {
        title: "E-E-A-T Signal Enhancement",
        desc: "Strengthening Experience, Expertise, Authoritativeness, and Trustworthiness signals through original research, expert citations, verifiable data, and authoritative backlinking.",
    },
    {
        title: "Multi-Platform Citation Building",
        desc: "Establishing presence on Reddit, Quora, LinkedIn, and industry forums — platforms that AI engines actively reference — to build a citation network around your brand.",
    },
]

// ===== SEO vs GEO COMPARISON =====
export const seoVsGeoComparison: { seo: string; geo: string; icon: string }[] = [
    {
        icon: RankIcon.src,
        seo: "Ranking in search results",
        geo: "Being cited in AI answers",
    },
    {
        icon: KeyIcon.src,
        seo: "Keyword optimization",
        geo: "Intent & context optimization",
    },
    {
        icon: GlobeIcon.src,
        seo: "Backlink building",
        geo: "Citation building across AI platforms",
    },
    {
        icon: DriveTrafficIcon.src,
        seo: "Click-through traffic focus",
        geo: "Zero-click AI visibility",
    },
    {
        icon: SparclesIcon.src,
        seo: "Search engine crawlers",
        geo: "LLM understanding & extraction",
    },
    {
        icon: DatabaseIcon.src,
        seo: "Page authority signals",
        geo: "Content authority & E-E-A-T signals",
    },
]
