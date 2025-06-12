"use client"
import { FormMeta } from "@/components/layout/form";
import Header from "@/components/layout/header/Header";
import { useParams } from "next/navigation";

const AddPage = () => {
    const params = useParams();
    const pages = params?.slug
        .toString()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <main className="w-full flex flex-col gap-12 pb-12">
            <Header title={`${pages} Meta Tag`} label={"Others"} />
            <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
                <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
                    <h1 className="text-4xl font-semibold text-black">Add {pages} Meta Tag</h1>
                    <p>Input new meta tags</p>
                </div>
                <div className="w-full">
                    <FormMeta />
                </div>
            </section>
        </main>
    );
};

export default AddPage;
