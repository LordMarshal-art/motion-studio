import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "LordMarshal Motion Studio",
  description: "Browser-based motion graphics studio for titles, lower thirds, stats, and overlays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#06080F] text-slate-100 antialiased">{children}</body>
    </html>
  );
}
