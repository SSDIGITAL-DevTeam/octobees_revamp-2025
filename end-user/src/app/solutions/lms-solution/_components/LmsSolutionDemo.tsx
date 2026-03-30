"use client";

import { useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

type LmsView =
  | "dashboard"
  | "subjects"
  | "teachers"
  | "classes"
  | "report-format"
  | "students"
  | "roles"
  | "admin-list"
  | "tuition"
  | "settings";

const payments = [
  { name: "Budiyono Siregar", className: "XI-A Regular", amount: "Rp 350.000", status: "Paid", dueDate: "August 5th, 2025", paymentDate: "August 2nd, 2025" },
  { name: "Irfan Bachdim", className: "XI-A Regular", amount: "Rp 350.000", status: "Paid", dueDate: "August 5th, 2025", paymentDate: "August 2nd, 2025" },
  { name: "Bambang Pamungkas", className: "XI-A Regular", amount: "Rp 350.000", status: "Unpaid", dueDate: "August 5th, 2025", paymentDate: "-/-" },
  { name: "Billie Eilish", className: "XI-A Plus", amount: "Rp 500.000", status: "Unpaid", dueDate: "August 5th, 2025", paymentDate: "-/-" },
];

const pageData: Record<Exclude<LmsView, "dashboard" | "tuition">, { title: string; note: string; rows: string[] }> = {
  subjects: { title: "Subjects", note: "Master data page based on the admin sidebar structure.", rows: ["Mathematics", "Science", "Bahasa Indonesia", "Economics"] },
  teachers: { title: "Teachers", note: "Static directory aligned with teacher master data management.", rows: ["Dafa Aulia", "Rina Melati", "Hendra Wijaya", "Salsabila Putri"] },
  classes: { title: "Classes", note: "Static class list aligned with LMS class management.", rows: ["XI-A Regular", "XI-A Plus", "VIII-A", "VIII-B"] },
  "report-format": { title: "Report Format", note: "Static report format list aligned with school reporting setup.", rows: ["Mid Semester Report", "Final Semester Report", "Character Assessment"] },
  students: { title: "Students Data", note: "Static student data page aligned with admin student management.", rows: ["Nayla Salsabila", "Rafa Mahendra", "Anjani Putri", "Farrel Nugraha"] },
  roles: { title: "Role Management", note: "Static role and access page aligned with admin role management.", rows: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"] },
  "admin-list": { title: "Admin List", note: "Static admin user list aligned with source role-access area.", rows: ["Dafa Aulia", "Rina Wulandari", "Bimo Satya"] },
  settings: { title: "School Settings", note: "Static settings panel aligned with school-level configuration.", rows: ["School identity", "Academic year", "Logo & theme", "Notification preferences"] },
};

function StatCard({
  title,
  subtitle,
  count,
  primary = false,
}: {
  title: string;
  subtitle: string;
  count: string;
  primary?: boolean;
}) {
  return (
    <div
      className={`group relative min-h-[140px] overflow-hidden rounded-2xl border p-5 transition-all ${
        primary
          ? "border-[#5b21b6] bg-[#5b21b6] text-white shadow-[0_12px_24px_rgba(74,0,224,0.25)]"
          : "border-gray-200 bg-white text-neutral-800"
      }`}
    >
      <h3 className={`text-base font-bold ${primary ? "text-white" : "text-gray-800"}`}>{title}</h3>
      <p className={`mt-1 text-xs ${primary ? "text-purple-100" : "text-gray-400"}`}>{subtitle}</p>
      <div className={`mt-8 text-3xl font-extrabold ${primary ? "text-white" : "text-[#5b21b6]"}`}>{count}</div>
    </div>
  );
}

function ShellCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export default function LmsSolutionDemo() {
  const [view, setView] = useState<LmsView>("dashboard");
  const [masterOpen, setMasterOpen] = useState(true);
  const [rolesOpen, setRolesOpen] = useState(true);

  const topItemClass = (active: boolean) =>
    `flex w-full items-center justify-between px-6 py-3.5 text-[15px] border-r-4 ${
      active ? "bg-[#5b21b6] text-white font-semibold border-[#5b21b6]" : "text-gray-800 border-transparent"
    }`;

  const subItemClass = (active: boolean) =>
    `flex items-center py-3 pl-[4.25rem] pr-6 text-[15px] border-r-4 ${
      active ? "bg-violet-50 text-[#5b21b6] font-semibold border-[#5b21b6]" : "text-gray-700 border-transparent"
    }`;

  return (
    <div className="flex h-[860px] w-full flex-col overflow-hidden rounded-[2rem] border border-[#eadfff] bg-[#f7f8fb] shadow-[0_24px_80px_rgba(76,29,149,0.12)] md:h-[920px] xl:h-[980px]">
      <div className="shrink-0 border-b border-[#e5e7eb] bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5b21b6]">Interactive Demo</p>
            <h3 className="mt-1 font-heading text-2xl font-semibold text-gray-900">Source-inspired LMS admin shell</h3>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#f3edff] px-4 py-2 text-sm font-semibold text-[#5b21b6]">Dummy data, admin only, no CRUD</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[256px_1fr]">
        <aside className="overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-20 items-center gap-4 border-b border-gray-100 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5b21b6] text-white">
              <GraduationCap className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-gray-800">Admin Workspace</span>
          </div>

          <div className="py-4">
            <button type="button" onClick={() => setView("dashboard")} className={topItemClass(view === "dashboard")}>
              <span className="flex items-center gap-4"><LayoutDashboard className="h-5 w-5" />Dashboard</span>
            </button>

            <div>
              <button type="button" onClick={() => setMasterOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-3.5 text-[15px] font-medium text-gray-800 border-r-4 border-transparent">
                <span className="flex items-center gap-4"><BookOpen className="h-5 w-5" />Master Data</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${masterOpen ? "rotate-180" : ""}`} />
              </button>
              {masterOpen && (
                <div className="bg-gray-50/50 py-2">
                  {[
                    ["subjects", "Subjects"],
                    ["teachers", "Teachers"],
                    ["classes", "Classes"],
                    ["report-format", "Students Report Format"],
                  ].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setView(id as LmsView)} className={subItemClass(view === id)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={() => setView("students")} className={topItemClass(view === "students")}>
              <span className="flex items-center gap-4"><Users className="h-5 w-5" />Students Data</span>
            </button>

            <div>
              <button type="button" onClick={() => setRolesOpen((value) => !value)} className="flex w-full items-center justify-between px-6 py-3.5 text-[15px] font-medium text-gray-800 border-r-4 border-transparent">
                <span className="flex items-center gap-4"><ShieldCheck className="h-5 w-5" />Role & Access</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${rolesOpen ? "rotate-180" : ""}`} />
              </button>
              {rolesOpen && (
                <div className="bg-gray-50/50 py-2">
                  {[
                    ["roles", "Role Management"],
                    ["admin-list", "Admin List"],
                  ].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setView(id as LmsView)} className={subItemClass(view === id)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={() => setView("tuition")} className={topItemClass(view === "tuition")}>
              <span className="flex items-center gap-4"><CreditCard className="h-5 w-5" />Tuition Fee Management</span>
            </button>

            <button type="button" onClick={() => setView("settings")} className={topItemClass(view === "settings")}>
              <span className="flex items-center gap-4"><Settings className="h-5 w-5" />School Settings</span>
            </button>
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden">
          <header className="shrink-0 border-b border-gray-200/90 bg-white/95 px-6 py-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Dashboard</p>
                <p className="text-sm font-semibold text-gray-700">Learning Admin Console</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600">
                  <span>English</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="relative rounded-xl border border-gray-200 p-2.5 text-gray-500">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">3</span>
                </button>
                <button type="button" className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-1.5">
                  <div className="h-9 w-9 rounded-full bg-gray-200" />
                  <div className="text-left hidden sm:block">
                    <span className="block text-sm font-semibold text-gray-700">Dafa Aulia</span>
                    <span className="block text-[11px] text-gray-400">admin@school.test</span>
                  </div>
                </button>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8">
            {view === "dashboard" && (
              <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                <div className="mb-6">
                  <h1 className="text-lg font-bold text-gray-800 sm:text-xl lg:text-2xl"><span className="mr-2">Hi</span>Welcome, Dafa Aulia</h1>
                </div>

                <div className="mb-8">
                  <h2 className="mb-4 text-base font-bold text-[#5b21b6] sm:text-lg lg:text-xl">Overview</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Active Teachers" subtitle="Total active teachers count" count="54" primary />
                    <StatCard title="Active Students" subtitle="Total active students count" count="1,268" />
                    <StatCard title="Parents" subtitle="Total parents count" count="1,074" />
                    <StatCard title="Active Admin" subtitle="Total active admin count" count="6" />
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-base font-bold text-[#5b21b6] sm:text-lg lg:text-xl">Student Tuition Payments</h2>
                  <div className="mb-6 flex flex-wrap items-center gap-2.5">
                    <button type="button" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium shadow-sm"><span className="font-semibold text-[#5b21b6]">Current Period</span><span className="text-gray-500">(August, 2025)</span></button>
                    <button type="button" className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm">All Class</button>
                    <button type="button" className="rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 shadow-sm">All Status</button>
                  </div>

                  <ShellCard className="sm:p-6 lg:p-8">
                    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <h3 className="text-base font-bold text-gray-800 sm:text-lg">Payment Status List</h3>
                      <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm">Download Data</button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <div className="hidden grid-cols-[1.3fr_1fr_0.9fr_0.7fr_0.9fr_0.9fr] bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 md:grid">
                        <span>Student Name</span>
                        <span>Class</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Due Date</span>
                        <span>Payment Date</span>
                      </div>
                      {payments.map((row) => (
                        <div key={row.name} className="grid gap-3 border-t border-gray-100 bg-white px-5 py-4 text-sm text-gray-600 first:border-t-0 md:grid-cols-[1.3fr_1fr_0.9fr_0.7fr_0.9fr_0.9fr]">
                          <span className="font-medium text-gray-800">{row.name}</span>
                          <span>{row.className}</span>
                          <span className="font-medium">{row.amount}</span>
                          <span className={`inline-flex w-fit items-center rounded px-2.5 py-1 text-xs font-semibold ${row.status === "Paid" ? "bg-[#e6f4ea] text-[#1e8e3e]" : "bg-[#fce8e6] text-[#d93025]"}`}>{row.status}</span>
                          <span>{row.dueDate}</span>
                          <span>{row.paymentDate}</span>
                        </div>
                      ))}
                    </div>
                  </ShellCard>
                </div>
              </div>
            )}

            {view === "tuition" && (
              <div className="mx-auto max-w-6xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Tuition Fee Management</h1>
                  <p className="mt-1 text-sm text-gray-500">Static admin payment area aligned with the LMS billing flow.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ShellCard><p className="text-sm font-semibold text-gray-500">Paid This Period</p><p className="mt-3 text-3xl font-bold text-[#5b21b6]">842</p></ShellCard>
                  <ShellCard><p className="text-sm font-semibold text-gray-500">Unpaid Bills</p><p className="mt-3 text-3xl font-bold text-[#f97316]">117</p></ShellCard>
                  <ShellCard><p className="text-sm font-semibold text-gray-500">Auto Debit Enabled</p><p className="mt-3 text-3xl font-bold text-[#5b21b6]">58%</p></ShellCard>
                </div>
                <ShellCard>
                  <p className="text-lg font-bold text-gray-800">Payment Summary</p>
                  <div className="mt-5 space-y-3">
                    {payments.map((row) => (
                      <div key={row.name} className="flex items-center justify-between rounded-xl border border-gray-200 bg-[#faf7ff] p-4">
                        <div>
                          <p className="font-semibold text-gray-800">{row.name}</p>
                          <p className="text-sm text-gray-500">{row.className}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#5b21b6]">{row.amount}</p>
                          <p className="text-xs text-gray-400">{row.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ShellCard>
              </div>
            )}

            {view !== "dashboard" && view !== "tuition" && (
              <div className="mx-auto max-w-5xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{pageData[view].title}</h1>
                  <p className="mt-1 text-sm text-gray-500">{pageData[view].note}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {pageData[view].rows.map((row) => (
                    <ShellCard key={row}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">{row}</p>
                          <p className="mt-1 text-sm text-gray-500">Admin preview item, static only.</p>
                        </div>
                        <button type="button" className="rounded-lg border border-[#5b21b6]/20 bg-[#faf7ff] px-4 py-2 text-sm font-semibold text-[#5b21b6]">View</button>
                      </div>
                    </ShellCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
