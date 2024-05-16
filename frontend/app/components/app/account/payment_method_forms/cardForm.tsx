import AnimatedInput from "@/app/components/AnimatedInput";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isCreditCard } from "validator";
import { errorIcon } from "@/app/components/Icons";
import creditCardType from "credit-card-type";
import { CARD_NAMES } from "@/app/types/types";
import axios from "axios";
import RippleButton from "@/app/components/RippleButton";
import { toast } from "sonner";
import { encryptToken } from "@/app/utils/cryptToken";
import { useRouter } from "next/navigation";

interface CardFormProps {}

const CardForm = ({}: CardFormProps) => {
	const CardPaymentMethodSchema = z.object({
		card_number: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.refine(isCreditCard, {
				message: "Must be a valid credit card number",
			})
			.refine((value) => value.trim() !== "", {
				message: "Card number cannot be empty",
			}),
		card_name: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.min(3, { message: "Full name must be atleast 3 characters long." })
			.max(100, {
				message: "Full name must be shorter than 100 characters",
			})
			.refine((value) => value.trim() !== "", {
				message: "Full name cannot be empty",
			}),
		card_expiry: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.refine(
				(value) => {
					const [month, year] = value.split("/");
					const expiryDate = new Date(
						Number("20" + year), // Assuming the year is in the format YY, adding 20 to convert to YYYY
						Number(month) - 1
					); // Adjust month by -1 to match JavaScript Date object
					const currentDate = new Date();
					return expiryDate > currentDate;
				},
				{
					message: "Expiry date must be in the future",
				}
			)
			.refine((value) => value.trim() !== "", {
				message: "Expiry date cannot be empty",
			})
			.refine((value) => value.length === 5, {
				message: "Expiry date must be 5 characters long",
			}),
		card_cvv: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.min(3, { message: "CVC must be atleast 3 characters long." })
			.max(4, {
				message: "CVC must be shorter than 4 characters",
			})
			.refine((value) => value.trim() !== "", {
				message: "CVC cannot be empty",
			}),
	});

	const router = useRouter();

	const {
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isValid },
	} = useForm<z.infer<typeof CardPaymentMethodSchema>>({
		resolver: zodResolver(CardPaymentMethodSchema),
		mode: "onChange",
	});

	const onSubmit = handleSubmit(async (data) => {
		const encryptedCardData = {
			card_number: encryptToken(data.card_number),
			card_name: encryptToken(data.card_name),
			card_expiry: encryptToken(data.card_expiry),
			card_cvv: encryptToken(data.card_cvv),
		};
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/payment/addPaymentMethod`,
				{
					type: CardType,
					card_number: encryptedCardData.card_number,
					card_holder_name: encryptedCardData.card_name,
					card_expiry: encryptedCardData.card_expiry,
					card_cvv: encryptedCardData.card_cvv,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				toast.success("Payment method added successfully");
				router.push("/app/account/managePaymentMethods");
			})
			.catch((err) => {
				if (err.response.status === 400 && err.response.data.message) {
					toast.error(err.response.data.message || "Unknown error");
				}
			});
	});

	const [CardType, setCardType] = useState<CARD_NAMES | undefined>(undefined);

	const CardNumberRef = useRef<HTMLInputElement>(null);
	const [CardNumber, setCardNumber] = useState<string>("");
	const [CardNumberActive, setCardNumberActive] = useState<boolean>(false);

	const CardNameRef = useRef<HTMLInputElement>(null);
	const [CardName, setCardName] = useState<string>("");
	const [CardNameActive, setCardNameActive] = useState<boolean>(false);

	const CardExpiryRef = useRef<HTMLInputElement>(null);
	const [CardExpiry, setCardExpiry] = useState<string>("");
	const [CardExpiryActive, setCardExpiryActive] = useState<boolean>(false);

	const CardCVCRef = useRef<HTMLInputElement>(null);
	const [CardCVC, setCardCVC] = useState<string>("");
	const [CardCVCActive, setCardCVCActive] = useState<boolean>(false);

	const expDateFormatter =
		CardExpiry.replace(/\//g, "")
			.substring(0, 2)
			.replace(/^(0[1-9]|1[0-2])$/, "$1") +
		(CardExpiry.length > 2 ? "/" : "") +
		CardExpiry.replace(/\//g, "")
			.substring(2, 4)
			.replace(/^(20[2-9])$/, "2");

	const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let cardNumber = e.target.value.replace(/\s+/g, ""); // Remove any existing spaces
		let gaps: number[] = [];

		// Assuming 'creditCardType' is imported and returns card types with gap info
		const cardType = creditCardType(cardNumber.slice(0, 4));

		setCardType(cardType[0].type as CARD_NAMES);

		if (cardType.length > 0) {
			gaps = cardType[0].gaps;
		}

		let cardNumberFormatted = "";
		let gapIndex = 0; // Keeps track of which gap we are at in the array

		for (let i = 0; i < cardNumber.length; i++) {
			cardNumberFormatted += cardNumber.charAt(i);
			if (gaps[gapIndex] === i + 1) {
				// Check if a space should be added after this character
				cardNumberFormatted += " ";
				gapIndex++; // Move to the next gap
			}
		}

		setCardNumber(cardNumberFormatted); // Assuming this is a function that sets state
		setValue("card_number", cardNumberFormatted, { shouldValidate: true });
	};
	const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardName(e.target.value);
		setValue("card_name", e.target.value, { shouldValidate: true });
	};

	const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardExpiry(e.target.value);
		setValue("card_expiry", e.target.value, { shouldValidate: true });
	};

	const handleCardCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCardCVC(e.target.value);
		setValue("card_cvv", e.target.value, { shouldValidate: true });
	};

	/* 	<Image
		src={type === "paypal" ? Paypal : getIconFromCard(type, "")}
		alt="alipay"
		className="object-contain w-12 rounded-md overflow-hidden h-10"
	/>; */
	return (
		<form
			onSubmit={onSubmit}
			className={`w-full h-full lg:max-w-[700px] relative flex-shrink-0 flex flex-col items-start gap-2.5`}
		>
			<AnimatedInput
				id="card_number"
				placeholder="Card Number"
				type="text"
				tabIndex={6}
				inputRef={CardNumberRef}
				active={CardNumber || CardNumberActive ? true : false}
				inputValue={CardNumber}
				handleChange={handleCardNumberChange}
				handleFocus={() => setCardNumberActive(true)}
				handleBlur={() => setCardNumberActive(false)}
			/>
			{errors.card_number && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.card_number.message}
					</p>
				</div>
			)}
			<AnimatedInput
				id="card_name"
				placeholder="Card Holder Name"
				type="text"
				tabIndex={6}
				inputRef={CardNameRef}
				active={CardName || CardNameActive ? true : false}
				inputValue={CardName}
				handleChange={handleCardNameChange}
				handleFocus={() => setCardNameActive(true)}
				handleBlur={() => setCardNameActive(false)}
			/>
			{errors.card_name && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.card_name.message}
					</p>
				</div>
			)}
			<div className="flex flex-row gap-2.5 w-full">
				<AnimatedInput
					id="card"
					placeholder="Expiry Date"
					type="text"
					tabIndex={6}
					inputRef={CardExpiryRef}
					active={CardExpiry || CardExpiryActive ? true : false}
					inputValue={expDateFormatter}
					handleChange={handleCardExpiryChange}
					handleFocus={() => setCardExpiryActive(true)}
					handleBlur={() => setCardExpiryActive(false)}
				/>

				<AnimatedInput
					id="card"
					placeholder="CVV"
					type="text"
					tabIndex={6}
					inputRef={CardCVCRef}
					active={CardCVC || CardCVCActive ? true : false}
					inputValue={CardCVC}
					handleChange={handleCardCVCChange}
					handleFocus={() => setCardCVCActive(true)}
					handleBlur={() => setCardCVCActive(false)}
				/>
			</div>
			{errors.card_expiry && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.card_expiry.message}
					</p>
				</div>
			)}
			{errors.card_cvv && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{errorIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.card_cvv.message}
					</p>
				</div>
			)}
			{/* 			<div className="flex items-center space-x-2">
				<Checkbox id="savePaymentMethod" />
				<label
					htmlFor="savePaymentMethod"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Save payment method for future transactions.
				</label>
			</div> */}
			<RippleButton
				type="submit"
				style="gradient"
				tabIndex={4}
				className="w-full"
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
		</form>
	);
};

export default CardForm;
