import Sidebar from "@/components/layout/Sidebar";
import type { ReactNode } from "react";

type PagesLayoutProps = {
  children: ReactNode;
};

const PagesLayout = ({ children }: PagesLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col px-8 py-6">
        <main className="mt-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default PagesLayout;
