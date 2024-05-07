"use client";

import { useTheme } from "@/app/context/themeContext";
import React, { useEffect, useState } from "react";
import {
	AccountCircleIcon,
	AdminIcon,
	HomeIcon,
	SearchIcon,
	TicketIcon,
} from "@/app/components/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import RippleButton from "../RippleButton";
import { useSession } from "@/app/context/sessionContext";

const BottomNav = () => {
	const pathname = usePathname();

	const [activeRoute, setActiveRoute] = useState<string>("");

	useEffect(() => {
		setActiveRoute(pathname.replace("/app/", ""));
	}, [pathname]);

	const customease = [0.05, 0.58, 0.57, 0.96];

	const textAnimation = `xl:group-hover:translate-y-0 xl:translate-y-3 xl:opacity-0 xl:group-hover:opacity-100 xl:duration-300 ease-[cubic-bezier(${customease})]`;

	const iconAnimation = `xl:group-hover:translate-y-0 xl:translate-y-3 xl:scale-110 xl:group-hover:scale-100 xl:duration-300 ease-[cubic-bezier(${customease})]`;

	const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

	const { isAdmin } = useSession();

	return (
		<nav
			className={
				"w-screen fixed bottom-5 px-5 flex justify-center items-center z-[999] lg:z-[80]"
			}
		>
			<div className="w-full lg:max-w-[600px] group flex justify-center items-center h-[80px] xl:h-[90px] rounded-[20px] bg-background/70 dark:bg-background back backdrop-blur-2xl xl:bg-background shadow-[0_0_35px_0_#00000010] dark:shadow-[0_0_35px_0_#FFFFFF10]  xl:shadow-[0_0_35px_0_#84848420] xl:dark:shadow-[0_0_35px_0_#FFFFFF06]">
				<div className="w-full flex flex-row px-2.5 md:px-10 py-2.5 gap-0 justify-evenly xl:justify-center xl:gap-10 items-center">
					<RippleButton
						onClick={() => setActiveRoute("home")}
						asLink
						href={"/app/home"}
						style="nofill"
						speed="fast"
						className="lg:hover:bg-secondary max-w-[100px] !flex-shrink w-full !py-2 !h-full duration-100 flex flex-col !gap-2 justify-center items-center"
					>
						<div
							className={`${
								activeRoute === "home"
									? "text-gradient"
									: `text-foreground ${iconAnimation}`
							} delay-0`}
						>
							{HomeIcon(activeRoute === "home")}
						</div>
						<span
							className={`leading-none select-none text-[14px] xl:text-[16px] delay-0 ${
								activeRoute === "home"
									? "text-gradient"
									: `text-foreground ${textAnimation}`
							}`}
						>
							Home
						</span>
					</RippleButton>
					<RippleButton
						onClick={() => setActiveRoute("search")}
						asLink
						href={"/app/search"}
						style="nofill"
						speed="fast"
						className="lg:hover:bg-secondary max-w-[100px] !flex-shrink w-full !py-2 !h-full duration-100 flex flex-col !gap-2 justify-center items-center"
					>
						<div
							className={`${
								activeRoute === "search"
									? "text-gradient"
									: `text-foreground ${iconAnimation}`
							} delay-75`}
						>
							{SearchIcon(activeRoute === "search")}
						</div>
						<span
							className={`leading-none select-none text-[14px] xl:text-[16px] delay-75 ${
								activeRoute === "search"
									? "text-gradient"
									: `text-foreground ${textAnimation}`
							}`}
						>
							Search
						</span>
					</RippleButton>
					<RippleButton
						onClick={() => setActiveRoute("history")}
						asLink
						href={"/app/history"}
						style="nofill"
						speed="fast"
						className="lg:hover:bg-secondary max-w-[100px] !flex-shrink w-full !py-2 !h-full duration-100 flex flex-col !gap-2 justify-center items-center"
					>
						<div
							className={`${
								activeRoute === "history"
									? "text-gradient"
									: `text-foreground ${iconAnimation}`
							} delay-100`}
						>
							{TicketIcon(
								activeRoute === "history",
								"w-6 h-6 xl:w-7 xl:h-7"
							)}
						</div>
						<span
							className={`leading-none select-none text-[14px] xl:text-[16px] delay-100 ${
								activeRoute === "history"
									? "text-gradient"
									: `text-foreground ${textAnimation}`
							}`}
						>
							History
						</span>
					</RippleButton>
					<RippleButton
						onClick={() => setActiveRoute("account")}
						asLink
						href={"/app/account"}
						style="nofill"
						speed="fast"
						className="lg:hover:bg-secondary max-w-[100px] !flex-shrink w-full !py-2 !h-full duration-100 flex flex-col !gap-2 justify-center items-center"
					>
						<div
							className={`${
								activeRoute === "account"
									? "text-gradient"
									: `text-foreground ${iconAnimation}`
							} delay-150`}
						>
							{AccountCircleIcon(activeRoute === "account")}
						</div>
						<span
							className={`leading-none select-none text-[14px] xl:text-[16px]  delay-150 ${
								activeRoute === "account"
									? "text-gradient"
									: `text-foreground ${textAnimation}`
							}`}
						>
							Account
						</span>
					</RippleButton>
					{isAdmin && (
						<RippleButton
							onClick={() => setActiveRoute("admin")}
							asLink
							href={"/app/admin"}
							style="nofill"
							speed="fast"
							className="lg:hover:bg-secondary max-w-[100px] !flex-shrink w-full !py-2 !h-full duration-100 flex flex-col !gap-2 justify-center items-center"
						>
							<div
								className={`${
									activeRoute === "admin"
										? "text-gradient"
										: `text-foreground ${iconAnimation}`
								} delay-150`}
							>
								{AdminIcon(activeRoute === "admin")}
							</div>
							<span
								className={`leading-none select-none text-[14px] xl:text-[16px]  delay-150 ${
									activeRoute === "admin"
										? "text-gradient"
										: `text-foreground ${textAnimation}`
								}`}
							>
								Admin
							</span>
						</RippleButton>
					)}
				</div>
			</div>
		</nav>
	);
};

export default BottomNav;
