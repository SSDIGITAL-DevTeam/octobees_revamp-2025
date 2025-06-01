// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Control } from "react-hook-form";

// type InputFieldProps = {
//   name: string;
//   type?: "text" | "email" | "password";
//   label: string;
//   control: Control<any>;
//   className?: string;
//   defaultValue?: string;
// };

// const FieldFile = ({
//   control,
//   name,
//   type = "text",
//   label,
//   className,
//   defaultValue: dial,
// }: InputFieldProps) => {
//   const [value, setValue] = useState<string>(dial || "");
//   useEffect(() => {
//     setValue(dial || "");
//   }, [dial]);
//   return (
//    <FormField
//       name={name}
//       control={control}
//       render={({ field }) => (
//         <FormItem className="w-full">
//           <FormControl className="w-full">
//             <Input
//               type="file"
//               accept=".pdf"
//               className={`py-3 px-4 text-black ${className}`}
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 field.onChange(file);
//               }}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// };

// export default FieldFile;

"use client";
import { useRef } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";
import { Upload } from "lucide-react";

type PDFUploadProps = {
    name: string;
    control: Control<any>;
    className?: string;
    label: string
};

const FieldFile = ({ control, name, className, label }: PDFUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    field.onChange(file);
                                }}
                                ref={inputRef}
                                className="hidden"
                            />
                            <div className="flex h-14">
                                <Button
                                    type="button"
                                    className="bg-gray-100 border-2 border-e-0 px-4 border-gray-300 rounded-md rounded-e-none text-black hover:bg-gray-300 text-sm"
                                    onClick={() => inputRef.current?.click()}
                                >
                                    <span className="hidden md:inline">Upload File</span>
                                    <span className="md:hidden"><Upload className="w-5 h-5"/></span>
                                </Button>
                                <div className={`text-sm md:text-base flex items-center ps-2 text-black rounded-md rounded-s-none border-2 border-gray-300 w-full max-w-full overflow-hidden ${className}`}>
                                    <p className="break-words line-clamp-2">
                                        {field.value?.name ? (
                                            field.value.name
                                        ) :
                                            <span className="text-gray-400">{label}</span>}
                                    </p>
                                </div>
                            </div>
                        </>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FieldFile;

