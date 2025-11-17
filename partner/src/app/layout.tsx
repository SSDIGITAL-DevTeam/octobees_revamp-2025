import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
