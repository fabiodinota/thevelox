"use client";

import React, { useEffect, useState } from "react";
import { Map } from "./Map";
import axios from "axios";
import RippleButton from "@/app/components/RippleButton";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import useStationData from "@/app/utils/useStationData";
import { Drawer } from "vaul";
import { useMediaQuery } from "react-responsive";
import { ArrowIcon, LineArrowIcon } from "@/app/components/Icons";
import Ticket from "@/app/components/app/search/Ticket";
import SearchForm from "@/app/components/app/search/SearchForm";
import searchFormSchema from "@/app/utils/searchFormSchema";
import useGetLevelIcon from "@/app/utils/getLevelIcon";
import {
	FormSchemaProps,
	ISearchReqData,
	SearchParams,
	Station,
	Ticket as TicketType,
} from "@/app/types/types";
import { getSearchParams } from "@/app/utils/getSearchParams";
import DrawerComponent from "@/app/components/app/search/Drawer";
import ActiveTicketHeader from "@/app/components/app/search/ActiveTicketHeader";
import { headers } from "next/headers";
import { toast } from "sonner";

const AppSearchPage = () => {
	const [startStation, setStartStation] = useState<Station>({
		name: "",
		level: undefined,
		label: "",
	});
	const [endStation, setEndStation] = useState<Station>({
		name: "",
		level: undefined,
		label: "",
	});
	const [departureDate, setDepartureDate] = useState<Date | undefined>(
		undefined
	);

	const [snap, setSnap] = useState<number | string | null>(0.4);

	const [searching, setSearching] = useState<boolean>(false);

	const [searchReqData, setSearchReqData] = useState<ISearchReqData | {}>({});

	const [showTicketLimit, setShowTicketLimit] = useState(5);

	const router = useRouter();
	const searchParams = useSearchParams();

	const { stations, fetchStations, loading } = useStationData();

	const [activeTicket, setActiveTicket] = useState<TicketType | undefined>(
		undefined
	);

	const isLg = useMediaQuery({ query: "(max-width: 1024px)" });

	const FormSchema = searchFormSchema({
		stations,
		startStation,
		endStation,
	});

	const {
		handleSubmit,
		setValue,
		formState: { errors },

		reset,
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		mode: "onSubmit",
	});

	const handleSearch = async (data: FormSchemaProps) => {
		// Push the search params to the URL

		if (data.startStation === data.endStation) {
			toast.error("Start and end stations can't be the same");
			setSearching(false);
			return;
		}

		router.push(
			`/app/search?startStation=${data.startStation}&endStation=${
				data.endStation
			}&departureDate=${format(data.departureDate, "PP HH:mm")}`
		);

		setSnap(isLg ? 0.4 : "520px");

		// Fetch the route data
		if (data.startStation && data.endStation && data.departureDate) {
			getRoute(
				data.startStation,
				data.endStation,
				format(data.departureDate, "PP HH:mm")
			);
		}
	};

	const getRoute = async (
		startStation: string,
		endStation: string,
		departureDate: string
	) => {
		try {
			const adjustedDate = new Date(departureDate);
			adjustedDate.setTime(
				adjustedDate.getTime() +
					adjustedDate.getTimezoneOffset() * 60 * 1000
			); // Adjust for local timezone
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/map/search?startStation=${startStation}&endStation=${endStation}&departureDate=${adjustedDate}`,
				{ withCredentials: true }
			);

			let fullPath: Station[] = [];

			res.data?.path.forEach((pathStation: string) => {
				stations.some((station: Station) => {
					if (station.name === pathStation) {
						fullPath.push(station);
					}
				});
			});

			setSearchReqData({
				startStation: res.data?.startStation || "",
				endStation: res.data?.endStation || "",
				startLevel: res.data?.tickets[0].startLevel || 0,
				endLevel: res.data?.tickets[0].endLevel || 0,
				lines: res.data?.lines || [],
				path: res.data?.path || [],
				fullPath: fullPath,
				times: res.data?.trainTimes || [],
				tickets: res.data?.tickets || [],
			});
		} catch (err) {
			console.log("Err: ", err);
		}
	};

	const loadMoreTickets = () => {
		setShowTicketLimit((prevLimit) => prevLimit + 3);

		if (searchReqData && "tickets" in searchReqData) {
			if (showTicketLimit >= searchReqData.tickets.length) {
				setShowTicketLimit(searchReqData.tickets.length);
			}
		}
	};

	const handleGoBackToMap = () => {
		setSnap(0);
		clearSearch();
		router.push("/app/search");
	};

	const clearSearch = () => {
		reset();

		setStartStation({
			name: "",
			level: undefined,
			label: " ",
		});
		setEndStation({
			name: "",
			level: undefined,
			label: " ",
		});
		setDepartureDate(undefined);
		setSearchReqData({}); // Reset to empty object
		setSearching(false);
	};

	useEffect(() => {
		getSearchParams({
			stations,
			setSearching,
			setStartStation,
			setEndStation,
			setValue,
			setDepartureDate,
			handleSearch,
			searchParams,
			router,
		});
	}, [searchParams, stations]);

	useEffect(() => {
		if (isLg && searching) {
			setSnap(0.4);
		} else if (!isLg && searching) {
			setSnap("520px");
		} else {
			setSnap(0);
		}
	}, [isLg, searching]);

	useEffect(() => {
		fetchStations();
	}, []);

	const handleQuickBookSearch = () => {
		const bookingData = JSON.parse(
			localStorage.getItem("quickBookInfo") || "{}"
		);

		const data = {
			startStation: bookingData.from,
			endStation: bookingData.to,
			departureDate: bookingData.departureDate,
		};

		if (data.startStation && data.endStation && data.departureDate) {
			setSearching(true);

			stations.some((station: Station) => {
				if (station.name === data.startStation) {
					setStartStation({
						name: station.name,
						level: station.level,
						label: station.label,
					});
					setValue("startStation", station.name, {
						shouldValidate: true,
					});
				}
				if (station.name === data.endStation) {
					setEndStation({
						name: station.name,
						level: station.level,
						label: station.label,
					});
					setValue("endStation", station.name, {
						shouldValidate: true,
					});
				}
			});
			// Set the date
			setDepartureDate(data.departureDate);
			setValue("departureDate", data.departureDate, {
				shouldValidate: true,
			});

			if (data.startStation && data.endStation && data.departureDate) {
				handleSearch({
					startStation: data.startStation,
					endStation: data.endStation,
					departureDate: data.departureDate,
				});
			}
			localStorage.removeItem("quickBookInfo");
		}
	};

	useEffect(() => {
		if (stations.length > 0) {
			setTimeout(() => {
				handleQuickBookSearch();
			}, 500);
		} else {
			fetchStations();
		}
	}, [stations]);

	const [level, setLevel] = useState(0);
	const [slideDirection, setSlideDirection] = useState("right");

	const xInitial = slideDirection === "right" ? -50 : 50;
	const xExit = slideDirection === "right" ? 50 : -50;

	const minMax = {
		min: 0,
		max: 2,
	};

	const decrease = () => {
		setSlideDirection("left");
		if (level > minMax.min) {
			setLevel((prevLevel) => prevLevel - 1);
		} else {
			setLevel(minMax.max);
		}
	};

	const increase = () => {
		setSlideDirection("right");
		if (level < minMax.max) {
			setLevel((prevLevel) => prevLevel + 1);
		} else {
			setLevel(minMax.min);
		}
	};

	return (
		<div className="w-full h-screen overflow-hidden relative flex items-center justify-center">
			<div
				className={`absolute top-5 z-[80] lg:z-[100] w-full px-5 flex justify-start items-center`}
			>
				<SearchForm
					stations={stations}
					searching={searching}
					handleSearch={handleSearch}
					handleGoBackToMap={handleGoBackToMap}
					startStation={startStation}
					endStation={endStation}
					departureDate={departureDate}
					setDepartureDate={setDepartureDate}
					handleSubmit={handleSubmit}
					searchReqData={searchReqData}
					setValue={setValue}
					errors={errors}
					increase={increase}
					decrease={decrease}
				/>
			</div>
			<DrawerComponent
				searching={searching}
				isLg={isLg}
				snap={snap}
				setSnap={setSnap}
				loadMoreTickets={loadMoreTickets}
				showTicketLimit={showTicketLimit}
				searchReqData={searchReqData}
				increase={increase}
				decrease={decrease}
				activeTicket={activeTicket}
				setActiveTicket={setActiveTicket}
			/>
			<Map
				searching={searching}
				searchRequestData={searchReqData}
				level={level}
				xInitial={xInitial}
				xExit={xExit}
			/>
		</div>
	);
};

export default AppSearchPage;
