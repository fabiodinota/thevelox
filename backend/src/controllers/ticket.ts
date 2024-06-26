import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
	user?: {
		user_id: number;
		iat: string;
		exp: string;
	};
}

export type Ticket = {
	departureTime: string;
	arrivalTime: string;
	startStation: string;
	endStation: string;
	startLine: number;
	endLine: number;
	startLevel: number;
	endLevel: number;
	times: string[];
	price: number;
};

export const buyTicket = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;

		const {
			ticket,
			payment_method_id,
		}: { ticket: Ticket; payment_method_id: number } = req.body;

		const startLineId = `${ticket.startLevel}-${ticket.startLine}`;
		const endLineId = `${ticket.endLevel}-${ticket.endLine}`;

		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		if (!ticket) {
			return res.status(400).json({ message: "Ticket is required" });
		}

		if (!payment_method_id) {
			return res
				.status(400)
				.json({ message: "Payment method ID is required" });
		}

		const newJourney = await prisma.journeys.create({
			data: {
				line_id_start: startLineId,
				line_id_end: endLineId,
				departure_station: ticket.startStation,
				arrival_station: ticket.endStation,
				departure_time: ticket.departureTime,
				arrival_time: ticket.arrivalTime,
			},
		});

		const newTicket = await prisma.tickets.create({
			data: {
				user_id,
				payment_method_id,
				journey_id: newJourney.journey_id,
				journey_date: ticket.departureTime,
				booking_date: new Date(),
				price: ticket.price,
				ticket_object: JSON.stringify(ticket),
			},
		});

		res.status(200).json(newTicket);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getActiveTickets = async (req: CustomRequest, res: Response) => {
	const user_id = req.user?.user_id;

	if (!user_id) {
		return res.status(400).json({ message: "User ID is required" });
	}

	const tickets = await prisma.tickets.findMany({
		where: {
			user_id,
		},
		include: {
			journeys: true,
		},
	});

	const activeTickets = tickets.filter((ticket) => {
		const journeyDate = new Date(ticket.journey_date);
		const currentDate = new Date();

		return journeyDate >= currentDate;
	});

	res.status(200).json(activeTickets);
};

export const getTicketHistory = async (req: CustomRequest, res: Response) => {
	const user_id = req.user?.user_id;

	if (!user_id) {
		return res.status(400).json({ message: "User ID is required" });
	}

	const tickets = await prisma.tickets.findMany({
		where: {
			user_id,
		},
		include: {
			journeys: true,
		},
	});

	const TicketHistory = tickets.filter((ticket) => {
		const journeyDate = new Date(ticket.journey_date);
		const currentDate = new Date();

		return journeyDate < currentDate;
	});

	res.status(200).json(TicketHistory);
};
