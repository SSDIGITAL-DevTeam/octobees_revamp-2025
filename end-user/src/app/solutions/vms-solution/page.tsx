import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BellRing,
  FileCheck2,
  Fingerprint,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import VmsSolutionDemo from "./_components/VmsSolutionDemo";

export const metadata: Metadata = {
  title: "VMS Solution - Visitor Management System by Octobees",
  description:
    "Explore the Octobees VMS Solution for registration, approval, access assignment, monitoring, and emergency visibility.",
};

const features = [
  {
    icon: Users,
    title: "Structured registration",
    text: "Built around visitor, employee, and contractor intake with the data needed for real site access flow.",
  },
  {
    icon: FileCheck2,
    title: "Document-heavy review",
    text: "Identity card, visa, SKCK, MCU, competency proof, safety induction, and GDPR-ready checkpoints can live in one process.",
  },
  {
    icon: Fingerprint,
    title: "Approval tied to access",
    text: "Approval can continue into department, shift, card binding, expiry, and access-level setup instead of stopping at status only.",
  },
  {
    icon: ShieldAlert,
    title: "Response-ready dashboard",
    text: "The system direction already includes activity visibility, occupancy context, live detection, and emergency support.",
  },
];

const flow = [
  "Registration enters through guided forms and required files.",
  "Host or admin reviews request and supporting documents.",
  "Approved people can be assigned into access setup flow.",
  "Dashboard and monitoring keep movement readable on site.",
];

const modules = [
  "Visitor, employee, contractor type 1, and contractor type 2 registration",
  "Host approval and visitor list flow",
  "Face capture and live detection path",
  "Department, shift, card, and access-level assignment",
  "24-hour activity, occupancy, and emergency visibility",
];

const pricingFactors = [
  "Number of sites, gates, and device points that must be covered",
  "Depth of registration fields, review documents, and approval stages",
  "Card reader, face capture, or internal-system integration needs",
  "Training, rollout support, and deployment environment requirements",
];

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
      {text}
    </span>
  );
}

export default function VmsSolutionPage() {
  return (
    <main className="relative overflow-hidden bg-white pt-28 md:pt-36">
      <div className="pointer-events-none absolute left-0 top-0 h-[360px] w-[360px] -translate-x-1/3 -translate-y-1/4 rounded-full bg-[#ffe5e1] blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-[10%] h-[300px] w-[300px] translate-x-1/3 rounded-full bg-[#ffe8e6] blur-[120px]" />

      <section className="relative px-6 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <Badge text="VMS Solution" />
            <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[112%] text-gray-900 md:text-5xl lg:text-[3.8rem]">
              Visitor flow built for controlled, operationally busy sites.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-[175%] text-gray-600 md:text-lg">
              This page follows the actual VMS project you referenced. The real
              system already points to one connected flow for registration,
              document review, host approval, access assignment, live detection,
              activity visibility, and emergency response support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Registration
              </span>
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Host Approval
              </span>
              <span className="rounded-full bg-[#fff3f1] px-4 py-2 text-sm font-semibold text-primary">
                Card & Access
              </span>
              <span className="rounded-full bg-[#fff1f0] px-4 py-2 text-sm font-semibold text-[#DA291C]">
                Emergency Mode
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
                href="/solutions/lms-solution"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:text-primary md:text-base"
              >
                View LMS Solution
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f0d8d5] bg-[linear-gradient(160deg,#ffffff_0%,#fff7f6_65%,#ffffff_100%)] p-6 shadow-[0_22px_70px_rgba(218,41,28,0.08)] md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-gray-900">
                  One operational cockpit
                </h2>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Dashboard, approvals, visitor list, and monitoring fit into one workspace.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#f8d7d4] bg-white p-5">
                <BellRing className="h-6 w-6 text-[#DA291C]" />
                <h2 className="mt-4 font-heading text-2xl font-semibold text-gray-900">
                  Alert-ready logic
                </h2>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Emergency visibility sits close to daily operations instead of becoming a separate silo.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Best fit
                </p>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  Plants, warehouses, offices, and contractor-heavy facilities with controlled access needs.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#f0d8d5] bg-white p-5">
                <Activity className="h-6 w-6 text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  Source-backed
                </p>
                <p className="mt-3 text-sm leading-[165%] text-gray-600">
                  The content here is based on the real routes, widgets, and workflow found in the referenced VMS app.
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
            {features.map(({ icon: Icon, title, text }) => (
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
              <h3 className="font-heading text-2xl font-semibold text-gray-900">Operational flow</h3>
              <div className="mt-5 space-y-4">
                {flow.map((item, index) => (
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <Badge text="Pricing" />
            <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-[120%] text-gray-900 md:text-4xl">
              VMS stays custom-scoped for now.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-[170%] text-gray-600 md:text-lg">
              For the current VMS version, pricing is kept custom first. The
              rollout depends heavily on site complexity, access policy,
              hardware scope, and integration needs, so it makes more sense to
              quote it after the operational flow is mapped clearly.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#f0d8d5] bg-[linear-gradient(180deg,#fff7f5_0%,#ffffff_100%)] p-6 shadow-sm shadow-primary/10 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Custom quote
              </span>
            </div>
            <h3 className="mt-6 font-heading text-3xl font-semibold text-gray-900">
              Custom VMS Package
            </h3>
            <p className="mt-4 text-sm leading-[170%] text-gray-600 md:text-base">
              Best positioned for plants, warehouses, offices, and mixed
              visitor-contractor environments where the actual access flow
              differs from site to site.
            </p>

            <ul className="mt-6 space-y-3 border-t border-[#f2e3df] pt-6">
              {pricingFactors.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-[165%] text-gray-600">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact-us"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-800"
            >
              Discuss Custom Scope
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fff3f1] px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Badge text="Interactive Demo" />
          <h2 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-[120%] text-gray-900 md:text-4xl">
            Explore a dummy VMS environment directly on this page.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-[170%] text-gray-600 md:text-lg">
            This is a contained front-end demo with dummy data, but the structure follows the real system direction: dashboard, approvals, live detection, and personnel visibility.
          </p>

          <div className="mt-10">
            <VmsSolutionDemo />
          </div>
        </div>
      </section>
    </main>
  );
}
