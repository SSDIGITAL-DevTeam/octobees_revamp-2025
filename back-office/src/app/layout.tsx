import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebarcomponents } from "@/components/partials/sidebar/SidebarComponents";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://octobees.com"),
  title: "OCTOBEES | Branding-focused & marketing tech company",
  description: "OCTOBEES is a Branding-focused & marketing tech company",
  icons: {
    icon: "/assets/png/asset-logo-octobees.png",
  },
  openGraph: {
    title: 'Octobees | Octobees',
    description: 'OCTOBEES is a branding-focused & marketing tech company. We focus to turn a brand to become top-of-mind and Well-Trusted Forever through various campaign method and content creation.',
    images: '/assets/png/asset-logo-octobees.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
       
      </body>
    </html>
  );
}