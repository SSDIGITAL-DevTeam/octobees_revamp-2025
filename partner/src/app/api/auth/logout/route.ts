// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { octobeesLogout } from "@/services/authService";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    // belum login / token sudah hilang
    const res = NextResponse.json(
      { message: "Tidak ada sesi login" },
      { status: 401 }
    );
    // pastikan cookie juga dibersihkan
    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
    return res;
  }

  try {
    // hit ke Partner Portal API
    await octobeesLogout(token);
  } catch (error) {
    console.error("Logout error:", error);
    // walaupun gagal di backend, dari sisi FE kita tetap bersihkan cookie
  }

  const res = NextResponse.json(
    { message: "Logout berhasil" },
    { status: 200 }
  );

  // hapus cookie token
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
