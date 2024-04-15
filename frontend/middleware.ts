import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const userAccessToken = request.cookies.get("accessToken")?.value;
	const userRefreshToken = request.cookies.get("refreshToken")?.value;

	if (!userAccessToken && !userRefreshToken) {
		return NextResponse.redirect(new URL("/signin", request.url));
	} else {
		if (request.nextUrl.pathname.startsWith("/signin")) {
			return NextResponse.redirect(new URL("/app", request.url));
		} else if (request.nextUrl.pathname.startsWith("/signup")) {
			return NextResponse.redirect(new URL("/app", request.url));
		}
		return NextResponse.next();
	}
}

export const config = {
	matcher: "/app",
};
