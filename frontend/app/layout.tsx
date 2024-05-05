import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import dotenv from "dotenv";
import { ThemeProvider } from "./context/themeContext";
import { SessionProvider } from "./context/sessionContext";
import { AutocompleteProvider } from "./context/AutocompleteContext";
import { Toaster } from "sonner";
import { checkIcon, errorIcon, xIcon } from "./components/Icons";

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
							<Toaster
								position="top-right"
								toastOptions={{
									className:
										"bg-background text-white shadow-[0_0_35px_0_#00000010] dark:shadow-[0_0_35px_0_#FFFFFF10] border-0 rounded-xl py-5 px-7",
									duration: 3000,
									closeButton: true,
									cancelButtonStyle: {
										color: "white",
										backgroundColor: "red",
									},
									classNames: {
										error: "text-[#E31937]",
										success: "text-[#00B252]",
										closeButton:
											"text-primary w-7 h-7 text-[50px] outline-[1px] outline-white !bg-background hover:bg-primary border-0",
										content: `text-[14px] md:text-[16px] font-regular !font-space-grotesk`,
									},
								}}
								icons={{
									success: checkIcon,
									error: errorIcon,
								}}
							/>
						</body>
					</html>
				</AutocompleteProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
