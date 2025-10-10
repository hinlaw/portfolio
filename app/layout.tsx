import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Support Pro - Intelligent Customer Service Solutions",
  description: "Transform your customer service with AI-powered auto-reply system. Reduce response times, increase satisfaction, and scale your support effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={"max-w-7xl mx-auto px-4"}
      >
        {children}
      </body>
    </html>
  );
}
