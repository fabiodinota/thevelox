import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwtHelper";
import { decryptToken, encryptToken } from "../utils/cryptToken";

const prisma = new PrismaClient();

// Refresh the JWT Access Token.
export const refreshJWTToken = async (req: Request, res: Response) => {
	const encryptedRefreshToken = req.cookies.refreshToken;

	if (!encryptedRefreshToken) {
		console.log("No refresh token found");
		return res.status(401).json({ message: "No refresh token found" });
	}

	const refreshToken = decryptToken(encryptedRefreshToken) as string;

	try {
		// Verify the refresh token
		const decoded = (await verifyRefreshToken(refreshToken)) as {
			user_id: number;
		};

		// Check if the user exists (you can also include additional checks here)
		const user = await prisma.users.findUnique({
			where: { user_id: decoded.user_id },
		});

		if (!user) {
			console.log("User not found");
			return res.status(401).json({ message: "User not found" });
		}

		const accessToken = generateAccessToken(user.user_id);

		const encryptedAccessToken = encryptToken(accessToken);

		console.log("New access token generated");
		res.cookie("accessToken", encryptedAccessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			domain: process.env.HOST,
			expires: new Date(Date.now() + 1000 * 60 * 15), // 7 days
		});
		res.status(200).send({ message: "Access token refreshed" });
	} catch (error) {
		console.error("Error refreshing access token");
		res.status(401).json({ message: "Invalid refresh token" });
	}
};
