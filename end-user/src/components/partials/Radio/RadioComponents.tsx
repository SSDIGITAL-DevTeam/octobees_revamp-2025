"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { formattedDate } from "@/utils/timezone";

type InputFieldProps = {
  name: string;
  control: Control<any>;
  className?: string;
  list: string[];
  selectedDate: Date;
  data?: any
};

const CalendarField = ({
  control,
  name,
  className,
  list,
  selectedDate,
  data,
}: InputFieldProps) => {
  const disabledTimes = selectedDate
  ? data
      .filter(
        (item: any) =>
          item.date === formattedDate(selectedDate)
      )
      .map((item:any)=> item.time)
  : [];
  
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={`w-full ${className}`}>
          <FormControl>
            <div className="flex flex-wrap lg:flex-col w-full gap-2 justify-center items-center">
              {list.map((time, i) => {
                const isDisabled = disabledTimes.includes(time);

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isDisabled}
                    className={`px-5 py-2 rounded-2xl border-[1px] ${isDisabled
                        ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-600 hover:bg-primary hover:text-white"
                      } transition-colors duration-300 shadow-sm ${field.value === time && !isDisabled
                        ? "bg-primary text-white"
                        : "bg-white"
                      }`}
                    onClick={() => {
                      if (!isDisabled) field.onChange(time);
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormDescription className="w-full text-center pt-5">Pick a Hour</FormDescription>
          <FormMessage className="text-center"/>
        </FormItem>
      )}
    />
  );
};
export default CalendarField;
