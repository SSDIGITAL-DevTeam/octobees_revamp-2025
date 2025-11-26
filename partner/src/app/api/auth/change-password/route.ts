// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { octobeesChangePassword } from "@/services/authService";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Old password dan new password wajib diisi" },
        { status: 400 }
      );
    }

    const data = await octobeesChangePassword(
      { oldPassword, newPassword },
      token
    );

    // biasanya API balas message sukses, tinggal forward
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      {
        message:
          error?.message ||
          "Terjadi kesalahan saat change password, coba lagi nanti",
      },
      { status: 500 }
    );
  }
}
