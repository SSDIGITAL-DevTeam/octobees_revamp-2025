"use client";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

type InputFieldProps = {
  name: string;
  type?: "text" | "email" | "password";
  label: string;
  control: Control<any>;
  className?: string;
  defaultValue?: string;
};

const InputField = ({
  control,
  name,
  type = "text",
  label,
  className,
  defaultValue: dial,
}: InputFieldProps) => {
  const [value, setValue] = useState<string>(dial || "");
  useEffect(() => {
    setValue(dial || "");
  }, [dial]);
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl className="w-full">
            <Input
              {...field}
              placeholder={label}
              type={type}
              className={`py-3 px-4 text-black ${className}`}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                field.onChange(e);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
