// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { octobeesForgotPassword } from "@/services/authService";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi" },
        { status: 400 }
      );
    }

    const data = await octobeesForgotPassword({ email });

    // biasanya API akan kirim message seperti:
    // "Reset password link has been sent to your email"
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        message:
          error?.message ||
          "Terjadi kesalahan saat request forgot password, coba lagi nanti",
      },
      { status: 500 }
    );
  }
}
