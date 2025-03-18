"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import axios from "axios";
import { failedToast, successToast } from "@/utils/toast";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/login";
import Image from "next/image";
import loginImage from "@/asset/login/login-image.png"
import { axiosInstance } from "@/lib/axios";

const dataSchema = z.object({
    email: z.string().email().nonempty(),
    password: z.string(),
});

type DataSchema = z.infer<typeof dataSchema>;

const FormMeta = () => {
    const form = useForm<DataSchema>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const setToken = useAuthStore((state) => state.setToken)

    const { handleSubmit, control, reset, watch } = form;

    const router = useRouter()

    const handleInput = handleSubmit(async (value) => {
        try {
            const response = await axiosInstance.post(
                `${process.env.NEXT_PUBLIC_AUTH_API_URL}/login`,
                value
            );
            sessionStorage.setItem("token", response.data.accessToken);
            setToken(response.data.accessToken)
            router.push("/dashboard");
        } catch (error: any) {
            failedToast("Error", (error.response?.data?.error || error.response?.statusText || error.message || "Error processing data"));
        }
    }
    )
    return (
        <main className="w-full grid grid-cols-1 lg:grid-cols-2 place-content-center place-items-center min-h-screen">
            <section className="w-full max-w-[60%] flex flex-col justify-center gap-5 h-[60vh]">
                <div>
                    <h1 className="text-2xl font-bold text-black">Login</h1>
                    <p className="">Enter your details below to login</p>
                </div>
                <Form {...form}>
                    <form onSubmit={handleInput}>
                        <div className="flex flex-col gap-4 md:gap-4 w-full">
                            <InputField control={control} label="Email" name="email" className="w-full" />
                            <InputField control={control} label="Password" name="password" type="password" className="w-full" />
                        
                            <Button
                                type="submit"
                                className=" bg-red-700 hover:bg-red-800 text-white font-semibold h-14 w-full rounded-full"
                            >
                                Login
                            </Button>

                        </div>

                    </form>
                </Form>
                <button
                    type="submit"
                    className=" underline text-red-800 text-base self-start"
                >
                    Forgot Your Password
                </button>
                <label className="text-gray-600 text-sm">© 2025 Octobees</label>
            </section>
            <section className="w-full max-w-[80%] h-[60vh]">
                <Image src={loginImage.src} alt="login-image" width={1920} height={1080} className="object-cover w-full h-full rounded-2xl" />
            </section>
        </main>
    );
};



export default FormMeta;
