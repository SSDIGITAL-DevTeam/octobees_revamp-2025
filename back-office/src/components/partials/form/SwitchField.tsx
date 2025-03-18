import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Control } from "react-hook-form";

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
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
