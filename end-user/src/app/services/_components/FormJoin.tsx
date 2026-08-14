"use client";
import Header from "./Header";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import ServiceFieldInput from "@/components/partials/Field/ServiceFieldInput";
import FieldPhoneInput from "@/components/partials/Field/FieldPhoneInput";
import { axiosInstance } from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { failToast, successToast } from "@/config/toastConfig";
import { usePathname, useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import FieldCheckbox from "@/components/partials/Field/FieldCheckbox";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formData = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  companyName: z.string().nonempty(),
  companyWebsite: z.string().optional(),
  business: z.string().nonempty(),
  phone: z
    .string()
    .nonempty()
    .refine(
      (val) => {
        return val.length > 3 && /\d{4,}/.test(val.replace(/^\+\d{1,3}/, ""));
      },
      {
        message: "Please enter a valid phone number",
      },
    ),
  isAgree: z.literal(true, {
    errorMap: () => ({ message: "You must agree before submitting the form." }),
  }),
});

type FormData = z.infer<typeof formData>;

const CHECKBOX_OPTIONS = [
  "Get my brand recommended by ChatGPT, Gemini, or Perplexity",
  "Increase my brand's visibility in AI search results",
  "Find out why competitors are being cited instead of my brand",
  "Improve my website/content for AI search",
  "Get a GEO / AI visibility audit",
  "I'm not sure yet, I'd like your recommendation",
];

export default function FormJoin() {
  const basePathname = usePathname();

  const lastSegment = basePathname.split("/").filter(Boolean).pop() || "";

  const pathname = lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isLoading, setIsLoading] = useState(false);

  // Remarks Checkbox State
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherText, setOtherText] = useState("");

  // Voucher State
  const [voucherCode, setVoucherCode] = useState("");
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    type: string;
    value: number;
  } | null>(null);

  // Modal Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      business: "",
      isAgree: undefined,
    },
    resolver: zodResolver(formData),
  });
  const { handleSubmit, control, reset } = form;

  const handleCheckboxChange = (option: string) => {
    setSelectedRemarks((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code", failToast);
      return;
    }
    setIsValidatingVoucher(true);
    try {
      const res = await axiosInstance.post("/voucher/validate", { code: voucherCode });
      const voucherData = res.data.voucher;
      setAppliedVoucher(voucherData);
      
      const discountText = voucherData.type === 'fixed' 
        ? `Rp ${voucherData.value.toLocaleString('id-ID')}`
        : `${voucherData.value}%`;

      setAlertType("success");
      setAlertMessage(`Coupon Applied! You get a ${discountText} discount.`);
      setAlertOpen(true);
    } catch (error: any) {
      setAppliedVoucher(null);
      setAlertType("error");
      setAlertMessage(error.response?.data?.error || "Invalid voucher code");
      setAlertOpen(true);
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true);
    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA is not available");
      }
      
      // Combine remarks
      const finalRemarks = [...selectedRemarks];
      if (isOtherSelected && otherText.trim() !== "") {
        finalRemarks.push(otherText.trim());
      }
      const messageString = finalRemarks.join(", ");

      const token = await executeRecaptcha("formSubmit");
      await axiosInstance.post("/lead", {
        ...value,
        message: messageString,
        voucherCode: appliedVoucher ? appliedVoucher.code : null,
        phone: value.phone.replaceAll("+", ""),
        from: pathname,
        token,
      });
      
      toast.success("Your message has been sent.", successToast);
      
      // Pass voucher info to thank you page if applied
      if (appliedVoucher) {
        const query = new URLSearchParams({
          voucherApplied: "true",
          vType: appliedVoucher.type,
          vValue: appliedVoucher.value.toString()
        }).toString();
        router.push(`/thanks/service-request?${query}`);
      } else {
        router.push("/thanks/service-request");
      }
      
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.message || error.response?.data?.error || "Message not sent",
        failToast,
      );
    } finally {
      setIsLoading(false);
      reset();
      setSelectedRemarks([]);
      setIsOtherSelected(false);
      setOtherText("");
      setVoucherCode("");
      setAppliedVoucher(null);
    }
  });

  return (
    <div
      id="consultation"
      className="md:scroll-mt-[160px] lg:max-w-7xl flex flex-col gap-2 justify-center items-center lg:gap-10 lg:mx-auto px-5"
    >
      <Header
        title="BE PART OF THE SMART BUSINESS OWNERS THAT AUTOMATE, SCALE, AND WIN."
        subtitle={"Unlock Exclusive Early-Adopter Benefits."}
        className="text-white md:max-w-7xl"
        subClassName="text-white/80 md:text-white/80 italic text-base md:text-xl"
      />
      <div className="w-full md:max-w-5xl pt-8 md:pt-0 px-5 sm:px-10 md:px-20 lg:px-0">
        <Form {...form}>
          <form
            onSubmit={handleInput}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <ServiceFieldInput
              control={control}
              label="Name: *"
              name="name"
              placeholder="Enter your name"
              labelClassName="text-white"
            />
            <ServiceFieldInput
              control={control}
              label="Email: *"
              name="email"
              placeholder="Enter your email address"
              labelClassName="text-white"
            />
            <FieldPhoneInput
              control={control}
              label="Contact No: *"
              name="phone"
              placeholder="Enter your phone number"
              labelClassName="text-white"
            />
            <ServiceFieldInput
              control={control}
              label="Company Name: *"
              name="companyName"
              placeholder="Enter your company's name"
              labelClassName="text-white"
            />
            <ServiceFieldInput
              control={control}
              label="Company Website:"
              name="companyWebsite"
              placeholder="e.g.https://www.yourcompany.com"
              labelClassName="text-white"
            />
            <ServiceFieldInput
              control={control}
              label="Business Industry: *"
              name="business"
              placeholder="Your business industry"
              labelClassName="text-white"
            />
            
            {/* Remarks / Special Requirements with Checkboxes */}
            <div className="lg:col-span-2">
              <label className="text-white font-medium mb-3 block">
                Remarks / Special Requirements
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CHECKBOX_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-600 bg-white hover:bg-gray-50 transition-colors text-black shadow-sm h-full">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600 shrink-0"
                      checked={selectedRemarks.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="text-sm md:text-base leading-tight">{option}</span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-600 bg-white hover:bg-gray-50 transition-colors text-black shadow-sm h-full">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 accent-red-600 shrink-0"
                    checked={isOtherSelected}
                    onChange={() => setIsOtherSelected(!isOtherSelected)}
                  />
                  <span className="text-sm md:text-base leading-tight">Other</span>
                </label>
                {isOtherSelected && (
                  <input
                    type="text"
                    className="flex h-full w-full placeholder:text-sm md:placeholder:text-base rounded-xl border border-gray-600 bg-white px-4 py-4 md:text-base shadow-sm text-black focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Please specify your requirements..."
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Voucher Code */}
            <div className="lg:col-span-1 mt-2">
              <label className="text-white font-medium mb-3 block">
                Got a Promo Code? (Optional)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter Voucher Code"
                  className="flex h-14 text-base w-full placeholder:text-sm md:placeholder:text-base rounded-xl border border-gray-600 bg-white px-4 py-1 md:text-lg shadow-sm text-black uppercase focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  disabled={appliedVoucher !== null || isValidatingVoucher}
                />
                {!appliedVoucher ? (
                  <button
                    type="button"
                    onClick={handleValidateVoucher}
                    disabled={isValidatingVoucher || !voucherCode.trim()}
                    className="whitespace-nowrap px-8 rounded-md border-2 border-white text-white bg-red-800/40 hover:bg-red-500 transition-all duration-200 disabled:bg-red-950/40 disabled:cursor-not-allowed h-14"
                  >
                    {isValidatingVoucher ? "Checking..." : "Check"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedVoucher(null);
                      setVoucherCode("");
                    }}
                    className="whitespace-nowrap px-8 rounded-md border-2 border-white text-white bg-red-950/80 hover:bg-red-900 transition-all duration-200 h-14"
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedVoucher && (
                <div className="mt-3 text-green-300 text-sm md:text-base font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Coupon successfully applied!
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <FieldCheckbox control={control} name="isAgree" />
            </div>

            <div className="flex justify-end w-full lg:col-span-2">
              <button
                disabled={isLoading}
                type="submit"
                className=" disabled:bg-red-950/40 text-sm md:text-base disabled:cursor-wait rounded-md border-2 text-white border-white bg-red-800/40 py-3 lg:py-4 px-5 lg:px-12 w-fit hover:bg-red-500 duration-200 transition-all"
              >
                {isLoading ? "Sending..." : "Request Consultation"}
              </button>
            </div>
          </form>
        </Form>
      </div>

      <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className={`text-2xl font-bold flex items-center gap-2 ${alertType === "success" ? "text-red-800" : "text-red-600"}`}>
              {alertType === "success" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Whoops!
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 text-lg">{alertMessage}</p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              className="bg-red-800 hover:bg-red-700 text-white transition-colors"
              onClick={() => setAlertOpen(false)}
            >
              Ok, Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
