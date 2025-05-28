import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import useWidth from "@/utils/useWidth";

type Props = {
    control: Control<any>,
    name: string,
    label: string,
}

export default function FieldPhoneNumber({ control, name, label }: Props) {
    const size = useWidth()
    let height = "48px";
    if (size && size >= 768) height = "56px"
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <PhoneInput
                            defaultCountry='id'
                            value={field.value}
                            placeholder={label}
                            onChange={field.onChange}
                            inputClassName="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 !flex !items-center !phone-input !text-sm md:!text-base !h-12 md:!h-14 !rounded-e-md w-full "
                            style={
                                {
                                    '--react-international-phone-flag-width': '24px',
                                    '--react-international-phone-flag-height': '24px',
                                    '--react-international-phone-height': `${height}`,
                                } as React.CSSProperties
                            }
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
    )
}