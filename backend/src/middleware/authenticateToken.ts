import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { decryptToken } from '../utils/cryptToken';


dotenv.config();

interface CustomRequest extends Request {
    user?: JwtPayload | string; // Adjusted to match the types that jwt.verify can return
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies['accessToken']; // Extract the token from cookies

    const decryptedToken = decryptToken(token);

    if (!decryptedToken) {
        return res.status(401).send("Unfortunately you're not authorized, please log in."); // If no token, return unauthorized
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).send('JWT secret is not defined');
    }

    jwt.verify(decryptedToken, process.env.JWT_SECRET, (err: unknown, decoded: unknown) => {
        // Explicitly check the type of `err` and `decoded` due to TypeScript's type safety
        if (err) return res.sendStatus(403); // If token is not valid or expired, return forbidden

        // Assuming `decoded` is of type JwtPayload if not an error, adjust as necessary for your payload
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
            console.log('Decoded token:', decoded); // Log the decoded token to check its contents
            next(); // Proceed to the next middleware/function
        } else {
            return res.sendStatus(403).send({ message: "Token was not authorized, please try again"}); // Handle the case where decoded is not as expected
        }
    });
};
