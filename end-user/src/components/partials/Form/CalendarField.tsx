"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type InputFieldProps = {
  name: string;
  control: Control<any>;
  className?: string;
};

const CalendarField = ({
  control,
  name,
  className,
}: InputFieldProps) => {

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={`w-full ${className}`}>
          <FormControl className="w-full">
            <div className="">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                initialFocus
                className="w-fit"
              />
              <p className="w-full flex justify-center items-center mt-1">
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </p>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CalendarField;
