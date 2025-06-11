"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import InputAreaField from "@/components/partials/form/InputAreaField";
import { useRouter } from "next/navigation";
import axios from "axios";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import { statusList } from "./FormComponents";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { Textarea } from "@/components/ui/textarea";
const dataSchema = z.object({
  name: z.string().nonempty(),
  status: z.string(),
  heading: z.string(),
  description: z.string(),
});
import { Controller } from "react-hook-form";
type DataSchema = z.infer<typeof dataSchema>;

const FormComponents = ({ defaultValue }: { defaultValue?: any }) => {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      status: "",
      heading:"",
      description:""
    },
  });
  const { handleSubmit, control, reset, watch } = form;

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
    }
  }, [defaultValue]);

  const router = useRouter()

  const handleInput = handleSubmit(async (value) => {
    try {
     
      const url = defaultValue ? `/service-category/${defaultValue.id}` : `/service-category`;
      const method = defaultValue ? axiosInstance.patch : axiosInstance.post;
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
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleInput}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          
          <InputField control={control} label="Category Name" name="name" />
          <InputField control={control} label="Heading" name="heading" />
          <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <div className="flex flex-col space-y-2">
                  <label htmlFor="description" className="font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter description here..."
                    {...field}
                    className="min-h-[120px]"
                  />
                </div>
              )}
            />
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



export default FormComponents;
