import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const upstream = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body,
    });

    const text = await upstream.text();
    return new NextResponse(text, {
        status: upstream.status,
        headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
    });
}
