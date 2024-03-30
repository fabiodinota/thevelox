import type { Metadata } from "next";
import Loading from "../loading";

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
        <>
{/*             <Loading />
 */}            <main>
                {children}
            </main>
        </>
	);
}
