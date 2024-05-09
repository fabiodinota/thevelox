"use client";

import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "../types/types";

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

// Define a type for the context value
type SessionContextType = {
	user: User | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	fetchUserData: () => void;
	signIn: (
		credentials: object
	) => Promise<{ success: boolean; message?: string }>;
	signUp: (
		userData: object
	) => Promise<{ success: boolean; message?: string }>;
	signOut: () => Promise<{ success: boolean; message?: string }>;
};

// Define the initial context value based on the type
const initialContextValue: SessionContextType = {
	user: null,
	isAuthenticated: false,
	isAdmin: false,
	fetchUserData: async () => {},
	signIn: async () => ({ success: true }),
	signUp: async () => ({ success: true }),
	signOut: async () => ({ success: true }),
};

export const SessionContext = createContext(initialContextValue);

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	// Check if the user is an admin
	useEffect(() => {
		if (user) {
			setIsAdmin(user.admin);
		}
	}, [user]);

	// Function to refresh the access token
	const refreshAccessToken = async () => {
		try {
			await axios
				.get(
					`${process.env.NEXT_PUBLIC_API_URL}/jwt/refresh`,
					{ withCredentials: true } // Assuming refreshToken is already stored securely
				)
				.then((res) => {
					if (res.status === 200) {
						fetchUserData();
					} else if (
						res.status === 401 &&
						res.data.message === "No refresh token found"
					) {
						console.log("No refresh token found");
					} else {
						console.log("Error refreshing access token");
					}
				});
		} catch (error) {
			console.error("Error refreshing access token:", error);
		}
	};

	const router = useRouter();

	const pathname = usePathname();

	useEffect(() => {
		const checkAuthentication = () => {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/isAuthenticated`,
					{
						withCredentials: true,
					}
				)
				.then((response) => {
					const { accessToken, refreshToken, isAuthenticated } =
						response.data;

					if (refreshToken) {
						refreshAccessToken(); // Refresh token if we have refresh token but no access token
					} else if (
						!accessToken &&
						!refreshToken &&
						!isAuthenticated &&
						pathname.startsWith("/app")
					) {
						router.push("/signin"); // Redirect to sign-in if no tokens are available
					}
				})
				.catch((error) => {
					console.error("Error:", error);
					router.push("/error"); // Handle error or redirect if needed
				});
		};

		checkAuthentication();

		const tokenRefreshInterval = setInterval(() => {
			checkAuthentication();
		}, 5 * 60 * 1000);

		return () => clearInterval(tokenRefreshInterval);
	}, []);

	const fetchUserData = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`,
				{ withCredentials: true }
			);

			setUser(response.data);
		} catch (error: any) {
			// Handle any errors (e.g., token expiration, unauthorized access)
			console.log("Error fetching user data:", error);
			if (error.response.status === 403) {
				refreshAccessToken();
			}
		}
	};

	// Sign-in function
	const signIn = async (
		credentials: object
	): Promise<{ success: boolean; message?: string }> => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
				credentials,
				{ withCredentials: true }
			);

			setUser(response.data.user); // Update the user data in the session context

			toast.success("Sign-in successful.");
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

			toast.error(errorMessage);
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
				userData,
				{ withCredentials: true }
			);

			setUser(response.data.user); // Update the user data in the session context

			toast.success("Sign-up successful.");
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
			toast.error(errorMessage);
			return { success: false, message: errorMessage };
		}
	};

	// Sign-out function
	const signOut = async () => {
		// Clear the user data and tokens in the state
		try {
			await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
				withCredentials: true,
			});

			setUser(null); // Update the user data in the session context
			toast.success("Sign-Out successful.");
			router.refresh();
			return { success: true, message: "Sign-Out successful." };
		} catch (error) {
			let errorMessage = "An unexpected error occurred during sign-out.";

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
			toast.error(errorMessage);
			return { success: false, message: errorMessage };
		}
	};

	return (
		<SessionContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isAdmin,
				fetchUserData,
				signIn,
				signUp,
				signOut,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};
