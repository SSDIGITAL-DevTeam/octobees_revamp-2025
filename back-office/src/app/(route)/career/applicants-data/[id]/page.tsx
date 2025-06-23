"use client";

import { Button } from "@/components/ui/button";
import { Download, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { Career } from "@/constrant/payload";
import formatDate from "@/utils/utilsFormatDate";
import { failedToast, successToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function PageApplicantDetail({ params }: any) {
  const [applicant, setApplicant] = useState<Career | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/career/${params.id}`, {
        });
        setApplicant(response.data);
      } catch (error: any) {
        setErr(
          error.response?.data?.error ||
          error.response?.statusText ||
          "Error fetching data"
        );
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string | undefined) => {
    try {
      await axiosInstance.delete(`/career/${id}`);
      successToast("Applicant data deleted successfully");
      router.push("/career/applicants-data");
    } catch (error) {
      failedToast("Failed to delete applicant data");
    }
  };

  const applicantDetailMap = [
    {
      label: "Name",
      value: applicant?.name,
    },
    {
      label: "Email",
      value: applicant?.email,
    },
    {
      label: "Phone",
      value: applicant?.phoneNumber,
    },
    {
      label: "Applied For",
      value: applicant?.position.name,
    },
    {
      label: "Submitted At",
      value: formatDate(applicant?.createdAt!),
    },
    {
      label: "Portfolio or Linkedin URL",
      value: applicant?.portfolio,
    },
    {
      label: "Applicant Notes",
      value: applicant?.message,
    },
  ]

  function isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }


  return (
    <main className="w-full flex flex-col gap-12">
      <Header title={"Applicant Detail"} label={"Career Management"} />
      <section className="flex flex-col gap-16 p-10 rounded-3xl bg-white border border-border shadow-sm w-full items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">Applicant Detail : {applicant?.name}</h1>
          </div>
          <div className="flex items-center">
            <div className="flex gap-3">
              <Button
                variant={"outline"}
                onClick={() => handleDelete(applicant?.id)}
                size={"sm"}
                className="rounded-full px-6 text-gray-500 font-semibold"
              >
                <Trash size={15} /> Delete Applicant
              </Button>
              <Button
                variant={"addData"}
                size={"sm"}
                className="flex gap-2 items-center"
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/resume/${applicant?.resume}`, "_blank")}
              >
                <Download size={15} /> Download Resume / CV
              </Button>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-5 grid-rows-3 gap-x-4 gap-y-10 w-full">
          {
            applicantDetailMap.map((item, index) => {
              const isLink = item.label === "Portfolio or Linkedin URL";
              const isNote = item.label === "Applicant Notes";
              if (isLink) {
                return (
                  <div key={index} className="space-y-2 col-span-2">
                    <h2 className="text-base font-semibold text-red-900">{item.label}</h2>
                    <a href={item.value || "#"} target="_blank" className="underline text-blue-700">
                      {item.value}
                    </a>
                  </div>
                )
              }
              else if (isNote) {
                return (
                  <div key={index} className="space-y-2 col-span-5 row-start-3">
                    <h2 className="text-base font-semibold text-red-900">{item.label}</h2>
                    <p>{item.value} </p>
                  </div>
                )
              }
              return (
                <div key={index} className="space-y-2">
                  <h2 className="text-base font-semibold text-red-900">{item.label}</h2>
                  <p>{item.value} </p>
                </div>
              )

            })
          }
        </div>
      </section>
    </main>
  );
}
