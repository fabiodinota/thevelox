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

		router.push(
			`/app/search?startStation=${data.startStation}&endStation=${
				data.endStation
			}&departureDate=${format(data.departureDate, "PP HH:mm")}`
		);

		setSnap(isLg ? 0.4 : "540px");

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
			const res = await axios.get(
				`${
					process.env.NEXT_PUBLIC_API_URL
				}/map/search?startStation=${startStation}&endStation=${endStation}&departureDate=${departureDate}&timezone=${
					Intl.DateTimeFormat().resolvedOptions().timeZone
				}`,
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
				startLevel: res.data?.startLevel || 0,
				endLevel: res.data?.endLevel || 0,
				lines: res.data?.lines || [],
				path: res.data?.path || [],
				fullPath: fullPath,
				times: res.data?.times || [],
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
			setSnap("540px");
		} else {
			setSnap(0);
		}
	}, [isLg, searching]);

	useEffect(() => {
		// Fetch stations on mount
		fetchStations();
	}, []);

	const [level, setLevel] = useState(0);
	const [slideDirection, setSlideDirection] = useState("right");

	const xInitial = slideDirection === "right" ? -50 : 50;
	const xExit = slideDirection === "right" ? 50 : -50;

	return (
		<div className="w-full h-full overflow-hidden relative flex items-center justify-center">
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
					setValue={setValue}
					errors={errors}
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
				level={level}
				setLevel={setLevel}
				setSlideDirection={setSlideDirection}
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
