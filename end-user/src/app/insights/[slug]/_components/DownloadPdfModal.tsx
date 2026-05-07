"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, CheckCircle } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

type Props = {
  slug: string;
  blogTitle: string;
  pdfPath: string;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
};

export default function DownloadPdfModal({ slug, blogTitle, pdfPath }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/lead", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        from: `insight/${slug}`,
        pdfPath,
        blogTitle,
      });

      if (response.status === 201) {
        setIsDone(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setTimeout(() => {
        setIsDone(false);
        setForm({ name: "", email: "", phone: "" });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-full bg-primary hover:bg-red-800 text-white font-semibold px-6 h-12 transition-all duration-300">
          <Download size={18} />
          Download PDF
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-6 sm:p-8 bg-[#F2EDE6]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold font-heading text-gray-900 !leading-[130%]">
            {isDone ? "Check your email!" : "Get the Full PDF"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-1">
            {isDone
              ? `We've sent the PDF to your email. Happy reading!`
              : "Fill in your details and we'll send the PDF straight to your inbox."}
          </DialogDescription>
        </DialogHeader>

        {isDone ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="text-primary w-14 h-14" />
            <p className="text-center text-gray-700 text-sm">
              The PDF for <strong>{blogTitle}</strong> has been sent to <strong>{form.email}</strong>.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="rounded-full bg-primary hover:bg-red-800 text-white px-8 mt-2"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="rounded-xl border-gray-300 focus-visible:ring-primary/30 bg-white h-11"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address <span className="text-primary">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="rounded-xl border-gray-300 focus-visible:ring-primary/30 bg-white h-11"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-primary">*</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+62 8xx xxxx xxxx"
                className="rounded-xl border-gray-300 focus-visible:ring-primary/30 bg-white h-11"
              />
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              By submitting, you agree to receive the requested PDF via email. We respect your privacy.
            </p>

            <Button
              type="submit"
              disabled={isLoading}
              className={`rounded-full h-12 font-semibold text-white transition-all duration-300 ${
                isLoading ? "bg-primary/50 pointer-events-none" : "bg-primary hover:bg-red-800"
              }`}
            >
              {isLoading ? "Sending PDF..." : "Send PDF to My Email"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
