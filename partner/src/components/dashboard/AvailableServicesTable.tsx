"use client";

import Badge from "@/components/ui/Badge";
import { useAvailableServices } from "@/hooks/useDashboardData";

const AvailableServicesTable = () => {
  const services = useAvailableServices();

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Available Services
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
              <th className="pb-3">Service Name</th>
              <th className="pb-3">Commission %</th>
              <th className="pb-3">Description</th>
              <th className="pb-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((service) => (
              <tr key={service.id} className="align-top">
                <td className="py-4 text-sm font-semibold text-slate-900">
                  {service.name}
                </td>
                <td className="py-4">
                  <Badge category="payment" variant="paid">{service.commission}</Badge>
                </td>
                <td className="py-4 text-black">{service.description}</td>
                <td className="py-4 text-center">
                  <button
                    type="button"
                    className="rounded-full bg-[#E30613] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#c0050f]"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AvailableServicesTable;
