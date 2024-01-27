"use client";

import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import parseToken from "../utils/parseToken";
import Cookies from 'js-cookie';

// Create a context to manage the session
export const SessionContext = createContext({
	user: null as User | null,
	isAuthenticated: false,
	signIn: (credentials: object) => Promise.resolve(),
	signUp: (userData: object) => Promise.resolve(),
	signOut: () => {},
});

// Custom hook to access the theme and toggle function
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

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string>(() => Cookies.get('accessToken') || '');
	const [refreshToken, setRefreshToken] = useState<string>(() => Cookies.get('refreshToken') || '');

	console.log("User: ", user);

	// Store the access token in localStorage
	useEffect(() => {
		Cookies.set('accessToken', accessToken, { expires: 7, secure: true, sameSite: 'Lax' });
	}, [accessToken]);

	// Store the refresh token in a cookie
	useEffect(() => {
		Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'Lax' });
	}, [refreshToken]);

	// Function to refresh the access token
	const refreshAccessToken = async () => {
		try {
			console.log("Refreshing access token...: ", refreshToken);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/jwt/refresh`,
				{ refreshToken }
			);
			setAccessToken(response.data.accessToken);
		} catch (error) {
			console.error("Error refreshing access token:", error);
		}
	};

	// Check token expiration and refresh automatically
	useEffect(() => {
		const tokenExpirationThreshold = 10 * 60 * 1000; // e.g., 2 minutes before expiration

		const checkTokenExpiration = () => {
			const tokenData = parseToken(accessToken);
			if (tokenData && typeof tokenData !== "string" && tokenData.exp) {
				const currentTime = Math.floor(Date.now() / 1000);
				if (tokenData.exp - currentTime < tokenExpirationThreshold) {
					refreshAccessToken();
				}
			}
		};

		const tokenExpirationInterval = setInterval(
			checkTokenExpiration,
			60 * 1000
		);

		return () => {
			clearInterval(tokenExpirationInterval);
		};
	}, [accessToken]);

	useEffect(() => {
		// Define a function to fetch the user data
		const fetchUserData = async () => {
			try {
				const tokenData = parseToken(accessToken);

				if (
					tokenData &&
					typeof tokenData !== "string" &&
					"user_id" in tokenData
				) {
					// Make a GET request to /user/getUser/:id using the access token
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_API_URL}/user/getUser/${tokenData.user_id}`,
						{
							headers: {
								Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
							},
						}
					);

					// Update the user object in your session context or state with the fetched data
					setUser(response.data); // Assuming setUser is a state updater function in your component
				}
			} catch (error) {
				// Handle any errors (e.g., token expiration, unauthorized access)
				console.error("Error fetching user data:", error);
			}
		};

		// Check if there is an access token available
		if (accessToken) {
			fetchUserData(); // Call the function to fetch user data
		}
	}, []); // Empty dependency array means this effect runs once when the component mounts

	// Sign-in function
	const signIn = async (credentials: object) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
				credentials
			);
			setAccessToken(response.data.accessToken);
			setRefreshToken(response.data.refreshToken);
			setUser(response.data.user); // Update the user data in the session context
		} catch (error) {
			// Handle sign-in errors
			console.error("Error during sign-in:", error);
		}
	};

	// Sign-up function
	const signUp = async (userData: object) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
				userData
			);

			setAccessToken(response.data.accessToken);
			setRefreshToken(response.data.refreshToken);
			setUser(response.data.user); // Update the user data in the session context
		} catch (error) {
			// Handle sign-up errors
			console.error("Error during sign-up:", error);
		}
	};

	// Sign-out function
	const signOut = () => {
		  // Remove the cookies
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
      
          // Clear the user data and tokens in the state
          setUser(null);
          setAccessToken("");
          setRefreshToken("");
	};

	return (
		<SessionContext.Provider
			value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}
		>
			{children}
		</SessionContext.Provider>
	);
};
