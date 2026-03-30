"use client";

import { useEffect, useState, Suspense } from "react";
import Header from "@/components/layout/header/Header";
import { FormCourse } from "@/components/layout/form";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import { Course } from "@/constrant/payload";
import Loading from "@/components/layout/wrapper/Loading";
import { failedToast } from "@/utils/toast";

const EditCourseContent = () => {
  const [course, setCourse] = useState<Course | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!id) return;
        const response = await axiosInstance.get(`/course/${id}`);
        setCourse(response.data);
      } catch (error: any) {
        failedToast("Failed to fetch course data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (isLoading) return <Loading isLoading={true} />;
  
  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Courses"} label={"Course Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Course</h1>
          <p>Update course data</p>
        </div>
        <div className="w-full">
          {course && <FormCourse course={course} />}
        </div>
      </section>
    </main>
  );
};

export default function EditCoursePage() {
  return (
    <Suspense fallback={<Loading isLoading={true} />}>
      <EditCourseContent />
    </Suspense>
  );
}
