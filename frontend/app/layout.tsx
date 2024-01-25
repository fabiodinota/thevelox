import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dotenv from "dotenv";
import Head from "next/head";
import { ThemeProvider } from "./context/themeContext";
import { SessionProvider } from "./context/sessionContext";

// Load environment variables from .env
dotenv.config();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "The Velox - Home",
	description: "The Velox - Home",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: [],
	authors: [{ name: "Fabio Di Nota" }],
	viewport:
		"minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
	icons: [
		{ rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
		{ rel: "icon", url: "/icons/icon-192x192.png" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider>
			<SessionProvider>
				<html lang="en">
                    <head>
                        {/* themecolor meta tag */}
                        <meta name="theme-color" content={"#E42B2B"} />
                        {/* manifest meta tags */}
                    </head>
					<body
						className={
							inter.className +
							"bg-white dark:bg-background text-black dark:text-white overflow-x-hidden"
						}
					>
						{children}
					</body>
				</html>
			</SessionProvider>
		</ThemeProvider>
	);
}
