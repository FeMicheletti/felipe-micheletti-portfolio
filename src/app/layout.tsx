import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Felipe Micheletti | Senior Full-Stack Developer",
    template: "%s | Felipe Micheletti",
  },
  description:
    "Portfólio de Felipe Micheletti, desenvolvedor Full-Stack especializado em produtos web, APIs, mobile e cloud.",
  keywords: [
    "Felipe Micheletti",
    "Full-Stack Developer",
    "Software Engineer",
    "Next.js",
    "Node.js",
    "React",
    "Java",
  ],
  authors: [{ name: "Felipe Micheletti" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
