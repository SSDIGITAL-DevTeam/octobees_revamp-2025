"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Control } from "react-hook-form";

type Props = {
  control: Control<any>;
  name: string;
};

export default function FieldCheckbox({ control, name }: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex flex-row items-start space-x-3 -space-y-1">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormDescription className="!leading-[1.6] text-[0.8rem] md:text-sm md:tracking-[0.2px] text-white/80">
                By submitting this form, I agree to be contacted by Octobees via
                email, WhatsApp, or phone regarding services, offers, or
                follow-up matters. I understand my data will be handled securely
                in accordance with Octobees{" "}
                <Link
                  href="/privacy-policy"
                  className="underline text-blue-300 hover:text-blue-200"
                >
                  Privacy Policy.
                </Link>
              </FormDescription>
            </div>
          </div>
          <FormMessage className="ps-7 md:ps-6 md:text-sm" />
        </FormItem>
      )}
    />
  );
}
