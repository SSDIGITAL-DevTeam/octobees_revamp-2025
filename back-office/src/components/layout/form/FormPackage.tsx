"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import InputAreaField from "@/components/partials/form/InputAreaField";
import { useRouter } from "next/navigation";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import SelectField from "@/components/partials/form/SelectField";
import SwitchField from "@/components/partials/form/SwitchField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { CategoryService, PlanService } from "@/constrant/payload";
import { dataSchema, DataSchema, OptionsType, optionsType } from "@/utils/zod-schema";
import Loading from "../wrapper/Loading";

const typeData = [
  { value: "Standard", title: "Standard" },
  { value: "Premium", title: "Premium" },
];
type Props = {
  categories: CategoryService[];
  pack?: PlanService
}

const FormPackage = ({
  categories,
  pack,
}: Props) => {
  const form = useForm<DataSchema>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      name: "",
      type: "Standard",
      showPrice: true,
      status: "Active",
      options: "Monthly",
      descriptions: "",
      categoryId: "",
      benefits: [{ value: "" }],
      prices: [
        { curr: "SGR", amount: 0, discount: 0 },
        { curr: "MYR", amount: 0, discount: 0 },
        { curr: "IDR", amount: 0, discount: 0 },
      ],
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit, control, reset } = form;

  const isOptionsType = (value: string): value is OptionsType => {
    return optionsType.includes(value as OptionsType);
  };

  //   const data = {
  //   name: "RTRT",
  //   type: "Standard",
  //   showPrice: true,
  //   status: "Active",
  //   options: "Bi-Monthly",
  //   descriptions: "RTRTR",
  //   categoryId: "01966fe5-5d6f-7253-ba82-9a4a6f3d7c91",
  //   prices: [
  //     { curr: "SGR", amount: 0, discount: 0 },
  //     { curr: "MYR", amount: 0, discount: 0 },
  //     { curr: "IDR", amount: 0, discount: 0 },
  //   ],
  //   benefits: [
  //     { value: "RTRTRT" },
  //     { value: "RTRTRT" },
  //   ],
  // };


  useEffect(() => {
    if (pack) {
      reset({
        name: pack.name,
        type: pack.type,
        showPrice: pack.showPrice,
        status: pack.status,
        options: isOptionsType(pack.options) ? pack.options : "Monthly",
        descriptions: pack.descriptions,
        categoryId: pack.categoryId,
        prices: pack.prices,
        benefits: pack.benefits
      });
    }
  }, [pack]);

  const router = useRouter()
  const checkShowPrice = useWatch({
    control,
    name: "showPrice",
  });

  const handleInput = handleSubmit(async (value) => {
    setIsLoading(true)
    try {
      const url = pack ? `/plan/${pack.id}` : "/plan";
      const method = pack ? axiosInstance.patch : axiosInstance.post;
      const response = await method(url, value);
      successToast(response.data.message);
      router.push("/services/packages");

    } catch (error: any) {
      failedToast(error.response?.data?.error || error.response?.statusText || error.message || "Error processing data");
    }
    finally {
      setIsLoading(false)
    }
  });

  const categoryArray = categories.map((item) => ({ value: item.id, title: item.name }))

  const { fields, append, remove } = useFieldArray({
    control,
    name: "benefits",
  });

  const { fields: pricesField } = useFieldArray({
    control,
    name: "prices",
  });

  const baseStatusList = [
    { value: "Active", title: "Active" },
  ];

  const statusList = pack
    ? [...baseStatusList, { value: "NonActive", title: "Non Active" }]
    : [...baseStatusList, { value: "Draft", title: "Draft" }]


  return (
    <Form {...form}>
      <Loading isLoading={isLoading} />
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
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-sm capitalize">
                      Amount
                    </Label>
                    <Input
                      {...form.register(`prices.${index}.amount`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      disabled={!checkShowPrice}
                      placeholder="Amount"
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-sm capitalize">
                      Discount
                    </Label>
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
            type="button"
            className="h-14 px-7 rounded-full"
          >
            Back
          </Button>

          <Button
            type="submit"
            className=" bg-red-700 hover:bg-red-800 text-white font-semibold h-14 px-5 rounded-full"
          >
            Save Data
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormPackage;
