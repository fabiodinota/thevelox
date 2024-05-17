"use client";

import AnimatedInput from "@/app/components/AnimatedInput";
import { errorIcon } from "@/app/components/Icons";
import RippleButton from "@/app/components/RippleButton";
import { encryptToken } from "@/app/utils/cryptToken";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PaypalFormProps {}

const PaypalForm = ({}: PaypalFormProps) => {
	const PaypalPaymentMethodSchema = z.object({
		paypal_email: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.email({ message: "Invalid email address" }),
	});

	const router = useRouter();

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
		const encryptedPaypalEmail = encryptToken(data.paypal_email);
		setLoading(true);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/addPaymentMethod`,
				{
					type: "paypal",
					paypal_email: encryptedPaypalEmail,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success("Payment method added successfully");
				setLoading(false);
				router.push("/app/account/managePaymentMethods");
			})
			.catch((err) => {
				toast.error(err.response.data.message || "Unknown error");
				setErrorMessage(err);
				setLoading(false);
			});
	});

	const [errorMessage, setErrorMessage] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

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
			className={`w-full h-full lg:max-w-[800px] relative flex-shrink-0 flex flex-col items-start gap-2.5`}
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
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.paypal_email.message}
					</p>
				</div>
			)}
			{/* 			<div className="flex items-center space-x-2 py-2.5">
				<Checkbox
					onCheckedChange={() => {
						setSavePaymentMethodIsChecked(
							!savePaymentMethodIsChecked
						);
					}}
					checked={savePaymentMethodIsChecked}
					id="savePaymentMethod"
				/>
				<label
					htmlFor="savePaymentMethod"
					className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Save payment method for future transactions.
				</label>
			</div> */}
			<RippleButton
				type="submit"
				style="gradient"
				tabIndex={4}
				className="w-full"
				loading={loading}
			>
				Add Payment Method
			</RippleButton>
			<RippleButton
				asLink
				href="/app/account/managePaymentMethods"
				style="outlined"
				tabIndex={4}
				className="w-full"
			>
				Back
			</RippleButton>
			{/* {errorMessage && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">{errorMessage}</p>
				</div>
			)} */}
		</form>
	);
};

export default PaypalForm;
