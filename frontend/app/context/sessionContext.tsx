"use client";

import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
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
        if(accessToken !== ""){
		    Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'Lax', domain: process.env.NEXT_PUBLIC_ORIGIN });
        }
	}, [accessToken]);

	// Store the refresh token in a cookie
	useEffect(() => {
        if(refreshToken !== ""){
		    Cookies.set('refreshToken', refreshToken, { expires: 7, secure: true, sameSite: 'Lax', domain: process.env.NEXT_PUBLIC_ORIGIN });
        }
	}, [refreshToken]);

	// Function to refresh the access token
    const refreshAccessToken = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/jwt/refresh`,
            { encryptedRefreshToken: refreshToken } // Assuming refreshToken is already stored securely
          );
          // Assuming the server will return a new access token directly without encryption
          setAccessToken(response.data.encryptedAccessToken);
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      };
      
      // Trigger token refresh at regular intervals or before making an API call
      useEffect(() => {
        if(user){
            const tokenRefreshInterval = setInterval(refreshAccessToken, 10 * 60 * 1000); // e.g., every 15 minutes
        
            return () => clearInterval(tokenRefreshInterval);
        }
      }, []);

    const fetchUserData = async () => {
        try {
            if (accessToken !== "") {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`, { withCredentials: true });

                setUser(response.data);
            }
        } catch (error) {
            // Handle any errors (e.g., token expiration, unauthorized access)
            console.error("Error fetching user data:", error);
        }
    };

	useEffect(() => {
		// Check if there is an access token available
		if (accessToken) {
			fetchUserData(); // Call the function to fetch user data
		}
	}, []);

	// Sign-in function
	const signIn = async (credentials: object) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
				credentials
			);

			setAccessToken(response.data.encryptedAccessToken);
			setRefreshToken(response.data.encryptedRefreshToken);
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

			setAccessToken(response.data.encryptedAccessToken);
			setRefreshToken(response.data.encryptedRefreshToken);
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
