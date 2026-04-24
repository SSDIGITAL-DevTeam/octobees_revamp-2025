"use client";

import StatCard from "./StatCard";
import type { DashboardStat } from "@/data/dashboard";

const StatsSection = ({ stats }: { stats: DashboardStat[] }) => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ id, ...stat }) => (
        <StatCard key={id} {...stat} />
      ))}
    </section>
  );
};

export default StatsSection;
