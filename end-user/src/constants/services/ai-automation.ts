//asset icons
import DatabaseIcon from '@/assets/services/svg/database.svg'
import ReduceManpowerIcon from '@/assets/services/svg/decrease-manpower.svg'
import ReduceAcquisitionIcon from '@/assets/services/svg/decrease-acquisition.svg'
import GraphIcon from '@/assets/services/svg/graph.svg'
import TumbIcon from '@/assets/services/svg/tumb.svg'
import ReduceIcon from '@/assets/services/svg/decrease.svg'
import IncreaseIcon from '@/assets/services/svg/drive-traffic.svg'
import SettingIcon from '@/assets/services/svg/setting.svg'
import ChatIcon from '@/assets/services/svg/chat.svg'
import CalendarIcon from '@/assets/services/svg/calendar.svg'
import SparclesIcon from '@/assets/services/svg/sparcles.svg'
import UsersIcon from '@/assets/services/svg/users2.svg'
import FakeIcon from '@/assets/services/svg/fake.svg'
import OverpricedIcon from '@/assets/services/svg/overpriced.svg'
import NoControlIcon from '@/assets/services/svg/no-control.svg'

import AllInOneImage1 from '@/assets/services/webp/ai/aio1.webp'
import AllInOneImage2 from '@/assets/services/webp/ai/aio2.webp'
import AllInOneImage3 from '@/assets/services/webp/ai/aio3.webp'
import AllInOneImage4 from '@/assets/services/webp/ai/aio4.webp'

export type List = {
    title: string;
    image: string;
    subtitle: string;
}[]

export const allInOnePlatformAI: List = [
    {
        title: "CRM & Sales Automation",
        subtitle: "At its core, our solution offers a powerful CRM system that helps you track leads, customer interactions, and all the steps of your sales process. It’s about making sure no lead falls through the cracks and automating follow-ups so you can focus on closing deals.",
        image: AllInOneImage1.src
    },
    {
        title: "Marketing Automation",
        subtitle: " From email campaigns to SMS messaging, it’s all about reaching your audience in the most effective way. Think of it as having a personal assistant who makes sure your messages get to the right people at the right time",
        image: AllInOneImage2.src
    },
    {
        title: "Reputation Management",
        subtitle: "In the digital world, reputation is everything. Our solutionl helps you monitor and manage your online reputation, ensuring that your best foot is always forward.",
        image: AllInOneImage3.src
    },
    {
        title: "Integrations",
        subtitle: "Our solution plays well with others, integrating seamlessly with tools and platforms you’re already using. This means less hassle in getting systems to communicate with each other and more time doing what you do best.",
        image: AllInOneImage4.src
    },
]



export const saveMoneyTime: { desc: string, icon: string; }[] = [
    {
        icon: DatabaseIcon.src,
        desc: "Reduce leads cost",
    },
    {
        icon: ReduceManpowerIcon.src,
        desc: "Reduce manpower cost"
    },
    {
        icon: ReduceAcquisitionIcon.src,
        desc: "Reduce cost per acquisition"
    },
    {
        icon: GraphIcon.src,
        desc: "Increased productivity & eficiency, reduced cost"
    },
    {
        icon: TumbIcon.src,
        desc: "Saves time, save money, more results"
    },
    {
        icon: ReduceIcon.src,
        desc: "Reduce cost for customized solution due to needs or industry"
    },
]
export const saveMoneyTime2: { desc: string, icons: string; title: string }[] = [
    {
        title: "Fake or Fragmented Automation",
        icons: FakeIcon.src,
        desc: "They’re promised “automation,” but end up using disconnected tools (CRM, WhatsApp, email, spreadsheets) that still require manual work or staff to manage.",
    },
    {
        title: "Overpriced & Underperforming Digital Agencies",
        icons: OverpricedIcon.src,
        desc: "Agencies charge high monthly fees but often outsource, delay results, and give vague reports."
    },
    {
        title: "No Control or Visibility Over Growth",
        icons: NoControlIcon.src,
        desc: "They don’t know what’s working — leads are coming in randomly, no dashboard, no ownership of strategy or data."
    },
]

export const increaseRevenueProfit: { desc: string, icon: string; }[] = [
    {
        icon: IncreaseIcon.src,
        desc: "Automated follow-ups convert leads and boost upsells.",
    },
    {
        icon: SettingIcon.src,
        desc: "Task automation lets teams focus on closing deals, increasing profits."
    },
    {
        icon: ChatIcon.src,
        desc: "Personalized communication reduces lost leads and improves efficiency."
    },
    {
        icon: CalendarIcon.src,
        desc: "AI booking cuts errors by 85%, boosting appointments and sales."
    },
    {
        icon: SparclesIcon.src,
        desc: "AI engagement reduces churn, ensuring retention and higher client value."
    },
    {
        icon: UsersIcon.src,
        desc: "Re-engaging past clients reconverts them, increasing lifetime value."
    },
]

export const whoShouldUseOurAI: { title: string; desc: string }[] = [
    {
        title: "Top Marketing agencies",
        desc: "If you run a marketing agency, this software is practically made for you. It has all the tools to smooth out client-getting and marketing strategy tasks."
    },
    {
        title: "Top Sales teams",
        desc: "It’s got tools to easily manage leads, track your sales calls, and even automate some of the communication stuff. Game-changer, right?"
    },
    {
        title: "Top Sales professionals",
        desc: "It helps you improve your agency plan and keeps your client relationships on point."
    },
    {
        title: "Top Resource consolidation seekers",
        desc: "We simplifies things by putting everything in one place. It makes your marketing activities more efficient and saves you time."
    },
    {
        title: "Top Local service businesses",
        desc: "like contractors, law firms, dentists, chiropractors, etc."
    },
    {
        title: "Top B2B companies",
        desc: "that want to streamline lead management and sales processes"
    },
    {
        title: "Top Coaches, consultants, and online course creators",
        desc: "Streamline client engagement and course management for better results."
    },
    {
        title: "Top Real estate agents",
        desc: "Simplify lead tracking and client communication to close deals faster."
    },
    {
        title: "Top E-commerce brands",
        desc: "Enhance lead management and sales processes to boost online sales."
    },
]

export const keyFunction: { title: string; desc: string }[] = [
    {
        title: "Capture Leads",
        desc: "Our platform boosts lead generation with drag-and-drop forms (35% higher conversions), customizable landing pages (60% more leads in 6 months), and online scheduling (40% productivity increase)."
    },
    {
        title: "Nurture Leads",
        desc: "Our platform boosts lead engagement by 230% with voicemail, email, and SMS campaigns. The mobile app’s two-way communication speeds responses by 50%, ensuring personalized, seamless interactions."
    },
    {
        title: "Automate Conversations",
        desc: "Our AI booking tool reduces manual errors by 85% and boosts lead engagement by 70% with tailored follow-ups, streamlining communication and helping your team close deals faster."
    },
    {
        title: "Create Community / Membership Areas",
        desc: "Our course system boosts community engagement by 45%, enabling free or paid courses for unlimited users. 78% of clients use video courses to effectively train leads, building a thriving community."
    },
    {
        title: "Manage Your Workﬂows & Close More Deals",
        desc: "Our pipeline tool boosts deal closures by 30%, integrates Stripe for seamless payments, and offers analytics—72% of customers use insights for data-driven decisions."
    },
]

export const canWeDo: { title: string; desc: string, emoji: string; }[] = [
    {
        emoji: '🔍',
        title: "Find new customers?",
        desc: "✅ CHECK.",
    },
    {
        emoji: '😊',
        title: "Keep existing clients happy?",
        desc: "✅ YOU BET."
    },
    {
        emoji: '💬',
        title: "Nurture leads?",
        desc: "✅ ABSOLUTELY."
    },
    {
        emoji: '👥',
        title: "Reactivate past clients?",
        desc: "✅ OH YEAH."
    },
    {
        emoji: '🚀',
        title: "Grow your business?",
        desc: "✅ THAT’S THE GOAL!"
    },
]