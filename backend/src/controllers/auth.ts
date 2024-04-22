import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper";
import { decryptToken, encryptToken } from "../utils/cryptToken";

const prisma = new PrismaClient();

// Sign up a new user with username, email, and password
export const signUp = async (req: Request, res: Response) => {
	const { fullName, dateOfBirth, countryCode, phoneNumber, email, password } =
		req.body;

	const hashedPassword = await hashPassword(password);

	const existingUser = await prisma.users.findFirst({
		where: {
			OR: [
				{
					email,
				},
			],
		},
	});

	if (existingUser) {
		console.log("User with that email already exists");
		return res.status(409).send({
			message: "User with that email already exists",
		});
	}

	const newUser = await prisma.users.create({
		data: {
			full_name: fullName,
			birth_date: dateOfBirth,
			country_code: countryCode,
			phone_number: phoneNumber,
			email,
			password: hashedPassword,
			created_on: new Date(),
		},
	});

	const accessToken = generateAccessToken(newUser.user_id); // Set expiresIn as needed
	const refreshToken = generateRefreshToken(newUser.user_id); // Set expiresIn as needed

	const encryptedAccessToken = encryptToken(accessToken);
	const encryptedRefreshToken = encryptToken(refreshToken);

	console.log("New user created: ", newUser);
	res.cookie("accessToken", encryptedAccessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		expires: new Date(Date.now() + 1000 * 60 * 15), // 15 mins
	});
	res.cookie("refreshToken", encryptedRefreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
	});
	res.send({ user: newUser });
};

// Sign in a user based on username and password
export const signIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	const user = await prisma.users.findFirst({
		where: {
			email,
		},
	});

	if (!user) {
		console.log("User not found");
		return res.status(404).send({ message: "User not found" });
	}

	const passwordMatch = await verifyPassword(password, user.password);

	if (passwordMatch) {
		// Generate a JWT token for the authenticated user    // Generate a JWT token for the newly registered user
		const accessToken = generateAccessToken(user.user_id); // Set expiresIn as needed
		const refreshToken = generateRefreshToken(user.user_id); // Set expiresIn as needed

		const encryptedAccessToken = encryptToken(accessToken);
		const encryptedRefreshToken = encryptToken(refreshToken);

		console.log("User authenticated: ", user);

		res.cookie("accessToken", encryptedAccessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			expires: new Date(Date.now() + 1000 * 60 * 15), // 15 mins
		});
		res.cookie("refreshToken", encryptedRefreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
		});
		res.send({ user });
	} else {
		console.log("Password is incorrect");
		res.status(401).send({ message: "Password is incorrect" });
	}
};

interface CustomRequest extends Request {
	user?: {
		user_id: number;
		iat: string;
		exp: string;
	}; // Adjusted to match the types that jwt.verify can return
}

export const verifyToken = async (req: CustomRequest, res: Response) => {
	const user_id = req.user?.user_id;

	const user = await prisma.users.findUnique({
		where: {
			user_id,
		},
	});

	if (user) {
		res.send({ isValid: true });
	} else {
		res.send({ isValid: false });
	}
};

export const signOut = async (req: Request, res: Response) => {
	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	res.send({ message: "User has been signed out" });
};
