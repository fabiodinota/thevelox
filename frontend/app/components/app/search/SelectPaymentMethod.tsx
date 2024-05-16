"use client";
import React, { useEffect, useState } from "react";
import { xIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import getIconFromCard from "@/app/utils/getIconFromCard";
import { PaymentMethodResponse } from "@/app/types/types";
import Image from "next/image";
import Paypal from "@/public/icons/credit_cards/paypal.svg";
import axios from "axios";
import { decryptToken } from "@/app/utils/cryptToken";

interface SelectPaymentMethodProps {
	setStage: React.Dispatch<
		React.SetStateAction<
			| "browseTicketsStage"
			| "moreInfoTicketStage"
			| "buyTicketStage"
			| "addPaymentMethodStage"
		>
	>;
	activePaymentMethod: number | undefined;
	setActivePaymentMethod: React.Dispatch<
		React.SetStateAction<number | undefined>
	>;
}

const SelectPaymentMethod = ({
	setStage,
	activePaymentMethod,
	setActivePaymentMethod,
}: SelectPaymentMethodProps) => {
	const [paymentMethods, setPaymentMethods] = useState<
		PaymentMethodResponse[]
	>([]);

	const handleChange = (e: number) => {
		setActivePaymentMethod(e);
	};

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

	useEffect(() => {
		handleGetPaymentMethods();
	}, []);

	return (
		<>
			<div className="flex flex-col gap-2">
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
								handleChange(method.payment_method_id)
							}
							speed="medium"
							key={method.payment_method_id}
							className={`flex items-center !text-foreground space-x-2 w-full !justify-between bg-secondary ${
								activePaymentMethod === method.payment_method_id
									? "border border-blue-500"
									: ""
							}  px-5 !h-[60px]`}
						>
							<div className="flex items-center gap-5">
								<div
									className={`w-4 h-4 grid place-content-center rounded-full border  ${
										activePaymentMethod ===
											method.payment_method_id &&
										"border-blue-500"
									}`}
								>
									{activePaymentMethod ===
										method.payment_method_id && (
										<div className="w-[10px] h-[10px] rounded-full bg-blue-500"></div>
									)}
								</div>
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
							<Image
								src={
									method.type === "paypal"
										? Paypal
										: getIconFromCard(method.type, "")
								}
								alt="alipay"
								className="object-contain w-12 rounded-md overflow-hidden h-10"
							/>
						</RippleButton>
					);
				})}

				<RippleButton
					style="nofill"
					speed="medium"
					onClick={() => setStage("addPaymentMethodStage")}
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
				<p className="text-sm opacity-50">
					You can manage payment methods in the account page.
				</p>
			</div>
		</>
	);
};

export default SelectPaymentMethod;
