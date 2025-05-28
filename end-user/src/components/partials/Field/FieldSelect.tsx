import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { countryCode } from "@/constants/countryCodes";
import Image from "next/image";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";

type InputFieldProps = {
    name: string;
    control: Control<any>;
    className?: string;
    label: string
    datas: data[]
};

type data = {
    value: string,
    name: string
}

export default function FieldSelect({ control, label, name, className, datas }: InputFieldProps) {
    // const [selectCountry, setSelectCountry] = React.useState<string>("ID");

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value);
                            // setSelectCountry(value);
                        }}
                        value={field.value}
                    >
                        <FormControl>
                            <SelectTrigger className={`p-3 px-5 cursor-pointer rounded-xl flex justify-between text-black text-base ${className}`}>
                                <>
                                    <SelectValue placeholder={label} />
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64 bg-white">
                            <SelectGroup>
                                {datas.map((data) => (
                                    <SelectItem key={data.value} value={data.value}>
                                        {data.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
