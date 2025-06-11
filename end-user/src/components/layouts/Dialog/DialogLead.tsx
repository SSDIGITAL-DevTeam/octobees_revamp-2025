"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldInput, FieldCalendar, InputAreaField, RadioField, FieldPhoneNumber } from "@/components/partials/Field";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp } from "lucide-react";
import { formattedDate } from "@/utils/timezone";
import axios from "axios";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { contactSchema, ContactSchema } from "@/constants/zodSchema";

export default function DialogLead(params: {
  showPrices: boolean;
  type: string;
  plan: string;
  planName: string;
  category: string;
  curr: string;
  amount: string;
}) {

  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const router = useRouter();

  const { handleSubmit, control, watch } = form;
  const handleInput = handleSubmit(async (value) => {

    setIsLoading((prev) => !prev)
    const newDate = formattedDate(value.date)
    const newPhoneNumber = value.phoneNumber.slice(1)
    const newServices = params.planName
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const dataForSpreadsheet = {
      "sheetName": "Get This Plan",
      "Full Name": value.name,
      "Email": value.email,
      "Phone Number": newPhoneNumber,
      "Chosen Date": newDate,
      "Chosen Time": value.time,
      "Services": newServices,
    }
    const dataForDatabase = {
      name: value.name,
      email: value.email,
      phoneNumber: newPhoneNumber,
      bussiness: value.bussiness,
      message: value.message,
      date: newDate,
      time: value.time,
      idPlan: params.plan,
      categoryId: params.category,
      amount: params.amount
    }

    const web = (process.env.NEXT_PUBLIC_SPREADSHEET_API)?.toString() || ""

    try {
      await axios.post(web, new URLSearchParams(dataForSpreadsheet), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const dbResponse = await axiosInstance.post("/order", dataForDatabase)
      if (dbResponse.status == 200) {
        setOpen((prev) => !prev)
        router.push(`/thanks/plans`);
      }
      // console.log(`Process is ${response.data.result}, to add row ${response.data.row} in sheet ${response.data.data}`);
    } catch (error: any) {
      console.error(`Process is ${error.result}, with message :  ${error.error}`);
    } finally {
      setIsLoading((prev) => !prev)
    }
  });

  const value = watch();
  // const dials = countryCode.find((c) => c.code == value?.dialCodes);
  const hour = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00"
  ]

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/order`)
        setOrder(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOrder()
  }, [open])

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isLoading]);


  return (
    <>
      {isLoading &&
        <div className="bg-black/20 fixed inset-0 flex justify-center items-center overflow-hidden z-[400]">
          <p className="text-white font-bold text-2xl text-center">Loading...</p>
        </div>
      }
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Link href={`#confirm-dialog`}
            className={`font-semibold flex gap-2 items-center text-center py-3 px-16 rounded-full self-start transition-all duration-300 ${params.type == "Premium"
              ? "bg-gradient-to-r from-[#E8D28F] to-[#D4AF37] text-[#1a1a1a] hover:shadow-md hover:from-[#D4AF37] hover:to-[#E8D28F]"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            {params.showPrices ? "Get this plan" : "Consul with us"}{" "}
            <TrendingUp size={20} />
          </Link>
        </DialogTrigger>
        <DialogContent className="z-[103] overflow-y-scroll h-[90vh] sm:max-w-7xl sm:mx-auto p-6 sm:px-12 w-[90%] bg-[#F2EDE6] rounded-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-center my-8 font-semibold text-3xl !leading-[120%]">
              Allow Us to Get to Know You Better <br />
              <span className="font-normal text-sm lg:text-base mt-3 !leading-[150%] tracking-[0.4%] font-body text-gray-600 inline-block max-w-[90%] lg:max-w-[60%]">
                Choose a time that fits your schedule, and we’ll make sure
                we’re ready for our conversation. We can’t wait to connect
                with you!
              </span>
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleInput}>
              <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 place-content-center">
                <div className="flex flex-col gap-4 md:gap-6 w-full lg:col-span-2">
                  <FieldInput control={control} label="Your Name" name="name" />
                  <FieldInput
                    control={control}
                    label="Email Address"
                    name="email"
                  />
                  <FieldPhoneNumber
                    control={control}
                    label="Phone Number"
                    name="phoneNumber"
                    className="!border !border-gray-600 !rounded-e-xl"
                    wrapClassName= "rounded-xl border-none"
                  />
                  <FieldInput
                    control={control}
                    label="Bussiness field..."
                    name="bussiness"
                  />
                  <InputAreaField
                    control={control}
                    label="Short description about the business..."
                    className="h-40"
                    name="message"
                  />
                </div>
                <div className="bg-white w-full lg:col-span-2 flex flex-col gap-4 items-center justify-center border-[1px] border-gray-600 shadow-md p-4 rounded-3xl ">
                  <FieldCalendar control={control} name="date" />
                </div>
                <div className="bg-white flex justify-center items-center w-full border-[1px] border-gray-600 shadow-md p-4 rounded-3xl">
                  <RadioField data={order} selectedDate={value.date} control={control} name="time" list={hour} />
                </div>
              </section>

              <div className="flex justify-end items-center lg:mb-0 my-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`${isLoading ? "pointer-events-none bg-primary/30" : "bg-primary"} text-white text-base sm:text-lg font-semibold w-full hover:bg-primary/30 sm:w-[20%] h-14 rounded-full`}
                >
                  {isLoading ? "Loading..." : "Send"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
