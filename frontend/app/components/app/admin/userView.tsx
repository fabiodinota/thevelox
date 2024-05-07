import React, { useEffect, useState } from "react";
import { UserInfo } from "@/app/app/admin/page";
import { Ticket } from "@/app/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import TailwindColor from "@videsk/tailwind-random-color";
import RippleButton from "../../RippleButton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../ui/tooltip";
import { Button } from "../../ui/button";
import { TicketIcon, DeleteIcon } from "../../Icons";

const UserView = ({
	user,
	handleViewUserTickets,
	handleDeleteUser,
	...props
}: {
	user: UserInfo;
	handleViewUserTickets: (user_id: number) => void;
	handleDeleteUser: (user_id: number) => void;
}) => {
	const [color, setColor] = useState("#000");

	const getRgb = () => Math.floor(Math.random() * 256);

	const rgbToHex = (r: number, g: number, b: number): string =>
		"#" +
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("");

	const handleGenerate = () => {
		const color = {
			r: getRgb(),
			g: getRgb(),
			b: getRgb(),
		};
		setColor(rgbToHex(color.r, color.g, color.b));
	};

	useEffect(() => {
		handleGenerate();
	}, []);

	return (
		<div
			{...props}
			className="w-full flex flex-row justify-between items-center bg-secondary p-5 rounded-xl"
		>
			<div className="flex flex-row w-full">
				<Avatar className="w-14 h-14">
					<AvatarFallback style={{ backgroundColor: color }}>
						{user.full_name.split(" ").map((word) => {
							return word.slice(0, 1).toUpperCase();
						})}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col justify-center items-start ml-4 flex-shrink">
					<span className="text-lg font-semibold w-full">
						{user.full_name}
					</span>
					<span className="text-ellipsis overflow-hidden max-w-[200px]">
						{user.email}
					</span>
				</div>
			</div>
			<div className="flex flex-row gap-3">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={() => handleDeleteUser(user.user_id)}
							>
								{DeleteIcon(
									false,
									"w-5 h-5 xl:w-6 xl:h-6 cursor-pointer"
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className="bg-background border-none">
							<p>Delete User</p>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={() =>
									handleViewUserTickets(user.user_id)
								}
							>
								{TicketIcon(
									false,
									"w-5 h-5 xl:w-6 xl:h-6 cursor-pointer"
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent className="bg-background border-none">
							<p>View Tickets</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			{/* {user.tickets.map((ticket) => {
					const ticketObject: Ticket = JSON.parse(
						ticket.ticket_object
					);
					if (!ticketObject) {
						return null;
					}
					return (
						<div key={ticket.ticket_id}>
							{ticketObject.startStation} -{" "}
							{ticketObject.endStation}
						</div>
					);
				})} */}
		</div>
	);
};

export default UserView;
