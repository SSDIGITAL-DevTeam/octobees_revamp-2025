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
import { CategoryService } from "@/constrant/payload";
import InputAreaField from "@/components/partials/form/InputAreaField";
import Loading from "../wrapper/Loading";

const dataSchema = z.object({
  name: z.string().nonempty(),
  status: z.string().nonempty(),
  heading: z.string().nonempty(),
  description: z.string().nonempty(),
});

type DataSchema = z.infer<typeof dataSchema>;

const FormCategory = ({ category }: { category?: CategoryService }) => {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      status: "",
      heading: "",
      description: ""
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        status: category.status || "Active",
        heading: category.heading || "",
        description: category.description || ""
      });
    }
  }, [category]);

  const router = useRouter()

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true)
    try {
      const url = category ? `/service-category/${category.id}` : `/service-category`;
      const method = category ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast(response.data.message);
      router.push("/services/categories");
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

  const baseStatusList = [
    { value: "Active", title: "Active" },
  ];

  const statusList = category
    ? [...baseStatusList, { value: "NonActive", title: "Non Active" }]
    : [...baseStatusList, { value: "Draft", title: "Draft" }]



  return (
    <Form {...form}>
            <Loading isLoading={isLoading} />
      <form onSubmit={handleInput}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">

          <InputField control={control} label="Category Name" name="name" />
          <InputField control={control} label="Heading" name="heading" />
          <InputAreaField control={control} label="Description" name="description" />
          <RadioGroupField
            control={control}
            label="Category Status"
            name="status"
            data={statusList}
          />
        </div>
        <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
          <Button
            onClick={() => router.push("/services/categories")}
            variant={"outline"}
            type="button"
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



export default FormCategory;
