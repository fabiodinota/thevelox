"use client";

import React from "react";
import { useSession } from "../../context/sessionContext";
import { redirect } from "next/navigation";

const AppHomePage = () => {
	const { user, signOut, isAuthenticated } = useSession();

	if (!isAuthenticated) {
		redirect("/signin");
	}

	return (
		<div className="w-full h-full flex justify-center items-center flex-col">
			You've entered the app directory: {user?.email}
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
};

export default AppHomePage;
