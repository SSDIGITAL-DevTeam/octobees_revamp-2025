"use client"

import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { ArrowUpRightFromCircle } from "lucide-react";
import { act, useEffect, useReducer } from "react";

interface BlockCardProps {
  text: string;
  value: number;
  className?: string;
}

const initialState = {
  activeUsers: 0,
  nonActiveUsers: 0,
  draftUsers: 0,
  activeServices: 0,
  nonActiveServices: 0,
  draftServices: 0,
  activePackages: 0,
  nonActivePackages: 0,
  draftPackages: 0,
  publishedBlogs: 0,
  takedownBlogs: 0,
  draftBlogs: 0,
  totalBlogCategories: 0,
  loading: true,
  error: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Page(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          activeUser, nonActiveUser, draftUser,
          activeCategory, nonActiveCategory, draftCategory,
          activePackage, nonActivePackage, draftPackage,
          publishedBlog, takedownBlog, draftBlog, totalBlogCategory
        ] = await Promise.all([
          axiosInstance.get("/user", { params: { status: "Active" } }),
          axiosInstance.get("/user", { params: { status: "NonActive" } }),
          axiosInstance.get("/user", { params: { status: "Draft" } }),
          axiosInstance.get("/service-category", { params: { status: "Active" } }),
          axiosInstance.get("/service-category", { params: { status: "NonActive" } }),
          axiosInstance.get("/service-category", { params: { status: "Draft" } }),
          axiosInstance.get("/plan", { params: { status: "Active" } }),
          axiosInstance.get("/plan", { params: { status: "NonActive" } }),
          axiosInstance.get("/plan", { params: { status: "Draft" } }),
          axiosInstance.get("/blog", { params: { status: "Published" } }),
          axiosInstance.get("/blog", { params: { status: "Takedown" } }),
          axiosInstance.get("/blog", { params: { status: "Draft" } }),
          axiosInstance.get("/blog-category"),
        ]);

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            activeUsers: activeUser.data.pagination.total,
            nonActiveUsers: nonActiveUser.data.pagination.total,
            draftUsers: draftUser.data.pagination.total,
            activeServices: activeCategory.data.pagination.total,
            nonActiveServices: nonActiveCategory.data.pagination.total,
            draftServices: draftCategory.data.pagination.total,
            activePackages: activePackage.data.pagination.total,
            nonActivePackages: nonActivePackage.data.pagination.total,
            draftPackages: draftPackage.data.pagination.total,
            publishedBlogs: publishedBlog.data.pagination.total,
            takedownBlogs: takedownBlog.data.pagination.total,
            draftBlogs: draftBlog.data.pagination.total,
            totalBlogCategories: totalBlogCategory.data.pagination.total,
          },
        });
      } catch (error: any) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    };

    fetchAllData();
  }, []);

  const {
    activeUsers, nonActiveUsers, draftUsers,
    activeServices, nonActiveServices, draftServices,
    activePackages, nonActivePackages, draftPackages,
    publishedBlogs, takedownBlogs, draftBlogs,
    totalBlogCategories, loading, error
  } = state;

  const BlockCard: React.FC<BlockCardProps> = ({ text, value, className }) => (
    <div
      className={`h-full w-full rounded-lg shadow-md hover:shadow-lg transition-all p-5 flex flex-col gap-4 ${className || "text-black bg-white"
        }`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-base">{text}</h2>
        <ArrowUpRightFromCircle className="max-h-5 max-w-5 bg-transparent" />
      </div>
      <p className="text-4xl font-semibold">{value}</p>
    </div>
  );

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title="Overview" label="Overview" />
      <section className="flex flex-col gap-6 w-full items-center">
        {/* User Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">User</h1>
          <div className="w-full min-h-28 grid grid-cols-3 gap-8">
            <BlockCard text="Active User" value={activeUsers} className="bg-red-700 text-white" />
            <BlockCard text="NonActive User" value={nonActiveUsers} />
            <BlockCard text="Drafted User" value={draftUsers} />
          </div>
        </div>

        {/* Services & Packages */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Services Category & Packages</h1>
          <div className="w-full grid grid-cols-4 grid-rows-2 gap-6">
            <BlockCard text="Active Category" value={activeServices} className="bg-red-700 min-h-28 col-span-2 text-white" />
            <BlockCard
              text="Active Package"
              value={activePackages}
              className="min-h-28 col-span-2 col-start-3 bg-red-700/10 text-red-700 border-[2px] border-red-700/50"
            />
            <BlockCard text="Non Active Category" value={nonActiveServices} />
            <BlockCard text="Drafted Category" value={draftServices} />
            <BlockCard text="Non Active Package" value={nonActivePackages} />
            <BlockCard text="Draft Package" value={draftPackages} />
          </div>
        </div>

        {/* Blog Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-xl font-semibold">Blog</h1>
          <div className="w-full min-h-28 grid grid-cols-4 gap-6">
            <BlockCard text="Published Blog" value={publishedBlogs} className="bg-red-700 text-white" />
            <BlockCard text="Takedown Blog" value={takedownBlogs} />
            <BlockCard text="Drafted Blog" value={draftBlogs} />
            <BlockCard text="Total Blog Category" value={totalBlogCategories} />
          </div>
        </div>
      </section>
    </main>
  );
}
