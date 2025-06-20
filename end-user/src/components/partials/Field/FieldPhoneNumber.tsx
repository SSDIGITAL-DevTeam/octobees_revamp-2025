import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import useWidth from "@/hooks/useWidth";

type Props = {
    control: Control<any>,
    name: string,
    label: string,
    className?: string,
    wrapClassName?: string,
    from?: string
}

export default function FieldPhoneNumber({ control, name, label, className, wrapClassName, from }: Props) {
    const size = useWidth()
    let height = "56px";
    if (size && size >= 768) {
        if (from == "contact") {
            height = "63px"
        } else {
            height = "56px"
        }
    }
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormControl className={`border-[1px] border-gray-300 rounded-md ${wrapClassName} `}>
                        <PhoneInput
                            defaultCountry='id'
                            value={field.value}
                            placeholder={label}
                            onChange={field.onChange}
                            inputClassName={`focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 !flex !items-center !phone-input !text-sm md:!text-base !h-14 md:!h-14 !rounded-e-md w-full ${className}`}
                            style={{
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