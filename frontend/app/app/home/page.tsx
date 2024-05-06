"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "../../context/sessionContext";
import { redirect } from "next/navigation";
import Header from "@/app/components/app/Header";
import { useRouter } from "next/navigation";
import RippleButton from "@/app/components/RippleButton";
import axios from "axios";
import {
	FavoriteRoute,
	ParsedFavoriteRoute,
	ParsedTicketResponse,
	Station,
	TicketResponse,
} from "@/app/types/types";
import Ticket, { MainTicket } from "@/app/components/app/search/Ticket";
import Route from "@/app/components/app/search/Route";
import useStationData from "@/app/utils/useStationData";
import { toast } from "sonner";

const AppHomePage = () => {
	const { user, signOut } = useSession();

	const router = useRouter();

	const handleSignOut = async () => {
		const { success } = await signOut();

		if (success) {
			router.push("/signin");
		}
	};

	const [activeTickets, setActiveTickets] = useState<
		ParsedTicketResponse[] | undefined
	>(undefined);

	const [favoriteRoutes, setFavoriteRoutes] = useState<ParsedFavoriteRoute[]>(
		[]
	);

	const handleGetActiveTickets = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/ticket/getActiveTickets`,
				{
					withCredentials: true,
				}
			);
			let activeTickets = response.data.map((ticket: TicketResponse) => {
				return {
					...ticket,
					ticket_object: JSON.parse(ticket.ticket_object),
				};
			});
			const sortedTickets = activeTickets.sort(
				(a: ParsedTicketResponse, b: ParsedTicketResponse) => {
					// Convert journey_date from string to Date objects
					const dateA = new Date(a.journey_date).getTime();
					const dateB = new Date(b.journey_date).getTime();

					// Sort by closest date to today's date
					return dateA - dateB;
				}
			);
			setActiveTickets(sortedTickets);
		} catch (error) {
			console.error(error);
		}
	};

	const { stations, fetchStations } = useStationData();

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
			toast.error("Failed to fetch favorite routes");
			return []; // Return an empty array in case of error
		}
	};

	const handleGetFavoriteRoutes = async () => {
		const favoriteRoutes = await fetchFavoriteRoutes();

		const updatedFavoriteRoutes = favoriteRoutes.map(
			(route: FavoriteRoute) => {
				const startStation = stations.find(
					(station) => station.name === route.start_station
				);
				const endStation = stations.find(
					(station) => station.name === route.end_station
				);

				console.log("startStation: ", startStation);
				console.log("endStation: ", endStation);

				return {
					...route,
					startStation,
					endStation,
				};
			}
		);
		console.log("updatedFavoriteRoutes: ", updatedFavoriteRoutes);
		setFavoriteRoutes(updatedFavoriteRoutes);
	};

	useEffect(() => {
		fetchStations();
		handleGetActiveTickets();
	}, []);

	useEffect(() => {
		if (stations.length > 0) {
			handleGetFavoriteRoutes();
		} else {
			fetchStations();
		}
	}, [stations]);

	console.log("favorite routes: ", favoriteRoutes);

	const handleSearchFavoriteRoute = (route: ParsedFavoriteRoute) => {
		const adjustedDate = new Date();

		// add 10 mins to the current time
		adjustedDate.setMinutes(adjustedDate.getMinutes() + 10);
		router.push(
			`/app/search?startStation=${route.startStation.name}&endStation=${
				route.endStation.name
			}&departureDate=${adjustedDate.toISOString()}`
		);
	};

	return (
		<>
			<Header />
			<div className="w-full h-full flex justify-start mt-10 items-center flex-col px-5">
				<div className="max-w-[800px] w-full flex flex-col gap-3">
					<span className="text-[24px] font-bold">
						Active Tickets
					</span>
					<div className="flex flex-col gap-2.5 lg:gap-5">
						{activeTickets &&
							activeTickets.map((ticket) => {
								if (
									"ticket_object" in ticket &&
									ticket.ticket_object !== null
								) {
									return (
										<div key={ticket.ticket_id}>
											<MainTicket
												journeyDate={
													ticket.journey_date
												}
												ticket={ticket.ticket_object}
											/>
										</div>
									);
								}
							})}
					</div>
					<span className="text-[24px] font-bold mt-5">
						Favorite Routes
					</span>
					<div className="flex flex-col gap-2.5 lg:gap-5">
						{favoriteRoutes.map((route) => {
							console.log(route);
							return (
								<div
									onClick={() =>
										handleSearchFavoriteRoute(route)
									}
									key={route.favorite_id}
								>
									<Route
										startStation={route.startStation}
										endStation={route.endStation}
										route={route}
									/>
								</div>
							);
						})}
					</div>
				</div>
				{/* You've entered the app directory: {user?.email}
				<RippleButton
					style="gradient"
					className="w-[200px]"
					onClick={handleSignOut}
					tabIndex={0}
				>
					Sign out
				</RippleButton> */}
			</div>
		</>
	);
};

export default AppHomePage;
