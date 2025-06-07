import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/header/Header";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://astnai.com"),
  title: {
    template: "astnai/%s",
    default: "astnai",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden touch-manipulation">
      <body
        className={`${geistSans.className} ${geistMono.variable}  ${caveat.variable} antialiased text-sm sm:text-[15px] md:text-base leading-relaxed`}
      >
        <Header />
        <ViewTransition name="layout">
          <main className="mx-auto max-w-screen-sm px-8 text-neutral-800 dark:text-neutral-200">
            {children}
            <Analytics />
          </main>
        </ViewTransition>
      </body>
    </html>
  );
}
