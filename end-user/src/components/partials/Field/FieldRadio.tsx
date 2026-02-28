import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CheckBoxFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  data: string[];
};

const FieldRadio = ({ control, name, label, data }: CheckBoxFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="capitalize font-semibold mb-2 text-base">
            {label}
          </FormLabel>
          <FormControl className="w-full ml-2">
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex gap-3 md:gap-6 items-center md:h-14"
            >
              {
                data.map((item, index) => (
                  <FormItem key={index} className="flex items-center md:space-x-1 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={item} />
                    </FormControl>
                    <FormLabel className="font-normal text-xs sm:text-sm">{item}</FormLabel>
                  </FormItem>
                ))
              }
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FieldRadio;
