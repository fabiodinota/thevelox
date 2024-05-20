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

export const getFavoriteRoutes = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;

		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const favoriteRoutes = await prisma.favorites.findMany({
			where: {
				user_id,
			},
			include: {
				journeys: true,
			},
		});

		const formattedFavoriteRoutes = favoriteRoutes.map((favoriteRoute) => {
			return {
				favorite_id: favoriteRoute.favorite_id,
				start_station: favoriteRoute.journeys.departure_station,
				end_station: favoriteRoute.journeys.arrival_station,
				start_line: favoriteRoute.journeys.line_id_start,
				end_line: favoriteRoute.journeys.line_id_end,
			};
		});

		res.status(200).json(formattedFavoriteRoutes);
	} catch (error) {
		console.error("Error getting favorite routes:", error);
		res.status(500).json({ message: "Error getting favorite routes" });
	}
};

export const addFavoriteRoute = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;

		const {
			startStation,
			endStation,
			startLine,
			endLine,
		}: {
			startStation: string;
			endStation: string;
			startLine: string;
			endLine: string;
		} = req.body;

		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		if (!startStation) {
			return res
				.status(400)
				.json({ message: "Start station is required" });
		}

		if (!endStation) {
			return res.status(400).json({ message: "End station is required" });
		}

		const existingFavoriteRoute = await prisma.favorites.findFirst({
			where: {
				user_id,
				journeys: {
					line_id_start: startLine,
					line_id_end: endLine,
					departure_station: startStation,
					arrival_station: endStation,
				},
			},
		});

		if (existingFavoriteRoute) {
			return res
				.status(400)
				.json({ message: "Favorite route already exists" });
		}

		const newJourney = await prisma.journeys.create({
			data: {
				line_id_start: startLine,
				line_id_end: endLine,
				departure_station: startStation,
				arrival_station: endStation,
				departure_time: new Date(),
				arrival_time: new Date(),
			},
		});

		const newFavoriteRoute = await prisma.favorites.create({
			data: {
				user_id,
				journey_id: newJourney.journey_id,
				added_on: new Date(),
			},
		});

		console.log(newFavoriteRoute);

		res.status(200).json(newFavoriteRoute);
	} catch (error) {
		console.error("Error adding favorite route:", error);
		res.status(500).json({ message: "Error adding favorite route" });
	}
};

export const removeFavoriteRoute = async (
	req: CustomRequest,
	res: Response
) => {
	try {
		const user_id = req.user?.user_id;
		const { favorite_id } = req.body;

		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		if (!favorite_id) {
			return res.status(400).json({ message: "Favorite ID is required" });
		}

		await prisma.favorites.delete({
			where: {
				favorite_id,
			},
			include: {
				journeys: true,
			},
		});

		res.status(200).json({ message: "Favorite route removed" });
	} catch (error) {
		console.error("Error removing favorite route:", error);
		res.status(500).json({ message: "Error removing favorite route" });
	}
};
