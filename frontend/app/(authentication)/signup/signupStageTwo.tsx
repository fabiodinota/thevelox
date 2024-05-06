"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatedInput from "@/app/components/AnimatedInput";
import { AsYouType } from "libphonenumber-js";
import { Calendar } from "@/app/components/ui/calendarDOB";
import { format } from "date-fns";
import { useAutocomplete } from "@/app/context/AutocompleteContext";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";
import { motion } from "framer-motion";
import CustomAutocomplete from "@/app/components/Autocomplete";
import {
	Country,
	countriesMap,
	flattenedCountries,
} from "@/app/utils/phoneNumberUtils";
import { errorIcon, xIcon } from "@/app/components/Icons";
import { useMediaQuery } from "react-responsive";
import RippleButton from "@/app/components/RippleButton";

interface SignUpStageOneProps {
	setStage: React.Dispatch<React.SetStateAction<number>>;
	setStageData: React.Dispatch<
		React.SetStateAction<{
			stageOne: {
				email: string;
				password: string;
				repeatPassword: string;
			};
			stageTwo: {
				fullName: string;
				dateOfBirth: Date;
				countryCode: string;
				phoneNumber: string;
			};
		}>
	>;
}

const SignUpStageTwo = ({ setStage, setStageData }: SignUpStageOneProps) => {
	const [fullName, setFullName] = useState<string>("");
	const [fullNameActive, setFullNameActive] = useState<boolean>(false);
	const fullNameRef = useRef<HTMLInputElement>(null);

	const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
		new Date()
	);

	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [phoneNumberActive, setPhoneNumberActive] = useState<boolean>(false);
	const phoneNumberRef = useRef<HTMLInputElement>(null);

	const [countryCode, setCountryCode] = useState<string>("");

	const [disabled, setDisabled] = useState<boolean>(true);

	const [calendarOpen, setCalendarOpen] = useState(false);

	const { releaseFocus } = useAutocomplete();

	useEffect(() => {
		if (calendarOpen) {
			releaseFocus();
		}
	}, [calendarOpen]);

	const SignInFormSchema = z.object({
		fullName: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
				required_error: "Full name is required",
			})
			.min(3, { message: "Full name must be atleast 3 characters long." })
			.max(100, {
				message: "Full name must be shorter than 100 characters",
			})
			.refine((value) => value.trim() !== "", {
				message: "Full name cannot be empty",
			}),
		dateOfBirth: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
				required_error: "Set a date of birth date",
			})
			.min(1, { message: "Set a date of birth date" })
			.refine(
				(value) => {
					const date = new Date(value);
					return date < new Date();
				},
				{ message: "Date of Birth must be in the past" }
			),
		countryCode: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
				required_error: "Country code is required",
			})
			.refine((value) => value !== "", {
				message: "Country code cannot be empty",
			})
			.refine(
				(value) => {
					return countriesMap.has(value);
				},
				{
					message: "Invalid country code",
				}
			),
		phoneNumber: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
				required_error: "Phone number is required",
			})
			.refine((value) => value !== "", {
				message: "Phone number cannot be empty",
			})
			.refine((value) => /^[0-9\s()-]*$/.test(value), {
				message: "Phone number can only contain numbers",
			}),
	});

	const {
		handleSubmit,
		setValue,
		getValues,
		formState: { errors, isValid },
	} = useForm<z.infer<typeof SignInFormSchema>>({
		resolver: zodResolver(SignInFormSchema),
		mode: "onChange",
	});

	const onSubmit = handleSubmit(async (data) => {
		setStage(3);
		setStageData((prev) => ({
			...prev,
			stageTwo: {
				fullName: data.fullName,
				dateOfBirth: new Date(data.dateOfBirth),
				countryCode: data.countryCode,
				phoneNumber: data.phoneNumber,
			},
		}));
	});

	const handleFullNameChange = (value: string) => {
		setFullName(value);
		setValue("fullName", value, {
			shouldValidate: true,
		});
	};

	const handleDateOfBirthChange = (newDate: Date | undefined) => {
		if (!newDate) return;

		if (dateOfBirth) {
			const hours = dateOfBirth.getHours();
			const minutes = dateOfBirth.getMinutes();
			newDate.setHours(hours, minutes);
		}

		// If the new date is in the past, don't update the state
		if (newDate < new Date(new Date())) {
			setDateOfBirth(newDate);
		}

		setValue("dateOfBirth", format(newDate, "PP"), {
			shouldValidate: true,
		});

		setCalendarOpen(false);
	};

	const handleCalendarClick = () => {
		setCalendarOpen(!calendarOpen);
	};

	const handlePhoneNumberChange = (value: string) => {
		setPhoneNumber(value);
		setValue("phoneNumber", value, { shouldValidate: true });
	};

	const handleCountryCodeChange = (value: string) => {
		setCountryCode(value);
		setValue("countryCode", value, { shouldValidate: true });
	};

	const popoverVariant = {
		initial: {
			opacity: 0,
			scale: 0.9,
			transition: { duration: 0.2 },
		},
		animate: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.2, ease: "easeOut" },
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			transition: { duration: 0.2, ease: "easeIn" },
		},
	};

	const asYouType = new AsYouType({
		defaultCallingCode: countriesMap.get(countryCode)?.dialing_code,
	});

	useEffect(() => {
		if (phoneNumber) {
			const formattedNumber = asYouType.input(phoneNumber);
			setPhoneNumber(formattedNumber);
		}
	}, [phoneNumber]);

	useEffect(() => {
		setDisabled(!isValid);
	}, [isValid]);

	const [mobileHeight, setMobileHeight] = useState(false);

	const isMobileHeight = useMediaQuery({
		query: "(max-height: 850px)",
	});

	useEffect(() => {
		setMobileHeight(isMobileHeight);
	}, []);

	return (
		<>
			<form
				onSubmit={onSubmit}
				className={`w-full h-full lg:max-w-[700px] relative flex-shrink-0 flex flex-col items-start ${
					mobileHeight
						? "items-start lg:py-10"
						: "lg:items-center justify-center py-0"
				} gap-2.5 lg:gap-5`}
			>
				<h1 className="text-2xl lg:text-3xl font-semibold leading-none text-left w-full lg:text-center">
					Welcome, tell us a bit more about yourself
				</h1>
				<p className="lg:text-[20px] text-[16px] leading-none text-left w-full lg:text-center">
					We need a bit more information to create your account,
					please fill in the following fields to continue.
				</p>
				<AnimatedInput
					id="fullName"
					placeholder="Full Name"
					type="text"
					tabIndex={6}
					inputRef={fullNameRef}
					active={fullName || fullNameActive ? true : false}
					inputValue={fullName}
					handleChange={(e) => handleFullNameChange(e.target.value)}
					handleFocus={() => setFullNameActive(true)}
					handleBlur={() => setFullNameActive(false)}
				/>
				{errors.fullName && (
					<div className="flex flex-row gap-3 items-center w-full justify-start">
						{errorIcon}
						<p className="md:text-[16px] text-[14px]">
							{errors.fullName.message}
						</p>
					</div>
				)}
				<div className="relative w-full">
					<button
						onClick={handleCalendarClick}
						id="calendarDOB"
						tabIndex={7}
						className={
							"flex items-center flex-row w-full h-[70px] md:h-[80px] bg-secondary rounded-xl px-2.5 lg:px-5 text-left font-normal text-[16px] justify-start"
						}
					>
						<div className="flex items-center flex-row w-full relative">
							<p
								className={`absolute cursor-pointer left-3 text-foreground/50 transition-all duration-200 ease-in-out top-1/2 transform -translate-y-5 md:-translate-y-6 text-[13px] md:text-[15px]`}
							>
								Date of Birth
							</p>
							<div className="pt-4 pl-3 text-[16px] md:text-[18px] font-medium">
								{dateOfBirth ? (
									format(dateOfBirth, "PP")
								) : (
									<span>Pick a date of birth</span>
								)}
							</div>
						</div>
					</button>
					<AnimatePresenceProvider>
						{calendarOpen && (
							<div className="relative">
								<motion.div
									variants={popoverVariant}
									initial="initial"
									animate="animate"
									exit="exit"
									key={"calendarDOB"}
									className="absolute z-[100] mt-1 w-auto p-0 bg-white dark:bg-background border border-muted rounded-lg shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]"
								>
									<Calendar
										mode="single"
										captionLayout="dropdown-buttons"
										selected={dateOfBirth}
										onSelect={handleDateOfBirthChange}
										initialFocus
										fromYear={1920}
										toYear={2030}
									/>
								</motion.div>
								{/* <div
									className="top-0 left-0 fixed w-screen h-screen z-10"
									onClick={() => setCalendarOpen(false)}
								/> */}
							</div>
						)}
					</AnimatePresenceProvider>
				</div>
				{errors.dateOfBirth && (
					<div className="flex flex-row gap-3 items-center w-full justify-start">
						{errorIcon}
						<p className="md:text-[16px] text-[14px]">
							{errors.dateOfBirth.message}
						</p>
					</div>
				)}
				<div className="flex flex-row gap-2.5 lg:gap-5 w-full">
					<div className="w-[200px]">
						<CustomAutocomplete
							id="countryCode"
							placeholder="Code"
							tabIndex={8}
							suggestions={Array.from(
								flattenedCountries.values()
							).map((country) => ({
								name: country.dialing_code,
								level: 0,
								label: `${country.emoji} +${country.dialing_code}`,
							}))}
							onSelectionChange={handleCountryCodeChange}
						/>
					</div>
					{/* phone number input */}
					<AnimatedInput
						id="phoneNumber"
						placeholder="Phone Number"
						type="text"
						tabIndex={9}
						inputRef={phoneNumberRef}
						active={phoneNumber || phoneNumberActive ? true : false}
						inputValue={phoneNumber}
						handleChange={(e) =>
							handlePhoneNumberChange(e.target.value)
						}
						handleFocus={() => setPhoneNumberActive(true)}
						handleBlur={() => setPhoneNumberActive(false)}
					/>
				</div>
				{(errors.countryCode || errors.phoneNumber) && (
					<div className="w-full">
						{errors.countryCode && (
							<div className="flex flex-row gap-3 items-center">
								{errorIcon}
								<p className="md:text-[16px] text-[14px]">
									{errors.countryCode?.message}
								</p>
							</div>
						)}
						{errors.phoneNumber && (
							<div className="flex flex-row gap-3 items-center">
								{errorIcon}
								<p className="md:text-[16px] text-[14px]">
									{errors.phoneNumber?.message}
								</p>
							</div>
						)}
					</div>
				)}
				<RippleButton
					disabled={disabled}
					type="submit"
					style="gradient"
					tabIndex={4}
					className="w-full"
				>
					Sign Up
				</RippleButton>
				<div className="w-full flex flex-row gap-10 h-[30px] items-center">
					<div className="w-full h-[1px] bg-foreground"></div>
					<p>OR</p>
					<div className="w-full h-[1px] bg-foreground"></div>
				</div>
				<RippleButton
					onClick={() => setStage(1)}
					style="outlined"
					tabIndex={4}
					className="w-full"
				>
					Back
				</RippleButton>
				<p>
					By clicking “Sign Up” you agree to our{" "}
					<u>Terms of Service</u> and <u>Privacy Policy</u>
				</p>
			</form>
		</>
	);
};

export default SignUpStageTwo;
