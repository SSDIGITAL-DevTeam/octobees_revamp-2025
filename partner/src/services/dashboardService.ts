// src/services/dashboardService.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not set");
}

// GANTI dengan endpoint GET yang kamu pakai di Postman,
// contoh: "/v1/affiliate/dashboard" atau "/v1/affiliate/auth/me"
const DASHBOARD_ENDPOINT = "/v1/affiliate/dashboard";

export async function getAffiliateDashboardStat(token: string) {
  const res = await fetch(`${BASE_URL}${DASHBOARD_ENDPOINT}/stats`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Get dashboard failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}