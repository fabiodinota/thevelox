"use client";

import { useSession } from "../context/sessionContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import RippleButton from "./RippleButton";

export function ContactForm({ className }: { className?: string }) {
	const { isAuthenticated } = useSession();

	const [isFocused, setIsFocused] = useState<string | null>(null);
	const [messageLength, setMessageLength] = useState<number>(0);

	const [contactMessage, setContactMessage] = useState<string>("");

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const FormSchema = z.object({
		first_name: z
			.string()
			.min(1, { message: "Input your first name." })
			.max(50, { message: "The first name is too long." }),
		last_name: z
			.string()
			.min(1, { message: "Input your last name." })
			.max(50, { message: "The last name is too long." }),
		email: z
			.string()
			.min(1, { message: "Input your email." })
			.max(200, { message: "The email is too long." })
			.regex(emailRegex, { message: "Invalid email address." }),
		message: z
			.string({ invalid_type_error: "This input only accepts a string." })
			.min(1, { message: "Input your message." })
			.refine((value) => value.length < 600, {
				message: "The message is too long",
			}),
	});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		getValues,
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const onSubmit = handleSubmit(async (data) => {
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/contact/sendContactForm`,
				data
			)
			.then((res) => {
				setContactMessage(
					"Thank you for your message! We will get back to you soon."
				);
			})
			.catch((err) => {
				console.log("Err: ", err);
			});
	});

	const customease = [0.05, 0.58, 0.57, 0.96];

	const handleFocus = (input: string) => {
		setIsFocused(input);
	};

	return (
		<>
			<motion.form
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4, ease: customease, delay: 0 }}
				onSubmit={onSubmit}
				className={
					"w-full max-w-[1400px] flex flex-col gap-2.5 p-5 rounded-[20px] bg-background " +
					className
				}
			>
				<div className="flex flex-col md:flex-row justify-center items-center gap-2.5">
					<div className="w-full h-[70px] md:h-[80px] relative z-[45] cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
						<div className="flex items-center flex-row w-full relative">
							<label
								htmlFor="first_name"
								className={`absolute cursor-pointer text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${
									isFocused === "first_name" ||
									getValues("first_name")
										? "transform -translate-y-5  md:-translate-y-6 text-[13px] md:text-[15px]"
										: "text-[16px] md:text-lg"
								}`}
							>
								First Name
							</label>
							<input
								type="text"
								id="first_name"
								{...register("first_name")}
								onFocus={() => handleFocus("first_name")}
								onBlur={() => setIsFocused(null)}
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								className="w-full bg-secondary pt-4 text-[16px] md:text-[18px] font-medium border-none outline-none"
							/>
						</div>
					</div>
					<div className="w-full h-[70px] md:h-[80px] relative z-[45] cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
						<div className="flex items-center flex-row w-full relative">
							<label
								htmlFor="last_name"
								className={`absolute cursor-pointer text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${
									isFocused === "last_name" ||
									getValues("last_name")
										? "transform -translate-y-5  md:-translate-y-6 text-[13px] md:text-[15px]"
										: "text-[16px] md:text-lg"
								}`}
							>
								Last Name
							</label>
							<input
								type="text"
								id="last_name"
								{...register("last_name")}
								onFocus={() => handleFocus("last_name")}
								onBlur={() => setIsFocused(null)}
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								className="w-full bg-secondary pt-4 text-[16px] md:text-[18px] font-medium border-none outline-none"
							/>
						</div>
					</div>
				</div>
				{(errors.first_name || errors.last_name) && (
					<div className=" flex flex-row gap-5">
						{errors.first_name && (
							<span className="text-red-500 w-full">
								{errors.first_name.message}
							</span>
						)}
						{errors.last_name && (
							<span className="text-red-500 w-full">
								{errors.last_name.message}
							</span>
						)}
					</div>
				)}
				<div className="w-full h-[70px] md:h-[80px] relative z-[45] cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
					<div className="flex items-center flex-row w-full relative">
						<label
							htmlFor="email"
							className={`absolute cursor-pointer text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${
								isFocused === "email" || getValues("email")
									? "transform -translate-y-5  md:-translate-y-6 text-[13px] md:text-[15px]"
									: "text-[16px] md:text-lg"
							}`}
						>
							Email
						</label>
						<input
							type="text"
							id="email"
							{...register("email")}
							onFocus={() => handleFocus("email")}
							onBlur={() => setIsFocused(null)}
							autoComplete="off"
							autoCapitalize="off"
							autoCorrect="off"
							className="w-full bg-secondary pt-4 text-[16px] md:text-[18px] font-medium border-none outline-none"
						/>
					</div>
				</div>
				{errors.email && (
					<span className="text-red-500">{errors.email.message}</span>
				)}
				<div className="w-full h-[200px] relative z-[45] cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
					<div className="flex items-center flex-row w-full relative overflow-hidden">
						<label
							htmlFor="message"
							className={`absolute cursor-pointer text-foreground/50 transition-all duration-200 ease-in-out left-0 top-5 z-20 ${
								isFocused === "message" || getValues("message")
									? "transform -translate-y-2  md:-translate-y-2 text-[13px] md:text-[15px]"
									: "text-[16px] md:text-lg"
							}`}
						>
							Message{" "}
							{(isFocused === "message" ||
								getValues("message")) && (
								<span>({messageLength}/600)</span>
							)}
						</label>
						<div className="absolute top-0 left-0 w-full z-10 h-9 bg-gradient-to-b from-secondary to-secondary"></div>
						<textarea
							id="message"
							onChange={(e) => {
								setMessageLength(e.target.value.length);
								setValue("message", e.target.value, {
									shouldValidate: true,
								});
							}}
							onFocus={() => handleFocus("message")}
							onBlur={() => setIsFocused(null)}
							autoComplete="off"
							autoCapitalize="off"
							autoCorrect="off"
							className="w-full min-h-[200px] max-h-[200px] bg-secondary pt-8 text-[16px] md:text-[18px] font-medium border-none outline-none resize-none"
						/>
					</div>
				</div>
				{errors.message && (
					<span className="text-red-500">
						{errors.message.message}
					</span>
				)}
				<RippleButton type="submit" style="gradient" className="w-full">
					Continue
				</RippleButton>

				{contactMessage && (
					<span className="text-green-600">{contactMessage}</span>
				)}
			</motion.form>
		</>
	);
}
