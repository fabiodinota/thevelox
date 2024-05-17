"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Progress } from "./components/ui/progress";
import React from "react";
import AnimatePresenceProvider from "./context/AnimatePresenceProvider";
import { useTheme } from "./context/themeContext";

export default function Loading() {
	// Or a custom loading skeleton component
	const [progress, setProgress] = React.useState(0);
	const [loading, setLoading] = React.useState(true);

	const { theme } = useTheme();

	React.useEffect(() => {
		const timer = setTimeout(() => setProgress(27), 250);
		const timer2 = setTimeout(() => setProgress(50), 750);
		const timer3 = setTimeout(() => setProgress(65), 1400);
		const timer4 = setTimeout(() => setProgress(80), 2100);
		const timer5 = setTimeout(() => setProgress(100), 2850);
		const timer6 = setTimeout(() => setLoading(false), 3000);
		return () => {
			clearTimeout(timer);
			clearTimeout(timer2);
			clearTimeout(timer3);
			clearTimeout(timer4);
			clearTimeout(timer5);
			clearTimeout(timer6);
		};
	}, []);
	return (
		<AnimatePresenceProvider>
			{loading && (
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="bg-background fixed top-0 left-0 z-50 h-screen w-screen flex justify-center items-center"
				>
					<div className="flex justify-center items-center flex-col h-full w-full">
						<div className="relative w-[50%] md:w-[30%] xl:w-[400px] xl:h-[200px]">
							<Image
								priority
								unoptimized
								src={
									theme === "dark"
										? "https://storage.thevelox.co/Logo_Animation.gif"
										: "https://storage.thevelox.co/Logo_Animation_dark.gif"
								}
								fill
								alt="TheVelox"
								className="object-contain w-full h-full"
							/>
						</div>
						<Progress
							value={progress}
							className=" w-[50%] xl:w-full max-w-[500px] h-[2px]"
						/>
					</div>
				</motion.div>
			)}
		</AnimatePresenceProvider>
	);
}
