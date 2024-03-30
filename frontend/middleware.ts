import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const userAccessToken = request.cookies.get("accessToken")?.value;
	const userRefreshToken = request.cookies.get("refreshToken")?.value;

	if (!userAccessToken && !userRefreshToken) {
		return NextResponse.redirect(new URL("/test", request.url));
	} else {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyToken`, {
				withCredentials: true,
			})
			.then((res) => {
				console.log("Res: ", res);
				return NextResponse.redirect(new URL("/signup", request.url));
			})
			.catch((err) => {
				console.log("Err: ", err);
				return NextResponse.redirect(new URL("/test", request.url));
			});
	}
}

export const config = {
	matcher: "/signin",
};
