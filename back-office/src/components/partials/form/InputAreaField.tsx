import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

type InputFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
};

const InputAreaField = ({ control, name, label }: InputFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize font-semibold mb-2 text-base">
            {name}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={label}
              className="py-2 px-4 text-black text-base w-full h-32 md:h-auto"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputAreaField;
