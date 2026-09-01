"use client";

import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Lead, LeadStatus } from "@/constrant/payload";

const NAME_RE = /^[\p{L}][\p{L}\p{N} .'-]{1,159}$/u;
const PHONE_RE = /^\+?[\d\s()-]{7,25}$/;

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "won", label: "Closed Won" },
  { value: "lost", label: "Closed Lost" },
];

export default function CreateLeadModal({
  open,
  onClose,
  onCreated,
  initialStatus = "new",
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
  initialStatus?: LeadStatus;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [business, setBusiness] = useState("");
  const [from, setFrom] = useState("manual");
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!open) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errs.name = "Full name is required";
    } else if (trimmedName.length < 2) {
      errs.name = "Name must be at least 2 characters long";
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = "Name cannot consist of numbers only";
    } else if (!NAME_RE.test(trimmedName)) {
      errs.name = "Name must start with a letter and contain valid name characters";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address";
    }

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errs.phone = "Phone number is required";
    } else if (!PHONE_RE.test(trimmedPhone)) {
      errs.phone = "Phone number must contain only numbers and valid symbols (e.g. +62 812 3456 7890)";
    }

    if (!companyName.trim()) {
      errs.companyName = "Company name is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        business: business.trim() || companyName.trim(),
        from: from.trim() || "manual",
        status,
        message: message.trim() || undefined,
      };

      const res = await axiosInstance.post("/back-office/lead", payload);

      const newLead: Lead = {
        id: res.data?.id || `lead-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onCreated(newLead);
      onClose();
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompanyName("");
      setBusiness("");
      setMessage("");
      setErrors({});
    } catch (err: any) {
      setServerError(err.response?.data?.error || err.message || "Failed to create lead.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Lead</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add a new prospective lead manually to the pipeline</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alexander Smith"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                errors.name ? "border-rose-400 bg-rose-50/30" : "border-gray-200 focus:border-red-500"
              }`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                  errors.email ? "border-rose-400 bg-rose-50/30" : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="+62 812 3456 7890"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                  errors.phone ? "border-rose-400 bg-rose-50/30" : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.phone && <p className="mt-1 text-[11px] text-rose-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: "" }));
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none ${
                  errors.companyName ? "border-rose-400 bg-rose-50/30" : "border-gray-200 focus:border-red-500"
                }`}
              />
              {errors.companyName && <p className="mt-1 text-[11px] text-rose-500">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Business Field</label>
              <input
                type="text"
                placeholder="Technology / Software"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-colors focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-colors focus:border-red-500 focus:outline-none bg-white"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Lead Source</label>
              <input
                type="text"
                placeholder="manual"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm transition-colors focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes / Message</label>
            <textarea
              rows={3}
              placeholder="Additional information..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm transition-colors focus:border-red-500 focus:outline-none resize-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-800 transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
