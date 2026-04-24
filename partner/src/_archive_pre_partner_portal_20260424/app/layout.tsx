import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

// Deployment trigger: 2026-04-15T12:00:00Z - Partner portal v3
export const metadata: Metadata = {
  title: "DIGITAL-PA Partner Dashboard",
  description:
    "Affiliate and partner performance dashboard for monitoring leads and commissions.",
};

export const runtime = "nodejs";

// Skip static prerendering for the entire app since it requires authentication
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F5F5F5] text-slate-900 antialiased">
        {children}
        <ClientProviders />
      </body>
    </html>
  );
}
