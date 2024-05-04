import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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

		res.status(200).json(paymentMethods);
	} catch (error) {
		console.error("Error getting payment methods:", error);
		res.status(500).json({ message: "Error getting payment methods" });
	}
};

export const addPaymentMethod = async (req: CustomRequest, res: Response) => {
	try {
		const user_id = req.user?.user_id;
		const {
			type,
			cardHolderName,
			cardNumber,
			expirationDate,
			cvv,
			postalCode,
		} = req.body;

		if (type === "paypal") {
		}

		/* const paymentMethod = await prisma.payment_methods.create({
			data: {
				user_id,
                type,
                card_holder_name: cardHolderName,
                card_number: cardNumber,
                expiration_date: expirationDate,
                
			},
		});
		res.status(200).json(paymentMethod);
 */
	} catch (error) {
		console.error("Error adding payment method:", error);
		res.status(500).json({ message: "Error adding payment method" });
	}
};
