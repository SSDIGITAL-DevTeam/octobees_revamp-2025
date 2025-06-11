import { Users, ChartPie, NotebookPen, NotebookTabs, Archive, Shapes, Briefcase, Folder, Hash, MailCheck } from "lucide-react"

const sidebarItems = [
  {
    group: "Dashboard",
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
    data: [
      {
        title: "Subscription",
        url: "/subscription",
        icon: MailCheck,
      }
    ],
  },
  {
    group: "User Management",
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
    data: [
      {
        title: "Position",
        url: "/position",
        icon: Briefcase,
      },
      {
        title: "Applicants Data",
        url: "/applicants-data",
        icon: Folder,
      },
    ],
  },
  {
    group: "Others",
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