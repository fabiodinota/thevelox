"use client";

import { useSession } from "@/app/context/sessionContext";
import React from "react";

const AdminPage = () => {
	const { isAdmin } = useSession();

	return <div>AdminPage</div>;
};

export default AdminPage;
