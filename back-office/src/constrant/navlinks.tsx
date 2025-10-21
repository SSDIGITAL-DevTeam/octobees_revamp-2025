import { Users, ChartPie, NotebookPen, NotebookTabs, Archive, Shapes, Briefcase, Folder, Hash, MailCheck } from "lucide-react"

const sidebarItems = [
  {
    group: "Dashboard",
    name:"dashboard",
    data: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: ChartPie,
      }
    ],
  },
  {
    group: "Subscription Management",
    name:"subscription",
    data: [
      {
        title: "Subscription",
        url: "/subscription",
        icon: MailCheck,
      },
      {
        title: "Affiliate Program",
        url: "/affiliate-program",
        icon: MailCheck,
      }
    ],
  },
  {
    group: "User Management",
    name:"user",
    data: [
      {
        title: "User",
        url: "/user",
        icon: Users,
      }
    ],
  },
  {
    group: "Blog Management",
    name:"blog",
    data: [
      {
        title: "Blogs",
        url: "/blog/blogs",
        icon: NotebookPen,
      },
      {
        title: "Blog Category",
        url: "/blog/blog-category",
        icon: NotebookTabs,
      }
    ],
  },
  {
    group: "Service Management",
    name:"services",
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
    group: "Career Management",
    name:"career",
    data: [
      {
        title: "Position",
        url: "/career/position",
        icon: Briefcase,
      },
      {
        title: "Applicants Data",
        url: "/career/applicants-data",
        icon: Folder,
      },
    ],
  },
  {
    group: "Others",
    name:"meta",
    data: [
      {
        title: "Meta Tags",
        url: "/meta",
        icon: Hash,
      }
    ],
  },
]

export {
    sidebarItems
}
