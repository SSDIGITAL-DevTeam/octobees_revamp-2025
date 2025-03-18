// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { Control, useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// type CheckboxProps = {
//   control: Control<any>;
//   features: any;
//   name: string;
//   label:string;
// };

// const CheckBoxField = ({ control, features, name, label }: CheckboxProps) => {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={() => (
//         <FormItem>
//           <div className="mb-4">
//             <FormLabel className="capitalize font-semibold mb-2 text-base">
//               {label}
//             </FormLabel>
//           </div>
//           {features.map((item: any) => (
//             <FormField
//               key={item.id}
//               control={control}
//               name="features"
//               render={({ field }) => {
//                 return (
//                   <FormItem
//                     key={item.id}
//                     className="flex flex-row items-start space-x-3 space-y-0 ml-2"
//                   >
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value?.includes(item.id)}
//                         onCheckedChange={(checked) => {
//                           return checked
//                             ? field.onChange([...field.value, item.id])
//                             : field.onChange(
//                                 field.value?.filter(
//                                   (value: any) => value !== item.id
//                                 )
//                               );
//                         }}
//                       />
//                     </FormControl>
//                     <FormLabel className="text-sm font-normal">
//                       {item.label}
//                     </FormLabel>
//                   </FormItem>
//                 );
//               }}
//             />
//           ))}
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export default CheckBoxField;

"use client";

import { Control, useController } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckboxProps = {
  control: Control<any>;
  features: any;
  name: string;
  label: string;
};

const CheckBoxField = ({ control, features, name, label }: CheckboxProps) => {
  const { field } = useController({
    control,
    name,
    defaultValue: [],
  });

  const allIds = features.map((item:any) => item.id);
  const isAllSelected = field.value.length === allIds.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      field.onChange(allIds); // Select all
    } else {
      field.onChange([]); // Deselect all
    }
  };

  const handleSingleCheck = (checked: boolean, id: any) => {
    if (checked) {
      field.onChange([...field.value, id]);
    } else {
      field.onChange(field.value.filter((value: any) => value !== id));
    }
  };

  return (
    <FormItem>
      <div className="mb-4">
        <FormLabel className="capitalize font-semibold mb-2 text-base">
          {label}
        </FormLabel>
      </div>

      {/* Select All Checkbox */}
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-2 mb-2">
        <FormControl>
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
        </FormControl>
        <FormLabel className="text-sm font-medium">
          Select All
        </FormLabel>
      </FormItem>

      {/* Individual Checkboxes */}
      {features.map((item:any) => (
        <FormItem
          key={item.id}
          className="flex flex-row items-start space-x-3 space-y-0 ml-2"
        >
          <FormControl>
            <Checkbox
              checked={field.value.includes(item.id)}
              onCheckedChange={(checked:any) =>
                handleSingleCheck(checked, item.id)
              }
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">
            {item.label}
          </FormLabel>
        </FormItem>
      ))}

      <FormMessage />
    </FormItem>
  );
};

export default CheckBoxField;
