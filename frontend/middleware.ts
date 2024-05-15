"use server";

import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import Cookies from "js-cookie";

async function validateToken(accessToken: string) {
	try {
		const data = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + accessToken,
				},
			}
		);

		return await data.json();
	} catch (error: any) {
		console.error("Error validating token:", error.message);
	}
}

const getIPInfo = async (ip: string) => {
	try {
		const data = await fetch(`http://ip-api.com/json/${ip}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		return await data.json();
	} catch (error: any) {
		console.error("Error getting IP info:", error.message);
	}
};

type User = {
	user_id: number;
	full_name: string;
	birth_date: string;
	country_code: string;
	phone_number: string;
	email: string;
	password: string;
	admin: boolean;
	created_on: string;
};

export async function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken")?.value ?? "";

	const IPInfo = getIPInfo(
		request.ip || request.headers.get("X-Forwarded-For") || ""
	);

	let user: User | null = null;
	if (accessToken !== "") {
		user = await validateToken(accessToken);
	}

	if (user?.user_id) {
		if (["/signin", "/signup", "/app"].includes(request.nextUrl.pathname)) {
			const response = NextResponse.redirect(
				new URL("/app/search", request.url)
			);
			response.headers.set("timezone", JSON.stringify(IPInfo));
			return response;
		}
		if (
			request.nextUrl.pathname.startsWith("/app/admin") &&
			user.admin === false
		) {
			const response = NextResponse.redirect(
				new URL("/app/search", request.url)
			);
			response.headers.set("timezone", JSON.stringify(IPInfo));
			return response;
		}

		const response = NextResponse.next();

		response.headers.set("timezone", JSON.stringify(IPInfo));

		return response;
	} else if (user && user.admin === true) {
		console.log("User is an admin:", user);
		if (request.nextUrl.pathname === "/app/admin") {
			const response = NextResponse.next();

			response.headers.set("timezone", JSON.stringify(IPInfo));

			return response;
		} else {
			const response = NextResponse.redirect(
				new URL("/app/search", request.url)
			);
			response.headers.set("timezone", JSON.stringify(IPInfo));
			return response;
		}
	} else if (user === null) {
		if (request.nextUrl.pathname === "/app/admin") {
			const response = NextResponse.redirect(
				new URL("/signin", request.url)
			);
			response.headers.set("timezone", JSON.stringify(IPInfo));
			return response;
		}
		if (request.nextUrl.pathname.startsWith("/app")) {
			const response = NextResponse.redirect(
				new URL("/signin", request.url)
			);
			response.headers.set("timezone", JSON.stringify(IPInfo));
			return response;
		}
		const response = NextResponse.next();

		response.headers.set("timezone", JSON.stringify(IPInfo));

		return response;
	}
}

export const config = {
	matcher: ["/signin", "/signup", "/app/:path*"],
};
