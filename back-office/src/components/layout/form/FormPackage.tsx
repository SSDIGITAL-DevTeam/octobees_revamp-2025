"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import InputAreaField from "@/components/partials/form/InputAreaField";
import { useRouter } from "next/navigation";
import CheckBoxField from "@/components/partials/form/CheckBoxField";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import axios from "axios";
import SelectField from "@/components/partials/form/SelectField";
import SwitchField from "@/components/partials/form/SwitchField";
import { statusList } from "./FormComponents";
import { Label } from "@/components/ui/label";
import { register } from "module";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { Controller } from "react-hook-form";
const planType = ["Standard", "Premium"] as const;
const statusType = ["Draft", "Active", "NonActive"] as const;
const optionsType = ["One-time", "Monthly", "Bi-Monthly", "3 Months", "6 Months", "Yearly"] as const;

const PriceSchema = z.object({
  curr: z.string().length(3), // Mata uang biasanya 3 huruf (ISO 4217)
  amount: z.number().nullable(),
  discount: z.number().nullable(),
});

const BenefitSchema = z.object({
  value: z.string(),
});

const dataSchema = z.object({
  name: z.string(),
  type: z.enum([...planType]), // Sesuaikan jika ada jenis lain
  showPrice: z.boolean(),
  status: z.enum([...statusType]), // Tambah varian jika perlu
  options: z.enum([...optionsType]), // Tambah varian jika perlu
  descriptions: z.string(),
  categoryId: z.string().uuid(),
  prices: z.array(PriceSchema).nullable(), // <-- Bisa null sekarang
  benefits: z.array(BenefitSchema),
});

export type DataSchema = z.infer<typeof dataSchema>;

const FormComponents = ({
  data = [],
  defaultValue,
}: {
  data?: any[];
  defaultValue?: any;
}) => {
  const props = data;
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      type: "Standard",
      showPrice: true,
      status: "Active",
      options: "Monthly",
      descriptions: "",
       categoryId: (defaultValue?.categoryId)?defaultValue?.categoryId:"",
      
      prices: [
        { curr: "SGR", amount: null, discount: null },
        { curr: "MYR", amount: null, discount: null },
        { curr: "IDR", amount: null, discount: null },
      ],
      benefits:(defaultValue?.benefits)?defaultValue?.benefits: [{ value: "" }],
    },
  });
  const { handleSubmit, control, reset, watch } = form;


  useEffect(() => {
    if (defaultValue) {
      reset({
        ...defaultValue,
      });
    }      
  }, [defaultValue]);

 
  

  const router = useRouter()

  const checkShowPrice = watch("showPrice");

  const handleInput = handleSubmit(async (newValue) => {
    //alert("test")
    let value = { ...newValue };

    if (value.showPrice === false) {
      const { prices, ...filterPrices } = value;
      value.prices = null;
    }
   
   
    try {
      const url = defaultValue ? `/plan/${defaultValue.id}` : "/plan";
      const method = defaultValue ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast(response.data.message);
      router.push("/services/packages");

    } catch (error: any) {
      failedToast(error.response?.data?.error || error.response?.statusText || error.message || "Error processing data");
    }
  });

  const typeData = [
    { value: "Standard", title: "Standard" },
    { value: "Premium", title: "Premium" },
  ];

  const categoryArray = Array.isArray(props)
    ? props.map((item: any) => ({ value: item.id, title: item.name }))
    : [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const { fields: pricesField } = useFieldArray({
    control,
    name: "prices",
  });
  
  return (
    <Form {...form}>
      <form onSubmit={handleInput}>
       
        <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
          <div className="col-span-2">
            <RadioGroupField
              control={control}
              label="Package Type"
              name="type"
              data={typeData}
            />
          </div>
          <InputField control={control} label="Package Name" name="name" />
          
          <SelectField
            control={control}
            label="Category"
            name="categoryId"
            data={categoryArray}
          />  
          
          <div className="col-span-2">
            <SwitchField
              control={control}
              label="Show Prices"
              name="showPrice"
            />
          </div>
          <div className="col-span-2 space-y-5">
            <Label className="mb-3 font-semibold text-base">Prices</Label>
            {pricesField?.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <Label className=" font-semibold text-base uppercase">
                  {field.curr}
                </Label>
                <div key={field.id} className="flex gap-8 items-center">
                  {/* Amount Input */}
                  <Input
                    {...form.register(`prices.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    disabled={!checkShowPrice}
                    placeholder="Amount"
                    className="w-full"
                  />
                  {/* Discount Input */}
                  <Input
                    {...form.register(`prices.${index}.discount`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    disabled={!checkShowPrice}
                    placeholder="Discount"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <SelectField
            control={control}
            label="Service Options"
            name="options"
            data={optionsType.map((item) => ({ value: item, title: item }))}
          />
          <div className="col-span-2">
            <InputAreaField
              control={control}
              label="Short Description..."
              name="descriptions"
            />
          </div>
          <div className="col-span-2">
            <RadioGroupField
              control={control}
              label="Package Status"
              name="status"
              data={statusList}
            />
          </div>
          <div className="space-y-2 col-span-2 w-full">
            <Label className="mb-3 font-semibold text-base">Benefit</Label>
            {fields?.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input
                  {...form.register(`benefits.${index}.value`)}
                  placeholder={`Benefit ${index + 1}`}
                  className="w-full"
                />
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  className="border-none"
                  size="icon"
                >
                  <X size={18} />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2 col-span-2 w-full">
            <Button
              className="w-full border-red-700 rounded-xl text-red-700 text-base font-semibold hover:bg-red-700/30 bg-red-700/10"
              type="button"
              onClick={() => append({ value: "" })}
              variant="outline"
              size={"sm"}
            >
              + Add Benefit
            </Button>
          </div>
        </div>
      
        <div className="w-full flex justify-between items-center mt-8 sm:mt-12">
          <Button
            onClick={() => router.push("/services/packages")}
            variant={"outline"}
            className="h-14 px-7 rounded-full"
          >
            Back
          </Button>

          <div className="flex gap-4 justify-end items-center">
            <Button
              onClick={() => reset()}
              variant={"outline"}
              className=" font-semibold h-14 px-5 rounded-full"
            >
              Reset
            </Button>
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
