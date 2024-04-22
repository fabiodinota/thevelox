"use client";

import React from "react";
import { useSession } from "../../context/sessionContext";
import { redirect } from "next/navigation";
import Header from "@/app/components/app/Header";
import { useRouter } from "next/navigation";
import RippleButton from "@/app/components/RippleButton";

const AppHomePage = () => {
	const { user, signOut } = useSession();

	const router = useRouter();

	const handleSignOut = async () => {
		/* const { success } = await signOut();

		if (success) {
			router.push("/signin");
		} */
	};
	return (
		<>
			<Header />
			<div className="w-full h-full flex justify-center items-center flex-col">
				You've entered the app directory: {user?.email}
				<RippleButton
					style="gradient"
					className="w-[200px]"
					onClick={handleSignOut}
					tabIndex={0}
				>
					Sign out
				</RippleButton>
			</div>
		</>
	);
};

export default AppHomePage;
