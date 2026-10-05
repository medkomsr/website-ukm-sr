import type { Metadata } from "next";
import { Geist, Great_Vibes, Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "@/app/globals.css";
import "@/styles/brand-theme.scss";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

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
    <html
      lang="id"
      className={cn(
        "h-full antialiased",
        inter.variable,
        geist.variable,
        playfair.variable,
        greatVibes.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
