// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { octobeesLogin } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const data = await octobeesLogin({ email, password });

    // Kalau API kirim token dan mau simpan di cookie (lebih aman):
    // misal response: { accessToken, user, ... }
    // if (data.accessToken) {
    //   const res = NextResponse.json(
    //     { user: data.user },
    //     { status: 200 }
    //   );
    //   res.cookies.set("accessToken", data.accessToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "lax",
    //     path: "/",
    //   });
    //   return res;
    // }

    // Kalau belum pakai cookie, kirim balik apa adanya:
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message:
          error?.message || "Terjadi kesalahan saat login, coba lagi nanti",
      },
      { status: 500 }
    );
  }
}
