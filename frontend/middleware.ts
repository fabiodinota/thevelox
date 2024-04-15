import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const userAccessToken = request.cookies.get("accessToken")?.value;
	const userRefreshToken = request.cookies.get("refreshToken")?.value;

	if (
		userAccessToken?.startsWith("U2FsdG") &&
		userRefreshToken?.startsWith("U2FsdG")
	) {
		console.log("User is authenticated");
		if (request.nextUrl.pathname.startsWith("/signin")) {
			console.log("Redirecting to /app from signin");
			return NextResponse.redirect(new URL("/app", request.url));
		} else if (request.nextUrl.pathname.startsWith("/signup")) {
			console.log("Redirecting to /app from signup");
			return NextResponse.redirect(new URL("/app", request.url));
		} else {
			return NextResponse.next();
		}
	} else {
		console.log("User is not authenticated");
		if (request.nextUrl.pathname.startsWith("/app")) {
			console.log("Redirecting to /signin from app");
			return NextResponse.redirect(new URL("/signin", request.url));
		} else {
			return NextResponse.next();
		}
	}
}

export const config = {
	matcher: ["/signin", "/signup", "/app/:path*"],
};
