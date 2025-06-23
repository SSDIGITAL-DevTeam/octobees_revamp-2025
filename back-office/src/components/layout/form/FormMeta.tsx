"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import { failedToast, successToast } from "@/utils/toast";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { MetaTag } from "@/constrant/payload";
import SelectField from "@/components/partials/form/SelectField";
import Loading from "../wrapper/Loading";

const baseMetaTagValues = [
    "title",
    "description",
    "keywords",
    "icon",
    "shortcut:icon",
    "apple:icon",
    "robot",
    "authors",
    "creator",
    "publisher",
    "canonical",
    "og:title",
    "og:description",
    "og:url",
    "og:site_name",
    "og:images",
    "og:type",
    "og:locale",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:site",
    "twitter:creator",
    "twitter:images",
    "application-name"
];


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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleSubmit, control, reset } = form;

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
        setIsLoading(true)
        try {
            const url = metatag ? `/meta/${metatag.id}` : `/meta`;
            const method = metatag ? axiosInstance.patch : axiosInstance.post;
            const values = metatag ? value : { ...value, page: slug };
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
        } finally {
            setIsLoading(false)
        }
    })

    const metaTagValue = baseMetaTagValues.map((value) => ({
        value,
        title: value
    }))

    return (
        <Form {...form}>
            <Loading isLoading={isLoading} />
            <form onSubmit={handleInput}>
                <div className="md:grid md:grid-cols-2 flex flex-col gap-4 md:gap-8 w-full">
                    <InputField control={control} label="Key" name="key" />
                    {/* <InputField control={control} label="Value" name="value" /> */}
                    <SelectField control={control} label="Value" name="value" data={metaTagValue} />
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
