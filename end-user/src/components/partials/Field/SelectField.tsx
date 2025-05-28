import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
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

type InputFieldProps = {
  name: string;
  control: Control<any>;
  className?: string;
};

export default function SelectField({ control, name, className }: InputFieldProps) {
  const [selectCountry, setSelectCountry] = React.useState<string>("ID");
  const [image, setImage] = React.useState<string>("");

  React.useEffect(() => {
    const fetchImage = () => {
      const response = countryCode.find((c) => c.code === selectCountry);
      setImage(response?.image || "");
    };
    fetchImage();
  }, [selectCountry]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setSelectCountry(value);
            }}
            value={selectCountry}
          >
            <FormControl>
              <SelectTrigger asChild className={`p-3 px-5 cursor-pointer rounded-xl rounded-e-none ${className}`}>
                {
                 image ? <Image src={image} alt="flag" width={12} height={10} className="object-contain" />
                 : <div>...</div>
                }
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-64 bg-white">
              <SelectGroup>
                {countryCode.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
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
