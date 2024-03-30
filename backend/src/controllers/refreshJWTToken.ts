import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwtHelper";
import { decryptToken, encryptToken } from "../utils/cryptToken";

const prisma = new PrismaClient();

// Refresh the JWT Access Token.
export const refreshJWTToken = async (req: Request, res: Response) => {
	const { encryptedRefreshToken } = req.body;

    const refreshToken = decryptToken(encryptedRefreshToken) as string;

	console.log("Refresh token:", refreshToken);

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
		res.json({ encryptedAccessToken });
	} catch (error) {
		console.error("Error refreshing access token");
		console.log("Invalid refresh token");
		res.status(401).json({ message: "Invalid refresh token" });
	}
};
