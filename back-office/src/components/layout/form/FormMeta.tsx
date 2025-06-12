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
import { axiosInstance } from "@/lib/axios";
import { MetaTag } from "@/constrant/payload";


const dataSchema = z.object({
    key: z.string().nonempty(),
    value: z.string(),
    content: z.string(),
});

type DataSchema = z.infer<typeof dataSchema>;

const FormMeta = ({ metatag }: { metatag?: MetaTag }) => {
    const form = useForm<DataSchema>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            key: "",
            value: "",
            content: "",
        },
    });

    const { handleSubmit, control, reset, watch } = form;

    useEffect(() => {
        if (metatag) {
            reset({
                key: metatag.key,
                value: metatag.value,
                content: metatag.content
            });
        }
    }, [metatag]);

    const router = useRouter()

    const params = useParams();
    const slug = params?.slug as string;

    const handleInput = handleSubmit(async (value) => {
        try {
            const url = metatag ? `/meta/${metatag.id}` : `/meta`;
            const method = metatag ? axiosInstance.patch : axiosInstance.post;
            const values = metatag ? value : { ...value, page : slug };
            const response = await method(url, values);
            successToast(response.data.message);
            router.push("/meta/" + slug);
        } catch (error: any) {
            failedToast(
                error.response?.data?.error
                || error.response?.statusText
                || error.message
                || "Error processing data"
            );
        }
    }
    )
    return (
        <Form {...form}>
            <form onSubmit={handleInput}>
                <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
                    <InputField control={control} label="Key" name="key" />
                    <InputField control={control} label="Value" name="value" />
                    <InputField control={control} label="Content" name="content" />
                </div>
                <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
                    <Button
                        onClick={() => router.push(`/meta/${slug}`)}
                        variant={"outline"}
                        type="button"
                        className="h-14 px-7 rounded-full"
                    >
                        Back
                    </Button>

                    <div className="flex gap-4 justify-end features-center">
                        <Button
                            type="submit"
                            className=" bg-red-700 hover:bg-red-800 text-white font-semibold h-14 px-5 rounded-full"
                        >
                            Save Data
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};



export default FormMeta;
