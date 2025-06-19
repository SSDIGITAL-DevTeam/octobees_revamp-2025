"use client";

import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import loginImage from '@/asset/login/login-image.png'
import { toast } from "sonner";

const dataSchema = z.object({
    email: z.string().email().nonempty(),
});

type DataSchema = z.infer<typeof dataSchema>;

const LoginPage = () => {
    const form = useForm<DataSchema>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            email: "",
        }
    });
    const { handleSubmit, control, reset } = form;
    const handleInput = handleSubmit(async (value) => {
        try {
            await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_AUTH_API_URL}/forgot-password`,
                value
            );
            toast.success(<p className="text-base font-semibold text-green-900">Password reset link has been sent to your email</p>, {
                duration: 4000,
            });
        } catch (error: any) {
            toast.error(<p className="text-base font-semibold text-red-900">{error.response?.data?.error || error.response?.statusText || "Error processing data"}</p>, {
                duration: 4000,
            })
        }
        finally {
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
                    <h1 className="text-xl font-bold text-black">Forgot Password</h1>
                    <p className="text-gray-600 text-sm">Please enter your email to reset the password</p>
                </div>
                <Form {...form}>
                    <form onSubmit={handleInput}>
                        <div className="flex flex-col gap-4 md:gap-4 w-full">
                            <InputField control={control} label="Email Address" name="email" className="w-full" />
                            <Button
                                type="submit"
                                className=" bg-red-700 hover:bg-red-800 text-white font-semibold h-14 w-full rounded-xl"
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



export default LoginPage;
