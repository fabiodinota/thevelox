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

		const paymentMethods = await prisma.payment_methods.findMany({
			where: {
				user_id,
			},
		});

		const formattedPaymentMethods = paymentMethods.map((paymentMethod) => {
			// turn a card number into a formatted card number like this 4111 **** **** 1234
			const formattedCardNumber = paymentMethod.card_number
				? paymentMethod.card_number
						.replace(/.(?=.{4})/g, "*")
						.replace(/(.{4})(.*)(.{4})/, "$1 **** **** $3")
				: null;

			// turn a paypal email into a formatted paypal email like this fabi****@gmail.com
			const formattedPaypalEmail = paymentMethod.paypal_email
				? paymentMethod.paypal_email.replace(
						/(.{4})[^@]*(?=@)/,
						"$1****"
				  )
				: null;

			return {
				payment_method_id: paymentMethod.payment_method_id,
				type: paymentMethod.type,
				formatted_card_number: formattedCardNumber,
				formatted_paypal_email: formattedPaypalEmail,
			};
		});

		res.status(200).json(formattedPaymentMethods);
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
