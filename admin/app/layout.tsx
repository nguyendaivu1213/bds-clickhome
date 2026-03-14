import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminLayoutWrapper from "./AdminLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildPro CMS - Bảng Điều Khiển",
  description: "Bảng Điều Khiển Hệ thống CMS Bất Động Sản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-background font-display text-slate-800 transition-colors duration-200 antialiased`}>
        <AdminLayoutWrapper>
          {children}
        </AdminLayoutWrapper>
      </body>
    </html>
  );
}
