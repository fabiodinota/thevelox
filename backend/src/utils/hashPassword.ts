import bcrypt from "bcrypt";

const saltRounds = 10;

// Hash the password
async function hashPassword(password: string): Promise<string> {
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
}

// Verify the password to hashed password
async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	const match = await bcrypt.compare(password, hashedPassword);
	return match;
}

export { hashPassword, verifyPassword };
