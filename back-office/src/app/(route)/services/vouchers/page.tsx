"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteDialog } from "@/components/partials/dialog/DialogDelete";

type Voucher = {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUsage: number | null;
  currentUsage: number;
  isActive: boolean;
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [type, setType] = useState("fixed");
  const [value, setValue] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/voucher");
        setVouchers(response.data);
      } catch (error: any) {
        toast.error("Error fetching vouchers");
      }
    };
    fetchData();
  }, [refetch]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/voucher/${id}`);
      toast.success("Voucher deleted successfully");
      setRefetch((prev) => !prev);
    } catch (error: any) {
      toast.error("Failed to delete voucher");
    }
  };

  const handleOpenEdit = (v: Voucher) => {
    setEditingId(v.id);
    setCode(v.code);
    setType(v.type);
    setValue(v.value.toString());
    setMaxUsage(v.maxUsage !== null ? v.maxUsage.toString() : "");
    setIsActive(v.isActive);
    setIsOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setCode("");
    setType("fixed");
    setValue("");
    setMaxUsage("");
    setIsActive(true);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code,
        type,
        value: Number(value),
        maxUsage: maxUsage ? Number(maxUsage) : null,
        isActive,
      };

      if (editingId) {
        await axiosInstance.put(`/voucher/${editingId}`, payload);
        toast.success("Voucher updated successfully");
      } else {
        await axiosInstance.post("/voucher", payload);
        toast.success("Voucher created successfully");
      }
      
      setIsOpen(false);
      setRefetch((prev) => !prev);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save voucher");
    }
  };

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Voucher / Promo Code"} label={"Service Management"} />
      <section className="flex flex-col gap-8 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh]">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">All Vouchers</h1>
            <p>Manage your promo codes here</p>
          </div>

          <div className="flex items-center">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenAdd} variant={"addData"} size={"sm"} className="flex gap-2 items-center">
                  <CirclePlus size={15} /> Add Voucher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Voucher" : "Add New Voucher"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-2">
                    <Label>Voucher Code</Label>
                    <Input
                      required
                      placeholder="e.g. POTONG50K"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Discount Type</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="fixed">Fixed Nominal (e.g. 50000)</option>
                      <option value="percentage">Percentage (e.g. 10%)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Value</Label>
                    <Input
                      required
                      type="number"
                      placeholder="e.g. 50000"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Max Usage (Optional)</Label>
                    <Input
                      type="number"
                      placeholder="Leave blank for unlimited"
                      value={maxUsage}
                      onChange={(e) => setMaxUsage(e.target.value)}
                    />
                  </div>
                  {editingId && (
                    <div className="flex flex-col gap-2">
                      <Label>Status</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={isActive ? "true" : "false"}
                        onChange={(e) => setIsActive(e.target.value === "true")}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  )}
                  <Button type="submit" className="mt-4">
                    {editingId ? "Update Voucher" : "Save Voucher"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full border rounded-xl overflow-hidden mt-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium">{v.code}</td>
                  <td className="px-6 py-4 capitalize">{v.type}</td>
                  <td className="px-6 py-4">
                    {v.type === "fixed" ? `Rp ${v.value.toLocaleString("id-ID")}` : `${v.value}%`}
                  </td>
                  <td className="px-6 py-4">
                    {v.currentUsage} / {v.maxUsage === null ? "∞" : v.maxUsage}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        v.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {v.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <button onClick={() => handleOpenEdit(v)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-md">
                        <Pencil size={16} />
                      </button>
                      <DeleteDialog deleteFunc={() => handleDelete(v.id)}>
                        <button className="text-red-500 hover:bg-red-50 p-2 rounded-md">
                          <Trash size={16} />
                        </button>
                      </DeleteDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {vouchers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No vouchers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
