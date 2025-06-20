import { countryCode, Country } from '@/constants/countryCodes';
import Image from 'next/image';
import { JSX, useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { PhoneInput } from "react-international-phone"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { FieldFile, FieldInput, FieldPhoneNumber, FieldSelect, InputAreaField } from '../Field';

const DataSchema = z.object({
  name: z.string().nonempty("Please enter your name"),
  email: z.string().email().nonempty("Please enter your email"),
  interest: z.string().nonempty("Please enter an interest"),
  message: z.string(),
  phoneNumber: z.string().nonempty("Please enter a phone number").refine((val) => {
    return val.length > 3 && /\d{4,}/.test(val.replace(/^\+\d{1,3}/, ""));
  }, {
    message: "Please enter a valid phone number",
  }),
})

type FormData = z.infer<typeof DataSchema>;

export default function FormContactNew({ source }: { source: string }): JSX.Element {
  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      interest: '',
      message: '',
      phoneNumber: '',
    },
    resolver: zodResolver(DataSchema),
  })

  const { control, handleSubmit, reset } = form

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pathname = usePathname();
  const router = useRouter();


  const submitForm = handleSubmit(async (value) => {
    setIsSubmitting(true);

    const dataForSpreadsheet = {
      "sheetName": "Contact Us",
      "Full Name": value.name,
      "Email": value.email,
      "Phone Number": value.phoneNumber.replace('+', ''),
      "Interest": value.interest,
      "Message": value.message
    }
    const web = (process.env.NEXT_PUBLIC_SPREADSHEET_API)?.toString() || ""

    try {
      const response = await axios.post(web, new URLSearchParams(dataForSpreadsheet), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      router.push(`/thanks/${pathname.slice(1)}`);
      console.log(`Process is ${response.data.result}, to add row ${response.data.row} in sheet ${response.data.data}`);
    } catch (error: any) {
      console.error(`Process is ${error.result}, with message :  ${error.error}`);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  });

  useEffect(() => {
    if (isSubmitting) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSubmitting]);


  return (
    <>
      {isSubmitting &&
        <div className="bg-black/20 fixed inset-0 flex justify-center items-center overflow-hidden z-[400]">
          <p className="text-white font-bold text-2xl text-center">Loading...</p>
        </div>
      }
      <Form {...form}>
        <form onSubmit={submitForm} className="flex flex-col gap-y-6 w-full max-w-[47rem]">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-8 gap-x-6">
            <div className="space-y-2">
              <FieldInput control={control} label="Your Name" name="name" className="border-[1px] border-gray-400 placeholder:text-sm md:placeholder:text-base md:h-16" />
            </div>
            <div className="space-y-2">
              <FieldInput control={control} label="Email Address" name="email" className="border-[1px] border-gray-400 placeholder:text-sm md:placeholder:text-base md:h-16" />
            </div>
            <div className="space-y-2">
              <FieldPhoneNumber control={control} name="phoneNumber" label="Phone Number" className='!rounded-e-xl md:!h-[63px]' wrapClassName='!rounded-xl border-[1px] border-gray-400' from='contact' />
            </div>
            <div className="space-y-2">
              <FieldInput label="I&apos;m interested in..." control={control} name="interest" className="border-[1px] border-gray-400 placeholder:text-sm md:placeholder:text-base md:h-16" />
            </div>
            <div className="space-y-2 col-span-1 md:col-span-2">
              <InputAreaField label="How can we help you?" control={control} name="message" className="border-[1px] border-gray-400 placeholder:text-sm md:placeholder:text-base h-40" />
            </div>
          </section>
          <button type="submit" className="py-4 px-14 rounded-full bg-primary text-white font-semibold text-sm lg:text-lg self-center hover:bg-red-900 border border-primary transition-colors duration-300" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send your message'}
          </button>
        </form>
      </Form>
    </>
  );
}
