
import { Button } from "@/components/ui/button";
import { FieldInput, FieldCalendar, InputAreaField, RadioField, FieldPhoneNumber, SelectField, FieldSelect } from "@/components/partials/Field";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchema } from "@/constants/zodSchema";
import { formattedDate } from "@/utils/timezone";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";
import { Order, PlanService } from "@/constants/payload";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type Props = {
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    plan: PlanService,
    amount: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    order: Order[]
    setDateOrder: React.Dispatch<React.SetStateAction<string>>,
    curr: string
}

export default function FormLead({
    isLoading, setIsLoading, plan, amount, setOpen, order, setDateOrder, curr
}: Props) {
    const form = useForm<ContactSchema>({
        resolver: zodResolver(contactSchema),
    });
    const { handleSubmit, control, watch, formState: { errors } } = form;

    const handleInput = handleSubmit(async (value) => {

        setIsLoading((prev) => !prev)
        const newDate = formattedDate(value.date)
        const newPhoneNumber = value.phoneNumber.slice(1)
        const newServices = plan.name
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        const dataForSpreadsheet = {
            "sheetName": "Get This Plan",
            "Full Name": value.name,
            "Email": value.email,
            "Phone Number": newPhoneNumber,
            "Chosen Date": newDate,
            "Chosen Time": value.time,
            "Services": newServices,
        }
        const dataForDatabase = {
            name: value.name,
            email: value.email,
            phoneNumber: newPhoneNumber,
            bussiness: value.bussiness,
            message: value.message,
            date: newDate,
            time: value.time,
            idPlan: plan.id,
            categoryId: plan.categoryId,
            currency: curr,
            amount: amount
        }

        const web = (process.env.NEXT_PUBLIC_SPREADSHEET_API)?.toString() || ""

        try {
            await axios.post(web, new URLSearchParams(dataForSpreadsheet), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const dbResponse = await axiosInstance.post("/order", dataForDatabase)
            if (dbResponse.status == 201) {
                setOpen((prev) => !prev)
                router.push(`/thanks/plans`);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message
            })
            console.error(`Process is ${error.result}, with message :  ${error.error}`);
        } finally {
            setIsLoading((prev) => !prev)
        }
    });
    const router = useRouter();
    const value = watch();

    useEffect(() => {
        if (value.date) {
            const date = formattedDate(value.date);
            setDateOrder(date);
        }
    }, [value.date, setDateOrder]);
    const usedTimes = order.map(item => item.time);

    const hour = [
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00"
    ]

    const availableHours = hour
        .filter(time => !usedTimes.includes(time))
        .map(time => ({ value: time, name: time }));


    const hasError = errors.name || errors.email || errors.phoneNumber || errors.bussiness || errors.message

    return (
        <Form {...form}>
            <form onSubmit={handleInput}>
                <section className={`flex flex-col md:flex-row justify-center gap-8 md:gap-y-12 items-center md:items-start`}>
                    <div className={`flex flex-col gap-4 w-full md:w-[50%] h-full ${hasError ? "md:gap-4" : "md:gap-6"}`}>
                        <FieldInput
                            control={control}
                            label="Your Name"
                            name="name"
                        />
                        <FieldInput
                            control={control}
                            label="Email Address"
                            name="email"
                        />
                        <FieldPhoneNumber
                            control={control}
                            label="Phone Number"
                            name="phoneNumber"
                            className='!rounded-e-xl'
                            from="plan"
                            wrapClassName='!rounded-xl border-[1px] border-gray-600'
                        />
                        <FieldInput
                            control={control}
                            label="Bussiness field..."
                            name="bussiness"
                        />
                        <InputAreaField
                            control={control}
                            label="Short description about the business..."
                            className="h-40"
                            name="message"
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center gap-y-5 md:gap-y-3 w-full max-w-full md:max-w-[40%]">
                        <div className="space-y-2 w-full">
                            <Label className="md:text-sm">Pick a Date : <span className="text-primary">{value.date ? formattedDate(value.date) : errors.date?.message && errors.date?.message}</span></Label>
                            <div className="bg-white w-full flex items-center justify-center border-[1px] border-gray-600 shadow-sm p-4 rounded-2xl ">
                                <FieldCalendar control={control} name="date" />
                            </div>
                        </div>
                        <div className="space-y-2 w-full">
                            <Label className="md:text-sm">Pick a Hour : <span className="text-primary">{errors.time?.message && errors.time?.message}</span></Label>
                            <div className="bg-white w-full overflow-x-scroll border-[1px] border-gray-600 shadow-sm px-1 py-2 rounded-2xl">
                                <FieldSelect control={control} name="time" datas={availableHours} label="..." className="h-8 md:text-sm border-none shadow-none" />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? "pointer-events-none bg-primary/30" : "bg-primary"} text-white mt-3 text-base sm:text-lg font-semibold w-full md:w-[200px] hover:bg-red-800 h-14 rounded-full self-end`}
                        >
                            {isLoading ? "Loading..." : "Send"}
                        </Button>
                    </div>
                </section>
            </form>
        </Form>
    )
}