"use client";

import React, { useState } from "react";
import RippleButton from "../../RippleButton";
import CardForm from "./payment_method_forms/cardForm";
import PaypalForm from "./payment_method_forms/paypalForm";

interface AddPaymentMethodProps {}

const AddPaymentMethod = ({}: AddPaymentMethodProps) => {
	const [activePaymentMethod, setActivePaymentMethod] =
		useState<string>("paypal");

	return (
		<div className="flex flex-col gap-2.5 w-full">
			<div className={`flex flex-row gap-2.5 w-full`}>
				<RippleButton
					onClick={() => setActivePaymentMethod("paypal")}
					type="button"
					style="nofill"
					className={`w-full !flex-shrink bg-secondary !text-foreground ${
						activePaymentMethod === "paypal"
							? "border border-blue-500"
							: ""
					}`}
					speed="medium"
					data-vaul-no-drag
				>
					Paypal
				</RippleButton>
				<RippleButton
					onClick={() => setActivePaymentMethod("card")}
					type="button"
					style="nofill"
					className={`w-full !flex-shrink bg-secondary !text-foreground ${
						activePaymentMethod === "card"
							? "border border-blue-500"
							: ""
					}`}
					speed="medium"
				>
					Card
				</RippleButton>
			</div>
			{activePaymentMethod === "paypal" && <PaypalForm />}
			{activePaymentMethod === "card" && <CardForm />}
		</div>
	);
};

export default AddPaymentMethod;
