import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Control, Form } from "react-hook-form";

type InputFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
};
const SwitchField = ({ control, name, label }: InputFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col">
            <FormLabel className="capitalize font-semibold mb-4 text-base">
              {label}
            </FormLabel>
            <FormControl>
              <div className="flex items-center gap-3">
              <Switch checked={field.value} onCheckedChange={(checked) => field.onChange(checked)}  />
              <p>{field.value ? "Active" : "Non Active"}</p>
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
