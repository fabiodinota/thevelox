import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dotenv from 'dotenv';
import Head from "next/head";
import { ThemeProvider } from "./context/themeContext";

// Load environment variables from .env
dotenv.config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Velox - Home",
  description: "The Velox - Home",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [],
  themeColor: "#E42B2B",
  authors: [
    { name: "Fabio Di Nota" },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/icon-128x128.png" },
    { rel: "icon", url: "/icons/icon-128x128.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
        <html lang="en">
        <body className={inter.className + "bg-white dark:bg-background text-black dark:text-white"}>{children}</body>
        </html>
    </ThemeProvider>
  );
}
