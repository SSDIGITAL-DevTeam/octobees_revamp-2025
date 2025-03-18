import React from 'react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {Control} from "react-hook-form"
import { Textarea } from '@/components/ui/textarea';

type InputFieldProps = {
    name: string;
    label: string;
className?: string
    control: Control<any>;
  };
  
const InputAreaField = ({control, name, label, className} : InputFieldProps) => {
  return (
    <FormField
              name={name}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder={label}
                    className={` ${className} py-2 px-4 text-black text-base md:text-lg w-full`}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  )
}

export default InputAreaField