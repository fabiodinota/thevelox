"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import background from "@/public/background_signup.png";
import { useMediaQuery } from "react-responsive";
import SignUpStageOne from "./signupStageOne";
import { countriesMap } from "@/app/utils/phoneNumberUtils";
import SignUpStageTwo from "./signupStageTwo";
import { useSession } from "@/app/context/sessionContext";
import { useRouter } from "next/navigation";
import { MinimalNavBar } from "@/app/components/Navbar";

const page = () => {
	const [stageData, setStageData] = useState({
		stageOne: {
			email: "",
			password: "",
			repeatPassword: "",
		},
		stageTwo: {
			fullName: "",
			dateOfBirth: new Date(),
			countryCode: "",
			phoneNumber: "",
		},
	});

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [stage, setStage] = useState<number>(1);

	const { signUp } = useSession();

	const router = useRouter();

	useEffect(() => {
		if (stage === 3) {
			signUp({
				fullName: stageData.stageTwo.fullName,
				dateOfBirth: stageData.stageTwo.dateOfBirth,
				countryCode: stageData.stageTwo.countryCode,
				phoneNumber: stageData.stageTwo.phoneNumber,
				email: stageData.stageOne.email,
				password: stageData.stageOne.password,
			}).then(({ success, message }) => {
				if (success) {
					console.log("Sign-up successful!");
					router.push("/app/search");
				} else {
					console.error("Sign-up failed:", message);
					setErrorMessage(message || "");
					setStage(1);
				}
			});
		}
	}, [stage]);

	return (
		<div className="p-0 lg:p-10 flex flex-col lg:flex-row gap-5 lg:gap-10 min-h-screen h-full w-full">
			<MinimalNavBar
				onClick={
					stage === 2 || stage === 3 ? () => setStage(1) : undefined
				}
				href={stage === 1 ? "/" : "/signup"}
			/>
			<div className="bg-gradient lg:rounded-3xl relative w-full flex-grow h-[400px] lg:h-auto lg:min-h-[400px] grid place-content-center overflow-hidden">
				<div className="flex flex-col justify-center items-center gap-3 pt-10 lg:pt-0">
					<svg
						width="48"
						height="58"
						viewBox="0 0 48 58"
						className="lg:scale-100 scale-75"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M11.6129 0.0129531H46.9639C47.9117 0.0129531 48.36 1.19189 47.6555 1.83965L27.6105 19.7827C26.906 20.4305 27.3543 21.6094 28.3021 21.6094H46.9511C47.9117 21.6094 48.3472 22.8013 47.6299 23.4491L1.72482 57.7288C0.905082 58.4673 -0.337326 57.5733 0.0853494 56.5369L12.074 35.5493C12.3557 34.8627 11.8562 34.0983 11.1133 34.0983H1.31495C0.584874 34.0983 0.0853482 33.3469 0.354323 32.6603L10.6394 0.660718C10.7931 0.259104 11.1774 0 11.6 0L11.6129 0.0129531Z"
							fill="white"
						/>
						<path
							d="M19.3605 56.1151L35.3563 43.8304C36.0318 43.29 36.8603 43 37.727 43H46.8401C47.4774 43 48 43.5404 48 44.1995V56.8005C48 57.4596 47.4774 58 46.8401 58H20.036C19.08 58 18.6339 56.761 19.3605 56.1151Z"
							fill="white"
						/>
					</svg>
					<p className="md:text-[20px] text-[16px] text-white">
						Electricity In Its Veins
					</p>
				</div>
				<Image
					src={background}
					alt="background"
					fill
					className="object-cover opacity-75 rounded-2xl"
				/>
				<div className="w-full h-[100px] absolute block lg:hidden bottom-0 left-0 z-40 bg-gradient-to-t from-background to-black/0"></div>
			</div>
			<div
				className={`w-full py-10 lg:py-0 lg:flex-grow flex flex-col justify-end lg:justify-start items-start lg:items-center  p-5 lg:p-0`}
			>
				<Link
					href={stage === 1 ? "/" : "/signup"}
					onClick={
						stage === 2 || stage === 3
							? () => setStage(1)
							: undefined
					}
					className="w-full max-w-[700px] flex-row gap-3 hidden lg:flex"
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

				{stage === 1 && (
					<SignUpStageOne
						setStage={setStage}
						setStageData={setStageData}
						stageData={stageData}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				)}
				{(stage === 2 || stage === 3) && (
					<SignUpStageTwo
						setStage={setStage}
						setStageData={setStageData}
					/>
				)}
			</div>
		</div>
	);
};

export default page;
