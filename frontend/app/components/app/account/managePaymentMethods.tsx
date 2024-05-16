"use client";
import React, { useEffect, useState } from "react";
import { DeleteIcon, xIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import getIconFromCard from "@/app/utils/getIconFromCard";
import { PaymentMethodResponse } from "@/app/types/types";
import Image from "next/image";
import Paypal from "@/public/icons/credit_cards/paypal.svg";
import axios from "axios";
import { decryptToken } from "@/app/utils/cryptToken";
import { AnimatePresence, motion } from "framer-motion";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ManagePaymentMethodsProps {}

const ManagePaymentMethods = ({}: ManagePaymentMethodsProps) => {
	const [paymentMethods, setPaymentMethods] = useState<
		PaymentMethodResponse[]
	>([]);

	const router = useRouter();

	const handleGetPaymentMethods = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/getPaymentMethods`,
				{
					withCredentials: true,
				}
			);

			const formattedPaymentMethods = response.data.map(
				(paymentMethod: any) => {
					// Decrypt the payment method
					let decryptedCardNumber = paymentMethod.card_number
						? decryptToken(paymentMethod.card_number)
						: null;
					let decryptedPaypalEmail = paymentMethod.paypal_email
						? decryptToken(paymentMethod.paypal_email)
						: null;

					decryptedCardNumber === null
						? (decryptedCardNumber = paymentMethod.card_number)
						: decryptedCardNumber;
					decryptedPaypalEmail === null
						? (decryptedPaypalEmail = paymentMethod.paypal_email)
						: decryptedPaypalEmail;

					// Format the decrypted card number
					const formattedCardNumber = decryptedCardNumber
						? decryptedCardNumber
								.replace(/.(?=.{4})/g, "*")
								.replace(/(.{4})(.*)(.{4})/, "$1 **** **** $3")
						: null;

					// Format the decrypted PayPal email
					const formattedPaypalEmail = decryptedPaypalEmail
						? decryptedPaypalEmail.replace(
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
				}
			);

			console.log(formattedPaymentMethods);

			setPaymentMethods(formattedPaymentMethods);
		} catch (error) {
			console.error("Error getting payment methods:", error);
		}
	};

	const handleDeletePaymentMethod = async (payment_method_id: number) => {
		await axios
			.delete(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/deletePaymentMethod`,
				{
					data: {
						payment_method_id,
					},
					withCredentials: true,
				}
			)
			.then(() => {
				toast.success("Payment method deleted successfully");
			})
			.catch((err) => {
				toast.error("Error deleting payment method");
			});

		handleGetPaymentMethods();
	};

	useEffect(() => {
		handleGetPaymentMethods();
	}, []);

	const [selected, setSelected] = useState<number | undefined>();

	return (
		<>
			<div className="flex flex-col gap-2 w-full">
				{paymentMethods.length === 0 && (
					<div className="flex flex-row justify-center items-center w-full h-20 bg-secondary rounded-xl px-5">
						<span className="text-[16px] font-medium">
							No payment methods found, please add a payment
							method to continue.
						</span>
					</div>
				)}
				{paymentMethods.map((method) => {
					return (
						<RippleButton
							style="nofill"
							asLink
							href=""
							onClick={() =>
								setSelected(method.payment_method_id)
							}
							speed="medium"
							key={method.payment_method_id}
							className={`!relative flex items-center !text-foreground space-x-2 w-full !justify-between bg-secondary px-5 !h-[60px]`}
						>
							<div className="flex items-center gap-5">
								{/* <div
									className={`w-4 h-4 grid place-content-center rounded-full border`}
								>
									{activePaymentMethod ===
										method.payment_method_id && (
										<div className="w-[10px] h-[10px] rounded-full bg-blue-500"></div>
									)}
								</div> */}
								<label
									htmlFor={method.payment_method_id.toString()}
								>
									<span className="text-[16px] font-medium">
										{method.type === "paypal"
											? method.formatted_paypal_email
											: method.formatted_card_number}
									</span>
								</label>
							</div>
							<div
								onClick={() =>
									handleDeletePaymentMethod(
										method.payment_method_id
									)
								}
								className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 duration-150 ${
									selected === method.payment_method_id
										? "opacity-100 translate-x-0"
										: "opacity-0 translate-x-5"
								}`}
							>
								<button>
									{DeleteIcon(
										false,
										"w-5 h-5 cursor-pointer"
									)}
								</button>
								{/* <TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
										</TooltipTrigger>
										<TooltipContent className="bg-background border-none">
											<p>Delete Payment Method</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider> */}
							</div>
							<div>
								<Image
									src={
										method.type === "paypal"
											? Paypal
											: getIconFromCard(method.type, "")
									}
									alt="alipay"
									className={`object-contain w-12 rounded-md overflow-hidden h-10 duration-150 ${
										selected === method.payment_method_id
											? "opacity-0 -translate-x-5"
											: "opacity-100 translate-x-0"
									}`}
								/>
							</div>
						</RippleButton>
					);
				})}

				<RippleButton
					style="nofill"
					speed="medium"
					asLink
					href="/app/account/addPaymentMethod"
					className="flex flex-row justify-between items-center bg-secondary !text-foreground w-full px-5 py-5 rounded-xl gap-5 !h-[60px]"
				>
					{/* add payment method */}
					<span className="text-[14px] lg:text-[16px] font-medium rounded-xl flex flex-row gap-5 items-center w-full">
						{xIcon({
							fill: "foreground",
							className: "rotate-45 scale-[1]",
						})}
						Add Payment Method
					</span>
				</RippleButton>
			</div>
		</>
	);
};

export default ManagePaymentMethods;
