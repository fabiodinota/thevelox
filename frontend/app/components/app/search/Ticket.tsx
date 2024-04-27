import { format } from "date-fns";
import React from "react";
import { LineArrowIcon } from "../../Icons";
import { Ticket } from "@/app/types/types";

interface TicketProps {
	ticket: Ticket;
	handleGetLevelIcon: (level: number, className: string) => React.ReactNode;
	[x: string]: any;
}

const Ticket: React.FC<TicketProps> = ({
	ticket,
	handleGetLevelIcon,
	...props
}) => {
	return (
		<div
			data-vaul-no-drag
			className="w-full p-2.5 md:p-5 bg-secondary rounded-xl text-foreground hover:bg-accent duration-100 cursor-pointer"
			{...props}
		>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[16px] lg:text-[20px]">
					{format(ticket.departureTime, "HH:mm")}
				</span>
				<span className="text-[16px] lg:text-[20px]">
					{format(ticket.arrivalTime, "HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{handleGetLevelIcon(ticket.startLevel, "w-7 h-7")}
					</div>
					<div className="flex flex-col items-start">
						<span className="text-[16px] lg:text-[20px] font-medium">
							{ticket.startStation}
						</span>
						<span className="opacity-50 text-[14px] lg:text-[16px] font-regular">
							Level {ticket.startLevel}
						</span>
					</div>
				</div>
				{LineArrowIcon("w-6 h-6")}
				<div className="flex flex-row-reverse gap-3 items-center">
					<div className="w-7 h-7 grid place-content-center">
						{handleGetLevelIcon(ticket.endLevel, "w-7 h-7")}
					</div>
					<div className="flex flex-col items-end">
						<span className="text-[16px] lg:text-[20px] text-end font-medium">
							{ticket.endStation}
						</span>

						<span className="opacity-50 text-[14px] lg:text-[16px] font-regular">
							Level {ticket.endLevel}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Ticket;
