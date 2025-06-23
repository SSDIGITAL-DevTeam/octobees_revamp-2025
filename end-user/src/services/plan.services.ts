import { CategoryService } from "@/constants/payload";
import { axiosInstance } from "@/lib/axios";

const getCategoryBySlug = async (slug: string) => {
  const response = await axiosInstance.get(`/service-category/${slug}`, {
    params: { status: "Active" },
  });
  return response.data as CategoryService;
};

export { getCategoryBySlug };
