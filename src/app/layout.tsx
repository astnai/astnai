import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  description: "astnai is the handle of Agustín Arias, a developer from Patagonia, Argentina.",
  title: {
    template: "astnai/%s",
    default: "astnai",
  },
  openGraph: {
    siteName: "astnai",
    url: "https://astnai.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@astnai",
    creator: "@astnai",
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
        className={`${geistSans.className} ${geistMono.variable} ${caveat.variable} mx-auto max-w-screen-sm px-6 sm:px-8 md:px-10 text-sm sm:text-[15px] md:text-base leading-relaxed antialiased`}
      >
        <Header />
        <ViewTransition name="layout">
          <main>
            {children}
            <Analytics />
            <SpeedInsights/>
          </main>
        </ViewTransition>
      </body>
    </html>
  );
}
