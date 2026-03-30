"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { Course } from "@/constrant/payload";
import Loading from "../wrapper/Loading";
import ImageField from "@/components/partials/form/ImageField";

const dataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.string().min(1, "Price is required"),
  videoUrl: z.string().min(1, "Video URL is required"),
  isActive: z.string().min(1, "Status is required"),
  bannerUrl: z.any().optional()
});

type DataSchema = z.infer<typeof dataSchema>;

const FormCourse = ({ course }: { course?: Course }) => {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      title: "",
      price: "",
      videoUrl: "",
      isActive: "true",
      bannerUrl: undefined
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (course) {
      reset({
        title: course.title || "",
        price: course.price?.toString() || "",
        videoUrl: course.videoUrl || "",
        isActive: course.isActive ? "true" : "false",
        bannerUrl: undefined
      });
    }
  }, [course, reset]);

  const router = useRouter()

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("title", value.title);
      formData.append("price", value.price);
      formData.append("videoUrl", value.videoUrl);
      formData.append("isActive", value.isActive);
      
      if (imageFile) {
         formData.append("bannerUrl", imageFile);
      } else if (!course) {
         throw new Error("Banner image is required");
      }

      const url = course ? `/back-office/course/${course.id}` : `/back-office/course`;
      const method = course ? axiosInstance.patch : axiosInstance.post;
      
      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      successToast(response.data.message);
      router.push("/course/courses");
    } catch (error: any) {
      failedToast(
        error.response?.data?.error
        || error.response?.statusText
        || error.message
        || "Error processing data"
      );
    }finally{
      setIsLoading(false)
    }
  });

  const statusList = [
    { value: "true", title: "Active" },
    { value: "false", title: "Non Active" },
  ];

  return (
    <Form {...form}>
      <Loading isLoading={isLoading} />
      <form onSubmit={handleInput}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          <InputField control={control} label="Course Title" name="title" />
          <FormField
            control={control}
            name="price"
            render={({ field }) => {
              const formatCurrency = (val: string) => {
                if (!val) return "";
                const numberStr = val.replace(/\D/g, "");
                if (!numberStr) return "";
                const formatted = new Intl.NumberFormat("id-ID").format(Number(numberStr));
                return `Rp ${formatted}`;
              };

              return (
                <FormItem className="w-full">
                  <FormLabel className="capitalize font-semibold mb-2 text-base">
                    Price (Rp)
                  </FormLabel>
                  <FormControl className="w-full">
                    <div className="w-full relative">
                      <Input
                        placeholder="Price (Rp)"
                        value={formatCurrency(field.value?.toString() || "")}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/\D/g, "");
                          field.onChange(numericValue);
                        }}
                        className="py-2 px-4 text-black"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <InputField control={control} label="Video URL" name="videoUrl" />
          <RadioGroupField
            control={control}
            label="Course Status"
            name="isActive"
            data={statusList}
          />
             <ImageField 
                control={control} 
                name="bannerUrl" 
                label="Course Banner" 
                setImageFile={setImageFile}
                defaultImage={course?.bannerUrl ? `${process.env.NEXT_PUBLIC_BASE_URL_FILE}${course.bannerUrl}` : undefined}
             />
        </div>
        <div className="w-full flex justify-between items-center mt-8 sm:mt-12">
          <Button
            onClick={() => router.push("/course/courses")}
            variant={"outline"}
            type="button"
            className="h-14 px-7 rounded-full"
          >
            Back
          </Button>

          <div className="flex gap-4 justify-end items-center">
            <Button
              type="submit"
              className=" bg-red-700 hover:bg-red-800 text-white font-semibold h-14 px-5 rounded-full"
            >
              Save Data
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormCourse;
