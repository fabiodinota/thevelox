"use client";

import { useTheme } from "@/app/context/themeContext";
import React, { useEffect, useState } from "react";
import {
	AccountCircleIcon,
	HomeIcon,
	SearchIcon,
	TicketIcon,
} from "@/app/components/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";

const BottomNav = () => {
	const pathname = usePathname();

	const [activeRoute, setActiveRoute] = useState<string>("");

	console.log(activeRoute);

	useEffect(() => {
		setActiveRoute(pathname.replace("/app/", ""));
	}, [pathname]);

	return (
		<nav
			className={
				"w-screen fixed xl:relative bottom-5 px-5 flex justify-center items-center z-[999]"
			}
		>
			<div className="w-full max-w-[1400px] flex justify-center items-center h-[80px] xl:h-[100px] rounded-[20px] bg-background/70 dark:bg-background back backdrop-blur-2xl xl:bg-background shadow-[0_0_35px_0_#00000010] dark:shadow-[0_0_35px_0_#FFFFFF10]  xl:shadow-[0_0_35px_0_#84848420] xl:dark:shadow-[0_0_35px_0_#FFFFFF06]">
				<div className="w-full max-w-[1400px] flex flex-row justify-center gap-1 px-5 sm:px-0 sm:gap-0 sm:justify-evenly xl:justify-center xl:gap-20 items-center">
					<Link
						href={"/app/home"}
						className="flex flex-col gap-2 justify-center items-center max-w-[100px] w-full py-2 duration-100 hover:bg-secondary rounded-xl"
					>
						{HomeIcon(activeRoute === "home")}
						<span
							className={`leading-none text-[14px] xl:text-[16px] ${
								activeRoute === "home"
									? "text-gradient"
									: "text-foreground"
							}`}
						>
							Home
						</span>
					</Link>
					<Link
						href={"/app/search"}
						className="flex flex-col gap-2 justify-center items-center max-w-[100px] w-full py-2 duration-100 hover:bg-secondary rounded-xl"
					>
						{SearchIcon(activeRoute === "search")}
						<span
							className={`leading-none text-[14px] xl:text-[16px] ${
								activeRoute === "search"
									? "text-gradient"
									: "text-foreground"
							}`}
						>
							Search
						</span>
					</Link>
					<Link
						href={"/app/history"}
						className="flex flex-col gap-2 justify-center items-center max-w-[100px] w-full py-2 duration-100 hover:bg-secondary rounded-xl"
					>
						{TicketIcon(activeRoute === "history")}
						<span
							className={`leading-none text-[14px] xl:text-[16px] ${
								activeRoute === "history"
									? "text-gradient"
									: "text-foreground"
							}`}
						>
							History
						</span>
					</Link>
					<Link
						href={"/app/account"}
						className="flex flex-col gap-2 justify-center items-center max-w-[100px] w-full py-2 duration-100 hover:bg-secondary rounded-xl"
					>
						{AccountCircleIcon(activeRoute === "account")}
						<span
							className={`leading-none text-[14px] xl:text-[16px] ${
								activeRoute === "account"
									? "text-gradient"
									: "text-foreground"
							}`}
						>
							Account
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default BottomNav;
