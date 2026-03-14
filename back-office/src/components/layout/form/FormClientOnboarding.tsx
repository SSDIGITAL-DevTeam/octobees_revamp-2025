"use client";

import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import type { ClientOnboarding } from "@/constrant/payload";
import Loading from "../wrapper/Loading";

const dataSchema = z.object({
  name: z.string().nonempty(),
  companyName: z.string().nonempty(),
  email: z.string().email(),
  password: z.string().optional(),
});

type DataSchema = z.infer<typeof dataSchema>;

const FormClientOnboarding = ({ client }: { client?: ClientOnboarding }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      password: "",
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (client) {
      reset({
        name: client.name || "",
        companyName: client.companyName || "",
        email: client.email || "",
        password: "",
      });
    }
  }, [client, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!client && !values.password) {
      failedToast("Password wajib diisi saat create client");
      return;
    }

    setIsLoading(true);
    try {
      if (client) {
        const payload: Partial<DataSchema> = {
          name: values.name,
          companyName: values.companyName,
          email: values.email,
        };

        if (values.password && values.password.trim()) {
          payload.password = values.password;
        }

        const response = await axiosInstance.patch(`/client-onboarding/${client.id}`, payload);
        successToast(response.data.message || "Client updated successfully");
      } else {
        const response = await axiosInstance.post(`/client-onboarding`, {
          name: values.name,
          companyName: values.companyName,
          email: values.email,
          password: values.password,
        });
        successToast(response.data.message || "Client created successfully");
      }

      router.push("/lead/client-onboarding");
    } catch (error: any) {
      failedToast(
        error?.response?.data?.error ||
          error?.response?.statusText ||
          error?.message ||
          "Error processing client onboarding data",
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Form {...form}>
      <Loading isLoading={isLoading} />
      <form onSubmit={onSubmit}>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          <InputField control={control} label="Nama" name="name" />
          <InputField control={control} label="Nama perusahaan" name="companyName" />
          <InputField control={control} label="Email" name="email" type="email" />
          <InputField
            control={control}
            label={client ? "Password baru (opsional)" : "Password"}
            name="password"
            type="password"
          />
        </div>

        <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
          <Button
            onClick={() => router.push("/lead/client-onboarding")}
            variant="outline"
            type="button"
            className="h-14 px-7 rounded-full"
          >
            Back
          </Button>

          <Button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-semibold h-14 px-5 rounded-full"
          >
            Save Data
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormClientOnboarding;
