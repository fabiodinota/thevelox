import bcrypt from "bcrypt";

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
}

async function verifyPassword(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	const match = await bcrypt.compare(password, hashedPassword);
	return match;
}

export { hashPassword, verifyPassword };
