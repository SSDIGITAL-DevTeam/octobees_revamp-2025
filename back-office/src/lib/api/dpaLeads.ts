import { axiosInstance } from "@/lib/axios";

export type DpaLeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export type DpaLeadDemoRequest = {
  id: string;
  name: string;
  whatsappNumber: string;
  email: string;
  businessType: string;
  businessTypeOther?: string | null;
  coreProblem: string;
  source: string;
  status: DpaLeadStatus;
  createdAt: string;
  updatedAt: string;
};

export type DpaLeadDemoRequestsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: DpaLeadStatus | "all";
  createdAt?: "today" | "this_week" | "this_month";
  orderBy?: string;
};

export type DpaLeadDemoRequestsResponse = {
  data: DpaLeadDemoRequest[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
};

export const getDpaLeadDemoRequests = (params: DpaLeadDemoRequestsParams) => {
  const { status, ...rest } = params;

  return axiosInstance.get<DpaLeadDemoRequestsResponse>("/dpa-leads/demo-requests", {
    params: {
      ...rest,
      status: status && status !== "all" ? status : undefined,
    },
  });
};

export const updateDpaLeadDemoRequest = (
  id: string,
  data: {
    status: DpaLeadStatus;
  },
) =>
  axiosInstance.patch<{ data: DpaLeadDemoRequest; message: string }>(
    `/dpa-leads/demo-requests/${id}`,
    data,
  );
