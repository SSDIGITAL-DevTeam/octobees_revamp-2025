"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import CheckBoxField from "@/components/partials/form/CheckBoxField";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import { failedToast, successToast } from "@/utils/toast";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";

const dataSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string(),
  status: z.string().nonempty(),
  role: z.string().nonempty(),
  features: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type DataSchema = z.infer<typeof dataSchema>;

export const features = [
  {
    id: "role",
    label: "Manage Role",
  },
  {
    id: "services",
    label: "Manage Services",
  },
  {
    id: "blog",
    label: "Manage Blog",
  },
  {
    id: "meta",
    label: "Manage Meta Content",
  },
] as const;

export const statusList = [
  {
    value: "Active",
    title: "Active",
  },
  {
    value: "NonActive",
    title: "Non Active",
  },
  {
    value: "Draft",
    title: "Draft",
  },
];

const FormComponents = ({ defaultValue }: { defaultValue?: any }) => {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      status: "",
      role: "",
      features: [],
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (defaultValue) {
      reset(defaultValue);
    }
  }, [defaultValue]);
  
  const router = useRouter();
  
  const handleInput = handleSubmit(async (value) => {
    try {
      const url = defaultValue ? `/role/${defaultValue.id}` : `/role`;
      const method = defaultValue ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast("Success", response.data.message);
      router.push("/user")
    } catch (error: any) {
      failedToast("Error",
        (error.response?.data?.error
          || error.response?.statusText
          || error.message
          || "Error processing data"
        ));
    }
  });


  return (
    <Form {...form}>
      <form onSubmit={handleInput}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          <InputField control={control} label="Person Name" name="name" />
          <InputField control={control} label="Email Address" name="email" />
          <InputField control={control} label="Role ..." name="role" />
          <InputField
            control={control}
            label="Password"
            type="password"
            name="password"
            {...(defaultValue ? { disabled: true } : {})}
          />
          <RadioGroupField
            control={control}
            label="Status"
            name="status"
            data={statusList}
          />
          <CheckBoxField
            control={control}
            features={features}
            name="features"
            label="Features"
          />
        </div>
        <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
          <Button
            onClick={() => router.push("/user")}
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

export default FormComponents;
