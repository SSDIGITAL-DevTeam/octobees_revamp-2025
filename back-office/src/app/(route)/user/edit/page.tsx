"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { useEffect, useState } from "react";
import { failedToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { FormUser } from "@/components/layout/form";
import { User } from "@/constrant/payload";
import Link from "next/link";
import { DialogChangePassword } from "@/components/partials/dialog/DialogChangePassword";
import { set } from "date-fns";

const EditPage = () => {
  const [user, setUser] = useState<User>();
  const searchParams = useSearchParams();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(searchParams.get("id") || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setQuery(searchParams.get("id") || "");
        const res = await axiosInstance.get(`/user/${query}`);
        setUser(res.data);
      } catch (error: any) {
        failedToast("Error", error.response?.data?.error || error.response?.statusText || "Error processing data");
      }
    };
    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"User"} label={"User Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex gap-1 text-sm text-gray-600 justify-between w-full">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start">
            <h1 className="text-4xl font-semibold text-black">Edit User</h1>
            <p>Edit user data</p>
          </div>
          {/* <DialogChangePassword refetch={setRefetch}>
            <p className="w-fit text-lg font-semibold text-red-700 hover:underline hover:text-red-800">Change Password</p>
          </DialogChangePassword> */}
        </div>
        <div className="w-full">
          <FormUser user={user} />
        </div>
      </section>
    </main>
  );
};

export default EditPage;
