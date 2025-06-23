"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { Order, PlanService } from "@/constants/payload";
import { FormLead } from "@/components/partials/Form";

type Props = {
  plan: PlanService
  curr: string;
  amount: string;
}

export default function DialogLead({ plan, curr, amount }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<Order[]>([]);
  const [dateOrder, setDateOrder] = useState<string>("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/order`, {
          params: {
            date: dateOrder
          }
        })
        setOrder(response.data.data)
      } catch (error : any) {
       console.error(error.message)
      }
    }
    fetchOrder()
  }, [open, dateOrder])

  useEffect(() => {
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
          <div className="loader scale-[50%] md:scale-[70%]">
            <div className="cell d-0"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-1"></div>
            <div className="cell d-2"></div>
            <div className="cell d-2"></div>
            <div className="cell d-3"></div>
            <div className="cell d-3"></div>
            <div className="cell d-4"></div>
          </div>
        </div>
      }
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Link href={`#confirm-dialog`}
            className={`font-semibold flex gap-2 items-center text-center py-3 px-16 rounded-full self-start transition-all duration-300 ${plan.type == "Premium"
              ? "bg-gradient-to-r from-[#E8D28F] to-[#D4AF37] text-[#1a1a1a] hover:shadow-md hover:from-[#D4AF37] hover:to-[#E8D28F]"
              : "bg-primary text-white hover:bg-primary/90"
              }`}
          >
            {plan.showPrice ? "Get this plan" : "Consult with us"}{" "}
            <TrendingUp size={20} />
          </Link>
        </DialogTrigger>
        <DialogContent className="z-[103] h-[90vh] overflow-y-scroll sm:max-w-5xl sm:mx-auto p-6 sm:px-12 bg-[#F2EDE6] rounded-2xl md:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center py-6 pt-8 max-w-[80%] w-full md:max-w-full mx-auto space-y-3 flex flex-col justify-center items-center">
              <span className="inline-block  font-heading  font-semibold text-2xl md:text-3xl !leading-[120%]">Allow Us to Get to Know You Better</span>
              <span className="font-normal text-xs lg:text-sm !leading-[150%] tracking-[0.4%] font-body text-gray-600 inline-block md:max-w-[60%]">
                Choose a time that fits your schedule, and we&apos;ll make sure
                we&apos;re ready for our conversation. We can&apos;t wait to connect
                with you!
              </span>
            </DialogTitle>
            <DialogDescription className="sr-only">Dialog Lead</DialogDescription>
          </DialogHeader>
          <FormLead
            plan={plan}
            curr={curr}
            amount={amount}
            setDateOrder={setDateOrder}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            order={order}
            setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
