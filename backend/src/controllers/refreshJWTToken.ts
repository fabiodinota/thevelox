import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwtHelper";

const prisma = new PrismaClient();

export const refreshJWTToken = async (req: Request, res: Response) => {
	const { refreshToken } = req.body;

	console.log("Refresh token:", refreshToken);

	try {
		// Verify the refresh token
		const decoded = (await verifyRefreshToken(refreshToken)) as {
			user_id: number;
		};

		console.log("Decoded token:", decoded); // Log the decoded token to check its contents

		// Check if the user exists (you can also include additional checks here)
		const user = await prisma.users.findUnique({
			where: { user_id: decoded.user_id },
		});

		if (!user) {
			console.log("User not found");
			return res.status(401).json({ message: "User not found" });
		}

		const accessToken = generateAccessToken(user.user_id);

		console.log("New access token generated");
		res.json({ accessToken });
	} catch (error) {
		console.error("Error:", error);
		console.log("Invalid refresh token");
		res.status(401).json({ message: "Invalid refresh token" });
	}
};
