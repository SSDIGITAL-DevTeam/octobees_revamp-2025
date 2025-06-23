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
    FieldInput,
    InputAreaField,
    FieldSelect,
    FieldFile,
    FieldPhoneNumber
} from "@/components/partials/Field";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck, XCircle } from "lucide-react";
import { Position } from "@/constants/payload";

export default function FormCareer() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [positions, setPositions] = useState<Position[]>([]);
    const form = useForm<CareerSchema>({
        resolver: zodResolver(careerSchema),
    });
    const { handleSubmit, control, reset } = form;
    const { toast } = useToast()

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axiosInstance.get("/position",{
                    params: {
                        limit: 20,
                        status: "Active"
                    }
                });
                setPositions(response.data.data);
            } catch (error) {
                toast({
                    title: "Failed to fetch positions",
                    description: "Something went wrong while fetching positions. Please try again.",
                    variant: "destructive",
                    action: <XCircle />
                })
            }
        };
        fetchPositions();
    }, [])

    const positionOptions = positions.map((position) => ({
        value: position.id.toString(),
        name: position.name,
    }));

    const handleInput = handleSubmit(async (values) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("phoneNumber", values.phoneNumber);
            formData.append("positionId", values.position);
            formData.append("portfolio", values.portfolio);
            formData.append("message", values.message || "");
            formData.append("resume", values.resume);

            await axiosInstance.post("/career", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast({
                title: "Application Sent",
                description: "Your job application has been submitted successfully.",
                variant: "success",
                action: <CircleCheck />
            })
            reset({
                name: "",
                email: "",
                position: "",
                portfolio: "",
                message: "",
            });
            router.push("/");
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "Something went wrong while sending your application. Please try again.",
                variant: "destructive",
                action: <XCircle />
            })
        } finally {
            setIsLoading(false);
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={handleInput} className="w-full">
                <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-10 gap-x-5">
                    <div className="md:col-span-2 space-y-2">
                        <Label>Full Name <span className="text-primary">*</span></Label>
                        <FieldInput control={control} label="Enter your full name" name="name" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address <span className="text-primary">*</span></Label>
                        <FieldInput control={control} label="Enter your email address" name="email" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number<span className="text-primary">*</span></Label>
                        <FieldPhoneNumber control={control} name="phoneNumber" label="Phone Number" />
                    </div>
                    <div className="space-y-2">
                        <Label>Applying For<span className="text-primary">*</span></Label>
                        <FieldSelect label="Select Position" datas={positionOptions} control={control} name="position" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="hidden md:block" />
                    <div className="space-y-2">
                        <Label>Resume/CV<span className="text-primary">*</span></Label>
                        <FieldFile label="Please select a file from your device" control={control} name="resume" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2">
                        <Label>Portfolio or LinkedIn URL<span className="text-primary">*</span></Label>
                        <FieldInput label="Enter your portfolio or LinkedIn link" control={control} name="portfolio" className="rounded-md border-2 border-gray-300 placeholder:text-base" />
                    </div>
                    <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label>Message</Label>
                        <InputAreaField label="Tell us briefly why you’re a good fit (optional)" control={control} name="message" className="rounded-md border-2 border-gray-300 placeholder:text-base h-40 md:h-64" />
                    </div>
                </section>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? "pointer-events-none bg-primary/50" : "bg-primary"} text-white text-base sm:text-lg font-semibold w-full hover:bg-red-900 h-14 rounded-full mt-8`}
                >
                    {isLoading ? "Loading..." : "Submit Application"}
                </Button>
            </form>
        </Form>
    )
}