import {
  Users,
  ChartPie,
  NotebookPen,
  Archive,
  Shapes,
  Briefcase,
  Hash,
  MailCheck,
  File,
  User,
  DollarSign,
  UserCheck,
  Ticket,
  UserRoundCog,
  PlaySquare,
  BadgeDollarSign
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
    group: "User Management",
    name: "user",
    data: [
      {
        title: "User",
        url: "/user",
        icon: Users,
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
    group: "Partnership Program",
    name: "services",
    data: [
      {
        title: "Affiliate Program",
        url: "/affiliate-program",
        icon: Ticket,
      },
      {
        title: "Partnership Dashboard",
        url: "/partnership/dashboard",
        icon: UserCheck,
      },
      {
        title: "Leads Management",
        url: "/partnership/leads-management",
        icon: File,
      },
      {
        title: "Partners",
        url: "/partnership/partners",
        icon: User,
      },
      {
        title: "Commission Control",
        url: "/partnership/commission-control",
        icon: DollarSign,
      },
    ],
  },
  {
    group: "Career Management",
    name: "career",
    data: [
      {
        title: "Position",
        url: "/career/position",
        icon: Briefcase,
      },
      {
        title: "Applicants Data",
        url: "/career/applicants-data",
        icon: Briefcase,
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
    group: "Course Management",
    name: "dashboard",
    data: [
      {
        title: "Courses",
        url: "/course/courses",
        icon: PlaySquare,
      },
      {
        title: "Pembayaran Course",
        url: "/course/purchases",
        icon: BadgeDollarSign,
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
