"use client";

import React, { useEffect, useState } from "react";
import CustomAutocomplete from "../../Autocomplete";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormSetValue,
	useForm,
} from "react-hook-form";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";
import { motion } from "framer-motion";
import { Calendar } from "../../ui/calendar";
import { TimePickerDemo } from "../../package/time-picker-demo";
import RippleButton from "../../RippleButton";
import { useAutocomplete } from "@/app/context/AutocompleteContext";
import searchFormSchema from "@/app/utils/searchFormSchema";
import { format } from "date-fns";
import { popoverVariant } from "@/app/utils/animationVariants";
import {
	Station,
	FormSchemaProps,
	FavoriteRoute,
	ISearchReqData,
} from "@/app/types/types";
import { ArrowIcon, HeartIcon, xIcon } from "../../Icons";
import axios from "axios";
import { toast } from "sonner";

interface SearchFormProps {
	stations: Station[];
	searching: boolean;
	handleSearch: (data: FormSchemaProps) => void;
	handleGoBackToMap: () => void;
	startStation: Station;
	endStation: Station;
	departureDate: Date | undefined;
	setDepartureDate: (date: Date) => void;
	handleSubmit: UseFormHandleSubmit<FormSchemaProps, FormSchemaProps>;
	setValue: UseFormSetValue<FormSchemaProps>;
	searchReqData: ISearchReqData | {};
	errors: FieldErrors<FormSchemaProps>;
	increase: () => void;
	decrease: () => void;
}

const SearchForm = ({
	stations,
	searching,
	handleSearch,
	handleGoBackToMap,
	startStation,
	endStation,
	departureDate,
	setDepartureDate,
	handleSubmit,
	setValue,
	searchReqData,
	errors,
	increase,
	decrease,
}: SearchFormProps) => {
	const [calendarOpen, setCalendarOpen] = useState(false);
	const { releaseFocus } = useAutocomplete();

	useEffect(() => {
		if (calendarOpen) {
			releaseFocus();
		}
	}, [calendarOpen]);

	const onSubmit = handleSubmit(async (data) => {
		if (!searching) {
			handleSearch(data);
		} else {
			handleGoBackToMap();
		}
	});

	const handleDateChange = (newDate: Date | undefined) => {
		if (!newDate) return;

		if (departureDate) {
			const hours = departureDate.getHours();
			const minutes = departureDate.getMinutes();
			newDate.setHours(hours, minutes);
		}

		if (newDate > new Date(new Date())) {
			setDepartureDate(newDate);
		}

		setValue("departureDate", format(newDate, "PP HH:mm"), {
			shouldValidate: true,
		});
	};

	const handleTimeChange = (time: Date | undefined) => {
		if (!time) return;

		const updatedDate = departureDate
			? new Date(departureDate)
			: new Date();
		updatedDate.setHours(time.getHours(), time.getMinutes());

		if (updatedDate < new Date(new Date())) return;
		setDepartureDate(updatedDate);

		setValue("departureDate", format(updatedDate, "PP HH:mm"), {
			shouldValidate: true,
		});
	};

	const handleCalendarClick = () => {
		setCalendarOpen(!calendarOpen);
	};

	const [favoriteRoute, setFavoriteRoute] = useState<number | undefined>(
		undefined
	);

	const fetchFavoriteRoutes = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/routes/getFavoriteRoutes`,
				{
					withCredentials: true,
				}
			);
			console.log("Favorite routes fetched:", response.data); // Debug: See what you get here
			return response.data;
		} catch (error) {
			console.error("Failed to fetch favorite routes", error);
			return []; // Return an empty array in case of error
		}
	};

	const isRouteFavorite = (
		favoriteRoutes: FavoriteRoute[],
		startStation: Station,
		endStation: Station
	) => {
		return favoriteRoutes.find(
			(favorite) =>
				favorite.start_station === startStation.name &&
				favorite.end_station === endStation.name
		);
	};

	const checkFavoriteRoute = async (
		startStation: Station,
		endStation: Station
	) => {
		const favoriteRoutes = await fetchFavoriteRoutes();
		const favorite = isRouteFavorite(
			favoriteRoutes,
			startStation,
			endStation
		);
		if (favorite) {
			setFavoriteRoute(favorite.favorite_id); // Ensure this function exists and works as expected
			console.log("Route is favorite, ID:", favorite.favorite_id); // Debug output
		} else {
			console.log("Route is not a favorite."); // Debug output
		}
	};

	useEffect(() => {
		if (searching && startStation && endStation) {
			checkFavoriteRoute(startStation, endStation);
		}
	}, [searching, startStation, endStation]);

	const handleFavoriteRoute = () => {
		if (favoriteRoute) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/routes/removeFavoriteRoute`,
					{
						favorite_id: favoriteRoute,
					},
					{
						withCredentials: true,
					}
				)
				.then(() => {
					setFavoriteRoute(undefined);
					toast.success("Route removed from favorites");
				})
				.catch((err) => {
					toast.error(err.response.data.message || "Unknown error");
					console.error(err);
				});
		} else {
			if (
				searchReqData &&
				"tickets" in searchReqData &&
				startStation &&
				endStation
			) {
				const startLine = `${searchReqData?.tickets[0].startLevel}-${searchReqData?.tickets[0].startLine}`;
				const endLine = `${searchReqData?.tickets[0].endLevel}-${searchReqData?.tickets[0].endLine}`;

				axios
					.post(
						`${process.env.NEXT_PUBLIC_API_URL}/routes/addFavoriteRoute`,
						{
							startStation: startStation.name,
							endStation: endStation.name,
							startLine: startLine,
							endLine: endLine,
						},
						{
							withCredentials: true,
						}
					)
					.then((res) => {
						setFavoriteRoute(res.data.favorite_id);
						toast.success("Route added to favorites");
					})
					.catch((err) => {
						toast.error(
							err.response.data.message || "Unknown error"
						);
						console.error(err);
					});
			}
		}
	};

	return (
		<form
			onSubmit={onSubmit}
			className={
				"w-full max-w-full lg:max-w-[500px] h-full flex flex-row gap-2 p-2.5 md:p-5 rounded-[20px] bg-background  shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07] "
			}
		>
			<div className=" flex flex-col gap-2.5 w-full h-full">
				<CustomAutocomplete
					id="from"
					placeholder="From"
					size="sm"
					disabled={searching}
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
					defaultValue={searching ? startStation.label : ""}
					suggestions={stations} // Assuming stations is an array of objects
					onSelectionChange={(value) =>
						setValue("startStation", value, {
							shouldValidate: true,
						})
					}
				/>
				{errors.startStation && (
					<span className="text-red-500">
						{errors.startStation.message}
					</span>
				)}
				<CustomAutocomplete
					id="to"
					placeholder="To"
					size="sm"
					disabled={searching}
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
					defaultValue={searching ? endStation.label : ""}
					suggestions={stations} // Assuming stations is an array of object'
					onSelectionChange={(value) => {
						setValue("endStation", value, {
							shouldValidate: true,
						});
					}}
				/>
				{errors.endStation && (
					<span className="text-red-500">
						{errors.endStation.message}
					</span>
				)}
				<div className="flex flex-col md:flex-row space-y-2.5 md:space-y-0 md:gap-2.5">
					<div className="relative w-full">
						<button
							onClick={handleCalendarClick}
							disabled={searching}
							className={
								"flex items-center flex-row w-full h-[60px] md:h-[70px] bg-secondary rounded-xl px-2.5 text-left font-normal text-[16px] justify-start"
							}
						>
							<div className="w-10 md:w-12 flex-shrink-0 h-10 md:h-12 grid place-content-center relative">
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
									className={`absolute cursor-pointer left-3 text-foreground/50 transition-all duration-200 ease-in-out top-1/2 transform -translate-y-5 md:-translate-y-6 text-[13px] md:text-[15px]`}
								>
									Date
								</p>
								<div className="pt-4 pl-3 text-[16px] md:text-[18px] font-medium">
									{departureDate ? (
										format(departureDate, "PP | HH:mm")
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
											selected={departureDate}
											onSelect={handleDateChange}
											initialFocus
										/>
										<div className="p-3 border-t border-border">
											<TimePickerDemo
												setDate={handleTimeChange}
												date={departureDate}
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
				</div>
				{errors.departureDate && (
					<span className="text-red-500">
						{errors.departureDate.message}
					</span>
				)}
				{!searching && (
					<>
						<RippleButton
							type="submit"
							style="gradient"
							className="w-full"
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
						</RippleButton>
					</>
				)}
				<div className={`flex flex-row gap-2.5 w-full`}>
					<RippleButton
						onClick={decrease}
						type="button"
						style="nofill"
						className="w-full !flex-shrink bg-secondary !text-foreground"
						speed="medium"
						data-vaul-no-drag
					>
						{ArrowIcon(false, "w-5 h-5")}
						Previous Level
					</RippleButton>
					<RippleButton
						onClick={increase}
						type="button"
						style="nofill"
						className="w-full !flex-shrink bg-secondary !text-foreground"
						speed="medium"
					>
						Next Level
						{ArrowIcon(false, "w-5 h-5 rotate-180")}
					</RippleButton>
				</div>
			</div>

			{searching && (
				<div className="grid relative flex-1 place-content-between">
					<RippleButton
						onClick={handleGoBackToMap}
						style="nofill"
						className="w-min !overflow-visible !h-min self-center"
					>
						{xIcon({
							fill: "foreground",
							className:
								"w-5 h-5 m-2 !scale-100 opacity-50 hover:opacity-100 duration-200",
						})}
					</RippleButton>
					<motion.div
						initial={{ scale: 1 }}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						transition={{ duration: 0.2, type: "spring" }}
						onClick={handleFavoriteRoute}
						className="w-min !h-min place-self-end self-center cursor-pointer"
					>
						{HeartIcon(
							favoriteRoute !== undefined,
							`w-8 h-8 ${
								favoriteRoute ? "opacity-100" : "opacity-50"
							}`
						)}
					</motion.div>
				</div>
			)}
		</form>
	);
};

export default SearchForm;
