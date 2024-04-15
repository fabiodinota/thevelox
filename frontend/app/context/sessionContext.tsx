"use client";

import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { boolean } from "zod";
import { useRouter } from "next/navigation";

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};

type SessionProviderProps = {
	children: React.ReactNode;
};

type User = {
	user_id: number;
	username: string;
	email: string;
	password: string;
};

// Define a type for the context value
type SessionContextType = {
	user: User | null;
	isAuthenticated: boolean;
	signIn: (
		credentials: object
	) => Promise<{ success: boolean; message?: string }>;
	signUp: (
		userData: object
	) => Promise<{ success: boolean; message?: string }>;
	signOut: () => void;
};

// Define the initial context value based on the type
const initialContextValue: SessionContextType = {
	user: null,
	isAuthenticated: false,
	signIn: async () => ({ success: true }),
	signUp: async () => ({ success: true }),
	signOut: () => {},
};

export const SessionContext = createContext(initialContextValue);

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string>(
		() => Cookies.get("accessToken") || ""
	);
	const [refreshToken, setRefreshToken] = useState<string>(
		() => Cookies.get("refreshToken") || ""
	);

	const router = useRouter();

	/* console.log("User: ", user); */

	// Store the access token in localStorage
	useEffect(() => {
		if (accessToken !== "") {
			Cookies.set("accessToken", accessToken, {
				expires: 1,
				secure: true,
				sameSite: "Lax",
				domain: process.env.NEXT_PUBLIC_ORIGIN,
			});
		}
	}, [accessToken]);

	// Store the refresh token in a cookie
	useEffect(() => {
		if (refreshToken !== "") {
			Cookies.set("refreshToken", refreshToken, {
				expires: 7,
				secure: true,
				sameSite: "Lax",
				domain: process.env.NEXT_PUBLIC_ORIGIN,
			});
		}
	}, [refreshToken]);

	// Function to refresh the access token
	const refreshAccessToken = async () => {
		try {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/jwt/refresh`,
					{ encryptedRefreshToken: refreshToken } // Assuming refreshToken is already stored securely
				)
				.then((res) => {
					setAccessToken(res.data.encryptedAccessToken);
					if (res.data.encryptedAccessToken !== "") {
						fetchUserData();
					}
				});
		} catch (error) {
			console.error("Error refreshing access token:", error);
		}
	};

	// Trigger token refresh at regular intervals or before making an API call
	useEffect(() => {
		if (refreshToken) {
			const tokenRefreshInterval = setInterval(
				refreshAccessToken,
				5 * 60 * 1000
			); // every 5 minutes

			if (accessToken.startsWith("U2FsdG")) {
				fetchUserData();
			}

			return () => clearInterval(tokenRefreshInterval);
		}
	}, []);

	const fetchUserData = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`,
				{ withCredentials: true }
			);

			setUser(response.data);
		} catch (error) {
			// Handle any errors (e.g., token expiration, unauthorized access)
			console.error("Error fetching user data:", error);
		}
	};

	useEffect(() => {
		if (accessToken.startsWith("U2FsdG")) {
			fetchUserData();
		} else if (refreshToken.startsWith("U2FsdG")) {
			refreshAccessToken().then(() => {
				setTimeout(() => {
					fetchUserData();
				}, 500);
			});
		} else {
			setUser(null);
		}
	}, []);

	// Sign-in function
	const signIn = async (
		credentials: object
	): Promise<{ success: boolean; message?: string }> => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
				credentials
			);

			setAccessToken(response.data.encryptedAccessToken);
			setRefreshToken(response.data.encryptedRefreshToken);
			setUser(response.data.user); // Update the user data in the session context

			return { success: true, message: "Sign-in successful." };
		} catch (error) {
			let errorMessage = "An unexpected error occurred during sign-in.";

			const axiosError = error as AxiosError;
			if (axiosError.response) {
				errorMessage =
					(axiosError.response.data as { message?: string })
						?.message || errorMessage;
			} else if (axiosError.request) {
				errorMessage = "No response was received from the server.";
			} else {
				errorMessage = axiosError.message || errorMessage;
			}

			console.error("Error during sign-in:", errorMessage);
			return { success: false, message: errorMessage };
		}
	};

	// Sign-up function
	const signUp = async (
		userData: object
	): Promise<{ success: boolean; message?: string }> => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
				userData
			);

			setAccessToken(response.data.encryptedAccessToken);
			setRefreshToken(response.data.encryptedRefreshToken);
			setUser(response.data.user); // Update the user data in the session context

			return { success: true, message: "Sign-up successful." };
		} catch (error) {
			let errorMessage = "An unexpected error occurred during sign-up.";

			const axiosError = error as AxiosError;

			if (axiosError.response) {
				errorMessage =
					(axiosError.response.data as { message?: string })
						?.message || errorMessage;
			} else if (axiosError.request) {
				errorMessage = "No response was received from the server.";
			} else {
				errorMessage = axiosError.message || errorMessage;
			}
			console.log(errorMessage);
			return { success: false, message: errorMessage };
		}
	};

	// Sign-out function
	const signOut = () => {
		// Remove the cookies
		Cookies.remove("accessToken");
		Cookies.remove("refreshToken");

		// Clear the user data and tokens in the state
		setUser(null);
		setAccessToken("");
		setRefreshToken("");
		router.push("/");
	};

	return (
		<SessionContext.Provider
			value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}
		>
			{children}
		</SessionContext.Provider>
	);
};
