import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
	path: "../.env",
});

// Helper function to generate an access token
function generateAccessToken(user_id: number) {
	if (!process.env.JWT_SECRET) {
		throw new Error(
			"JWT_SECRET is not defined in the environment variables"
		);
	}

	console.log("Access token generated");
	return jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

// Helper function to generate a refresh token
function generateRefreshToken(user_id: number) {
	if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
		throw new Error(
			"JWT_SECRET is not defined in the environment variables"
		);
	}

	console.log("Refresh token generated");
	return jwt.sign({ user_id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
}

if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
	throw new Error("JWT_SECRET is not defined in the environment variables");
}
const refreshSecretKey = process.env.JWT_REFRESH_TOKEN_SECRET;

export const verifyRefreshToken = (token: string) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, refreshSecretKey, (error, decoded) => {
			if (error) {
				console.log(
					"Refresh token verification failed: ",
					error.message,
					token,
					refreshSecretKey
				);
				reject(error); // Token verification failed
			} else {
				console.log("Refresh token verified");
				resolve(decoded); // Token is valid, and 'decoded' contains the payload
			}
		});
	});
};

export { generateAccessToken, generateRefreshToken };
