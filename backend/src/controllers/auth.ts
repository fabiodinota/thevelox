import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper";
import { encryptToken } from "../utils/cryptToken";

const prisma = new PrismaClient();

// Sign up a new user with username, email, and password
export const signUp = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	const hashedPassword = await hashPassword(password);

	const existingUser = await prisma.users.findFirst({
		where: {
			OR: [
				{
					username,
				},
				{
					email,
				},
			],
		},
	});

	if (existingUser) {
		console.log("User with that username or email already exists");
		return res.status(409).send({
			message: "User with that username or email already exists",
		});
	}

	const newUser = await prisma.users.create({
		data: {
			username,
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
	res.send({ user: newUser, encryptedAccessToken, encryptedRefreshToken });
};

// Sign in a user based on username and password
export const signIn = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await prisma.users.findFirst({
		where: {
			username,
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

		res.send({ user, encryptedAccessToken, encryptedRefreshToken });
	} else {
		console.log("Password is incorrect");
		res.status(401).send({ message: "Password is incorrect" });
	}
};
