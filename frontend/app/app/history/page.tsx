"use client";

import Header from "@/app/components/app/Header";
import { MainTicket } from "@/app/components/app/search/Ticket";
import { ParsedTicketResponse, TicketResponse } from "@/app/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AppHistoryPage = () => {
	const [ticketHistory, setTicketHistory] = useState<
		ParsedTicketResponse[] | undefined
	>(undefined);

	const handleGetTicketHistory = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/ticket/getTicketHistory`,
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
					return dateB - dateA;
				}
			);

			setTicketHistory(
				sortedTickets.filter((ticket: ParsedTicketResponse) => {
					const journeyDate = new Date(ticket.journey_date);
					const currentDate = new Date();

					return journeyDate <= currentDate;
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		handleGetTicketHistory();
	}, []);
	return (
		<div className="pb-[140px] pt-[70px]">
			<Header />
			<div className="w-full h-full flex justify-start mt-10 items-center flex-col px-5">
				<div className="max-w-[800px] w-full flex flex-col gap-3">
					<span className="text-[24px] font-bold mt-5">
						Ticket History
					</span>
					<div className="flex flex-col gap-2.5 lg:gap-5">
						{ticketHistory?.length === 0 && (
							<span className="text-[14px] md:text-[16px] text-primary opacity-50">
								No ticket history found. Book your first ticket
							</span>
						)}
						{ticketHistory &&
							ticketHistory.map((ticket) => {
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
				</div>
			</div>
		</div>
	);
};

export default AppHistoryPage;
