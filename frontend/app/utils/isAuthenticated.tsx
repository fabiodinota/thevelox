"use client";

import React from "react";
import { useSession } from "../context/sessionContext";

export const isAuthenticated = () => {
	const { isAuthenticated } = useSession();

	return isAuthenticated ? true : false;
};
