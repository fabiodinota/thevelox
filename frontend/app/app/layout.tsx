import type { Metadata } from "next";
import BottomNav from "../components/app/BottomNav";

export const metadata: Metadata = {
	title: "The Velox - App",
	description: "The Velox - App",
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
		<div className={`flex flex-col`}>
			<main className="h-full ">{children}</main>
			<BottomNav />
		</div>
	);
}
