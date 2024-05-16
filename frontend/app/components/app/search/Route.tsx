import React from "react";
import { LineArrowIcon } from "../../Icons";
import { ParsedFavoriteRoute, Station } from "@/app/types/types";
import getLevelIcon from "@/app/utils/getLevelIcon";

interface RouteProps {
	startStation: Station;
	endStation: Station;
	route: ParsedFavoriteRoute;
	handleBack?: () => void;
	[x: string]: any;
}

const Route: React.FC<RouteProps> = ({
	startStation,
	endStation,
	route,
	...props
}) => {
	const startLine = route.start_line.split("-")[1];
	const endLine = route.end_line.split("-")[1];

	if (startStation === undefined || endStation === undefined) {
		return;
	}
	return (
		<div
			data-vaul-no-drag
			className="w-full p-2.5 md:p-5 bg-secondary rounded-xl text-foreground hover:bg-accent duration-100 cursor-pointer"
			{...props}
		>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(Number(startLine), "w-7 h-7")}
					</div>
					<div className="flex flex-col items-start">
						<span className="text-[16px] lg:text-[20px] font-medium">
							{startStation.name}
						</span>
						<span className="opacity-50 text-[14px] lg:text-[16px] font-regular">
							Level {startStation.level}
						</span>
					</div>
				</div>
				{LineArrowIcon("w-6 h-6")}
				<div className="flex flex-row-reverse gap-3 items-center">
					<div className="w-7 h-7 grid place-content-center">
						{getLevelIcon(Number(endLine), "w-7 h-7")}
					</div>
					<div className="flex flex-col items-end">
						<span className="text-[16px] lg:text-[20px] text-end font-medium">
							{endStation.name}
						</span>

						<span className="opacity-50 text-[14px] lg:text-[16px] font-regular">
							Level {endStation.level}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Route;
