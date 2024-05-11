"use client";

import Link from "next/link";
import RippleButton from "./components/RippleButton";

export default function NotFound() {
	return (
		<main className="flex h-[100dvh] flex-col items-center justify-center">
			<div className="space-y-4 text-center">
				<h1 className="text-9xl font-bold tracking-tighter text-foreground">
					404
				</h1>
				<p className="text-lg text-foreground/50">
					Oops, the page you are looking for does not exist.
				</p>
				<RippleButton style="gradient" href="/" asLink>
					Go Home
				</RippleButton>
			</div>
		</main>
	);
}
