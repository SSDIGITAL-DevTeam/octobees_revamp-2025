"use client";
import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
  disabled?: boolean;
  desc?: string;
};

const InputField = ({
  control,
  name,
  type = "text",
  label,
  className,
  desc,
  disabled
}: InputFieldProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="capitalize font-semibold mb-2 text-base">{label}</FormLabel>
          {desc && <FormDescription>{desc}</FormDescription>}
          <FormControl className="w-full">
            <Input
              {...field}
              placeholder={label}
              type={type}
              disabled={disabled}
              className={`py-2 px-4 text-black ${className}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
