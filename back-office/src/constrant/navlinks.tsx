import {
  Briefcase,
  ChartPie,
  NotebookPen,
  Archive,
  Shapes,
  Hash,
  MailCheck,
  User,
  Ticket,
  UserRoundCog,
  Layers,
  CircleUserRound,
  CircleDollarSign,
  WalletCards,
} from "lucide-react";

const sidebarItems = [
  {
    group: "Dashboard",
    name: "dashboard",
    data: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: ChartPie,
      },
    ],
  },
  {
    group: "Blog Management",
    name: "blog",
    data: [
      {
        title: "Blogs",
        url: "/blog/blogs",
        icon: NotebookPen,
      },
    ],
  },
  {
    group: "Service Management",
    name: "services",
    data: [
      {
        title: "Services Category",
        url: "/services/categories",
        icon: Shapes,
      },
      {
        title: "Services Package",
        url: "/services/packages",
        icon: Archive,
      },
    ],
  },
  {
    group: "Partner Management",
    name: "partnership",
    data: [
      // {
      //   title: "Partnership Dashboard",
      //   url: "/partnership/dashboard",
      //   icon: ChartPie,
      // },
      // {
      //   title: "Leads Management",
      //   url: "/partnership/leads-management",
      //   icon: MailCheck,
      // },
      // {
      //   title: "Partners",
      //   url: "/partnership/partners",
      //   icon: CircleUserRound,
      // },
      // {
      //   title: "Commission Control",
      //   url: "/partnership/commission-control",
      //   icon: CircleDollarSign,
      // },
      // {
      //   title: "Affiliate Program",
      //   url: "/affiliate-program",
      //   icon: Ticket,
      // },
      {
        title: "Partner Recruitment System",
        url: "/partner-recruitment-system",
        icon: Layers,
      },
      {
        title: "Partner List",
        url: "/partnership/partner-list",
        icon: User,
      },
    ],
  },
  {
    group: "Career Management",
    name: "career",
    data: [
      {
        title: "Career Position",
        url: "/career/position",
        icon: Briefcase,
      },
      {
        title: "Applicants Data",
        url: "/career/applicants-data",
        icon: UserRoundCog,
      },
    ],
  },
  {
    group: "Lead Management",
    name: "dashboard",
    data: [
      {
        title: "Consultation Leads",
        url: "/lead",
        icon: MailCheck,
      },
      {
        title: "Client Onboarded",
        url: "/lead/client-onboarding",
        icon: UserRoundCog,
      },
      {
        title: "Onboarding Videos",
        url: "/lead/onboarding-videos",
        icon: UserRoundCog,
      },
    ],
  },
  {
    group: "User Management",
    name: "user",
    data: [
      {
        title: "Users",
        url: "/user",
        icon: User,
      },
    ],
  },
  {
    group: "Subscription Management",
    name: "subscription",
    data: [
      {
        title: "Subscription",
        url: "/subscription",
        icon: WalletCards,
      },
    ],
  },
  {
    group: "Others",
    name: "meta",
    data: [
      {
        title: "Meta Content Management",
        url: "/meta",
        icon: Hash,
      },
    ],
  },
];

export { sidebarItems };
