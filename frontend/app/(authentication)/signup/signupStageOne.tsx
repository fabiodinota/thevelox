"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AnimatedInput from "@/app/components/AnimatedInput";
import { xIcon, checkIcon } from "@/app/components/Icons";
import MediaQuery, { useMediaQuery } from "react-responsive";
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
	stageData: {
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
	};
	errorMessage: string;
	setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const SignUpStageOne = ({
	setStage,
	setStageData,
	stageData,
	errorMessage,
	setErrorMessage,
}: SignUpStageOneProps) => {
	const [email, setEmail] = useState<string>("");
	const [emailActive, setEmailActive] = useState<boolean>(false);
	const emailRef = useRef<HTMLInputElement>(null);

	const [password, setPassword] = useState<string>("");
	const [passwordActive, setPasswordActive] = useState<boolean>(false);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [repeatPassword, setRepeatPassword] = useState<string>("");
	const [repeatPasswordActive, setRepeatPasswordActive] =
		useState<boolean>(false);
	const repeatPasswordRef = useRef<HTMLInputElement>(null);

	const [disabled, setDisabled] = useState<boolean>(true);
	const [passwordValidation, setPasswordValidation] = useState({
		uppercase: false,
		number: false,
		special: false,
		matching: false,
	});

	useEffect(() => {
		setEmail(stageData.stageOne.email);
	}, []);

	const SignInFormSchema = z.object({
		email: z
			.string({
				invalid_type_error:
					"Don't know what you entered, don't want to know, please don't do it again.",
			})
			.email({ message: "Invalid email address" }),
		password: z
			.string()
			.min(8, { message: "Password must be atleast 8 characters long." })
			.max(500, {
				message: "Password must be shorter than 500 characters",
			})
			.refine((value) => value.trim() !== "", {
				message: "Password cannot be empty",
			})
			.refine((value) => !/\s/.test(value), {
				message: "Password cannot contain spaces",
			}),
		repeatPassword: z.string(),
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
		setStage(2);
		setStageData((prev) => ({
			...prev,
			stageOne: {
				email: data.email,
				password: data.password,
				repeatPassword: data.repeatPassword,
			},
		}));
	});

	useEffect(() => {
		if (errorMessage !== "") {
			// Clear input fields using refs when an error occurs
			if (emailRef.current) emailRef.current.value = "";
			if (passwordRef.current) passwordRef.current.value = "";
			if (repeatPasswordRef.current) repeatPasswordRef.current.value = "";
			// Optionally reset the error message state if needed
		}
	}, [errorMessage, setErrorMessage]);

	const handleEmailChange = (value: string) => {
		setEmail(value.toLowerCase().toString());
		setValue("email", value.toLowerCase().toString(), {
			shouldValidate: true,
		});
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		setValue("password", value, { shouldValidate: true });
		setPasswordValidation({
			uppercase: /^(?=.*[A-Z])/.test(value),
			number: /^(?=.*\d{3})/.test(value),
			special: /(?=.*[\W_])/.test(value),
			matching: value === repeatPassword,
		});
	};

	const handlePasswordRepeatChange = (value: string) => {
		setRepeatPassword(value);
		setValue("repeatPassword", value, { shouldValidate: true });
		setPasswordValidation({
			...passwordValidation,
			matching: value === password,
		});
	};

	useEffect(() => {
		if (
			passwordValidation.uppercase &&
			passwordValidation.number &&
			passwordValidation.special &&
			isValid
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [passwordValidation, isValid]);

	useEffect(() => {
		const values = getValues();
		setEmail(values.email);
		setPassword(values.password);
		setRepeatPassword(values.repeatPassword);
	}, []);

	const [mobileHeight, setMobileHeight] = useState(false);

	const isMobileHeight = useMediaQuery({
		query: "(max-height: 850px)",
	});

	useEffect(() => {
		setMobileHeight(isMobileHeight);
	}, []);

	return (
		<form
			onSubmit={onSubmit}
			className={`w-full h-full lg:max-w-[700px] relative flex-shrink-0 flex flex-col ${
				mobileHeight
					? "items-start lg:py-10"
					: "items-start lg:items-center justify-center py-0"
			} gap-2.5 lg:gap-5`}
		>
			<h1 className="text-2xl lg:text-3xl font-semibold leading-none w-full text-left lg:text-center">
				Create An Account
			</h1>
			<p className="lg:text-[20px] text-[16px] leading-none w-full text-left lg:text-center">
				Enter the details below to create your account.
			</p>
			<AnimatedInput
				id="email"
				placeholder="Email"
				type="text"
				tabIndex={1}
				inputRef={emailRef}
				active={email || emailActive ? true : false}
				handleChange={(e) => handleEmailChange(e.target.value)}
				handleFocus={() => setEmailActive(true)}
				handleBlur={() => setEmailActive(false)}
			/>
			{errors.email && (
				<div className="flex flex-row gap-3 items-center w-full justify-start">
					{xIcon}
					<p className="md:text-[16px] text-[14px]">
						{errors.email.message}
					</p>
				</div>
			)}
			<AnimatedInput
				id="password"
				placeholder="Password"
				type="password"
				tabIndex={2}
				inputRef={passwordRef}
				active={password || passwordActive ? true : false}
				handleChange={(e) => handlePasswordChange(e.target.value)}
				handleFocus={() => setPasswordActive(true)}
				handleBlur={() => setPasswordActive(false)}
			/>
			<AnimatedInput
				id="repeatPassword"
				placeholder="Repeat Password"
				type="password"
				tabIndex={3}
				inputRef={repeatPasswordRef}
				active={repeatPassword || repeatPasswordActive ? true : false}
				handleChange={(e) => handlePasswordRepeatChange(e.target.value)}
				handleFocus={() => setRepeatPasswordActive(true)}
				handleBlur={() => setRepeatPasswordActive(false)}
			/>
			<div className="flex flex-col gap-2 w-full">
				<div className="flex flex-row gap-3 items-center">
					{passwordValidation.uppercase &&
					passwordValidation.number &&
					passwordValidation.special
						? checkIcon
						: xIcon}
					<p className="md:text-[16px] text-[14px]">
						Password contains atleast 1 uppercase, 1 special, and 3
						number characters.
					</p>
				</div>

				{errors.password && (
					<div className="flex flex-row gap-3 items-center">
						{xIcon}
						<p className="md:text-[16px] text-[14px]">
							{errors.password.message}
						</p>
					</div>
				)}
				{!passwordValidation.matching && (
					<div className="flex flex-row gap-3 items-center">
						{xIcon}
						<p className="md:text-[16px] text-[14px]">
							Passwords do not match
						</p>
					</div>
				)}
			</div>

			<RippleButton
				disabled={disabled}
				type="submit"
				style="gradient"
				tabIndex={4}
				className="w-full"
			>
				Continue
			</RippleButton>
			{errorMessage && (
				<div className="flex flex-row gap-3 items-center w-full">
					{xIcon}
					<p className="md:text-[16px] text-[14px]">{errorMessage}</p>
				</div>
			)}
			<div className="w-full flex flex-row gap-10 h-[30px] items-center">
				<div className="w-full h-[1px] bg-foreground"></div>
				<p>OR</p>
				<div className="w-full h-[1px] bg-foreground"></div>
			</div>
			<RippleButton
				asLink
				href="/signin"
				style="outlined"
				tabIndex={4}
				className="w-full"
			>
				Sign In
			</RippleButton>
		</form>
	);
};

export default SignUpStageOne;
