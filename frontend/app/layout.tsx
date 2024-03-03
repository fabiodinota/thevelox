import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import dotenv from "dotenv";
import Head from "next/head";
import { ThemeProvider } from "./context/themeContext";
import { SessionProvider } from "./context/sessionContext";
import { AnimatePresence } from "framer-motion";
import AnimatePresenceProvider from "./context/AnimatePresenceProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AutocompleteProvider } from "./context/AutocompleteContext";
import { useEffect } from "react";
import "aos/dist/aos.css";
import Loading from "./loading";

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
                    <html lang="en" className={`${space_grotesk.className} bg-background`}>
                        <head>
                            {/* themecolor meta tag */}
                            <meta name="theme-color" content={"#E42B2B"} />
                            {/* viewport meta tag */}
                            <meta
                                name="viewport"
                                content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
                                />
                            <link rel="preconnect" href="https://api.thevelox.co" />
                        </head>
                        <body
                            className={
                                "bg-background text-foreground overflow-x-hidden"
                            }
                        >   
                            <Loading />
                            <Navbar />
                            <main className="mt-0 xl:mt-[100px]">
                                {children}
                            </main>
                            <Footer />
                        </body>     
                    </html>
                </AutocompleteProvider>
			</SessionProvider>
		</ThemeProvider>
	);
}
