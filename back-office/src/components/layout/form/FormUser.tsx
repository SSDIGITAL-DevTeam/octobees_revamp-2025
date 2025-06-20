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
import { axiosInstance } from "@/lib/axios";
import { User } from "@/constrant/payload";

const dataSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().nonempty(),
  status: z.string().nonempty(),
  role: z.string().nonempty(),
  features: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type DataSchema = z.infer<typeof dataSchema>;

export const features = [
  {
    id: "user",
    label: "Manage User",
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
  {
    id: "subscription",
    label: "Manage Subscription",
  },
  {
    id: "career",
    label: "Manage Career",
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

const FormUser = ({ user }: { user?: User }) => {
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

  const { handleSubmit, control, reset, setValue } = form;

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        status: user.status || "",
        role: user.role || "",
        features: user.features || [],
      });
    }
  }, [user]);

  const router = useRouter();

  const handleInput = handleSubmit(async (value) => {
    try {
      const url = user ? `/user/${user.id}` : `/user`;
      const method = user ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast(response.data.message);
      router.push("/user")
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
          <InputField control={control} label="Person Name" name="name" />
          <InputField control={control} label="Email Address" name="email" />
          <InputField control={control} label="Role" name="role" />
          {
            user ? <>
              <InputField
                control={control}
                label="Password"
                type="password"
                name="Disabled Password"
                disabled
              />
              <input
                type="hidden"
                {...form.register("password")}
              />
            </>
              : <InputField
                control={control}
                label="Password"
                type="password"
                name="password"
              />}

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

export default FormUser;
