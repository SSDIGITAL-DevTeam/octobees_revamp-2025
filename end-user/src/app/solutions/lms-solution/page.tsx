import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import LmsSolutionDemo from "./_components/LmsSolutionDemo";

export const metadata: Metadata = {
  title: "LMS Solution - Learning Management System by Octobees",
  description:
    "Explore the Octobees LMS Solution for admin, teacher, student, and parent workflows with report management, AI insight, and tuition flow.",
};

const highlights = [
  {
    icon: LayoutDashboard,
    title: "Role-based school management",
    text: "The referenced LMS already splits experience across admin, teacher, student, and parent needs.",
  },
  {
    icon: GraduationCap,
    title: "Teacher workflow that follows class reality",
    text: "Homeroom summary, report tracking, and grade input sit close to classroom activity instead of being buried in generic forms.",
  },
  {
    icon: BookOpen,
    title: "Student and parent visibility",
    text: "Student portal and parent portal both surface academic progress, behavior alerts, and report access in their own view.",
  },
  {
    icon: CreditCard,
    title: "Tuition flow inside the same product",
    text: "Billing status, VA number, payment history, and auto-debit setting are treated as part of the platform experience.",
  },
];

const modules = [
  "Subjects, teachers, classes, report format, roles, admin list, and settings",
  "Teacher dashboard, class report, and input grade flow",
  "Student portal with AI performance preview and flag history",
  "Parent portal with switch-student, flag view, and billing access",
  "Tuition fee display, history, and auto-debit setting flow",
];

const journey = [
  "Admin configures structure, report format, roles, and school data.",
  "Teacher manages class context and inputs learning results.",
  "Student sees personal progress and behavior feedback.",
  "Parent follows performance, alerts, and tuition from their own portal.",
];

const pricingPlans = [
  {
    icon: BookOpen,
    name: "Free",
    kicker: "Entry tier",
    price: "Rp 0",
    unit: "for early exploration",
    description:
      "Suitable for schools that want to review the platform direction first before moving into a larger operational rollout.",
    features: [
      "Basic product introduction and workflow preview",
      "Good starting point for internal evaluation",
      "Used to validate fit before moving into paid scope",
    ],
  },
  {
    icon: CreditCard,
    name: "Tuition",
    kicker: "Billing-focused tier",
    price: "Custom",
    unit: "based on tuition scope",
    description:
      "Focused on payment visibility, billing administration, and tuition-related workflows without taking the full school suite.",
    features: [
      "Payment status, history, and billing visibility",
      "Admin-side tuition workflow and reporting",
      "Narrower scope than the full School package",
    ],
  },
  {
    icon: GraduationCap,
    name: "School",
    kicker: "Most complete tier",
    price: "Per user",
    unit: "highest package",
    description:
      "The broadest package for schools that want admin, teaching, portal access, reporting, and tuition in one connected product.",
    features: [
      "Admin, teacher, student, and parent flows",
      "Academic structure, report format, and role setup",
      "Charged per user because the system is used across more daily roles",
    ],
  },
] as const;

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
      {text}
    </span>
  );
}

export default function LmsSolutionPage() {
  return (
    <main className="relative overflow-hidden bg-white pt-28 md:pt-36">
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-[#ffe8e3] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[12%] h-[320px] w-[320px] translate-x-1/3 rounded-full bg-[#fff1e6] blur-[120px]" />

      <section className="relative px-6 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <Badge text="LMS Solution" />
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[112%] text-gray-900 md:text-5xl lg:text-[3.7rem]">
              School workflow in one platform, from admin setup to parent visibility.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-[175%] text-gray-600 md:text-lg">
              This page follows the LMS project you shared. The real product
              direction already shows a connected layer for admin management,
              teacher work, student portal, parent portal, AI performance
              analysis, and tuition flow rather than scattering those functions
              across separate tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Admin
              </span>
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Teacher
              </span>
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Student
              </span>
              <span className="rounded-full bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#f97316]">
                Parent & Tuition
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-red-800 md:text-base"
              >
                Discuss This Solution
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/solutions/vms-solution"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary md:text-base"
              >
                View VMS Solution
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f0d8d5] bg-[linear-gradient(165deg,#ffffff_0%,#fff9f7_58%,#fff3f1_100%)] p-6 shadow-[0_22px_70px_rgba(218,41,28,0.08)] md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-gray-900">
                  Multi-role by default
                </h2>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Each role gets a different doorway into the same school data and workflow.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#ffe3c3] bg-white p-5">
                <Bot className="h-6 w-6 text-[#f97316]" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-gray-900">
                  AI and reporting layer
                </h2>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Performance analysis is positioned as a usable layer for students and parents, not just internal admin data.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Best fit
                </p>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Schools, academies, or learning programs that need admin, teaching, portal access, and billing in one product line.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <CreditCard className="h-6 w-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Source-backed
                </p>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  The content here is aligned with the real dashboard, sidebar, portal, and tuition routes in the referenced LMS app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf9] px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Badge text="What It Covers" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[1.6rem] border border-[#f0d8d5] bg-white p-6 shadow-sm shadow-primary/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3f1] text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-3 text-sm leading-[170%] text-gray-600 md:text-base">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.8rem] border border-[#f0d8d5] bg-white p-6 shadow-sm shadow-primary/5 md:p-8">
              <h3 className="font-heading text-2xl font-semibold text-gray-900">Core modules already reflected</h3>
              <ul className="mt-5 space-y-3">
                {modules.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-[165%] text-gray-600 md:text-base">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.8rem] border border-[#f0d8d5] bg-white p-6 shadow-sm shadow-primary/5 md:p-8">
              <h3 className="font-heading text-2xl font-semibold text-gray-900">Connected journey</h3>
              <div className="mt-5 space-y-4">
                {journey.map((item, index) => (
                  <div key={item} className="rounded-[1.4rem] bg-[#fff7f5] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-[165%] text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Badge text="Pricing" />
          <div className="mt-5 max-w-3xl">
            <h2 className="font-heading text-3xl font-semibold leading-[120%] text-gray-900 md:text-4xl">
              Three pricing directions for the LMS rollout.
            </h2>
            <p className="mt-4 text-base leading-[170%] text-gray-600 md:text-lg">
              Based on your brief, this LMS pricing is split into
              <span className="font-semibold text-gray-900"> Free</span>,
              <span className="font-semibold text-gray-900"> Tuition</span>, and
              <span className="font-semibold text-gray-900"> School</span>. The
              School package is positioned as the highest tier and uses a
              per-user charging model.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {pricingPlans.map(({ icon: Icon, name, kicker, price, unit, description, features }) => {
              const featured = name === "School";

              return (
                <div
                  key={name}
                  className={`rounded-[1.9rem] border p-6 shadow-sm transition-transform hover:-translate-y-1 md:p-8 ${
                    featured
                      ? "border-primary/20 bg-[linear-gradient(180deg,#fff7f5_0%,#ffffff_100%)] shadow-primary/10"
                      : "border-[#f0d8d5] bg-white shadow-primary/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${featured ? "bg-primary text-white" : "bg-[#fff3f1] text-primary"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${featured ? "bg-primary text-white" : "bg-[#fff7f5] text-primary"}`}>
                      {kicker}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-heading text-3xl font-semibold text-gray-900">{name}</h3>
                    <div className="mt-4 flex items-end gap-2">
                      <span className="font-heading text-4xl font-semibold text-gray-900 md:text-5xl">{price}</span>
                      <span className="pb-1 text-sm font-medium text-gray-500">{unit}</span>
                    </div>
                    <p className="mt-4 text-sm leading-[170%] text-gray-600 md:text-base">{description}</p>
                  </div>

                  <ul className="mt-6 space-y-3 border-t border-[#f2e3df] pt-6">
                    {features.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-[165%] text-gray-600">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact-us"
                    className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                      featured
                        ? "bg-primary text-white hover:bg-red-800"
                        : "border border-gray-300 bg-white text-gray-700 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    Discuss {name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#fff3f1] px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Badge text="Interactive Demo" />
          <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-[120%] text-gray-900 md:text-4xl">
            Explore a dummy LMS environment directly on this page.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-[170%] text-gray-600 md:text-lg">
            The demo below stays client-side and uses dummy data, but for this version it focuses on the admin-side LMS shell and page flow from the referenced source project.
          </p>

          <div className="mt-10">
            <LmsSolutionDemo />
          </div>
        </div>
      </section>
    </main>
  );
}
