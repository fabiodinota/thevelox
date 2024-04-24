"use client";

import { useTheme } from "@/app/context/themeContext";
import Image from "next/image";
import React from "react";
import Logo_Black from "@/public/Logo_thevelox_black.png";
import Logo_White from "@/public/Logo_thevelox_white.png";

const Header = () => {
	const { theme } = useTheme();

	return (
		<header
			className={
				"w-screen relative top-5 xl:top-0 px-5 xl:px-0 flex justify-center items-center z-[999]"
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
				</div>
			</div>
		</header>
	);
};

export default Header;
