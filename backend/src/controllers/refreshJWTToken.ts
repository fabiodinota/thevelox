import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwtHelper";
import { decryptToken, encryptToken } from "../utils/cryptToken";

const prisma = new PrismaClient();

// Refresh the JWT Access Token.
export const refreshJWTToken = async (req: Request, res: Response) => {
	const { authorization } = req.headers;
	const { refreshToken: encryptedRefreshToken } = req.cookies;

	let token = "";

	if (authorization) {
		const authHeader = authorization.split(" ");
		token = authHeader[1];
	} else if (encryptedRefreshToken) {
		token = encryptedRefreshToken;
	}

	if (!token) {
		console.log("No refresh token found");
		return res.status(401).json({ message: "No refresh token found" });
	}

	const refreshToken = decryptToken(token) as string;

	try {
		const decoded = (await verifyRefreshToken(refreshToken)) as {
			user_id: number;
		};

		const user = await prisma.users.findUnique({
			where: { user_id: decoded.user_id },
		});

		if (!user) {
			console.log("User not found");
			return res.status(401).json({ message: "User not found" });
		}

		if (!user.admin) {
			user.admin = false;
		}

		const accessToken = generateAccessToken(user.user_id, user.admin);

		const encryptedAccessToken = encryptToken(accessToken);

		console.log("New access token generated");
		res.clearCookie("accessToken");
		res.cookie("accessToken", encryptedAccessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			domain: process.env.COOKIE_DOMAIN,
			expires: new Date(Date.now() + 1000 * 60 * 15),
		});
		res.status(200).send({ message: "Access token refreshed" });
	} catch (error) {
		console.error("Error refreshing access token");
		res.status(401).json({ message: "Invalid refresh token" });
	}
};
