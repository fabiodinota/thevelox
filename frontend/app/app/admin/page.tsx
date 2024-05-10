"use client";

import RippleButton from "@/app/components/RippleButton";
import Header from "@/app/components/app/Header";
import UserView from "@/app/components/app/admin/userView";
import { MainTicket } from "@/app/components/app/search/Ticket";
import { useSession } from "@/app/context/sessionContext";
import {
	ParsedTicketResponse,
	Ticket,
	TicketResponse,
	User,
} from "@/app/types/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export interface UserInfo extends User {
	tickets: TicketResponse[];
}

const AdminPage = () => {
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [activeUser, setActiveUser] = useState<UserInfo | undefined>(
		undefined
	);
	const handleGetAllUsers = async () => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getAllUsers`, {
				withCredentials: true,
			})
			.then((res) => {
				setUsers(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		handleGetAllUsers();
	}, []);

	const handleViewUserTickets = async (user_id: number) => {
		const user = users.find((user) => user.user_id === user_id);
		setActiveUser(user);
	};

	const handleDeleteUser = async (user_id: number) => {
		await axios
			.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/deleteUser`, {
				data: {
					user_id,
				},
				withCredentials: true,
			})
			.then((res) => {
				toast.success("User deleted successfully");
				handleGetAllUsers();
			})
			.catch((err) => {
				toast.error("Error deleting user");
			});
	};

	return (
		<div className="pb-[140px] pt-[70px]">
			<Header />
			<div className="w-full h-full flex justify-center items-center flex-col mt-10 gap-5">
				<div className="max-w-[800px] w-full flex flex-col gap-3 px-5">
					{!activeUser ? (
						<>
							<span className="text-[24px] font-bold mt-5">
								User Management
							</span>
							{users.map((user, index) => (
								<UserView
									handleDeleteUser={handleDeleteUser}
									handleViewUserTickets={
										handleViewUserTickets
									}
									key={index}
									user={user}
								/>
							))}
						</>
					) : (
						<>
							<div className="w-full justify-between items-center flex flex-row mt-5">
								<span className="text-[24px] font-bold">
									{activeUser.full_name}'s Tickets
								</span>
								<button
									onClick={() => setActiveUser(undefined)}
								>
									Back
								</button>
							</div>
							{activeUser.tickets.length === 0 && (
								<span className="text-[14px] md:text-[16px] text-primary opacity-50">
									No tickets found.
								</span>
							)}
							{activeUser.tickets.map((ticket) => {
								const ticketObject: Ticket = JSON.parse(
									ticket.ticket_object
								);
								if (!ticketObject) {
									return null;
								}
								return (
									<div key={ticket.ticket_id}>
										<MainTicket
											journeyDate={ticket.journey_date}
											ticket={ticketObject}
										/>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
