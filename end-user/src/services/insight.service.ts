import { Blog, BlogCategory, Pagination } from "@/constants/payload";
import { axiosInstance } from "@/lib/axios";

const getAllInsights = async ({
  search,
  page,
}: {
  search: string;
  page: number;
}) => {
  const response = await axiosInstance.get("/blog", {
    params: {
      search,
      status: "Published",
      limit: 10,
      orderBy: "createdAt:desc",
      page,
    },
  });
  return {
    data: response.data.data as Blog[],
    pagination: response.data.pagination as Pagination,
  };
};

const getAllCategories = async () => {
  const response = await axiosInstance.get(`/blog-category`, {
    params: {
      status: true,
    },
  });
  return {
    data: response.data.data as BlogCategory[],
    pagination: response.data.pagination as Pagination,
  };
};

const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/blog-category/${id}`);
  return response.data as BlogCategory;
};

const getInsightBySlug = async (slug: string) => {
  const response = await axiosInstance.get(`/blog/${slug}`,{
    params: {
      status: "Published",
    },
  });
  return response.data as Blog;
};

const getInsightByCategory = async (
  category: string,
  limit: number,
  page?: number
) => {
  const response = await axiosInstance.get(`/blog`, {
    params: {
      categoryId: category,
      limit: limit || 3,
      page: page || 1,
      orderBy: "createdAt:desc",
      status: "Published",
    },
  });
  return {
    data: response.data.data as Blog[],
    pagination: response.data.pagination as Pagination,
  };
};

const getInsightBySearch = async (
  search: string,
  limit: number,
  page?: number
) => {
  const response = await axiosInstance.get("/blog", {
    params: {
      search,
      limit: limit || 10,
      page: page || 1,
      status: "Published",
      orderBy: "createdAt:desc",
    },
  });
  return {
    data: response.data.data as Blog[],
    pagination: response.data.pagination as Pagination,
  };
};

export {
  getAllInsights,
  getAllCategories,
  getInsightBySlug,
  getInsightByCategory,
  getInsightBySearch,
  getCategoryById,
};
