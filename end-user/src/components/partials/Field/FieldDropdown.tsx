import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    control: Control<any>,
    name: string,
    label: string,
    value: string[],
    placeholder?: string
}

export default function FieldSelect({ control, name, label, value, placeholder }: Props) {
    return (
        <FormField
            name={name}
            control={control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder || label} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                value.map((item, index) => (
                                    <SelectItem key={index} value={item}>{item}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
    )
}  