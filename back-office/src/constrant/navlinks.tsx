import { url } from "inspector"
import { Users, ChartPie, NotebookPen, NotebookTabs, Archive, Shapes, Briefcase, Folder, Hash, MailCheck, File, User, DollarSign, UserCheck} from "lucide-react"
import { title } from "process"

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
    group: "Partnership Program",
    name:"services",
    data: [
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
      }
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
        icon: Briefcase,
      },
    ],
  },
  {
    group: "Others",
    name:"meta",
    data: [
      {
        title: "Meta Content Management",
        url: "/meta",
        icon: Hash,
      },
      {
        title: "Affiliate Program",
        url: "/meta",
        icon: Hash,
      }
    ],
  },
]

export {
    sidebarItems
}
