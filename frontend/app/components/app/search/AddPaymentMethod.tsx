"use client";

import React, { useState } from "react";
import RippleButton from "../../RippleButton";
import CardForm from "./payment_method_forms/cardForm";
import PaypalForm from "./payment_method_forms/paypalForm";

interface AddPaymentMethodProps {
	setStage: React.Dispatch<
		React.SetStateAction<
			| "browseTicketsStage"
			| "moreInfoTicketStage"
			| "buyTicketStage"
			| "addPaymentMethodStage"
		>
	>;
}

const AddPaymentMethod = ({ setStage }: AddPaymentMethodProps) => {
	const [activePaymentMethod, setActivePaymentMethod] =
		useState<string>("paypal");

	return (
		<div className="flex flex-col gap-2.5">
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
			{activePaymentMethod === "paypal" && (
				<PaypalForm
					/* savePaymentMethodIsChecked={savePaymentMethodIsChecked}
					setSavePaymentMethodIsChecked={
						setSavePaymentMethodIsChecked
					} */
					setStage={setStage}
				/>
			)}
			{activePaymentMethod === "card" && <CardForm setStage={setStage} />}
		</div>
	);
};

export default AddPaymentMethod;
