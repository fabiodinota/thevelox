import { Ticket } from "@/app/types/types";
import React from "react";
import { xIcon } from "../../Icons";

interface ActiveTickerHeaderProps {
	activeTicket: Ticket | undefined;
	setStage: React.Dispatch<
		React.SetStateAction<
			"browseTicketsStage" | "moreInfoTicketStage" | "buyTicketStage"
		>
	>;
}

const ActiveTicketHeader = ({
	activeTicket,
	setStage,
}: ActiveTickerHeaderProps) => {
	return (
		<div
			className={
				" w-full max-w-full lg:max-w-[500px] flex flex-row items-center gap-5 px-5 py-4 rounded-[20px] bg-background  shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07] "
			}
		>
			<span
				onClick={() => setStage("browseTicketsStage")}
				className="cursor-pointer"
			>
				{xIcon({ fill: "foreground", className: "scale-[1.40]" })}
			</span>
			<span className="text-[18px]">Ticket</span>
		</div>
	);
};

export default ActiveTicketHeader;
