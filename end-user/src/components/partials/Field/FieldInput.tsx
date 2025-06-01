"use client";
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
};

const FieldInput = ({
  control,
  name,
  type = "text",
  label,
  className
}: InputFieldProps) => {
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FieldInput;
