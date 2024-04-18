"use client";

import React from "react";
import { useSession } from "../../context/sessionContext";

const AppHomePage = () => {
	const { user, signOut } = useSession();

	return (
		<div className="w-full h-full flex justify-center items-center flex-col">
			You've entered the app directory: {user?.email}
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
};

export default AppHomePage;
