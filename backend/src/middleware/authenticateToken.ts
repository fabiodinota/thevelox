import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { decryptToken } from "../utils/cryptToken";

dotenv.config();

interface CustomRequest extends Request {
	user?: JwtPayload | string;
}

export const authenticateToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers;
	const { accessToken: cookieToken } = req.cookies;

	let token = "";

	if (authorization) {
		const authHeader = authorization.split(" ");
		token = authHeader[1];
	} else if (cookieToken) {
		token = cookieToken;
	}

	const decryptedToken = decryptToken(token);

	if (!decryptedToken) {
		return res
			.status(401)
			.send("Unfortunately you're not authenticated, please log in.");
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).send("JWT secret is not defined");
	}

	jwt.verify(
		decryptedToken,
		process.env.JWT_SECRET,
		(err: unknown, decoded: unknown) => {
			if (err) return res.sendStatus(403);

			if (typeof decoded === "object" && decoded !== null) {
				req.user = decoded;
				console.log("Decoded token:", decoded);
				next();
			} else {
				return res.sendStatus(403).send({
					message: "Token was not authorized, please try again",
				});
			}
		}
	);
};
