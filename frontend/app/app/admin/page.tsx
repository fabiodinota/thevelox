"use client";

import Header from "@/app/components/app/Header";
import { useSession } from "@/app/context/sessionContext";
import React from "react";

const AdminPage = () => {
	return (
		<>
			<Header />
			<div className="w-full h-full flex justify-center items-center mt-10"></div>
		</>
	);
};

export default AdminPage;
