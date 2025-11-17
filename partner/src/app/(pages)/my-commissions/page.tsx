"use client";

import { useMemo, useState } from "react";

import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/dashboard/StatCard";

type CommissionEntry = {
  id: string;
  date: string;
  leadName: string;
  service: string;
  projectValue: string;
  commissionPercent: string;
  amount: string;
  statusLabel: "paid" | "pending_transfer" | "pending";
  paidDate: string;
  period: "this_month" | "all";
};

const commissionStats = [
  {
    id: "total",
    title: "Total Commission",
    value: "IDR 42.5M",
    subtitle: "+12% from last month",
    accentColor: "#E30613",
    images: "/assets/icons/coin-icon.svg",
  },
  {
    id: "this_month",
    title: "This Month",
    value: "24",
    subtitle: "+25% from last month",
    images: "/assets/icons/group-icon.svg",
  },
  {
    id: "pending",
    title: "Pending Commission",
    value: "IDR 3.5M",
    subtitle: "1 pending",
    images: "/assets/icons/stopwatch-icon.svg",
  },
  {
    id: "closed",
    title: "Closed Leads",
    value: "8",
    subtitle: "+2 this month",
    images: "/assets/icons/deal-icon.svg",
  },
];

const commissionEntries: CommissionEntry[] = [
  {
    id: "1",
    date: "Oct 10, 2025",
    leadName: "PT Tech Solution",
    service: "Web Development",
    projectValue: "IDR 45,000,000",
    commissionPercent: "15%",
    amount: "IDR 5,000,000",
    statusLabel: "paid",
    paidDate: "Oct 10, 2025",
    period: "this_month",
  },
  {
    id: "2",
    date: "Oct 10, 2025",
    leadName: "PT Tech Solution",
    service: "Web Development",
    projectValue: "IDR 45,000,000",
    commissionPercent: "15%",
    amount: "IDR 5,000,000",
    statusLabel: "pending_transfer",
    paidDate: "-",
    period: "this_month",
  },
  {
    id: "3",
    date: "Oct 10, 2025",
    leadName: "PT Tech Solution",
    service: "Web Development",
    projectValue: "IDR 45,000,000",
    commissionPercent: "15%",
    amount: "IDR 5,000,000",
    statusLabel: "paid",
    paidDate: "Oct 10, 2025",
    period: "this_month",
  },
  {
    id: "4",
    date: "Oct 10, 2025",
    leadName: "PT Tech Solution",
    service: "Web Development",
    projectValue: "IDR 45,000,000",
    commissionPercent: "15%",
    amount: "IDR 5,000,000",
    statusLabel: "paid",
    paidDate: "Oct 10, 2025",
    period: "all",
  },
  {
    id: "5",
    date: "Oct 10, 2025",
    leadName: "PT Tech Solution",
    service: "Web Development",
    projectValue: "IDR 45,000,000",
    commissionPercent: "15%",
    amount: "IDR 5,000,000",
    statusLabel: "paid",
    paidDate: "Oct 10, 2025",
    period: "all",
  },
];

const statusConfig = {
  paid: {
    label: "Paid",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  pending_transfer: {
    label: "Pending Transfer",
    badgeClass: "bg-amber-50 text-amber-700",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-slate-100 text-slate-700",
  },
};

const MyCommisionsPage = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | keyof typeof statusConfig>("all");
  const [timeFilter, setTimeFilter] = useState<"all" | "this_month">("all");

  const filteredData = useMemo(() => {
    return commissionEntries.filter((entry) => {
      const matchStatus =
        statusFilter === "all" ? true : entry.statusLabel === statusFilter;
      const matchPeriod =
        timeFilter === "all"
          ? true
          : entry.period === "this_month";
      return matchStatus && matchPeriod;
    });
  }, [statusFilter, timeFilter]);

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Lead Name",
      "Service",
      "Project Value",
      "Commission %",
      "Amount",
      "Status",
      "Paid Date",
    ];

    const rows = filteredData.map((entry) => [
      entry.date,
      entry.leadName,
      entry.service,
      entry.projectValue,
      entry.commissionPercent,
      entry.amount,
      statusConfig[entry.statusLabel].label,
      entry.paidDate,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "my-commissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Topbar title="My Commissions" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commissionStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3">
            <select
              className="rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending_transfer">Pending Transfer</option>
              <option value="pending">Pending</option>
            </select>

            <select
              className="rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none"
              value={timeFilter}
              onChange={(event) =>
                setTimeFilter(event.target.value as typeof timeFilter)
              }
            >
              <option value="all">All Time</option>
              <option value="this_month">This Month</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f]"
          >
            Export report
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
                <th className="pb-3">Date</th>
                <th className="pb-3">Lead Name</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Project Value</th>
                <th className="pb-3">Commission %</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Paid Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredData.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-4">{entry.date}</td>
                  <td className="py-4 font-semibold">{entry.leadName}</td>
                  <td className="py-4">{entry.service}</td>
                  <td className="py-4">{entry.projectValue}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-[#E6F5EF] px-3 py-1 text-xs font-semibold text-emerald-700">
                      {entry.commissionPercent}
                    </span>
                  </td>
                  <td className="py-4">{entry.amount}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[entry.statusLabel].badgeClass}`}
                    >
                      {statusConfig[entry.statusLabel].label}
                    </span>
                  </td>
                  <td className="py-4">{entry.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyCommisionsPage;
