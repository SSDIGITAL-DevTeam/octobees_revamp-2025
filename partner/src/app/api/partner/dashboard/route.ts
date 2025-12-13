// app/api/affiliate/dashboard/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAffiliateDashboardStat } from "@/services/dashboardService";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await getAffiliateDashboardStat(token);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      {
        message:
          error?.message || "Gagal mengambil data dashboard",
      },
      { status: 500 }
    );
  }
}