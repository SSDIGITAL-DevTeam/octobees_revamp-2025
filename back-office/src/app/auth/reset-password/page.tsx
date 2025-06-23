"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import loginImage from '@/asset/login/login-image.png'
import { failedToast, successToast } from "@/utils/toast";

const dataSchema = z.object({
    token: z.string().nonempty(),
    newPassword: z.string().nonempty(),
    confirmNewPassword: z.string().nonempty(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});

type DataSchema = z.infer<typeof dataSchema>;

const ResetPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const form = useForm<DataSchema>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            token: "",
            newPassword: "",
            confirmNewPassword: ""
        }
    });

    const { handleSubmit, control, setValue, reset } = form;

    useEffect(() => {
        if (token) {
            setValue("token", token);
        }
    }, [token]);

    const router = useRouter()

    const handleInput = handleSubmit(async (value) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_AUTH_API_URL}/reset-password`,
                {
                    token: value.token,
                    newPassword: value.newPassword
                }
            );
            successToast(response.data.message);
            router.push("/auth/login");
        } catch (error: any) {
            failedToast(error.response?.data?.error || error.response?.statusText || "Error processing data");
        }
        finally {
            setIsLoading(false);
            reset();
        }
    })

    return (
        <main className="w-full flex justify-center items-center min-h-screen bg-[#f5f5f5]">
            <section className="w-full max-w-[35%] flex flex-col justify-center gap-5 bg-white shadow-md rounded-xl p-12">
                <div className="w-full pb-8 border-b-[1px] rounded-xl">
                    <Image src={loginImage} alt="login-image" width={1920} priority height={1080} quality={100} className="w-full h-[20vh] object-top object-cover mx-auto rounded-2xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-black">Reset Password</h1>
                    <p className="text-gray-600 text-sm">Enter your new password</p>
                </div>
                <Form {...form}>
                    <form onSubmit={handleInput}>
                        <div className="flex flex-col gap-4 md:gap-4 w-full">
                            <InputField control={control} label="New Password" name="newPassword" className="w-full" />
                            <InputField control={control} label="Confirm New Password" name="confirmNewPassword" className="w-full" />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-red-700 hover:bg-red-800 text-white font-semibold h-14 w-full rounded-xl ${isLoading ? "cursor-not-allowed bg-red-900" : ""}`}
                            >
                                Reset Password
                            </Button>
                        </div>
                    </form>
                </Form>
                <label className="text-gray-600 text-sm">© {new Date().getFullYear()} Octobees</label>
            </section>
        </main>
    );
};



export default ResetPasswordPage;
