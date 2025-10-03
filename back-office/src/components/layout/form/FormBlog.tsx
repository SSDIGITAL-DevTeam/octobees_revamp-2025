"use client";

import { Form } from "@/components/ui/form";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/partials/form/InputField";
import { useRouter } from "next/navigation";
import RadioGroupField from "@/components/partials/form/RadioGroupField";
import { failedToast, successToast } from "@/utils/toast";
import BlogField from "@/components/partials/form/BlogField";
import SelectField from "@/components/partials/form/SelectField";
import ImageField from "@/components/partials/form/ImageField";
import SEOFormSection from "@/components/partials/form/SEOFormSection";
import { useAuthStore } from "@/app/store/login";
import { axiosInstance } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { Blog, BlogCategory } from "@/constrant/payload";
import Loading from "../wrapper/Loading";

const dataSchema = z.object({
    title: z.string().nonempty("Title is required"),
    // image: z
    //     .any()
    //     .refine(
    //         (file) => {
    //             if (!file) return true;
    //             if (typeof file === "string") return true;
    //             if (file instanceof File) return true;
    //             return false;
    //         },
    //         { message: "Image must be a file" }
    //     )
    //     .optional(),
    image: z.preprocess(
        (val) => {
            if (typeof val === "string") return val; // image lama (sudah ada)
            return val instanceof File ? val : undefined; // file baru
        },
        z.union([
            z.string(),
            z.instanceof(File, { message: "Image is required" }),
        ])
    ),

    content: z.string().nonempty("Content is required"),
    status: z.string(),
    favorite: z.boolean(),
    categoryId: z.string().nonempty("Category is required"),
});


type DataSchema = z.infer<typeof dataSchema>;

type FormBlogProps = {
    blog?: Blog;
    categories: BlogCategory[]
}

const FormBlog = ({ blog, categories }: FormBlogProps) => {

    const form = useForm<DataSchema>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            title: "",
            image: undefined,
            content: "",
            status: "Published",
            favorite: false,
            categoryId: "",
        },
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleSubmit, control, reset } = form;

    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>("");
    const previewObjectUrlRef = useRef<string | null>(null);
    const [seo, setSeo] = React.useState<{ title: string; keyword: string; description: string }>({
        title: "",
        keyword: "",
        description: "",
    });
    const id = useAuthStore((state) => state.id);


    useEffect(() => {
        if (blog) {
            reset({
                title: blog.title,
                image: blog.image,
                content: blog.content,
                status: blog.status,
                favorite: blog.favorite,
                categoryId: blog.categoryId || "",
            });
            setPreviewUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${blog.image}`);
            const findMetaContent = (value: string) =>
                blog?.metas?.find((meta: any) => meta.value === value)?.content || "";
            setSeo({
                title: findMetaContent("title") || blog.title || "",
                keyword:
                    findMetaContent("keyword") ||
                    findMetaContent("keywords") ||
                    blog.category?.name ||
                    "",
                description: findMetaContent("description") || blog.content?.slice(0, 160) || "",
            });
        }
        return () => {
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
                previewObjectUrlRef.current = null;
            }
        };
    }, [blog]);

    useEffect(() => {
        return () => {
            if (previewObjectUrlRef.current) {
                URL.revokeObjectURL(previewObjectUrlRef.current);
            }
        };
    }, []);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        if (previewObjectUrlRef.current) {
            URL.revokeObjectURL(previewObjectUrlRef.current);
        }
        const objectUrl = URL.createObjectURL(file);
        previewObjectUrlRef.current = objectUrl;
        setPreviewUrl(objectUrl);
    };

    const router = useRouter()
    const blogCategory = categories
        .map((c) => {
            return {
                value: c.id,
                title: c.name
            }
        })
    const buildMetaPayload = (metaData: { title: string; keyword: string; description: string }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
        const resolvedPreview = previewUrl && previewUrl.startsWith("http") ? previewUrl : "";
        const ogImage = blog?.image
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${blog.image}`
            : resolvedPreview;

        const entries = [
            { key: "name", value: "title", content: metaData.title },
            { key: "name", value: "description", content: metaData.description },
            { key: "name", value: "keyword", content: metaData.keyword },
            { key: "property", value: "og:title", content: metaData.title },
            { key: "property", value: "og:description", content: metaData.description },
            { key: "property", value: "og:type", content: "article" },
            { key: "name", value: "twitter:title", content: metaData.title },
            { key: "name", value: "twitter:description", content: metaData.description },
            { key: "name", value: "twitter:card", content: "summary_large_image" },
        ];

        if (blog?.slug && baseUrl) {
            const detailUrl = `${baseUrl}/blog/${blog.slug}`;
            entries.push({ key: "property", value: "og:url", content: detailUrl });
            entries.push({ key: "name", value: "twitter:url", content: detailUrl });
        }

        if (ogImage) {
            entries.push({ key: "property", value: "og:image", content: ogImage });
            entries.push({ key: "name", value: "twitter:image", content: ogImage });
        }

        return entries;
    };

    const handleInput = handleSubmit(async (value) => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                router.push("/auth/login");
                return;
            }
            let userId = "";
            const decoded = jwtDecode(token) as any;
            if (decoded?.id) {
                userId = decoded?.id;
            }
            const trimmedTitle = seo.title.trim();
            const trimmedKeyword = seo.keyword.trim();
            const trimmedDescription = seo.description.trim();

            if (!trimmedTitle || !trimmedKeyword || !trimmedDescription) {
                failedToast("SEO title, keyword, and description are required");
                setIsLoading(false);
                return;
            }

            if (trimmedTitle.length > 60) {
                failedToast("SEO title must be 60 characters or fewer");
                setIsLoading(false);
                return;
            }

            if (trimmedKeyword.length > 70) {
                failedToast("SEO keyword must be 70 characters or fewer");
                setIsLoading(false);
                return;
            }

            if (trimmedDescription.length > 160) {
                failedToast("SEO description must be 160 characters or fewer");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("title", value.title);
            formData.append("content", value.content);
            formData.append("status", value.status);
            formData.append("favorite", String(value.favorite));
            formData.append("categoryId", value.categoryId);
            formData.append("userId", userId || id);
            if (imageFile) {
                formData.append("image", imageFile);
            }
            const metaPayload = buildMetaPayload({
                title: trimmedTitle,
                keyword: trimmedKeyword,
                description: trimmedDescription,
            });
            formData.append("seo", JSON.stringify(metaPayload));
            const url = blog
                ? `/blog/${blog.id}`
                : `/blog`;
            const method = blog ? axiosInstance.patch : axiosInstance.post;
            const response = await method(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            successToast(response.data.message);
            router.push("/blog/blogs");
        } catch (error: any) {
            failedToast(
                error.response?.data?.error ||
                error.response?.statusText ||
                error.message ||
                "Error processing data"
            );
        }finally{
            setIsLoading(false);
        }
    });

    const baseStatusList = [
        {
            title: "Published",
            value: "Published",
        },
    ];

    const statusList = blog
        ? [...baseStatusList, {
            title: "Takedown",
            value: "Takedown",
        },]
        : [...baseStatusList, {
            title: "Draft",
            value: "Draft",
        }]

    return (
        <Form {...form}>
            <Loading isLoading={isLoading} />
            <form onSubmit={handleInput}>
                <div className="flex flex-col gap-4 md:gap-8 w-full">
                    <SelectField control={control} label="Add Category" name="categoryId" data={blogCategory} />
                    <ImageField defaultImage={previewUrl} setImageFile={handleImageSelect} control={control} label="Add Cover Image" name="image" />
                    <InputField control={control} label="Add Title" name="title" />
                    <RadioGroupField control={control} name="status" label="Status" data={statusList} />
                    <BlogField control={control} name="content" label="blog Content" />
                    {/* SEO Section */}
                    <SEOFormSection
                        title={seo.title}
                        keyword={seo.keyword}
                        description={seo.description}
                        onChange={(v) => setSeo((s) => ({ ...s, ...v }))}
                    />
                </div>
                <div className="w-full flex justify-between features-center mt-8 sm:mt-12">
                    <Button
                        onClick={() => router.push("/blog/blogs")}
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



export default FormBlog;
