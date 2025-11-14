import AvailableServicesTable from "@/components/dashboard/AvailableServicesTable";
import CommissionHistoryTable from "@/components/dashboard/CommissionHistoryTable";
import CurrentLeadsTable from "@/components/dashboard/CurrentLeadsTable";
import StatsSection from "@/components/dashboard/StatsSection";
import Topbar from "@/components/layout/Topbar";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <Topbar />
      <StatsSection />
      <AvailableServicesTable />
      <CurrentLeadsTable />
      <CommissionHistoryTable />
    </div>
  );
};

export default DashboardPage;
