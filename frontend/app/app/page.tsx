"use client";

import React from "react";
import { useSession } from "../context/sessionContext";

const TestPage = () => {
	const { user, signOut } = useSession();

	return (
		<div>
			You've entered the app directory: {user?.email}
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
};

export default TestPage;
