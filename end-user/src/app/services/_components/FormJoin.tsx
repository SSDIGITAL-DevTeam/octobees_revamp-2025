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

const formData = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  companyName: z.string().nonempty(),
  companyWebsite: z.string().optional(),
  business: z.string().nonempty(),
  message: z.string(),
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
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      companyWebsite: "",
      business: "",
      message: "",
      isAgree: undefined,
    },
    resolver: zodResolver(formData),
  });
  const { handleSubmit, control, reset } = form;

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true);
    try {
      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA is not available");
      }
      const token = await executeRecaptcha("formSubmit");
      const response = await axiosInstance.post("/lead", {
        ...value,
        phone: value.phone.replaceAll("+", ""),
        from: pathname,
        token,
      });
      console.log("Success:", response.data.message);
      toast.success("Your message has been sent.", successToast);
      router.push("/thanks/service-request");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.message || error.response.data.error || "Message not sent",
        failToast,
      );
    } finally {
      setIsLoading(false);
      reset();
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
            <div className="lg:col-span-2">
              <ServiceFieldInput
                control={control}
                label="Remarks / Special Requirements"
                name="message"
                type={"textarea"}
                placeholder="What would you like to discuss during the consultation?"
                labelClassName="text-white"
              />
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
                {" "}
                {isLoading ? "Sending..." : "Request Consultation"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
