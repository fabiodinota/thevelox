import React, { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { ArrowIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import Ticket, { ExpandedTicket } from "./Ticket";
import { ISearchReqData, Ticket as TicketType } from "@/app/types/types";
import { motion } from "framer-motion";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";

interface DrawerComponentProps {
	searching: boolean;
	searchReqData: ISearchReqData | {};
	snap: number | string | null;
	setSnap: React.Dispatch<React.SetStateAction<number | string | null>>;
	loadMoreTickets: () => void;
	showTicketLimit: number;
	isLg: boolean;
	level: number;
	setLevel: React.Dispatch<React.SetStateAction<number>>;
	setSlideDirection: React.Dispatch<React.SetStateAction<string>>;
}

const DrawerComponent = ({
	searching,
	searchReqData,
	snap,
	setSnap,
	loadMoreTickets,
	showTicketLimit,
	isLg,
	level,
	setLevel,
	setSlideDirection,
}: DrawerComponentProps) => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [stage, setStage] = useState<
		"browseTicketsStage" | "moreInfoTicketStage" | "buyTicketStage"
	>("browseTicketsStage");
	const [activeTicket, setActiveTicket] = useState<TicketType>();

	const minMax = {
		min: 0,
		max: 2,
	};

	const decrease = () => {
		setSlideDirection("left");
		if (level > minMax.min) {
			setLevel((prevLevel) => prevLevel - 1);
		} else {
			setLevel(minMax.max);
		}
	};

	const increase = () => {
		setSlideDirection("right");
		if (level < minMax.max) {
			setLevel((prevLevel) => prevLevel + 1);
		} else {
			setLevel(minMax.min);
		}
	};

	useEffect(() => {
		if (!searching) {
			setStage("browseTicketsStage");
			setActiveTicket(undefined);
		}
	}, [searching]);

	return (
		<Drawer.Root
			shouldScaleBackground
			open={searching || drawerOpen}
			dismissible={false}
			direction={isLg ? "bottom" : "left"}
			snapPoints={isLg ? ["140px", 0.4, 1] : [0, "540px"]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
			modal={false}
			onOpenChange={(open) => {
				setDrawerOpen(open);
			}}
		>
			<Drawer.Portal>
				<Drawer.Content
					className={`flex flex-col rounded-t-[30px] lg:rounded-r-[30px] focus-visible:!outline-none max-h-[100%] h-full ${
						isLg
							? snap === 1
								? "max-h-full w-full"
								: snap === 0.4
								? "max-h-[40%] w-full"
								: "max-h-[140px] w-full"
							: `w-[540px] !pt-[310px] h-full`
					} py-[40px] lg:py-5 duration-300 bg-background fixed right-0 top-0 z-[90] shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]`}
				>
					<div className="absolute right-1/2 translate-x-1/2 lg:translate-x-0 top-5 lg:-right-[60px] lg:rotate-90 lg:-translate-y-1/2 lg:top-1/2 px-5 lg:py-10 cursor-pointer">
						<div className="w-12 h-1 flex-shrink-0 rounded-full bg-zinc-300" />
					</div>
					<div
						className={`p-5 pt-0 rounded-t-[20px]  flex-1 w-full h-full overflow-scroll pb-20 lg:pb-0 noscrollbar  duration-100 ${
							snap === "140px" ? "opacity-0" : "opacity-100"
						}`}
					>
						<div className={`flex flex-row gap-2.5 w-full`}>
							<RippleButton
								onClick={decrease}
								type="button"
								style="nofill"
								className="w-full !flex-shrink bg-secondary !text-foreground"
								speed="medium"
								data-vaul-no-drag
							>
								{ArrowIcon(false, "w-5 h-5")}
								Previous Level
							</RippleButton>
							<RippleButton
								onClick={increase}
								type="button"
								style="nofill"
								className="w-full !flex-shrink bg-secondary !text-foreground"
								speed="medium"
							>
								Next Level
								{ArrowIcon(false, "w-5 h-5 rotate-180")}
							</RippleButton>
						</div>
						<AnimatePresenceProvider mode="wait">
							{stage === "browseTicketsStage" && (
								<motion.div
									initial={{
										x: "-100%",
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1,
										transition: {
											duration: 0.5,
										},
									}}
									exit={{
										x: "100%",
										opacity: 0,
										transition: {
											duration: 0.5,
										},
									}}
								>
									<div className="flex flex-col gap-2.5 md:gap-5 w-full mt-2.5 md:mt-5">
										{searchReqData &&
											"tickets" in searchReqData &&
											searchReqData.tickets.map(
												(ticket, index) => {
													if (index > showTicketLimit)
														return;
													return (
														<Ticket
															key={index}
															ticket={ticket}
															onClick={() => {
																setActiveTicket(
																	ticket
																);
																setStage(
																	"moreInfoTicketStage"
																);
															}}
														/>
													);
												}
											)}
										{searchReqData &&
										"tickets" in searchReqData &&
										searchReqData.tickets.length >
											showTicketLimit ? (
											<RippleButton
												onClick={loadMoreTickets}
												type="button"
												style="gradient"
												className="w-full !flex-shrink"
												speed="medium"
											>
												Load More
											</RippleButton>
										) : (
											<p>No more tickets available</p>
										)}
									</div>
								</motion.div>
							)}
							{stage === "moreInfoTicketStage" && (
								<motion.div
									initial={{
										x: "-100%",
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1,
										transition: {
											duration: 0.5,
										},
									}}
									exit={{
										x: "100%",
										opacity: 0,
										transition: {
											duration: 0.5,
										},
									}}
								>
									<div className="flex flex-col gap-2.5 md:gap-5 w-full mt-2.5 md:mt-5">
										{activeTicket && searchReqData && (
											<ExpandedTicket
												ticket={activeTicket}
												onClick={() => {
													setStage("buyTicketStage");
												}}
												searchReqData={searchReqData}
											/>
										)}
									</div>
								</motion.div>
							)}
							{stage === "buyTicketStage" && (
								<motion.div
									initial={{
										x: "-100%",
										opacity: 0,
									}}
									animate={{
										x: 0,
										opacity: 1,
										transition: {
											duration: 0.5,
										},
									}}
									exit={{
										x: "100%",
										opacity: 0,
										transition: {
											duration: 0.5,
										},
									}}
								>
									<div className="flex flex-col gap-2.5 md:gap-5 w-full mt-2.5 md:mt-5">
										<p
											onClick={() =>
												setStage("browseTicketsStage")
											}
										>
											Buy Ticket
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresenceProvider>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

export default DrawerComponent;
