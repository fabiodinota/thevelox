"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { TimePickerDemo } from "./package/time-picker-demo";

import CustomAutocomplete from "./Autocomplete";
import { useAutocomplete } from "../context/AutocompleteContext";

import useQuickBookStore from "../state/state";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { motion } from "framer-motion";
import AnimatePresenceProvider from "../context/AnimatePresenceProvider";

type Station = {
	name: string;
	level: number;
};

export function HeroQuickBook({ className }: { className?: string }) {
	const [stations, setStations] = useState<Station[]>([]);
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [calendarOpen, setCalendarOpen] = useState(false);

	const { releaseFocus } = useAutocomplete();

	useEffect(() => {
		if (calendarOpen) {
			releaseFocus();
		}
	}, [calendarOpen]);

	const { setQuickBook, clear } = useQuickBookStore();

	const FormSchema = z.object({
		from: z
			.string()
			.min(1, { message: "Set a departure station" })
			.refine(
				(value) =>
					stations.some(
						(station) =>
							`${station.name}, Level ${station.level}` === value
					),
				{
					message: "Enter a valid station",
				}
			),
		to: z
			.string()
			.min(1, { message: "Set a destination station" })
			.refine(
				(value) =>
					stations.some(
						(station) =>
							`${station.name}, Level ${station.level}` === value
					),
				{
					message: "Enter a valid station",
				}
			),
		departureDate: z
			.string()
			.min(1, { message: "Set a departure date" })
			.refine((value) => new Date(value) > new Date(new Date()), {
				message: "The departure date must be in the future",
			}),
		passengers: z
			.number({ invalid_type_error: "This input only accepts numbers." })
			.default(1)
			.refine((value) => value >= 1 && value <= 4, {
				message: "The number of passengers must be in between 1 and 4.",
			}),
	});

	useEffect(() => {
		const currentDate = new Date();
		const halfHourLater = new Date(currentDate.getTime() + 30 * 60000); // Adding 30 minutes in milliseconds

		setDate(halfHourLater);
	}, []);

	const {
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const handleQuickBook = async (data: z.infer<typeof FormSchema>) => {
		clear();

		setQuickBook({
			from: data.from,
			to: data.to,
			departureDate: data.departureDate,
			passengers: data.passengers,
			searching: true,
		});
	};

	const handleGetStations = async () => {
		if (stations.length === 0) {
			await axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/map/getDestinations`)
				.then((res) => {
					setStations(res.data.destinations);
				})
				.catch((err) => {
					console.log("Err: ", err);
				});
		}
	};

	useEffect(() => {
		handleGetStations();
	}, []);

	const onSubmit = handleSubmit(async (data) => {
		// Your submission logic, using data from the form
		console.log("Form Data: ", data);
		handleQuickBook(data);
		// Note: Since you're using Zod for validation, data is already validated here
	});

	const handleDateChange = (newDate: Date | undefined) => {
		if (!newDate) return;

		if (date) {
			const hours = date.getHours();
			const minutes = date.getMinutes();
			newDate.setHours(hours, minutes);
		}

		// If the new date is in the past, don't update the state
		if (newDate > new Date(new Date())) {
			setDate(newDate);
		}

		setValue("departureDate", format(newDate, "PP HH:mm"), {
			shouldValidate: true,
		});
	};

	const handleTimeChange = (time: Date | undefined) => {
		if (!time) return; // Exit if no time is selected

		const updatedDate = date ? new Date(date) : new Date();
		updatedDate.setHours(time.getHours(), time.getMinutes());

		if (updatedDate < new Date(new Date())) return; // Don't update the state if the new date is in the past
		setDate(updatedDate); // Set the new date with the updated time

		// Update React Hook Form state
		setValue("departureDate", format(updatedDate, "PP HH:mm"), {
			shouldValidate: true,
		});
	};

	const handleCalendarClick = () => {
		setCalendarOpen(!calendarOpen);
	};

	const popoverVariant = {
		initial: { opacity: 0, scale: 0.9 },
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

	const customease = [0.05, 0.58, 0.57, 0.96];

	return (
		<>
			<motion.form
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.4, ease: customease, delay: 0.2 }}
				onSubmit={onSubmit}
				className={
					"w-full max-w-[1400px] flex flex-col gap-2.5 p-5 rounded-[20px] bg-background " +
					className
				}
			>
				<CustomAutocomplete
					id="from"
					placeholder="From"
					svgIcon={
						<svg
							className="relative z-10"
							width="20"
							height="13"
							viewBox="0 0 20 13"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6 10.8335C7.1 10.8335 8.04167 10.4418 8.825 9.6585C9.60833 8.87516 10 7.9335 10 6.8335C10 5.7335 9.60833 4.79183 8.825 4.0085C8.04167 3.22516 7.1 2.8335 6 2.8335C4.9 2.8335 3.95833 3.22516 3.175 4.0085C2.39167 4.79183 2 5.7335 2 6.8335C2 7.9335 2.39167 8.87516 3.175 9.6585C3.95833 10.4418 4.9 10.8335 6 10.8335ZM6 12.8335C4.33333 12.8335 2.91667 12.2502 1.75 11.0835C0.583333 9.91683 0 8.50016 0 6.8335C0 5.16683 0.583333 3.75016 1.75 2.5835C2.91667 1.41683 4.33333 0.833496 6 0.833496C7.5 0.833496 8.80417 1.3085 9.9125 2.2585C11.0208 3.2085 11.6917 4.40016 11.925 5.8335H20V7.8335H11.925C11.6917 9.26683 11.0208 10.4585 9.9125 11.4085C8.80417 12.3585 7.5 12.8335 6 12.8335Z"
								className="fill-foreground"
							/>
						</svg>
					}
					suggestions={stations.map(
						(station) => `${station.name}, Level ${station.level}`
					)} // Assuming stations is an array of objects
					onSelectionChange={(value) =>
						setValue("from", value, { shouldValidate: true })
					}
				/>
				{errors.from && (
					<span className="text-red-500">{errors.from.message}</span>
				)}
				<CustomAutocomplete
					id="to"
					placeholder="To"
					svgIcon={
						<svg
							className="relative z-10"
							width="20"
							height="13"
							viewBox="0 0 20 13"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M14 2.5C12.9 2.5 11.9583 2.89167 11.175 3.675C10.3917 4.45833 10 5.4 10 6.5C10 7.6 10.3917 8.54167 11.175 9.325C11.9583 10.1083 12.9 10.5 14 10.5C15.1 10.5 16.0417 10.1083 16.825 9.325C17.6083 8.54167 18 7.6 18 6.5C18 5.4 17.6083 4.45833 16.825 3.675C16.0417 2.89167 15.1 2.5 14 2.5ZM14 0.500001C15.6667 0.5 17.0833 1.08333 18.25 2.25C19.4167 3.41667 20 4.83333 20 6.5C20 8.16667 19.4167 9.58333 18.25 10.75C17.0833 11.9167 15.6667 12.5 14 12.5C12.5 12.5 11.1958 12.025 10.0875 11.075C8.97917 10.125 8.30833 8.93333 8.075 7.5L-4.37114e-07 7.5L-6.11959e-07 5.5L8.075 5.5C8.30833 4.06667 8.97917 2.875 10.0875 1.925C11.1958 0.975001 12.5 0.500001 14 0.500001Z"
								className="fill-foreground"
							/>
						</svg>
					}
					suggestions={stations.map(
						(station) => `${station.name}, Level ${station.level}`
					)} // Assuming stations is an array of object'
					onSelectionChange={(value) =>
						setValue("to", value, { shouldValidate: true })
					}
				/>
				{errors.to && (
					<span className="text-red-500">{errors.to.message}</span>
				)}
				<div className="flex flex-col md:flex-row space-y-2.5 md:space-y-0 md:gap-2.5">
					<div className="relative w-full">
						<button
							onClick={handleCalendarClick}
							className={
								"flex items-center flex-row w-full h-[70px] md:h-[80px] bg-secondary rounded-xl px-5 text-left font-normal text-[16px] justify-start"
							}
						>
							<div className="w-12 flex-shrink-0 h-12 grid place-content-center relative">
								<svg
									className="relative z-10"
									width="18"
									height="21"
									viewBox="0 0 18 21"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M2 20.167C1.45 20.167 0.979167 19.9712 0.5875 19.5795C0.195833 19.1878 0 18.717 0 18.167V4.16699C0 3.61699 0.195833 3.14616 0.5875 2.75449C0.979167 2.36283 1.45 2.16699 2 2.16699H3V0.166992H5V2.16699H13V0.166992H15V2.16699H16C16.55 2.16699 17.0208 2.36283 17.4125 2.75449C17.8042 3.14616 18 3.61699 18 4.16699V18.167C18 18.717 17.8042 19.1878 17.4125 19.5795C17.0208 19.9712 16.55 20.167 16 20.167H2ZM2 18.167H16V8.16699H2V18.167ZM2 6.16699H16V4.16699H2V6.16699Z"
										className="fill-foreground"
									/>
								</svg>
								<div className="w-full h-full absolute top-0 left-0 bg-accent z-0 rounded-full"></div>
							</div>

							<div className="flex items-center flex-row w-full relative">
								<p
									className={`absolute cursor-pointer left-3 text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${
										date
											? "transform -translate-y-5 md:-translate-y-6 text-[13px] md:text-[15px]"
											: "text-[16px] md:text-lg"
									}`}
								>
									Date
								</p>
								<div className="pt-4 pl-3 text-[16px] md:text-[18px] font-medium">
									{date ? (
										format(date, "PP | HH:mm")
									) : (
										<span>Pick a date</span>
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
										key={"calendar"}
										className="absolute z-[100] mt-1 w-auto p-0 bg-white dark:bg-background border border-muted rounded-lg shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]"
									>
										<Calendar
											mode="single"
											selected={date}
											onSelect={handleDateChange}
											initialFocus
										/>
										<div className="p-3 border-t border-border">
											<TimePickerDemo
												setDate={handleTimeChange}
												date={date}
											/>
										</div>
									</motion.div>
									<div
										className="top-0 left-0 fixed w-screen h-screen z-50"
										onClick={() => setCalendarOpen(false)}
									/>
								</div>
							)}
						</AnimatePresenceProvider>
					</div>
					<CustomAutocomplete
						id="passengers"
						placeholder="Passengers"
						svgIcon={
							<svg
								className="relative z-10"
								width="23"
								height="17"
								viewBox="0 0 23 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0.101562 16.8032V14.0032C0.101562 13.4366 0.247396 12.9157 0.539062 12.4407C0.830729 11.9657 1.21823 11.6032 1.70156 11.3532C2.7349 10.8366 3.7849 10.4491 4.85156 10.1907C5.91823 9.93239 7.00156 9.80322 8.10156 9.80322C9.20156 9.80322 10.2849 9.93239 11.3516 10.1907C12.4182 10.4491 13.4682 10.8366 14.5016 11.3532C14.9849 11.6032 15.3724 11.9657 15.6641 12.4407C15.9557 12.9157 16.1016 13.4366 16.1016 14.0032V16.8032H0.101562ZM18.1016 16.8032V13.8032C18.1016 13.0699 17.8974 12.3657 17.4891 11.6907C17.0807 11.0157 16.5016 10.4366 15.7516 9.95322C16.6016 10.0532 17.4016 10.2241 18.1516 10.4657C18.9016 10.7074 19.6016 11.0032 20.2516 11.3532C20.8516 11.6866 21.3099 12.0574 21.6266 12.4657C21.9432 12.8741 22.1016 13.3199 22.1016 13.8032V16.8032H18.1016ZM8.10156 8.80322C7.00156 8.80322 6.0599 8.41156 5.27656 7.62822C4.49323 6.84489 4.10156 5.90322 4.10156 4.80322C4.10156 3.70322 4.49323 2.76156 5.27656 1.97822C6.0599 1.19489 7.00156 0.803223 8.10156 0.803223C9.20156 0.803223 10.1432 1.19489 10.9266 1.97822C11.7099 2.76156 12.1016 3.70322 12.1016 4.80322C12.1016 5.90322 11.7099 6.84489 10.9266 7.62822C10.1432 8.41156 9.20156 8.80322 8.10156 8.80322ZM18.1016 4.80322C18.1016 5.90322 17.7099 6.84489 16.9266 7.62822C16.1432 8.41156 15.2016 8.80322 14.1016 8.80322C13.9182 8.80322 13.6849 8.78239 13.4016 8.74072C13.1182 8.69906 12.8849 8.65322 12.7016 8.60322C13.1516 8.06989 13.4974 7.47822 13.7391 6.82822C13.9807 6.17822 14.1016 5.50322 14.1016 4.80322C14.1016 4.10322 13.9807 3.42822 13.7391 2.77822C13.4974 2.12822 13.1516 1.53656 12.7016 1.00322C12.9349 0.919889 13.1682 0.865723 13.4016 0.840723C13.6349 0.815723 13.8682 0.803223 14.1016 0.803223C15.2016 0.803223 16.1432 1.19489 16.9266 1.97822C17.7099 2.76156 18.1016 3.70322 18.1016 4.80322ZM2.10156 14.8032H14.1016V14.0032C14.1016 13.8199 14.0557 13.6532 13.9641 13.5032C13.8724 13.3532 13.7516 13.2366 13.6016 13.1532C12.7016 12.7032 11.7932 12.3657 10.8766 12.1407C9.9599 11.9157 9.0349 11.8032 8.10156 11.8032C7.16823 11.8032 6.24323 11.9157 5.32656 12.1407C4.4099 12.3657 3.50156 12.7032 2.60156 13.1532C2.45156 13.2366 2.33073 13.3532 2.23906 13.5032C2.1474 13.6532 2.10156 13.8199 2.10156 14.0032V14.8032ZM8.10156 6.80322C8.65156 6.80322 9.1224 6.60739 9.51406 6.21572C9.90573 5.82406 10.1016 5.35322 10.1016 4.80322C10.1016 4.25322 9.90573 3.78239 9.51406 3.39072C9.1224 2.99906 8.65156 2.80322 8.10156 2.80322C7.55156 2.80322 7.08073 2.99906 6.68906 3.39072C6.2974 3.78239 6.10156 4.25322 6.10156 4.80322C6.10156 5.35322 6.2974 5.82406 6.68906 6.21572C7.08073 6.60739 7.55156 6.80322 8.10156 6.80322Z"
									className="fill-foreground"
								/>
							</svg>
						}
						suggestions={[
							{ label: "1", value: 1 },
							{ label: "2", value: 2 },
							{ label: "3", value: 3 },
							{ label: "4", value: 4 },
						]} // Assuming stations is an array of object'
						onSelectionChange={(value) =>
							setValue("passengers", parseInt(value), {
								shouldValidate: true,
							})
						}
					/>
				</div>
				{errors.departureDate && (
					<span className="text-red-500">
						{errors.departureDate.message}
					</span>
				)}
				{errors.passengers && (
					<span className="text-red-500">
						{errors.passengers.message}
					</span>
				)}

				<button
					type="submit"
					className="rounded-lg bg-gradient h-[50px] md:h-[60px] disabled:opacity-50 text-white font-medium text-[16px] md:text-[18px] flex gap-3 items-center justify-center transition-all duration-200 ease-in-out"
				>
					<svg
						width="18"
						height="17"
						viewBox="0 0 18 17"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M16.1 17L10.8 11.7C10.3 12.1 9.725 12.4167 9.075 12.65C8.425 12.8833 7.73333 13 7 13C5.18333 13 3.64583 12.3708 2.3875 11.1125C1.12917 9.85417 0.5 8.31667 0.5 6.5C0.5 4.68333 1.12917 3.14583 2.3875 1.8875C3.64583 0.629167 5.18333 0 7 0C8.81667 0 10.3542 0.629167 11.6125 1.8875C12.8708 3.14583 13.5 4.68333 13.5 6.5C13.5 7.23333 13.3833 7.925 13.15 8.575C12.9167 9.225 12.6 9.8 12.2 10.3L17.5 15.6L16.1 17ZM7 11C8.25 11 9.3125 10.5625 10.1875 9.6875C11.0625 8.8125 11.5 7.75 11.5 6.5C11.5 5.25 11.0625 4.1875 10.1875 3.3125C9.3125 2.4375 8.25 2 7 2C5.75 2 4.6875 2.4375 3.8125 3.3125C2.9375 4.1875 2.5 5.25 2.5 6.5C2.5 7.75 2.9375 8.8125 3.8125 9.6875C4.6875 10.5625 5.75 11 7 11Z"
							fill="white"
						/>
					</svg>
					Search
				</button>
			</motion.form>
		</>
	);
}
