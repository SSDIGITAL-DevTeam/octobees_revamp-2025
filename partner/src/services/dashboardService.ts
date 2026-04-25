// src/services/dashboardService.ts

import { clearPartnerSession } from "@/lib/partner-portal";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not set");
}

const handlePartnerApiError = async (res: Response, fallbackMessage: string) => {
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") {
      clearPartnerSession();
      window.location.href = "/login";
    }
  }

  const message =
    data?.message ||
    data?.error ||
    `${fallbackMessage} failed with status ${res.status}`;
  throw new Error(message);
};

export async function getAffiliateDashboardStat(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/stats`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get dashboard");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateServices(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/services`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get services");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateSalesMaterials(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/materials`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get sales materials");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export type PartnerCommissionQuery = {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  period?: string;
};

export async function getAffiliateCommissions(
  token: string,
  pageOrOptions: number | PartnerCommissionQuery = 1,
  limit = 10,
) {
  const options: PartnerCommissionQuery =
    typeof pageOrOptions === "number"
      ? { page: pageOrOptions, limit }
      : pageOrOptions;

  const params = new URLSearchParams();
  params.set("page", String(options.page ?? 1));
  params.set("limit", String(options.limit ?? 10));
  if (options.type) params.set("type", options.type);
  if (options.status) params.set("status", options.status);
  if (options.period) params.set("period", options.period);

  const res = await fetch(
    `${BASE_URL}/partner/dashboard/commissions?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get commissions");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateRecentLeads(token: string, limit = 5) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/recent-leads?limit=${limit}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get recent leads");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliatePerformance(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/performance`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get performance");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateTermsAndConditions(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/terms-and-conditions`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get terms and conditions");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateCommissionPolicy(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/commission-policy`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get commission policy");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliatePipelineStatuses(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/pipeline-statuses`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get pipeline statuses");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateVerticalMarkets(token: string) {
  const res = await fetch(`${BASE_URL}/partner/dashboard/vertical-markets`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get vertical markets");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateProfile(token: string) {
  const res = await fetch(`${BASE_URL}/partner/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get profile");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function updateAffiliateProfile(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/partner/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Update profile");
  }

  const response = await res.json().catch(() => ({}));
  return response;
}

export async function getAffiliateLeads(token: string, page = 1, limit = 10, status?: string) {
  let url = `${BASE_URL}/partner/leads?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get leads");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateLeadDetail(token: string, leadId: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return await handlePartnerApiError(res, "Get lead detail");
  }

  const data = await res.json().catch(() => ({}));
  return data;
}

export async function getAffiliateLeadActivities(token: string, leadId: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}/activities`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Get lead activities failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function createAffiliateLead(token: string, data: any) {
  const res = await fetch(`${BASE_URL}/partner/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      response?.message ||
      response?.error ||
      `Create lead failed with status ${res.status}`;
    throw new Error(message);
  }

  return response;
}

export async function updateAffiliateLead(token: string, leadId: string, data: any) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const response = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      response?.message ||
      response?.error ||
      `Update lead failed with status ${res.status}`;
    throw new Error(message);
  }

  return response;
}

export async function deleteAffiliateLead(token: string, leadId: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Delete lead failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function getAffiliateLeadNotes(token: string, leadId: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}/notes`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return handlePartnerApiError(res, "Get notes");
  return res.json().catch(() => ({}));
}

export async function createAffiliateLeadNote(token: string, leadId: string, content: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
    cache: "no-store",
  });
  if (!res.ok) return handlePartnerApiError(res, "Create note");
  return res.json().catch(() => ({}));
}

export async function updateAffiliateLeadNote(token: string, leadId: string, noteId: string, content: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
    cache: "no-store",
  });
  if (!res.ok) return handlePartnerApiError(res, "Update note");
  return res.json().catch(() => ({}));
}

export async function deleteAffiliateLeadNote(token: string, leadId: string, noteId: string) {
  const res = await fetch(`${BASE_URL}/partner/leads/${leadId}/notes/${noteId}`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return handlePartnerApiError(res, "Delete note");
  return res.json().catch(() => ({}));
}
