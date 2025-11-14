import StatCard from "./StatCard";

const stats = [
  {
    title: "Total Commission",
    value: "IDR 42.5M",
    subtitle: "+12% from last month",
    accentColor: "#E30613",
    images: "/assets/icons/coin-icon.svg",
  },
  {
    title: "Pending Commission",
    value: "IDR 3.5M",
    subtitle: "1 pending",
    images: "/assets/icons/stopwatch-icon.svg",
  },
  {
    title: "Total Leads",
    value: "24",
    subtitle: "+3 this month",
    images: "/assets/icons/group-icon.svg",
  },
  {
    title: "Closed Leads",
    value: "8",
    subtitle: "32% conversion",
    images: "/assets/icons/deal-icon.svg",
  },
];

const StatsSection = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <StatCard key={item.title} {...item} />
      ))}
    </section>
  );
};

export default StatsSection;
