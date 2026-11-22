import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motion Studio | Creator Motion Graphics",
  description:
    "Animated motion-graphic overlays, titles, lower thirds, and callouts with PNG and WebM export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-cyan-400/25 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
