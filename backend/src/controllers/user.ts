import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get a user by id
export const getUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const user = await prisma.users.findFirst({
			where: {
				user_id: Number(id),
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
