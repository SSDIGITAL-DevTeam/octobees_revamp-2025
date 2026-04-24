"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Plus, MoreHorizontal, Copy, Trash2, Tag, Percent, DollarSign } from "lucide-react";

import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets";
import { Button } from "@/components/ui/button";
import {
  getPartnerServices,
  deletePartnerService,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership";

type CommissionControlTableProps = {
  onRefresh: () => void;
  onAddNew: () => void;
  onEdit: (service: PartnerServiceApiItem) => void;
};

export const CommissionControlTable = ({
  onRefresh,
  onAddNew,
  onEdit,
}: CommissionControlTableProps) => {
  const [services, setServices] = useState<PartnerServiceApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getPartnerServices();
      const { data } = res.data;
      if (data && Array.isArray(data)) {
        setServices(data);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product catalog item?")) return;

    try {
      setDeletingId(id);
      await deletePartnerService(id);
      await fetchServices();
      onRefresh();
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Your Product & Service Catalog</h3>
          <p className="text-sm text-slate-500 mt-1">Manage the available services and linked sales materials.</p>
        </div>
        <Button
          onClick={onAddNew}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 font-semibold shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-100/50 text-slate-600">
              <th className="font-semibold px-6 py-4">Service Name</th>
              <th className="font-semibold py-4">Project Value</th>
              <th className="font-semibold py-4">Status</th>
              <th className="font-semibold py-4">Description</th>
              <th className="font-semibold text-right px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="h-40 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                    Loading products...
                  </div>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-40 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="h-8 w-8 text-slate-300" />
                    <p>No products available yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="font-semibold text-slate-900 px-6 py-4">{service.name}</td>
                  <td className="py-4 text-slate-700 font-medium">${service.projectValue?.toLocaleString("en-US") || 0}</td>
                  <td className="py-4">
                    <StatusBadge
                      label={service.isActive ? "Active" : "Inactive"}
                      tone={service.isActive ? "success" : "default"}
                    />
                  </td>
                  <td className="py-4 text-slate-500 max-w-[200px] truncate">{service.description || "-"}</td>
                  <td className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(service)} className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} disabled={deletingId === service.id} className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
