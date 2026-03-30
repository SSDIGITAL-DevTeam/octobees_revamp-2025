"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Building2,
  Camera,
  ChevronDown,
  ChevronLeft,
  CircleUserRound,
  Clock3,
  CreditCard,
  Fingerprint,
  IdCard,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Monitor,
  ScanFace,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  Users,
} from "lucide-react";

type VmsView =
  | "dashboard"
  | "sites-view"
  | "visitor-management"
  | "devices"
  | "locations"
  | "approvals"
  | "cameras"
  | "visitor-list"
  | "person-detail";

type RegistrationType =
  | "visitor"
  | "employee"
  | "contractor_type1"
  | "contractor_type2";

type RegistrationStatus = "pending" | "active" | "non-active";
type ApprovalTab = "Pending" | "All" | "History";

type DemoRegistration = {
  id: number;
  fullName: string;
  registrationType: RegistrationType;
  company: string;
  hostName: string;
  phoneNumber: string;
  identityNumber: string;
  visitPurpose: string;
  broughtItems: string;
  status: RegistrationStatus;
  createdAt: string;
  departmentName?: string;
  shiftName?: string;
  accessLevelIds?: string;
  cardNumber?: string;
  cardExpiresAt?: string;
  documents: string[];
};

type AccessLog = {
  id: number;
  visitorId: number;
  locationName: string;
  deviceName: string;
  accessType: "entry" | "exit";
  createdAt: string;
  cardNumber: string;
};

const navItems = [
  { id: "dashboard", label: "Main Dashboard", short: "Dashboard", icon: LayoutDashboard },
  { id: "sites-view", label: "Sites View", short: "Sites", icon: MapPin },
  { id: "visitor-management", label: "Visitor Management", short: "Visitors", icon: Users },
  { id: "devices", label: "Device Management", short: "Devices", icon: Monitor },
  { id: "locations", label: "Location Management", short: "Locations", icon: MapPin },
] as const;

const registrations: DemoRegistration[] = [
  {
    id: 1,
    fullName: "Rama Syahputra",
    registrationType: "contractor_type1",
    company: "PT Delta Infra",
    hostName: "Ayu Prameswari",
    phoneNumber: "+62 812 3300 1001",
    identityNumber: "3174031209980001",
    visitPurpose: "Scheduled utility maintenance",
    broughtItems: "Toolbox, helmet, laptop",
    status: "active",
    createdAt: "2026-07-10T08:45:00",
    departmentName: "Utility Engineering",
    shiftName: "Morning Shift",
    accessLevelIds: "L1, L3, L7",
    cardNumber: "RFID-0271",
    cardExpiresAt: "2026-07-11T17:00:00",
    documents: ["identity_card_rama.pdf", "skck_rama.pdf", "mcu_rama.pdf", "competency_rama.pdf"],
  },
  {
    id: 2,
    fullName: "Anisa Putri",
    registrationType: "visitor",
    company: "PT Nusa Teknik",
    hostName: "Dimas Santoso",
    phoneNumber: "+62 811 2244 7788",
    identityNumber: "3276021403970004",
    visitPurpose: "Site audit and safety review meeting",
    broughtItems: "Tablet, visitor binder",
    status: "pending",
    createdAt: "2026-07-10T09:20:00",
    documents: ["identity_card_anisa.pdf", "business_visa_anisa.pdf"],
  },
  {
    id: 3,
    fullName: "Michael Gunawan",
    registrationType: "contractor_type2",
    company: "PT Core Systems",
    hostName: "Rani Handoko",
    phoneNumber: "+62 813 9000 5533",
    identityNumber: "3172050507910002",
    visitPurpose: "Electrical inspection and panel verification",
    broughtItems: "Inspection meter, access card pouch",
    status: "active",
    createdAt: "2026-07-10T06:55:00",
    departmentName: "Production Line B",
    shiftName: "Day Shift",
    accessLevelIds: "L2, L5",
    cardNumber: "RFID-0184",
    cardExpiresAt: "2026-07-10T22:00:00",
    documents: ["identity_card_michael.pdf", "skck_michael.pdf", "competency_michael.pdf"],
  },
  {
    id: 4,
    fullName: "Nur Azizah",
    registrationType: "employee",
    company: "Internal Operations",
    hostName: "Internal HR",
    phoneNumber: "+62 812 5555 1945",
    identityNumber: "3517010806960007",
    visitPurpose: "Internal payroll and permit review",
    broughtItems: "Company laptop",
    status: "active",
    createdAt: "2026-07-10T07:10:00",
    departmentName: "Admin Office",
    shiftName: "Office Hours",
    accessLevelIds: "L1, L4",
    cardNumber: "EMP-0048",
    cardExpiresAt: "2026-07-10T18:00:00",
    documents: ["employee_badge_nur.pdf"],
  },
  {
    id: 5,
    fullName: "Kevin Pratama",
    registrationType: "visitor",
    company: "Quality Audit Partner",
    hostName: "Intan Maharani",
    phoneNumber: "+62 857 4400 0112",
    identityNumber: "3573011012000009",
    visitPurpose: "Quality assurance review",
    broughtItems: "Inspection folder",
    status: "non-active",
    createdAt: "2026-07-09T14:00:00",
    documents: ["identity_card_kevin.pdf"],
  },
];

const accessLogs: AccessLog[] = [
  { id: 1, visitorId: 1, locationName: "Main Gate", deviceName: "Reader MG-01", accessType: "entry", createdAt: "2026-07-10T08:48:00", cardNumber: "RFID-0271" },
  { id: 2, visitorId: 1, locationName: "Utility Corridor", deviceName: "Reader UT-02", accessType: "entry", createdAt: "2026-07-10T09:12:00", cardNumber: "RFID-0271" },
  { id: 3, visitorId: 1, locationName: "Panel Room", deviceName: "Reader PR-04", accessType: "exit", createdAt: "2026-07-10T11:38:00", cardNumber: "RFID-0271" },
  { id: 4, visitorId: 3, locationName: "Main Gate", deviceName: "Reader MG-01", accessType: "entry", createdAt: "2026-07-10T07:00:00", cardNumber: "RFID-0184" },
  { id: 5, visitorId: 4, locationName: "Admin Office", deviceName: "Reader AO-01", accessType: "entry", createdAt: "2026-07-10T07:25:00", cardNumber: "EMP-0048" },
];

const hourlyActivity = [18, 46, 70, 58, 41, 35, 23, 28];
const siteCards = [
  { name: "Main Gate", count: 36, note: "High entry volume this morning" },
  { name: "Production Line B", count: 22, note: "Contractor-heavy access zone" },
  { name: "Admin Office", count: 14, note: "Mostly employee movement" },
];
const deviceRows = [
  { name: "Reader MG-01", type: "RFID Reader", location: "Main Gate", status: "online" },
  { name: "Camera LB-04", type: "Face Camera", location: "Lobby", status: "online" },
  { name: "Reader PR-04", type: "RFID Reader", location: "Panel Room", status: "maintenance" },
];
const locationRows = [
  { name: "Main Gate", zone: "External Access", readers: 2, occupancy: 36 },
  { name: "Lobby", zone: "Reception", readers: 1, occupancy: 11 },
  { name: "Production Line B", zone: "Restricted", readers: 3, occupancy: 22 },
];
const cameraFeeds = [
  { id: 1, camera: "Main Entrance - Cam 01", time: "10 Jul 2026, 14:23:11" },
  { id: 2, camera: "Lobby - Cam 04", time: "10 Jul 2026, 14:22:58" },
  { id: 3, camera: "Side Gate - Cam 02", time: "10 Jul 2026, 14:21:45" },
  { id: 4, camera: "Parking Lot - Cam 08", time: "10 Jul 2026, 14:19:12" },
];

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function typeLabel(type: RegistrationType) {
  return {
    visitor: "Visitor",
    employee: "Employee",
    contractor_type1: "Contractor 1",
    contractor_type2: "Contractor 2",
  }[type];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-sm shadow-black/5 ${className}`}>{children}</div>;
}

function Avatar({ name, active = false }: { name: string; active?: boolean }) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${active ? "bg-[#4f5bd5] text-white" : "bg-[#4f5bd5]/10 text-[#4f5bd5]"}`}>
      {initials(name)}
    </div>
  );
}

export default function VmsSolutionDemo() {
  const [view, setView] = useState<VmsView>("dashboard");
  const [selectedId, setSelectedId] = useState(1);
  const [approvalTab, setApprovalTab] = useState<ApprovalTab>("Pending");
  const [search, setSearch] = useState("");

  const selected = useMemo(() => registrations.find((item) => item.id === selectedId) ?? registrations[0], [selectedId]);
  const approvalList = useMemo(() => {
    if (approvalTab === "Pending") return registrations.filter((item) => item.status === "pending");
    if (approvalTab === "History") return registrations.filter((item) => item.status !== "pending");
    return registrations;
  }, [approvalTab]);
  const filteredVisitors = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.toLowerCase();
    return registrations.filter((item) => item.fullName.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.identityNumber.includes(q));
  }, [search]);
  const logs = useMemo(() => accessLogs.filter((item) => item.visitorId === selected.id), [selected.id]);

  return (
    <div
      className="flex h-[860px] w-full flex-col overflow-hidden rounded-[2rem] border border-[#dfe3f0] bg-[#f0f2ff] shadow-[0_24px_80px_rgba(31,41,55,0.12)] md:h-[920px] xl:h-[980px]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="shrink-0 border-b border-[#e5e7eb] bg-white px-5 py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#4f5bd5]">Interactive Demo</p>
            <h3 className="mt-1 font-heading text-2xl font-semibold text-gray-900">Source-inspired VMS shell</h3>
          </div>
          <span className="inline-flex w-fit rounded-full bg-[#f0f2ff] px-4 py-2 text-sm font-semibold text-gray-600">Dummy data, no CRUD</span>
        </div>
      </div>

      <div className="shrink-0 border-b border-[#e5e7eb] bg-white px-5 py-3 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4f5bd5] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold text-[#1f2937]">Visitor Access Console</p>
              <p className="text-xs text-[#6b7280]">Static navigation and page flow demo modeled from the source app.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="relative rounded-full p-2 text-[#6b7280] hover:bg-gray-100"><Bell className="h-5 w-5" /><span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-[#ef4444]" /></button>
            <div className="flex items-center gap-2 border-l border-[#e5e7eb] pl-3">
              <CircleUserRound className="h-7 w-7 text-[#4f5bd5]" />
              <span className="text-sm font-semibold text-[#1f2937]">site.admin</span>
              <ChevronDown className="h-4 w-4 text-[#9ca3af]" />
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-[#fff7f6] px-5 py-3 text-sm font-semibold text-[#DA291C]">Global emergency banner placement is preserved in the demo shell, but actions stay disabled.</div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6 md:pb-28">
        {view === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-2xl font-bold text-[#1f2937]">Admin Analytics Dashboard</h4>
                <p className="mt-1 text-sm text-[#6b7280]">Overview of site activity, alerts, and occupancy logs.</p>
              </div>
              <button type="button" disabled className="inline-flex items-center gap-2 rounded-lg border border-[#DA291C]/30 bg-[#DA291C]/5 px-4 py-2 text-sm font-bold text-[#DA291C] opacity-70"><ShieldAlert className="h-4 w-4" />Activate Emergency Mode</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total Registered", value: "142", icon: Users, color: "bg-emerald-500" },
                { label: "Visitors", value: "36", icon: Building2, color: "bg-sky-500" },
                { label: "Contractor Type 1", value: "61", icon: ShieldCheck, color: "bg-amber-500" },
                { label: "Contractor Type 2", value: "45", icon: Fingerprint, color: "bg-violet-500" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={String(label)} className="relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between"><span className="text-sm text-[#6b7280]">{label}</span><Icon className="h-5 w-5 text-[#9ca3af]" /></div>
                  <p className="mt-4 text-3xl font-bold text-[#1f2937]">{value}</p>
                  <div className={`absolute bottom-0 left-0 h-1 w-full ${color}`} />
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
              <Panel>
                <p className="text-base font-bold text-[#1f2937]">24-Hour Entry/Exit Activity</p>
                <p className="text-sm text-[#6b7280]">Hourly RFID scans across all main gates</p>
                <div className="mt-6 grid grid-cols-8 gap-3">
                  {hourlyActivity.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div className="flex h-44 w-full items-end rounded-full bg-[#f8fafc] px-1 py-2"><div className="w-full rounded-full bg-[#4f5bd5]" style={{ height: `${value}%` }} /></div>
                      <span className="text-[11px] font-medium text-[#9ca3af]">{index + 6}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <p className="text-base font-bold text-[#1f2937]">Visitor Type Breakdown</p>
                <p className="text-sm text-[#6b7280]">Distribution of registered personnel</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: "conic-gradient(#f97316 0 43%, #3b82f6 43% 68%, #8b5cf6 68% 100%)" }}>
                    <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white"><span className="text-2xl font-bold text-[#1f2937]">142</span><span className="text-xs text-[#6b7280]">On Site</span></div>
                  </div>
                </div>
              </Panel>
            </div>

            <Panel>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h5 className="text-xl font-bold text-[#1f2937]">Persons</h5>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, ID..." className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#4f5bd5] lg:w-72" />
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredVisitors.map((person) => (
                  <button key={person.id} type="button" onClick={() => { setSelectedId(person.id); setView("person-detail"); }} className="rounded-xl border border-[#e5e7eb] bg-white p-4 text-left shadow-sm transition hover:border-[#4f5bd5]/30">
                    <div className="flex items-start gap-3"><Avatar name={person.fullName} /><div><p className="font-semibold text-[#1f2937]">{person.fullName}</p><p className="mt-1 text-sm text-[#6b7280]">{person.visitPurpose}</p></div></div>
                    <p className="mt-4 text-xs text-[#9ca3af]">{person.cardNumber ? `Card ${person.cardNumber}` : "No card bound yet"}</p>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {view === "sites-view" && (
          <div className="space-y-6">
            <div><h4 className="text-2xl font-bold text-[#1f2937]">Sites View</h4><p className="mt-1 text-sm text-[#6b7280]">Compact occupancy view based on the source route.</p></div>
            <div className="grid gap-4 lg:grid-cols-3">
              {siteCards.map((site) => <Panel key={site.name}><p className="text-lg font-bold text-[#1f2937]">{site.name}</p><p className="mt-2 text-4xl font-bold text-[#4f5bd5]">{site.count}</p><p className="mt-2 text-sm text-[#6b7280]">{site.note}</p></Panel>)}
            </div>
          </div>
        )}

        {view === "visitor-management" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div><h4 className="text-2xl font-bold text-[#1f2937]">Visitor Management</h4><p className="mt-1 text-sm text-[#6b7280]">Manage registrations, approvals, and live feeds from one place.</p></div>
              <button type="button" onClick={() => setView("visitor-list")} className="inline-flex items-center gap-2 rounded-lg bg-[#4f5bd5] px-4 py-2 text-sm font-semibold text-white"><ListChecks className="h-4 w-4" />Visitor List</button>
            </div>
            <Panel>
              <p className="text-lg font-bold text-[#1f2937]">Visitor Registration Widget</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {["Visitor", "Employee", "Contractor Type 1", "Contractor Type 2"].map((label) => <div key={label} className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"><p className="font-semibold text-[#1f2937]">{label}</p><p className="mt-2 text-sm text-[#6b7280]">Static entry card based on source flow.</p></div>)}
              </div>
            </Panel>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel><p className="text-lg font-bold text-[#1f2937]">Host Approval Widget</p><div className="mt-5 space-y-3">{registrations.filter((item) => item.status === "pending").map((item) => <div key={item.id} className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"><p className="font-semibold text-[#1f2937]">{item.fullName}</p><p className="mt-1 text-sm text-[#6b7280]">{typeLabel(item.registrationType)} - {item.company}</p></div>)}</div><button type="button" onClick={() => setView("approvals")} className="mt-5 rounded-lg border border-[#d7dcfa] bg-white px-4 py-2 text-sm font-semibold text-[#4f5bd5]">Open Host Approval</button></Panel>
              <Panel><p className="text-lg font-bold text-[#1f2937]">Face Detection Widget</p><div className="mt-5 grid grid-cols-2 gap-3">{cameraFeeds.map((feed) => <div key={feed.id} className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"><div className="flex aspect-square items-end rounded-xl bg-[linear-gradient(145deg,#dbe4ff_0%,#eef3ff_100%)] p-3"><Camera className="h-5 w-5 text-[#4f5bd5]" /></div><p className="mt-3 text-sm font-semibold text-[#1f2937]">{feed.camera}</p></div>)}</div><button type="button" onClick={() => setView("cameras")} className="mt-5 rounded-lg border border-[#d7dcfa] bg-white px-4 py-2 text-sm font-semibold text-[#4f5bd5]">Open Face Detection Feed</button></Panel>
            </div>
          </div>
        )}

        {view === "devices" && (
          <div className="space-y-6">
            <div><h4 className="text-2xl font-bold text-[#1f2937]">Device Management</h4><p className="mt-1 text-sm text-[#6b7280]">Static device list reflecting source routes.</p></div>
            <Panel><div className="grid gap-3">{deviceRows.map((row) => <div key={row.name} className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 md:grid-cols-[1.2fr_1fr_1fr] md:items-center"><div><p className="font-semibold text-[#1f2937]">{row.name}</p><p className="mt-1 text-sm text-[#6b7280]">{row.type}</p></div><p className="text-sm text-[#374151]">{row.location}</p><span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${row.status === "online" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{row.status}</span></div>)}</div></Panel>
          </div>
        )}

        {view === "locations" && (
          <div className="space-y-6">
            <div><h4 className="text-2xl font-bold text-[#1f2937]">Location Management</h4><p className="mt-1 text-sm text-[#6b7280]">Static access zone cards reflecting source routes.</p></div>
            <div className="grid gap-4 md:grid-cols-3">{locationRows.map((row) => <Panel key={row.name}><p className="text-lg font-bold text-[#1f2937]">{row.name}</p><p className="mt-1 text-sm text-[#6b7280]">{row.zone}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f8fafc] p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">Readers</p><p className="mt-2 text-2xl font-bold text-[#1f2937]">{row.readers}</p></div><div className="rounded-xl bg-[#f8fafc] p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">Occupancy</p><p className="mt-2 text-2xl font-bold text-[#1f2937]">{row.occupancy}</p></div></div></Panel>)}</div>
          </div>
        )}

        {view === "approvals" && (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-5 rounded-3xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
              <button type="button" onClick={() => setView("visitor-management")} className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280]"><ChevronLeft className="h-4 w-4" />Back to Hub</button>
              <div className="flex items-center gap-3"><h4 className="text-2xl font-bold text-[#1f2937]">Host Approval</h4><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#4f5bd5]">{registrations.filter((item) => item.status === "pending").length} Pending</span></div>
              <div className="flex rounded-full border border-[#e5e7eb] bg-gray-100/80 p-1.5">{(["Pending", "All", "History"] as ApprovalTab[]).map((tab) => <button key={tab} type="button" onClick={() => setApprovalTab(tab)} className={`flex-1 rounded-full py-1.5 text-sm font-semibold ${approvalTab === tab ? "bg-[#4f5bd5] text-white" : "text-[#6b7280]"}`}>{tab}</button>)}</div>
              <div className="space-y-2">{approvalList.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${item.id === selectedId ? "border-[#4f5bd5] bg-blue-50" : "border-transparent hover:bg-[#f8fafc]"}`}><Avatar name={item.fullName} active={item.id === selectedId} /><div><p className="text-sm font-semibold text-[#1f2937]">{item.fullName}</p><p className="text-xs text-[#9ca3af]">{typeLabel(item.registrationType)} - {item.company}</p></div></button>)}</div>
            </aside>
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">{[{ label: "Full Name", value: selected.fullName, icon: Users }, { label: "Company Name", value: selected.company, icon: Building2 }, { label: "Phone Number", value: selected.phoneNumber, icon: Clock3 }, { label: "Host Name", value: selected.hostName, icon: UserCircle2 }].map(({ label, value, icon: Icon }) => <Panel key={label}><p className="text-sm font-semibold text-[#1f2937]">{label}</p><div className="mt-2 flex items-center gap-3 rounded-xl border border-[#e5e7eb] px-4 py-3"><Icon className="h-4 w-4 text-[#9ca3af]" /><span className="text-sm font-medium text-[#1f2937]">{value}</span></div></Panel>)}</div>
              <Panel><p className="text-sm font-semibold text-[#1f2937]">Purpose</p><div className="mt-2 rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm font-medium text-[#1f2937]">{selected.visitPurpose}</div></Panel>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{selected.documents.map((file) => <Panel key={file}><div className="flex items-center gap-2 font-bold text-[#1f2937]"><IdCard className="h-4 w-4 text-[#4f5bd5]" />DOCUMENT</div><div className="mt-4 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"><p className="text-sm font-semibold text-[#1f2937]">{file}</p></div></Panel>)}</div>
              <Panel><div className="flex items-center justify-between"><p className="text-lg font-bold text-[#1f2937]">Approval Decision</p><span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-[#6b7280]">Demo only</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Department", selected.departmentName ?? "Utility Engineering"], ["Shift", selected.shiftName ?? "Morning Shift"], ["Assign Card", selected.cardNumber ?? "No Card"], ["Access Levels", selected.accessLevelIds ?? "L1, L3"]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9ca3af]">{label}</p><p className="mt-2 text-sm font-semibold text-[#1f2937]">{value}</p></div>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" disabled className="rounded-xl border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#1f2937] opacity-60">Deny Entry</button><button type="button" disabled className="rounded-xl bg-[#4f5bd5] px-6 py-3 text-sm font-semibold text-white opacity-60">Approve Entry</button></div></Panel>
            </section>
          </div>
        )}

        {view === "cameras" && (
          <div className="space-y-6">
            <button type="button" onClick={() => setView("visitor-management")} className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280]"><ChevronLeft className="h-4 w-4" />Back to Hub</button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><ScanFace className="h-7 w-7 text-[#4f5bd5]" /><div><h4 className="text-2xl font-bold text-[#1f2937]">Face Detection Feed</h4><p className="mt-1 text-sm text-[#6b7280]">Source-aligned camera grid with capture/upload entry point.</p></div></div><button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#4f5bd5] px-5 py-2.5 text-sm font-semibold text-white"><Camera className="h-4 w-4" />Capture / Upload Face</button></div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">{cameraFeeds.map((feed) => <button key={feed.id} type="button" className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white text-left shadow-sm"><div className="flex aspect-square items-end bg-[linear-gradient(145deg,#dbe4ff_0%,#eef3ff_100%)] p-4"><Camera className="h-6 w-6 text-[#4f5bd5]" /></div><div className="p-3"><p className="text-sm font-semibold text-[#1f2937]">{feed.camera}</p><p className="mt-1 text-xs text-[#9ca3af]">{feed.time}</p></div></button>)}</div>
          </div>
        )}

        {view === "visitor-list" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h4 className="text-2xl font-bold text-[#1f2937]">Visitor List</h4><p className="mt-1 text-sm text-[#6b7280]">All registered visitors and contractors with source-inspired filters.</p></div><button type="button" onClick={() => setView("visitor-management")} className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280]"><ChevronLeft className="h-4 w-4" />Back to Hub</button></div>
            <Panel><div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, company, ID..." className="w-full rounded-lg border border-[#e5e7eb] bg-white py-2 pl-9 pr-4 text-sm outline-none lg:w-72" /></div><button type="button" className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-medium text-[#374151]">All Status</button></div><div className="overflow-hidden rounded-xl border border-[#e5e7eb]">{filteredVisitors.map((person) => <button key={person.id} type="button" onClick={() => { setSelectedId(person.id); setView("person-detail"); }} className="grid w-full items-center gap-3 border-t border-[#eef2f7] bg-white px-5 py-4 text-left first:border-t-0 md:grid-cols-[1.3fr_1fr_1fr_0.8fr]"><div className="flex items-center gap-3"><Avatar name={person.fullName} /><div><p className="font-semibold text-[#1f2937]">{person.fullName}</p><p className="text-xs text-[#9ca3af]">{person.identityNumber}</p></div></div><span className="text-sm text-[#374151]">{person.company}</span><span className="text-sm text-[#374151]">{person.hostName}</span><span className="text-sm text-[#374151]">{formatDate(person.createdAt)}</span></button>)}</div></Panel>
          </div>
        )}

        {view === "person-detail" && (
          <div className="space-y-6">
            <button type="button" onClick={() => setView("visitor-list")} className="inline-flex items-center gap-2 text-sm font-medium text-[#6b7280]"><ChevronLeft className="h-4 w-4" />Back to Visitor List</button>
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              <div className="space-y-6">
                <Panel className="overflow-hidden p-0"><div className="bg-[linear-gradient(135deg,#4f5bd5_0%,#6c8eef_100%)] px-6 py-6 text-white"><div className="flex items-center gap-4"><Avatar name={selected.fullName} /><div><p className="text-2xl font-bold">{selected.fullName}</p><p className="mt-1 text-sm text-white/80">{typeLabel(selected.registrationType)}</p></div></div></div><div className="space-y-4 p-6">{[["Visitor ID", `V-${new Date(selected.createdAt).getFullYear()}-${String(selected.id).padStart(4, "0")}`], ["Phone Number", selected.phoneNumber], ["Host Name", selected.hostName], ["Purpose", selected.visitPurpose], ["Belonging", selected.broughtItems]].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between gap-4"><span className="text-sm font-medium text-[#6b7280]">{label}</span><span className="text-sm font-semibold text-[#1f2937]">{value}</span></div>)}<div className="grid gap-3 sm:grid-cols-3">{[{ label: "Bind RFID", icon: CreditCard }, { label: "Edit Profile", icon: IdCard }, { label: "Sync ZKTeco", icon: ShieldCheck }].map(({ label, icon: Icon }) => <button key={label} type="button" className="flex items-center justify-center gap-2 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151]"><Icon className="h-4 w-4" />{label}</button>)}</div></div></Panel>
                <Panel><div className="flex items-center gap-2"><Settings className="h-4 w-4 text-[#4f5bd5]" /><p className="text-base font-bold text-[#1f2937]">Technical Details</p></div><div className="mt-5 space-y-4">{[["Department", selected.departmentName ?? "Not Assigned"], ["Shift Schedule", selected.shiftName ?? "Not Assigned"], ["Access Level IDs", selected.accessLevelIds ?? "None"]].map(([label, value]) => <div key={String(label)}><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9ca3af]">{label}</p><p className="mt-1 font-semibold text-[#1f2937]">{value}</p></div>)}</div></Panel>
              </div>
              <div className="space-y-6">
                <Panel><p className="text-lg font-bold text-[#1f2937]">Visit History & Logs</p><div className="mt-6 space-y-4">{logs.map((log) => <div key={log.id} className="rounded-xl bg-[#f8fafc] p-4"><p className="text-[15px] font-bold text-[#1a1f36]">{log.locationName}</p><p className="mt-1 text-[13px] text-[#6b7280]">{formatDate(log.createdAt)} - {formatTime(log.createdAt)}</p><p className="mt-3 text-[13px] text-[#6b7280]">Device: <span className="font-semibold text-[#1a1f36]">{log.deviceName}</span></p><div className="mt-3 inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#4b5563]">Card: {log.cardNumber}</div></div>)}</div></Panel>
                <div className="grid gap-4 sm:grid-cols-2">{selected.documents.map((file) => <Panel key={file}><div className="flex items-center gap-2 text-base font-bold text-[#1f2937]"><IdCard className="h-4 w-4 text-[#4f5bd5]" />DOCUMENT</div><div className="mt-4 rounded-xl border border-[#e5e7eb] p-3"><p className="text-sm font-semibold text-[#1f2937]">{file}</p><p className="mt-1 text-xs text-[#9ca3af]">{formatDate(selected.createdAt)}</p></div></Panel>)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#e5e7eb] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-1 rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-xl shadow-black/10">
          {navItems.map(({ id, label, short, icon: Icon }) => {
            const active = view === id;
            return (
              <button key={id} type="button" onClick={() => setView(id)} className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-medium ${active ? "bg-[#4f5bd5] text-white" : "text-[#6b7280] hover:bg-gray-50 hover:text-[#1f2937]"}`}>
                <Icon className="h-5 w-5" />
                <span className="hidden sm:block">{label}</span>
                <span className="sm:hidden">{short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
