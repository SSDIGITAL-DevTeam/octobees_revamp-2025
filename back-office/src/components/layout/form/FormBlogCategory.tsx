"use client";

import { Form } from "@/components/ui/form";
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
import { BlogCategory } from "@/constrant/payload";
import Loading from "../wrapper/Loading";

const dataSchema = z.object({
  name: z.string().nonempty(),
  status: z.string(),
});
type DataSchema = z.infer<typeof dataSchema>;


export const statusList = [
  {
    value: "true",
    title: "Active",
  },
  {
    value: "false",
    title: "Non Active",
  },

];

export default function FormBlogCategory({ categories }: { categories?: BlogCategory }) {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      status: "true"
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit, control, reset } = form;
  const router = useRouter()

  useEffect(() => {
    if (categories) {
      reset({
        name: categories.name,
        status: categories.status ? "true" : "false",
      });
    }
  }, [categories]);

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true);
    try {
      const url = categories ? `/blog-category/${categories.id}` : `/blog-category`;
      const method = categories ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast(response.data.message || "Data saved successfully");
      router.push("/blog/blog-category");
    } catch (error: any) {
      failedToast(
        error.response?.data?.error
        || error.response?.statusText
        || error.message
        || "Error processing data"
      );
    }finally{
      setIsLoading(false);
    }
  });

  return (
    <Form {...form}>
      <Loading isLoading={isLoading} />
      <form onSubmit={handleInput}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          <InputField control={control} label="Category Name" name="name" />
          <RadioGroupField
            control={control}
            label="Category Status"
            name="status"
            data={statusList}
          />
        </div>
        <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
          <Button
            type="button"
            onClick={() => router.push("/blog/blog-category")}
            variant={"outline"}
            className="h-14 px-7 rounded-full"
          >
            Back
          </Button>

          <div className="flex gap-4 justify-end features-center">
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

