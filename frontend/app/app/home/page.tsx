"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "../../context/sessionContext";
import { redirect } from "next/navigation";
import Header from "@/app/components/app/Header";
import { useRouter } from "next/navigation";
import RippleButton from "@/app/components/RippleButton";
import axios from "axios";
import { ParsedTicketResponse, TicketResponse } from "@/app/types/types";
import Ticket, { MainTicket } from "@/app/components/app/search/Ticket";

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

	useEffect(() => {
		handleGetActiveTickets();
	}, []);

	return (
		<>
			<Header />
			<div className="w-full h-full flex justify-start mt-10 items-center flex-col">
				<div className="max-w-[800px] w-full flex flex-col gap-3">
					<span className="text-[20px] lg:text-[24px] font-bold">
						Active Tickets
					</span>
					{activeTickets &&
						activeTickets.map((ticket) => (
							<div key={ticket.ticket_id}>
								<MainTicket
									journeyDate={ticket.journey_date}
									ticket={ticket.ticket_object}
								/>
							</div>
						))}
					<span className="text-[20px] lg:text-[24px] font-bold">
						Favorite Routes
					</span>
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
