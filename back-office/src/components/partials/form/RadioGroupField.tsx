import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type CheckBoxFieldProps = {
  name: string;
  label: string;
  control: Control<any>;
  data: Radio[];
  defaultChecked?: string
};
type Radio = {
  title: string;
  value: string;
}

const RadioGroupField = ({ control, name, label, data, defaultChecked }: CheckBoxFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        console.log("wkw", typeof field.value);
        return(
        <FormItem className="space-y-3">
          <FormLabel className="capitalize font-semibold mb-2 text-base">
            {name}
          </FormLabel>
          <FormControl className="w-full ml-2">
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              // defaultValue={defaultChecked}
              className="flex flex-col space-y-1"
            >
              {
                data.map((item, index) => (
                  <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={item.value} />
                    </FormControl>
                    <FormLabel className="font-normal">{item.title}</FormLabel>
                  </FormItem>
                ))
              }
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}}
    />
  );
};

export default RadioGroupField;
