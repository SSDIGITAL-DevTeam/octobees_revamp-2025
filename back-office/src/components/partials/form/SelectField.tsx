import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import React from "react";
import { Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
  label: string;
  data: Data[];
};

type Data = {
  value: string;
  title: string;
};

// const SelectField = ({ control, name, label, data }: Props) => {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel className="capitalize font-semibold mb-2 text-base">{name}</FormLabel>
//           <Select onValueChange={field.onChange} defaultValue={field.value}>
//             <FormControl>
//               <SelectTrigger>
//                 <SelectValue placeholder={label} />
//               </SelectTrigger>
//             </FormControl>
//             <SelectContent>
//               {data.map((item, index) => (
//                 <SelectItem key={index} value={item.value}>{item.title}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };
const SelectField = ({ control, name, label, data }: Props) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize font-semibold mb-2 text-base">{name}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={label} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((item, index) => (
                <SelectItem key={index} value={item.value}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


export default SelectField;
