import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
    user?: {
        user_id: number;
        iat: string;
        exp: string;
    };
}

// Get a user by id
export const getUser = async (req: CustomRequest, res: Response) => {
	const user_id = req.user?.user_id;
    
	try {
		const user = await prisma.users.findFirst({
			where: {
				user_id: Number(user_id),
			},
		});
		if (user) {
			res.json(user);
		} else {
			res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ error: "Error retrieving user" });
	}
};
