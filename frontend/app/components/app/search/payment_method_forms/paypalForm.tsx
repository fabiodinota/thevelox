"use client";

import AnimatedInput from "@/app/components/AnimatedInput";
import { xIcon } from "@/app/components/Icons";
import RippleButton from "@/app/components/RippleButton";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PaypalFormProps {
	setStage: React.Dispatch<
		React.SetStateAction<
			| "browseTicketsStage"
			| "moreInfoTicketStage"
			| "buyTicketStage"
			| "addPaymentMethodStage"
		>
	>;
}

const PaypalForm = ({ setStage }: PaypalFormProps) => {
	const PaypalPaymentMethodSchema = z.object({
		paypal_email: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.email({ message: "Invalid email address" }),
	});

	const {
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isValid },
	} = useForm<z.infer<typeof PaypalPaymentMethodSchema>>({
		resolver: zodResolver(PaypalPaymentMethodSchema),
		mode: "onChange",
	});

	const onSubmit = handleSubmit(async (data) => {
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/addPaymentMethod`,
				{
					type: "paypal",
					paypal_email: data.paypal_email,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				setStage("buyTicketStage");
			})
			.catch((err) => {
				setErrorMessage(err);
			});
	});

	const [errorMessage, setErrorMessage] = useState<string>("");

	const paypalRef = useRef<HTMLInputElement>(null);
	const [paypalEmail, setPaypalEmail] = useState<string>("");
	const [paypalEmailActive, setPaypalEmailActive] = useState<boolean>(false);

	const handlePaypalEmailChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setPaypalEmail(e.target.value.toLowerCase());
		setValue("paypal_email", e.target.value.toLowerCase(), {
			shouldValidate: true,
		});
	};

	return (
		<form
			onSubmit={onSubmit}
			className={`w-full h-full lg:max-w-[700px] relative flex-shrink-0 flex flex-col items-start gap-2.5`}
		>
			<AnimatedInput
				id="paypal"
				placeholder="Paypal Email"
				type="text"
				tabIndex={6}
				inputRef={paypalRef}
				active={paypalEmail || paypalEmailActive ? true : false}
				inputValue={paypalEmail}
				handleChange={handlePaypalEmailChange}
				handleFocus={() => setPaypalEmailActive(true)}
				handleBlur={() => setPaypalEmailActive(false)}
			/>
			{errors.paypal_email && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{xIcon({ fill: "[#E31937]" })}
					<p className="md:text-[16px] text-[14px]">
						{errors.paypal_email.message}
					</p>
				</div>
			)}
			<RippleButton
				type="submit"
				style="gradient"
				tabIndex={4}
				className="w-full"
			>
				Add Payment Method
			</RippleButton>
			<RippleButton
				onClick={() => setStage("buyTicketStage")}
				style="outlined"
				tabIndex={4}
				className="w-full"
			>
				Back
			</RippleButton>
			{errorMessage && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{xIcon({ fill: "[#E31937]" })}
					<p className="md:text-[16px] text-[14px]">{errorMessage}</p>
				</div>
			)}
		</form>
	);
};

export default PaypalForm;
