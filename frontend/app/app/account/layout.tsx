import type { Metadata } from "next";
import Loading from "../../loading";
import BottomNav from "../../components/app/BottomNav";
import Header from "../../components/app/Header";
import { usePathname, useRouter } from "next/navigation";

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
		<div className={`pb-[140px] pt-[70px] flex flex-col`}>
			<main className="h-full ">{children}</main>
			<BottomNav />
		</div>
	);
}
