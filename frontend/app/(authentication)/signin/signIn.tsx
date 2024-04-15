"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import AnimatedInput from "@/app/components/AnimatedInput";
import { xIcon, checkIcon } from "@/app/components/Icons";

interface SignInProps {
	setStage: React.Dispatch<React.SetStateAction<number>>;
	setSignInData: React.Dispatch<
		React.SetStateAction<{
			email: string;
			password: string;
		}>
	>;
	signInData: {
		email: string;
		password: string;
	};
	errorMessage: string;
}

const SignIn = ({
	setStage,
	setSignInData,
	signInData,
	errorMessage,
}: SignInProps) => {
	const [email, setEmail] = useState<string>("");
	const [emailActive, setEmailActive] = useState<boolean>(false);
	const emailRef = useRef<HTMLInputElement>(null);

	const [password, setPassword] = useState<string>("");
	const [passwordActive, setPasswordActive] = useState<boolean>(false);
	const passwordRef = useRef<HTMLInputElement>(null);

	const [disabled, setDisabled] = useState<boolean>(true);
	const [passwordValidation, setPasswordValidation] = useState({
		uppercase: false,
		number: false,
		special: false,
	});

	useEffect(() => {
		setEmail(signInData.email);
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
		setStage(2);
		setSignInData(() => ({
			email: data.email,
			password: data.password,
		}));
	});

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
			special: /^(?=.*[!@#$%^&*()-_+])/.test(value),
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
	}, []);

	return (
		<form
			onSubmit={onSubmit}
			className="w-full h-full max-w-[700px] relative flex-shrink-0 flex flex-col justify-center items-center gap-2.5 md:gap-5"
		>
			<h1 className="text-3xl font-semibold leading-none">Sign In</h1>
			<p className="md:text-[20px] text-[16px] leading-none">
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
			</div>
			{errorMessage && (
				<div className="flex flex-row gap-3 items-center w-full">
					<p className="md:text-[16px] text-[14px] text-red-500">
						{errorMessage}
					</p>
				</div>
			)}
			<button
				type="submit"
				disabled={disabled}
				tabIndex={4}
				className="rounded-xl flex-shrink-0 bg-gradient w-full h-[50px] md:h-[60px] text-white font-medium text-[16px] md:text-[18px] flex gap-3 items-center justify-center transition-all duration-200 ease-in-out disabled:opacity-50"
			>
				Sign In
			</button>
			<div className="w-full flex flex-row gap-10 h-[30px] items-center">
				<div className="w-full h-[1px] bg-foreground"></div>
				<p>OR</p>
				<div className="w-full h-[1px] bg-foreground"></div>
			</div>
			<Link
				href="/signup"
				tabIndex={5}
				className="rounded-xl flex-shrink-0 border border-foreground w-full h-[50px] md:h-[60px] disabled:opacity-50 text-foreground font-medium text-[16px] md:text-[18px] flex gap-3 items-center justify-center transition-all duration-200 ease-in-out"
			>
				Sign Up
			</Link>
			<p>
				By clicking “Sign In” you agree to our Terms of Service and
				Privacy Policy
			</p>
		</form>
	);
};

export default SignIn;
