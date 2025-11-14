import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Octobees Partner Dashboard",
  description:
    "Affiliate and partner performance dashboard for monitoring leads and commissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-[#F5F5F5] text-slate-900 antialiased`}
      >
        <div className="flex min-h-screen bg-[#F5F5F5]">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col px-8 py-6">
            <main className="mt-6 flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
