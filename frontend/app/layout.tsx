import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import dotenv from "dotenv";
import { ThemeProvider } from "./context/themeContext";
import { SessionProvider } from "./context/sessionContext";
import { AutocompleteProvider } from "./context/AutocompleteContext";

// Load environment variables from .env
dotenv.config();

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "The Velox - Home",
	description: "The Velox - Home",
	generator: "Next.js",
	manifest: "/manifest.json",
	keywords: [],
	authors: [{ name: "Fabio Di Nota" }],
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
				<AutocompleteProvider>
					<html
						lang="en"
						className={`${space_grotesk.className} bg-background`}
					>
						<head>
							<meta
								name="theme-color"
								media="(prefers-color-scheme: dark)"
								content="#121212"
							/>
							<meta
								name="theme-color"
								media="(prefers-color-scheme: light)"
								content="#ffffff"
							/>

							{/* viewport meta tag */}
							<meta
								name="viewport"
								content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
							/>
							<link
								rel="preconnect"
								href="https://api.thevelox.co"
							/>
						</head>
						<body
							className={
								"bg-background text-foreground overflow-x-hidden"
							}
						>
							{children}
						</body>
					</html>
				</AutocompleteProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
