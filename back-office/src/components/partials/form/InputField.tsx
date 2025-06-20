"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type InputFieldProps = {
  name: string;
  type?: "text" | "email" | "password";
  label: string;
  control: Control<any>;
  className?: string;
  disabled?: boolean;
};

const InputField = ({
  control,
  name,
  type = "text",
  label,
  className,
  disabled,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="capitalize font-semibold mb-2 text-base">
            {name}
          </FormLabel>
          <FormControl className="w-full">
            <div className="w-full h-full relative">
              <Input
                {...field}
                placeholder={label}
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                disabled={disabled}
                className={`py-2 px-4 text-black ${className}`}
              />
              {type === "password" && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
