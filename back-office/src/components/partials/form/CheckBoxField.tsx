// "use client";

// import { Control, useController } from "react-hook-form";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// type CheckboxProps = {
//   control: Control<any>;
//   features: any;
//   name: string;
//   label: string;
// };

// const CheckBoxField = ({ control, features, name, label }: CheckboxProps) => {
//   const { field } = useController({
//     control,
//     name,
//     defaultValue: [],
//   });

//   const allIds = features.map((item:any) => item.id);
//   const isAllSelected = field.value.length === allIds.length;

//   const handleSelectAll = (checked: boolean) => {
//     if (checked) {
//       field.onChange(allIds); // Select all
//     } else {
//       field.onChange([]); // Deselect all
//     }
//   };

//   const handleSingleCheck = (checked: boolean, id: any) => {
//     if (checked) {
//       field.onChange([...field.value, id]);
//     } else {
//       field.onChange(field.value.filter((value: any) => value !== id));
//     }
//   };

//   return (
//     <FormItem>
//       <div className="mb-4">
//         <FormLabel className="capitalize font-semibold mb-2 text-base">
//           {label}
//         </FormLabel>
//       </div>

//       {/* Select All Checkbox */}
//       <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-2 mb-2">
//         <FormControl>
//           <Checkbox
//             checked={isAllSelected}
//             onCheckedChange={handleSelectAll}
//           />
//         </FormControl>
//         <FormLabel className="text-sm font-medium">
//           Select All
//         </FormLabel>
//       </FormItem>

//       {/* Individual Checkboxes */}
//       {features.map((item:any) => (
//         <FormItem
//           key={item.id}
//           className="flex flex-row items-start space-x-3 space-y-0 ml-2"
//         >
//           <FormControl>
//             <Checkbox
//               checked={field.value.includes(item.id)}
//               onCheckedChange={(checked:any) =>
//                 handleSingleCheck(checked, item.id)
//               }
//             />
//           </FormControl>
//           <FormLabel className="text-sm font-normal">
//             {item.label}
//           </FormLabel>
//         </FormItem>
//       ))}

//       <FormMessage />
//     </FormItem>
//   );
// };

// export default CheckBoxField;
"use client";

import { Control } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CheckboxProps = {
  control: Control<any>;
  features: { id: string; label: string }[];
  name: string;
  label: string;
};

const CheckBoxField = ({ control, features, name, label }: CheckboxProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const allIds = features.map((item) => item.id);
        const isAllSelected = field.value?.length === allIds.length;

        const handleSelectAll = (checked: boolean) => {
          if (checked) {
            field.onChange(allIds);
          } else {
            field.onChange([]);
          }
        };

        const handleSingleCheck = (checked: boolean, id: string) => {
          if (checked) {
            field.onChange([...field.value, id]);
          } else {
            field.onChange(field.value?.filter((value: string) => value !== id));
          }
        };

        return (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="capitalize font-semibold mb-2 text-base">
                {label}
              </FormLabel>
            </div>

            {/* Select All */}
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 ml-2 mb-2">
              <FormControl>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">Select All</FormLabel>
            </FormItem>

            {/* Individual Checkboxes */}
            {features.map((item) => (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0 ml-2"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleSingleCheck(checked, item.id)
                    }
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
              </FormItem>
            ))}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CheckBoxField;
