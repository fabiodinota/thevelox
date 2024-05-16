"use client";

import RippleButton from "@/app/components/RippleButton";
import Header from "@/app/components/app/Header";
import UserView from "@/app/components/app/admin/userView";
import {
	AdminViewTicket,
	ExpandedTicket,
	MainTicket,
} from "@/app/components/app/search/Ticket";
import { useSession } from "@/app/context/sessionContext";
import {
	ISearchReqData,
	Station,
	Ticket,
	TicketResponse,
	User,
} from "@/app/types/types";
import useStationData from "@/app/utils/useStationData";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
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
	const [activeTicket, setActiveTicket] = useState<
		TicketResponse | undefined
	>(undefined);

	const [searchReqData, setSearchReqData] = useState<ISearchReqData | {}>({});

	const { stations } = useStationData();

	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			if (activeTicket) {
				const ticketObject: Ticket = JSON.parse(
					activeTicket.ticket_object
				);
				if (!ticketObject) {
					return;
				}

				const adjustedDate = new Date(ticketObject.departureTime);
				adjustedDate.setTime(
					adjustedDate.getTime() +
						adjustedDate.getTimezoneOffset() * 60 * 1000
				); // Adjust for local timezone

				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/map/search?startStation=${ticketObject.startStation}&endStation=${ticketObject.endStation}&departureDate=${adjustedDate}`,
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
			} else {
				setSearchReqData({});
			}
		};

		fetchData();
	}, [activeTicket]);

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
				setUsers([]);
				handleGetAllUsers();
			})
			.catch((err) => {
				toast.error("Error deleting user");
			});
	};

	const handleDeleteTicket = async (ticket_id: number) => {
		await axios
			.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/deleteTicket`, {
				data: {
					ticket_id,
				},
				withCredentials: true,
			})
			.then((res) => {
				toast.success("Ticket deleted successfully");
				setActiveTicket(undefined);

				setUsers((prevUsers) =>
					prevUsers.map((user) => ({
						...user,
						tickets: user.tickets.filter(
							(ticket) => ticket.ticket_id !== ticket_id
						),
					}))
				);

				setActiveUser((prevActiveUser) => {
					if (!prevActiveUser) return undefined;
					return {
						...prevActiveUser,
						tickets: prevActiveUser.tickets.filter(
							(ticket) => ticket.ticket_id !== ticket_id
						),
					};
				});
			})
			.catch((err) => {
				toast.error("Error deleting ticket.");
			});
	};

	const handleChangeRole = async (user_id: number, admin: boolean) => {
		await axios
			.put(
				`${process.env.NEXT_PUBLIC_API_URL}/admin/changeRole`,
				{
					user_id,
					admin,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				toast.success("Role changed successfully");
				setUsers([]);
				handleGetAllUsers();
			})
			.catch((err) => {
				toast.error("Error changing role");
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
									handleChangeRole={handleChangeRole}
									key={index}
									user={user}
								/>
							))}
						</>
					) : activeTicket ? (
						(() => {
							const ticketObject: Ticket = JSON.parse(
								activeTicket.ticket_object
							);
							if (!ticketObject) {
								return null;
							}
							return (
								<>
									<div className="w-full justify-between items-center flex flex-row mt-5">
										<span className="text-[24px] font-bold">
											Ticket Details
										</span>
										<button
											onClick={() =>
												setActiveTicket(undefined)
											}
										>
											Back
										</button>
									</div>
									<AdminViewTicket
										key={
											ticketObject.startStation +
											ticketObject.endStation
										}
										ticket={ticketObject}
										searchReqData={searchReqData}
										handleBack={() =>
											setActiveTicket(undefined)
										}
										handleDeleteTicket={() => {
											handleDeleteTicket(
												activeTicket.ticket_id
											);
										}}
									/>
								</>
							);
						})()
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
											onClick={() => {
												setActiveTicket(ticket);
											}}
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
