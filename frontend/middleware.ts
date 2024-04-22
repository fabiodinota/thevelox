import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

async function validateToken(token: string) {
	try {
		const data = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + token,
				},
			}
		);
		return await data.json();
	} catch (error: any) {
		console.error("Error validating token:", error.message);
	}
}

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

	let user: User | null = null;
	if (accessToken !== "") {
		user = await validateToken(accessToken);
	}

	if (user?.user_id) {
		if (["/signin", "/signup", "/app"].includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL("/app/home", request.url));
		}
		if (
			request.nextUrl.pathname.startsWith("/app/admin") &&
			user.admin === false
		) {
			return NextResponse.redirect(new URL("/app/home", request.url));
		}

		return NextResponse.next();
	} else if (user && user.admin === true) {
		console.log("User is an admin:", user);
		if (request.nextUrl.pathname === "/app/admin") {
			return NextResponse.next();
		} else {
			return NextResponse.redirect(new URL("/app/home", request.url));
		}
	} else if (user === null) {
		if (request.nextUrl.pathname === "/app/admin") {
			return NextResponse.redirect(new URL("/signin", request.url));
		}
		if (request.nextUrl.pathname.startsWith("/app")) {
			return NextResponse.redirect(new URL("/signin", request.url));
		}
		return NextResponse.next();
	}
}

export const config = {
	matcher: ["/signin", "/signup", "/app/:path*"],
};
