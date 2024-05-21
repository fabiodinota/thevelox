import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
	user?: {
		user_id: number;
		admin: boolean;
		iat: string;
		exp: string;
	};
}

type Journey = {
	journey_id: number;
	line_id_start: string;
	line_id_end: string;
	departure_station: string;
	arrival_station: string;
	departure_time: Date;
	arrival_time: Date;
};

type Ticket = {
	ticket_id: number;
	user_id: number;
	journey_id: number;
	payment_method_id: number;
	journey_date: Date;
	booking_date: Date;
	price: number | null;
	ticket_object: string | null;
	journeys?: Journey;
};

type User = {
	user_id: number;
	full_name: string;
	birth_date: Date;
	country_code: string;
	phone_number: string;
	email: string;
	password: string;
	admin: boolean | null;
	created_on: Date;
	tickets?: Ticket[];
};

export const getAllUsers = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;
		const admin = req.user?.admin;

		if (!admin) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		const usersWithTickets: User[] = await prisma.users.findMany({
			include: {
				tickets: true,
			},
		});

		if (!usersWithTickets) {
			return res.status(404).json({ message: "No users found" });
		}

		usersWithTickets.forEach((user) => {
			if (user.tickets) {
				user.tickets.sort((a: Ticket, b: Ticket) => {
					const dateA = new Date(a.journey_date).getTime();
					const dateB = new Date(b.journey_date).getTime();
					return dateB - dateA;
				});
			}
		});

		res.status(200).json(usersWithTickets);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
	const admin = req.user?.admin;

	const { user_id }: { user_id: number } = req.body;

	if (!admin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	if (!user_id) {
		return res
			.status(400)
			.json({ message: "User ID is required to delete." });
	}

	try {
		await prisma.users.delete({
			where: {
				user_id: user_id,
			},
			include: {
				payment_methods: true,
				tickets: {
					include: {
						journeys: true,
					},
				},
				favorites: true,
			},
		});

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteTicket = async (req: CustomRequest, res: Response) => {
	const admin = req.user?.admin;

	const { ticket_id }: { ticket_id: number } = req.body;

	if (!admin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	if (!ticket_id) {
		return res
			.status(400)
			.json({ message: "Ticket ID is required to delete." });
	}

	try {
		await prisma.tickets.delete({
			where: {
				ticket_id: ticket_id,
			},
		});

		res.status(200).json({ message: "Ticket deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const changeRole = async (req: CustomRequest, res: Response) => {
	const admin = req.user?.admin;

	const { user_id, admin: adminStatus }: { user_id: number; admin: boolean } =
		req.body;

	if (!admin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	if (!user_id || adminStatus === undefined) {
		return res
			.status(400)
			.json({ message: "User ID and new role are required." });
	}

	try {
		await prisma.users.update({
			where: {
				user_id: user_id,
			},
			data: {
				admin: adminStatus ? false : true,
			},
		});

		res.status(200).json({ message: "Role changed successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
