"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { Squash as Hamburger } from "hamburger-react";
import { useMediaQuery } from "react-responsive";
import Logo_White from "@/public/Logo_thevelox_white.png";
import Logo_Black from "@/public/Logo_thevelox_black.png";
import { useTheme } from "../context/themeContext";
import Image from "next/image";
import Logo_animation from "@/public/Logo_Animation.gif";
import RippleButton from "./RippleButton";

const Navbar = () => {
	const [openMobileNav, setOpenMobileNav] = useState<boolean>(false);

	const pathname = usePathname();
	const { theme } = useTheme();

	const customease = [0.05, 0.58, 0.57, 0.96];

	const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

	/*  if(openMobileNav) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = 'auto'
    } */

	useEffect(() => {
		if (!isMobile) {
			setOpenMobileNav(false);
		}
	}, [isMobile]);

	const hrVariant = {
		initial: {
			width: 0,
			origin: "left",
			opacity: 1,
			transition: { duration: 0.5, delay: 0.1, ease: customease },
		},
		animate: {
			width: "100%",
			origin: "left",
			opacity: 1,
			transition: { duration: 0.5, delay: 0.1, ease: customease },
		},
		exit: {
			width: 0,
			origin: "left",
			opacity: 1,
			transition: { duration: 0.5, delay: 0.1, ease: customease },
		},
	};

	const liVariant = {
		initial: { y: 50, opacity: 0 },
		animate: { y: 0, opacity: 1 },
		exit: { y: 50, opacity: 0 },
	};

	const navVariant = {
		initial: { opacity: 0, scale: 1.1 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.2, ease: customease },
		},
		exit: {
			opacity: 0,
			scale: 1.1,
			transition: { duration: 0.2, delay: 0.3, ease: customease },
		},
	};

	const handleClose = () => {
		setOpenMobileNav(false);
	};

	return (
		<>
			<nav
				className={
					"w-screen fixed top-5 px-5 xl:px-0 xl:top-0 xl:left-0 flex justify-center items-center z-[999]"
				}
			>
				<div className="w-full flex justify-center items-center h-[80px] xl:h-[100px] rounded-[20px] xl:rounded-none bg-background/70 dark:bg-background back backdrop-blur-2xl xl:bg-background shadow-[0_0_35px_0_#00000010] dark:shadow-[0_0_35px_0_#FFFFFF10]  xl:shadow-[0_0_35px_0_#84848420] xl:dark:shadow-[0_0_35px_0_#FFFFFF06]">
					<div className="w-full max-w-[1400px] flex flex-row justify-between px-5 xl:px-10 items-center">
						<Link
							href={"/"}
							className="relative h-[35px] w-[120px] xl:h-[100px] cursor-pointer"
						>
							<Image
								sizes="120px"
								src={theme === "dark" ? Logo_White : Logo_Black}
								alt="TheVelox"
								className={"object-contain"}
								fill
								priority
							/>
						</Link>
						<div className="flex-row list-none gap-10 items-center hidden xl:flex">
							<Link
								className={`nav-item`}
								data-text="Home"
								href="/"
							>
								<span>Home</span>
							</Link>
							<Link
								className="nav-item"
								data-text="About Us"
								href="/about"
							>
								<span>About Us</span>
							</Link>
							<Link
								className="nav-item"
								data-text="Contact Us"
								href="/contact"
							>
								<span>Contact Us</span>
							</Link>
							<RippleButton
								asLink
								href="/signup"
								style="gradient"
								prefetch={false}
								className="w-[220px] !h-[50px]"
							>
								Launch App
							</RippleButton>
							<ThemeSwitcher
								size="small"
								className="hidden xl:flex"
							/>
						</div>
						<div className="block xl:hidden">
							<Hamburger
								color={theme === "dark" ? "white" : "#121212"}
								label="Show menu"
								rounded
								size={30}
								toggled={openMobileNav}
								toggle={setOpenMobileNav}
							/>
						</div>
					</div>
				</div>
			</nav>
			<AnimatePresence mode="wait">
				{openMobileNav && (
					<motion.nav
						variants={navVariant}
						initial="initial"
						animate="animate"
						exit="exit"
						className="fixed inset-0 w-screen h-screen overflow-y-auto no-scrollbar pb-[100px] bg-background z-[998] flex flex-col justify-between items-center"
					>
						<ul
							className={
								"flex flex-col w-full gap-10 px-5 mt-[130px] relative z-30"
							}
						>
							<motion.li
								onClick={handleClose}
								variants={liVariant}
								transition={{
									duration: 0.3,
									delay: openMobileNav ? 0.3 : 0.3,
									ease: customease,
								}}
								className="flex items-center w-full flex-col gap-10"
							>
								<Link
									className={`nav-item-mobile hover:text-foreground/80 duration-100 text-[42px] xs:text-[50px] sm:text-[60px] w-full text-left`}
									href="/"
								>
									<motion.span className="pl-5">
										1. Home
									</motion.span>
								</Link>
								<motion.hr
									variants={hrVariant}
									transition={{
										duration: 0.3,
										delay: 0,
										ease: customease,
									}}
									className="bg-muted h-[2px] w-full origin-bottom-left"
								/>
							</motion.li>
							<motion.li
								onClick={handleClose}
								variants={liVariant}
								transition={{
									duration: 0.3,
									delay: openMobileNav ? 0.2 : 0.4,
									ease: customease,
								}}
								className="flex items-center w-full flex-col gap-10"
							>
								<Link
									className="nav-item-mobile hover:text-foreground/80 duration-100 text-[42px] xs:text-[50px] sm:text-[60px] w-full text-left"
									href="/about"
								>
									<motion.span className="pl-5">
										2. About Us
									</motion.span>
								</Link>
								<motion.hr
									variants={hrVariant}
									transition={{
										duration: 0.3,
										delay: 0.1,
										ease: customease,
									}}
									className="bg-muted h-[2px] w-full origin-bottom-left"
								/>
							</motion.li>
							<motion.li
								onClick={handleClose}
								variants={liVariant}
								transition={{
									duration: 0.3,
									delay: openMobileNav ? 0.1 : 0.5,
									ease: customease,
								}}
								className="flex items-center w-full flex-col gap-10"
							>
								<Link
									className="nav-item-mobile hover:text-foreground/80 duration-100 text-[42px] xs:text-[50px] sm:text-[60px] w-full text-left"
									href="/contact"
								>
									<motion.span className="pl-5">
										3. Contact Us
									</motion.span>
								</Link>
								<motion.hr
									variants={hrVariant}
									transition={{
										duration: 0.3,
										delay: 0.2,
										ease: customease,
									}}
									className="bg-muted h-[2px] w-full origin-bottom-left"
								/>
							</motion.li>
							<motion.li
								onClick={handleClose}
								variants={liVariant}
								transition={{
									duration: 0.3,
									delay: openMobileNav ? 0 : 0.6,
									ease: customease,
								}}
								className="flex items-center w-full flex-col gap-10"
							>
								<Link
									className="text-gradient nav-item-mobile hover:text-foreground/80 duration-100 text-[42px] xs:text-[50px] sm:text-[60px] w-full text-left"
									href="/signup"
									prefetch={false}
								>
									<motion.span className="pl-5">
										4. Launch App
									</motion.span>
								</Link>
							</motion.li>
						</ul>
						<ThemeSwitcher
							size="big"
							className="px-5 fixed bottom-5 z-50 "
						/>
						{/*                     <div className='fixed bottom-0 w-full h-[100px] left-0 z-40 bg-gradient-to-t from-background to-[#12121200]'></div>
						 */}{" "}
					</motion.nav>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;

interface NavBarProps {
	onClick: (() => void) | undefined;
	href: string;
}

export const MinimalNavBar = ({ onClick, href }: NavBarProps) => {
	const { theme } = useTheme();

	return (
		<nav
			className={
				"w-screen fixed block lg:hidden top-5 px-5 z-50 xl:px-0 xl:top-0 xl:left-0"
			}
		>
			<div className="w-full flex justify-center items-center h-[80px] xl:h-[100px] rounded-[20px] xl:rounded-none bg-background/70 dark:bg-background back backdrop-blur-2xl xl:bg-background shadow-[0_0_35px_0_#00000010] dark:shadow-[0_0_35px_0_#FFFFFF10]  xl:shadow-[0_0_35px_0_#84848420] xl:dark:shadow-[0_0_35px_0_#FFFFFF06]">
				<div className="w-full max-w-[1400px] flex flex-row justify-between px-5 xl:px-10 items-center">
					<div className="relative h-[35px] w-[120px] xl:h-[100px]">
						<Image
							sizes="120px"
							src={theme === "dark" ? Logo_White : Logo_Black}
							alt="TheVelox"
							className={"object-contain"}
							fill
							priority
						/>
					</div>
					<Link
						href={href}
						onClick={onClick}
						className="flex-row gap-3 flex"
					>
						<svg
							width="14"
							height="22"
							viewBox="0 0 14 22"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 1.5L2.76316 10.275C2.34816 10.6693 2.34816 11.3307 2.76316 11.725L12 20.5"
								className="stroke-foreground"
								strokeWidth="3"
								strokeLinecap="round"
							/>
						</svg>
						Go Back
					</Link>
				</div>
			</div>
		</nav>
	);
};
