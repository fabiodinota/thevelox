"use client";
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { xIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import getIconFromCard from "@/app/utils/getIconFromCard";
import creditCardType from "credit-card-type";
import {
	CARD_NAMES,
	PaymentMethod,
	PaymentMethodResponse,
} from "@/app/types/types";
import Image from "next/image";
import Paypal from "@/public/icons/credit_cards/paypal.svg";
import axios from "axios";
import { z } from "zod";

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
	/* const paymentMethods = [
		"6703 XXXX XXXX 1234",
		"4111 XXXX XXXX 1235",
		"4111 XXXX XXXX 1236",
		"5720 XXXX XXXX 1237",
		"fabi****@gmail.com",
	]; */

	const [paymentMethods, setPaymentMethods] = useState<
		PaymentMethodResponse[]
	>([]);

	const handleChange = (e: number) => {
		setActivePaymentMethod(e);
	};

	const handleGetPaymentMethods = async () => {
		try {
			const paymentMethods = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/getPaymentMethods`,
				{
					withCredentials: true,
				}
			);

			setPaymentMethods(paymentMethods.data);
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
				<RadioGroup
					value={activePaymentMethod?.toString()}
					defaultValue="default"
				>
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
								className={`flex items-center space-x-2 w-full !justify-between bg-secondary ${
									activePaymentMethod ===
									method.payment_method_id
										? "border border-blue-500"
										: ""
								}  px-5 !h-[60px]`}
							>
								<div className="flex items-center gap-5">
									<RadioGroupItem
										className={`${
											activePaymentMethod ===
											method.payment_method_id
												? "border border-blue-500"
												: "border border-accent"
										}`}
										value={method.payment_method_id.toString()}
										id={method.payment_method_id.toString()}
									></RadioGroupItem>
									<Label
										htmlFor={method.payment_method_id.toString()}
									>
										<span className="text-[16px] font-medium">
											{method.type === "paypal"
												? method.formatted_paypal_email
												: method.formatted_card_number}
										</span>
									</Label>
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
				</RadioGroup>
				<RippleButton
					style="nofill"
					speed="medium"
					onClick={() => setStage("addPaymentMethodStage")}
					className="flex flex-row justify-between items-center bg-secondary w-full px-5 py-5 rounded-xl gap-5 !h-[60px]"
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

export default SelectPaymentMethod;
