"use client"
import FormMeta from "@/components/layout/form/FormMeta";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AddPage = () => {
    const [defaultValue, setDefaultValue] = useState();
    const params = useParams();
    const pages = params?.slug
        .toString()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const searchParams = useSearchParams();
    const query = searchParams.get("id")
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!query) return;
                const response = await axiosInstance.get("/meta/" + query);
                setDefaultValue(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [query]);

    return (
        <main className="w-full flex flex-col gap-12 pb-12">
            <Header title={`${pages} Meta Tag`} label={"Others"} />
            <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
                <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
                    <h1 className="text-4xl font-semibold text-black">Edit {pages} Meta Tag</h1>
                    <p>Edit meta tags</p>
                </div>
                <div className="w-full">
                    <FormMeta defaultValue={defaultValue}/>
                </div>
            </section>
        </main>
    );
};

export default AddPage;
