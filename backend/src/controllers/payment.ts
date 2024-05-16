import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
	user?: {
		user_id: number;
		iat: string;
		exp: string;
	}; // Adjusted to match the types that jwt.verify can return
}

export const getPaymentMethods = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;

		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		const paymentMethods = await prisma.payment_methods.findMany({
			where: {
				user_id,
				status: "active",
			},
		});

		res.status(200).json(paymentMethods);
	} catch (error) {
		console.error("Error getting payment methods:", error);
		res.status(500).json({ message: "Error getting payment methods" });
	}
};

export const addPaymentMethod = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;
		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}
		const {
			type,
			card_number = null,
			card_holder_name = null,
			card_expiry = null,
			card_cvv = null,
			paypal_email = null,
		} = req.body;

		// check if payment method already exists

		if (type !== "paypal") {
			const existingPaymentMethod =
				await prisma.payment_methods.findFirst({
					where: {
						user_id,
						card_number,
					},
				});
			if (existingPaymentMethod) {
				return res
					.status(400)
					.json({ message: "Payment method already exists" });
			}
		} else if (type === "paypal") {
			const existingPaymentMethod =
				await prisma.payment_methods.findFirst({
					where: {
						user_id,
						paypal_email,
					},
				});
			if (existingPaymentMethod) {
				return res
					.status(400)
					.json({ message: "Payment method already exists" });
			}
		}

		if (type !== "paypal") {
			const paymentMethod = await prisma.payment_methods.create({
				data: {
					user_id,
					type,
					card_number: card_number,
					card_holder_name: card_holder_name,
					expiration_date: card_expiry,
					card_cvv: card_cvv,
					status: "active",
					last_updated: new Date(),
					created_on: new Date(),
				},
			});
			/* 			getPaymentMethods(req, res);
			 */ res.status(200).json(paymentMethod);
		} else if (type === "paypal") {
			const paymentMethod = await prisma.payment_methods.create({
				data: {
					user_id,
					type,
					paypal_email: paypal_email,
					last_updated: new Date(),
					created_on: new Date(),
				},
			});
			res.status(200).json(paymentMethod);
		}
	} catch (error) {
		console.error("Error adding payment method:", error);
		res.status(500).json({ message: "Error adding payment method" });
	}
};

export const deletePaymentMethod = async (
	req: CustomRequest,
	res: Response
) => {
	try {
		const user_id = req.user?.user_id;
		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}
		const { payment_method_id } = req.body;

		const paymentMethod = await prisma.payment_methods.update({
			where: {
				payment_method_id,
				user_id,
			},
			data: {
				status: "inactive",
				last_updated: new Date(),
			},
		});

		res.status(200).json(paymentMethod);
	} catch (error) {
		console.error("Error deleting payment method:", error);
		res.status(500).json({ message: "Error deleting payment method" });
	}
};
