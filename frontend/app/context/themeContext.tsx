"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context to manage the theme
export const ThemeContext = createContext({
	theme: "light",
	toggleTheme: () => {},
});

// Custom hook to access the theme and toggle function
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

type ThemeProviderProps = {
	children: React.ReactNode;
};

// ThemeProvider component to manage theme state
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme") as "light" | "dark";
		if (storedTheme) {
			setTheme(storedTheme);
		} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setTheme("dark");
		} else {
			setTheme("light");
			localStorage.setItem("theme", "light");
		}
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark");
	};

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
