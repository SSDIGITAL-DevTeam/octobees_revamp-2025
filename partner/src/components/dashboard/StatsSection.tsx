"use client";

import { useDashboardStats } from "@/hooks/useDashboardData";

import StatCard from "./StatCard";

const StatsSection = () => {
  const stats = useDashboardStats();

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ id, ...stat }) => (
        <StatCard key={id} {...stat} />
      ))}
    </section>
  );
};

export default StatsSection;
