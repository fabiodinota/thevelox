"use client";

import AnimatedInput from "@/app/components/AnimatedInput";
import CustomAutocomplete from "@/app/components/Autocomplete";
import { errorIcon } from "@/app/components/Icons";
import Header from "@/app/components/app/Header";
import { Calendar } from "@/app/components/ui/calendarDOB";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";
import { useAutocomplete } from "@/app/context/AutocompleteContext";
import { countriesMap, flattenedCountries } from "@/app/utils/phoneNumberUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from "libphonenumber-js";
import { format } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RippleButton from "@/app/components/RippleButton";
import { useSession } from "@/app/context/sessionContext";
import axios from "axios";
import { toast } from "sonner";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { useRouter } from "next/navigation";

const AppAccountPage = () => {
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

	const [email, setEmail] = useState<string>("");
	const [emailActive, setEmailActive] = useState<boolean>(false);
	const emailRef = useRef<HTMLInputElement>(null);

	const [changes, setChanges] = useState<boolean>(false);

	console.log(changes);

	const [disabled, setDisabled] = useState<boolean>(true);

	const [calendarOpen, setCalendarOpen] = useState(false);

	const { releaseFocus } = useAutocomplete();

	const { user, fetchUserData, signOut } = useSession();

	useEffect(() => {
		if (user) {
			console.log(user);
			if (user.full_name || !fullName) {
				setFullName(user.full_name);
				setValue("fullName", user.full_name);
			}

			if (user.birth_date || !dateOfBirth) {
				setDateOfBirth(new Date(user.birth_date));
				setValue("dateOfBirth", user.birth_date);
			}

			const countryCode = countryCodeSuggestions.find(
				(suggestion) => suggestion.name === user.country_code
			)?.name;

			if (user.country_code || !countryCode) {
				if (countryCode === undefined) return;
				setCountryCode(countryCode);
				setValue("countryCode", countryCode, { shouldValidate: true });
			}

			if (user.phone_number || !phoneNumber) {
				setPhoneNumber(user.phone_number);
				setValue("phoneNumber", user.phone_number);
			}

			if (user.email || !email) {
				setEmail(user.email);
				setValue("email", user.email);
			}
		}
	}, [user]);

	useEffect(() => {
		if (calendarOpen) {
			releaseFocus();
		}
	}, [calendarOpen]);

	const FormSchema = z.object({
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
		email: z
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
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onChange",
	});

	const onSubmit = handleSubmit(async (data) => {
		handleUpdateAccountInfo(data);
	});

	const handleUpdateAccountInfo = async (
		data: z.infer<typeof FormSchema>
	): Promise<void> => {
		try {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/user/updateAccountInfo`,
					{
						full_name: data.fullName,
						birth_date: new Date(data.dateOfBirth),
						country_code: data.countryCode,
						phone_number: data.phoneNumber,
						email: data.email,
					},
					{ withCredentials: true }
				)
				.then((response) => {
					console.log(response.data);
					toast.success("Account information updated successfully");
					fetchUserData();
				})
				.catch((error) => {
					toast.error(
						error.response.data.message ||
							"Error updating account information"
					);
				});
		} catch (error: any) {
			toast.error(
				error.response.data.message ||
					"Error updating account information"
			);
		}
	};

	useEffect(() => {
		setChanges(checkForChanges());
	}, [fullName, dateOfBirth, countryCode, phoneNumber, email]);

	const checkForChanges = useCallback(() => {
		const values = getValues();
		const userValues = {
			full_name: user?.full_name,
			birth_date: user?.birth_date,
			country_code: user?.country_code,
			phone_number: user?.phone_number,
			email: user?.email,
		};

		if (values.fullName !== userValues.full_name) {
			console.log("Full name changed");
			return true;
		}

		if (values.dateOfBirth !== userValues.birth_date) {
			console.log("Date of birth changed");
			return true;
		}

		if (values.countryCode !== userValues.country_code) {
			console.log("Country code changed");
			return true;
		}

		if (values.phoneNumber !== userValues.phone_number) {
			console.log("Phone number changed");
			return true;
		}

		if (values.email !== userValues.email) {
			console.log("Email changed");
			return true;
		}

		console.log("No changes");
		return false;
	}, [getValues, user]);

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

	const handleEmailChange = (value: string) => {
		setEmail(value.toLowerCase().toString());
		setValue("email", value.toLowerCase().toString(), {
			shouldValidate: true,
		});
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
		if (changes && isValid) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [isValid, changes]);

	const countryCodeSuggestions = Array.from(flattenedCountries.values()).map(
		(country) => ({
			name: country.dialing_code,
			level: 0,
			label: `${country.emoji} +${country.dialing_code}`,
		})
	);

	const defaultCountryCode = user?.country_code
		? countryCodeSuggestions.find(
				(suggestion) => suggestion.name === countryCode
		  )
		: "";

	const router = useRouter();

	const handleSignOut = async () => {
		const { success } = await signOut();

		if (success) {
			router.push("/signin");
		}
	};

	return (
		<>
			<Header />
			<div className="w-full h-full flex justify-center items-center mt-10">
				<form
					onSubmit={onSubmit}
					className="w-full h-full flex justify-center items-center flex-col max-w-[700px] gap-2.5 p-5"
				>
					<span className="text-[24px] font-bold mt-5 w-full text-left">
						Account Information
					</span>
					<AnimatedInput
						id="fullName"
						placeholder="Full Name"
						type="text"
						tabIndex={6}
						inputRef={fullNameRef}
						active={fullName || fullNameActive ? true : false}
						inputValue={fullName}
						handleChange={(e) =>
							handleFullNameChange(e.target.value)
						}
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
					<div className="flex flex-row gap-2.5 w-full">
						<div className="w-[200px]">
							<CustomAutocomplete
								id="countryCode"
								placeholder="Code"
								tabIndex={8}
								suggestions={countryCodeSuggestions}
								onSelectionChange={handleCountryCodeChange}
								defaultValue={defaultCountryCode}
							/>
						</div>
						{/* phone number input */}
						<AnimatedInput
							id="phoneNumber"
							placeholder="Phone Number"
							type="text"
							tabIndex={9}
							inputRef={phoneNumberRef}
							active={
								phoneNumber || phoneNumberActive ? true : false
							}
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
					<AnimatedInput
						id="email"
						placeholder="Email"
						type="text"
						tabIndex={1}
						inputRef={emailRef}
						active={email || emailActive ? true : false}
						inputValue={email}
						handleChange={(e) => handleEmailChange(e.target.value)}
						handleFocus={() => setEmailActive(true)}
						handleBlur={() => setEmailActive(false)}
					/>
					{errors.email && (
						<div className="flex flex-row gap-3 items-center w-full justify-start">
							{errorIcon}
							<p className="md:text-[16px] text-[14px]">
								{errors.email.message}
							</p>
						</div>
					)}
					<ThemeSwitcher className="w-full" size="big" />
					<RippleButton
						disabled={disabled}
						type="submit"
						style="gradient"
						tabIndex={4}
						className="w-full"
					>
						Save Account Information
					</RippleButton>
					<div className="w-full flex flex-row gap-10 h-[30px] items-center">
						<div className="w-full h-[1px] bg-foreground"></div>
						<p>OR</p>
						<div className="w-full h-[1px] bg-foreground"></div>
					</div>
					<RippleButton
						onClick={handleSignOut}
						style="outlined"
						tabIndex={4}
						className="w-full"
					>
						Sign Out
					</RippleButton>
				</form>
			</div>
		</>
	);
};

export default AppAccountPage;
