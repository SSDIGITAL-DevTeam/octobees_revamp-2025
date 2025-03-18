"use client";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";

type InputFieldProps = {
    name: string;
    label: string;
    control: Control<any>;
    className?: string;
    disabled?: boolean;
    setImageFile: (file: File) => void;
    defaultImage?: string;
};

const ImageField = ({
    control,
    name,
    label,
    className,
    setImageFile,
    defaultImage,
}: InputFieldProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // ⬇️ Set hanya jika defaultImage ada
    useEffect(() => {
        if (defaultImage) {
            setPreviewUrl(defaultImage);
        }
    }, [defaultImage]);

    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem className="">
                    <FormLabel className="capitalize font-semibold mb-2 text-base">
                        {label}
                    </FormLabel>
                    <FormControl className="">
                        <Input
                            type="file"
                            accept="image/*"
                            placeholder={label}
                            className={` w-fit h-fit rounded-sm bg-red-700/10 border-red-700 border-[1px] text-sm ${className}`}
                            defaultValue={undefined}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImageFile(file);
                                    field.onChange(file);
                                    setPreviewUrl(URL.createObjectURL(file)); // ⬅️ Buat URL preview
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />

                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            width={500}
                            height={500}
                            className="h-72 w-full object-cover"
                        />
                    ) : (
                        <div className="h-72 w-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No Image
                        </div>
                    )}

                </FormItem>
            )}
        />


    );
};

export default ImageField;
