"use client";
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { RadioGroupIndicator } from "@radix-ui/react-radio-group";
import { xIcon } from "../../Icons";
import RippleButton from "../../RippleButton";

const SelectPaymentMethod = () => {
	const paymentMethods = [
		"Default",
		"Paypal",
		"Stripe",
		"Apple Pay",
		"Google Pay",
	];
	const [activePaymentMethod, setActivePaymentMethod] =
		useState<string>("default");
	const handleChange = (e: string) => {
		setActivePaymentMethod(e);
	};

	console.log(activePaymentMethod);
	return (
		<>
			<div className="flex flex-col gap-2">
				<RadioGroup value={activePaymentMethod} defaultValue="default">
					{paymentMethods.map((method) => (
						<RippleButton
							style="nofill"
							onClick={() => handleChange(method.toLowerCase())}
							speed="medium"
							key={method}
							className={`flex items-center space-x-2 w-full !justify-start bg-secondary ${
								activePaymentMethod === method.toLowerCase()
									? "border-2 border-blue-500"
									: ""
							}  px-5 py-5`}
						>
							<RadioGroupItem
								className=""
								value={method.toLowerCase()}
								id={method}
							>
								<RadioGroupIndicator className="w-4 h-4 rounded-full bg-blue-500" />
							</RadioGroupItem>
							<Label htmlFor={method}>
								<span className="text-sm font-medium">
									{method}
								</span>
							</Label>
						</RippleButton>
					))}
				</RadioGroup>
				<RippleButton
					style="nofill"
					speed="medium"
					className="flex flex-row justify-between items-center bg-secondary w-full px-5 py-5 rounded-xl gap-3"
				>
					{/* add payment method */}
					<span className="text-[14px] lg:text-[16px] font-medium rounded-xl flex flex-row gap-3 items-center w-full">
						{xIcon({
							fill: "foreground",
							className: "rotate-45 scale-[1.10]",
						})}
						Add Payment Method
					</span>
				</RippleButton>
			</div>
			<RippleButton style="gradient" speed="medium" className="">
				Buy Ticket
			</RippleButton>
		</>
	);
};

export default SelectPaymentMethod;
