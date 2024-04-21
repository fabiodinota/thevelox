"use client";

import Link from "next/link";
import React from "react";
import Logo from "@/public/Logo_thevelox_allwhite.png";
import Image from "next/image";
import RippleButton from "./RippleButton";

const Footer = () => {
	return (
		<footer className="w-full h-full flex justify-center items-center flex-col bg-gradient mt-[100px]">
			<div className="flex justify-center items-center flex-col max-w-[1400px] gap-10 py-10 px-10">
				<h1 className="text-[9vw] md:text-[70px] text-center text-balance font-bold text-white leading-snug">
					Get Started Now <br />
					Book Your Journey in Seconds!
				</h1>
				<RippleButton
					/* 	asLink
					href="/signup" */
					style="nofill"
					className="w-full max-w-[400px] bg-white"
					rippleColor="#00000010"
				>
					<span className="text-gradient font-bold text-[18px]">
						Launch App
					</span>
				</RippleButton>
				<hr className="h-[2px] w-full bg-white/50 border-none" />
				<div className="flex flex-col gap-2 justify-center items-center">
					<div className="relative h-[50px] w-[200px]">
						<Image
							sizes="200px"
							quality={100}
							priority={false}
							src={Logo}
							alt="logo"
							fill
							className="object-contain"
						/>
					</div>
					<span className="text-white/50">By Fabio Di Nota</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
