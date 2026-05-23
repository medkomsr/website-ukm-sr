import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script" });

export const metadata: Metadata = {
  title: "Seni Religi UB - Website Resmi Seni Religi Universitas Brawijaya",
  description: "Website Resmi Seni Religi Universitas Brawijaya",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full antialiased", inter.variable, playfair.variable, greatVibes.variable, "font-sans")}>
      <body className="min-h-full flex flex-col"> <QueryProvider>{children}</QueryProvider></body>
    </html>
  );
}
