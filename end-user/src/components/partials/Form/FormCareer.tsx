"use client"
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    careerSchema,
    CareerSchema
} from "@/constants/zodSchema";
import {
    InputField,
    SelectField,
    InputAreaField,
    FieldSelect,
    FieldFile,
    FieldPhoneNumber
} from "@/components/partials/Field";
import { Label } from "@/components/ui/label";

import { countryCode } from "@/constants/countryCodes";
import { axiosInstance } from "@/lib/axios";

const dummyDataJobApply = [
    {
        value: "1",
        name: "Frontend Developer"
    },
    {
        value: "2",
        name: "Backend Developer"
    },
    {
        value: "3",
        name: "Fullstack Developer"
    },
    {
        value: "4",
        name: "UI/UX Designer"
    },
    {
        value: "5",
        name: "Mobile Developer"
    },
]

export default function FormCareer() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [phoneNum, setPhoneNum] = useState<string>("+62");
    const form = useForm<CareerSchema>({
        resolver: zodResolver(careerSchema),
    });
    const { handleSubmit, control, watch, reset } = form;
    const handleInput = handleSubmit(async (values) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("phoneNumber", values.phoneNumber);
            formData.append("position", values.position);
            formData.append("portfolio", values.portfolio);
            formData.append("message", values.message || "");
            formData.append("resume", values.resume);

            const response = await axiosInstance.post("/career", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            router.push("/");
        } catch (error) {
            console.error(error);
        } finally {
            reset();
            setIsLoading(false);
        }
    });


    useEffect(() => {
        const dialCodes = watch("dialCodes");
        const selectCode = countryCode.find((c) => c.code === dialCodes);
        setPhoneNum(selectCode?.dialCodes?.[0] ?? "+62");
    }, [watch("dialCodes")])


    return (
        <Form {...form}>
            <form onSubmit={handleInput} className="w-full">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-10 gap-x-5">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Full Name <span className="text-primary">*</span></Label>
                        <InputField control={control} label="Enter your full name" name="name" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address <span className="text-primary">*</span></Label>
                        <InputField control={control} label="Enter your email address" name="email" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number<span className="text-primary">*</span></Label>
                        {/* <div className="gap-0 flex flex-row w-full">
                         <SelectField
                                control={control}
                                name={"dialCodes"}
                                className="rounded-md rounded-e-none border-2 border-gray-300 placeholder:text-base border-e-0"
                            /> 
                        {/* <InputField
                                defaultValue={phoneNum}
                                className="rounded-md rounded-s-none w-full border-gray-300 placeholder:text-base border-2"
                                control={control}
                                label="Phone Number"
                                name="phoneNumber"
                            /> 
                         </div> */}
                        <div className="w-full border-[1px] border-gray-300 rounded-md">
                            <FieldPhoneNumber control={control} name="phoneNumber" label="Phone Number" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Position Applying For<span className="text-primary">*</span></Label>
                        <FieldSelect label="Select Position" datas={dummyDataJobApply} control={control} name="position" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="hidden md:block" />
                    <div className="space-y-2">
                        <Label>Resume/CV<span className="text-primary">*</span></Label>
                        <FieldFile label="Please select a file from your device" control={control} name="resume" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Portfolio or LinkedIn URL<span className="text-primary">*</span></Label>
                        <InputField label="Enter your portfolio or LinkedIn link" control={control} name="portfolio" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label>Message</Label>
                        <InputAreaField label="Tell us briefly why you’re a good fit (optional)" control={control} name="message" className="rounded-md border-2 border-gray-300 placeholder:text-base h-40 md:h-64" />
                    </div>
                </section>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? "pointer-events-none bg-primary/30" : "bg-primary"} text-white text-base sm:text-lg font-semibold w-full hover:bg-primary/30 h-14 rounded-full mt-8`}
                >
                    {isLoading ? "Loading..." : "Submit Application"}
                </Button>
            </form>
        </Form>
    )
}