import { format } from "date-fns";
import React from "react";
import { LineArrowIcon } from "../../Icons";
import { CARD_NAMES, Station, Ticket } from "@/app/types/types";
import getLevelIcon from "@/app/utils/getLevelIcon";
import RippleButton from "../../RippleButton";
import CreditCardType from "credit-card-type";
import getIconFromCard from "@/app/utils/getIconFromCard";

interface TicketProps {
	ticket: Ticket;
	journeyDate?: string;
	handleBack?: () => void;
	[x: string]: any;
}

const Ticket: React.FC<TicketProps> = ({ ticket, ...props }) => {
	return (
		<div
			data-vaul-no-drag
			className="w-full p-2.5 md:p-5 bg-secondary rounded-xl text-foreground hover:bg-accent duration-100 cursor-pointer"
			{...props}
		>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[16px] lg:text-[20px]">
					{format(ticket.departureTime, "HH:mm")}
					{/* 					{getIconFromCard(type, "scale-75")}
					 */}{" "}
				</span>
				<span className="text-[16px] lg:text-[20px]">
					{format(ticket.arrivalTime, "HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(ticket.startLine, "w-7 h-7")}
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
						{getLevelIcon(ticket.endLine, "w-7 h-7")}
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

export const MainTicket: React.FC<TicketProps> = ({
	ticket,
	journeyDate = "",
	onClick,
	...props
}) => {
	return (
		<div
			onClick={onClick}
			data-vaul-no-drag
			className="w-full p-2.5 md:p-5 bg-secondary rounded-xl text-foreground hover:bg-accent duration-100 cursor-pointer"
			{...props}
		>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[16px] lg:text-[20px]">
					{format(new Date(ticket.departureTime), "HH:mm")}
				</span>
				<span className="text-[16px] lg:text-[20px] font-medium opacity-50">
					{format(journeyDate, "d LLL")}
				</span>
				<span className="text-[16px] lg:text-[20px]">
					{format(new Date(ticket.arrivalTime), "HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(ticket.startLine, "w-7 h-7")}
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
						{getLevelIcon(ticket.endLine, "w-7 h-7")}
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

export const ExpandedTicket: React.FC<TicketProps> = ({
	ticket,
	searchReqData,
	handleBuyActiveTicket,
	handleBack,
	...props
}) => {
	const getLine = (index: number) => {
		const line: string = searchReqData.lines[index];

		return line.split("-")[1];
	};
	return (
		<div className="w-full flex flex-col gap-3 text-foreground" {...props}>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.departureTime, "L LLL HH:mm")}
				</span>
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.arrivalTime, "L LLL HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(ticket.startLine, "w-7 h-7")}
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
						{getLevelIcon(ticket.endLine, "w-7 h-7")}
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
			{ticket.price && (
				<div className="flex flex-row justify-between items-center w-full">
					<span className="text-[14px] lg:text-[16px] font-medium px-4 py-1 border-[1px] border-accent rounded-lg bg-secondary">
						{ticket.price.toFixed(2)}€
					</span>
					{/* travel time in minutes */}
					<span className="text-[14px] lg:text-[16px] font-medium">
						Travel Time:{" "}
						{Math.floor(
							(new Date(ticket.arrivalTime).getTime() -
								new Date(ticket.departureTime).getTime()) /
								60000
						)}
						m
					</span>
				</div>
			)}
			<RippleButton
				style="gradient"
				onClick={handleBuyActiveTicket}
				className="w-full"
				tabIndex={4}
			>
				Buy Ticket
			</RippleButton>
			<RippleButton
				onClick={handleBack}
				style="outlined"
				tabIndex={4}
				className="w-full"
			>
				Go Back
			</RippleButton>
			<div className="flex flex-col gap-16 mt-5">
				{searchReqData &&
					"path" in searchReqData &&
					"lines" in searchReqData &&
					searchReqData.fullPath.map(
						(station: Station, index: number) => (
							<div key={index} className="relative">
								<div
									key={index}
									className="flex flex-row gap-5 items-center h-5"
								>
									{ticket.times[index] && (
										<span
											key={`${index}-time`}
											className="text-[16px] lg:text-[18px] tabular-nums w-[60px] text-center font-medium"
										>
											{format(
												new Date(ticket.times[index]),
												"HH:mm"
											)}
										</span>
									)}
									<div className="border-foreground border bg-background w-3 h-3 rounded-full"></div>
									{searchReqData.path[index] && (
										<span
											key={`${index}-station`}
											className=" leading-none text-[18px] lg:text-[20px] font-medium"
										>
											{station.label}
										</span>
									)}
								</div>
								{index !==
									searchReqData.fullPath.length - 1 && (
									<div
										key={`${index}-lines`}
										className="absolute left-[85px] top-[14px]"
									>
										<p className=" absolute top-1/2 -translate-y-1/2 left-5 opacity-50 text-[14px] whitespace-nowrap">
											Line {getLine(index)}
										</p>
										<svg
											width="1"
											height="77"
											viewBox="0 0 1 77"
											className="h-[75px]"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M0.5 76.5V1"
												className="stroke-foreground"
												strokeLinecap="round"
												strokeDasharray="5 5"
											/>
										</svg>
									</div>
								)}
							</div>
						)
					)}
			</div>
		</div>
	);
};

export const BuyTicket = ({ ticket, ...props }: { ticket: Ticket }) => {
	return (
		<div
			className="w-full p-5 bg-secondary rounded-xl flex flex-col gap-3 text-foreground"
			{...props}
		>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.departureTime, "L LLL HH:mm")}
				</span>
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.arrivalTime, "L LLL HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(ticket.startLine, "w-7 h-7")}
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
						{getLevelIcon(ticket.endLine, "w-7 h-7")}
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
			{ticket.price && (
				<div className="flex flex-row justify-between items-end w-full">
					<span className="text-[14px] lg:text-[16px] font-medium px-4 py-1 border-[1px] border-accent rounded-lg bg-secondary">
						{ticket.price.toFixed(2)}€
					</span>

					<span className="text-[14px] lg:text-[16px] font-medium">
						Travel Time:{" "}
						{Math.floor(
							(new Date(ticket.arrivalTime).getTime() -
								new Date(ticket.departureTime).getTime()) /
								60000
						)}
						m
					</span>
				</div>
			)}
		</div>
	);
};

export const AdminViewTicket: React.FC<TicketProps> = ({
	ticket,
	searchReqData,
	handleDeleteTicket,
	handleBack,
	...props
}) => {
	const getLine = (index: number) => {
		const line: string = searchReqData.lines[index];

		return line.split("-")[1];
	};
	return (
		<div className="w-full flex flex-col gap-3 text-foreground" {...props}>
			<div className="flex flex-row justify-between items-center w-full">
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.departureTime, "L LLL HH:mm")}
				</span>
				<span className="text-[14px] lg:text-[16px]">
					{format(ticket.arrivalTime, "L LLL HH:mm")}
				</span>
			</div>
			<div className="flex flex-row justify-between items-center">
				<div className="flex flex-row gap-3 items-center">
					<div className="w-7 h-7  grid place-content-center">
						{getLevelIcon(ticket.startLine, "w-7 h-7")}
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
						{getLevelIcon(ticket.endLine, "w-7 h-7")}
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
			{ticket.price && (
				<div className="flex flex-row justify-between items-center w-full">
					<span className="text-[14px] lg:text-[16px] font-medium px-4 py-1 border-[1px] border-accent rounded-lg bg-secondary">
						{ticket.price.toFixed(2)}€
					</span>
					{/* travel time in minutes */}
					<span className="text-[14px] lg:text-[16px] font-medium">
						Travel Time:{" "}
						{Math.floor(
							(new Date(ticket.arrivalTime).getTime() -
								new Date(ticket.departureTime).getTime()) /
								60000
						)}
						m
					</span>
				</div>
			)}
			<RippleButton
				style="gradient"
				onClick={handleDeleteTicket}
				className="w-full"
				tabIndex={4}
			>
				Delete Ticket
			</RippleButton>
			<RippleButton
				onClick={handleBack}
				style="outlined"
				tabIndex={4}
				className="w-full"
			>
				Go Back
			</RippleButton>
			<div className="flex flex-col gap-16 mt-5">
				{searchReqData &&
					"path" in searchReqData &&
					"lines" in searchReqData &&
					searchReqData.fullPath.map(
						(station: Station, index: number) => (
							<div key={index} className="relative">
								<div
									key={index}
									className="flex flex-row gap-5 items-center h-5"
								>
									{ticket.times[index] && (
										<span
											key={`${index}-time`}
											className="text-[16px] lg:text-[18px] tabular-nums w-[60px] text-center font-medium"
										>
											{format(
												new Date(ticket.times[index]),
												"HH:mm"
											)}
										</span>
									)}
									<div className="border-foreground border bg-background w-3 h-3 rounded-full"></div>
									{searchReqData.path[index] && (
										<span
											key={`${index}-station`}
											className=" leading-none text-[18px] lg:text-[20px] font-medium"
										>
											{station.label}
										</span>
									)}
								</div>
								{index !==
									searchReqData.fullPath.length - 1 && (
									<div
										key={`${index}-lines`}
										className="absolute left-[85px] top-[14px]"
									>
										<p className=" absolute top-1/2 -translate-y-1/2 left-5 opacity-50 text-[14px] whitespace-nowrap">
											Line {getLine(index)}
										</p>
										<svg
											width="1"
											height="77"
											viewBox="0 0 1 77"
											className="h-[75px]"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M0.5 76.5V1"
												className="stroke-foreground"
												strokeLinecap="round"
												strokeDasharray="5 5"
											/>
										</svg>
									</div>
								)}
							</div>
						)
					)}
			</div>
		</div>
	);
};
