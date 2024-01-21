import jwt from "jsonwebtoken";

// Function to parse a JWT token and extract data
const parseToken = (token: string) => {
	try {
		const decoded = jwt.decode(token);
		return decoded;
	} catch (error) {
		// Handle token parsing errors
		return null;
	}
};

export default parseToken;
