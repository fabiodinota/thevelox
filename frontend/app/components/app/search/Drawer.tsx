import React, { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { ArrowIcon, xIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import Ticket, { BuyTicket, ExpandedTicket } from "./Ticket";
import { ISearchReqData, Ticket as TicketType } from "@/app/types/types";
import { AnimatePresence, motion } from "framer-motion";
import AnimatePresenceProvider from "@/app/context/AnimatePresenceProvider";
import SelectPaymentMethod from "./SelectPaymentMethod";
import ActiveTicketHeader from "./ActiveTicketHeader";
import AddPaymentMethod from "./AddPaymentMethod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DrawerComponentProps {
	searching: boolean;
	searchReqData: ISearchReqData | {};
	snap: number | string | null;
	setSnap: React.Dispatch<React.SetStateAction<number | string | null>>;
	loadMoreTickets: () => void;
	showTicketLimit: number;
	isLg: boolean;
	increase: () => void;
	decrease: () => void;
	activeTicket: TicketType | undefined;
	setActiveTicket: React.Dispatch<
		React.SetStateAction<TicketType | undefined>
	>;
}

const DrawerComponent = ({
	searching,
	searchReqData,
	snap,
	setSnap,
	loadMoreTickets,
	showTicketLimit,
	isLg,
	increase,
	decrease,
	activeTicket,
	setActiveTicket,
}: DrawerComponentProps) => {
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [stage, setStage] = useState<
		| "browseTicketsStage"
		| "moreInfoTicketStage"
		| "buyTicketStage"
		| "addPaymentMethodStage"
	>("browseTicketsStage");
	const [activePaymentMethod, setActivePaymentMethod] = useState<
		number | undefined
	>(undefined);

	useEffect(() => {
		if (!searching) {
			setStage("browseTicketsStage");
			setActiveTicket(undefined);
		}
	}, [searching]);

	const handleBuyActiveTicket = () => {
		setStage("buyTicketStage");
	};

	const handleBack = () => {
		setStage("browseTicketsStage");
		setActiveTicket(undefined);
	};

	useEffect(() => {
		if (stage === "buyTicketStage") {
			setSnap(1);
		}
	}, [stage]);

	const router = useRouter();

	const handleBuyTicket = async () => {
		console.log("Buying ticket", activeTicket, activePaymentMethod);
		axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/ticket/buyTicket`,
				{
					ticket: activeTicket,
					payment_method_id: activePaymentMethod,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				toast.success(
					"Ticket bought successfully, you can view it in the Home page"
				);
				router.push("/app/home");
			})
			.catch((err) => {
				toast.error(err.response.data.message || "Unknown error");
			});
	};

	return (
		<>
			<Drawer.Root
				shouldScaleBackground
				open={searching || drawerOpen}
				dismissible={false}
				direction={isLg ? "bottom" : "left"}
				snapPoints={isLg ? ["140px", 0.4, 1] : [0, "520px"]}
				activeSnapPoint={snap}
				setActiveSnapPoint={setSnap}
				modal={false}
				onOpenChange={(open) => {
					setDrawerOpen(open);
				}}
			>
				<Drawer.Portal>
					<Drawer.Content
						className={`flex flex-col rounded-t-[30px] lg:rounded-[30px] focus-visible:!outline-none max-h-[100%] h-full ${
							isLg
								? snap === 1
									? "max-h-full w-full"
									: snap === 0.4
									? "max-h-[40%] w-full"
									: "max-h-[140px] w-full"
								: `w-[500px] !top-[380px] lg:h-[calc(100%-400px)]`
						} py-[20px] lg:py-5 duration-300 bg-background fixed right-0 top-0 z-[90] after:opacity-0 shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]`}
					>
						<Drawer.Handle className="w-12 h-1 flex-shrink-0 rounded-full bg-zinc-300 mr-auto lg:!top-1/2 lg:-translate-y-1/2 lg:!-right-10 lg:!rotate-90 lg:!mr-0" />
						<div
							data-vaul-no-drag
							className={`p-5 mt-5 lg:mt-0 pt-0 rounded-t-[20px]  flex-1 w-full h-full overflow-scroll pb-24 lg:pb-0 noscrollbar  duration-100 ${
								snap === "140px" ? "opacity-0" : "opacity-100"
							}`}
						>
							{stage === "browseTicketsStage" && (
								<div className="flex flex-col gap-2.5 md:gap-5 w-full ">
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
							)}
							{stage === "moreInfoTicketStage" && (
								<div>
									<div className="flex flex-col gap-2.5 md:gap-5 w-full ">
										{activeTicket && searchReqData && (
											<ExpandedTicket
												key={
													activeTicket.startStation +
													activeTicket.endStation
												}
												ticket={activeTicket}
												handleBuyActiveTicket={
													handleBuyActiveTicket
												}
												searchReqData={searchReqData}
												handleBack={handleBack}
											/>
										)}
									</div>
								</div>
							)}
							{stage === "buyTicketStage" && activeTicket && (
								<div>
									<div className="flex flex-col gap-2.5 md:gap-5 w-full ">
										<Drawer.Title className="flex flex-row justify-between items-center">
											<span className="text-[20px] lg:text-[24px] font-bold">
												Buy Ticket
											</span>
											<span
												onClick={handleBack}
												className="flex flex-row items-center gap-3 text-[16px] font-medium cursor-pointer"
											>
												Back
												{xIcon({
													fill: "foreground",
													className: "scale-[1.40]",
												})}
											</span>
										</Drawer.Title>
										<BuyTicket ticket={activeTicket} />
										<SelectPaymentMethod
											setStage={setStage}
											setActivePaymentMethod={
												setActivePaymentMethod
											}
											activePaymentMethod={
												activePaymentMethod
											}
										/>
										<RippleButton
											onClick={handleBuyTicket}
											style="gradient"
											speed="medium"
											className=""
										>
											Buy Ticket
										</RippleButton>
									</div>
								</div>
							)}
							{stage === "addPaymentMethodStage" &&
								activeTicket && (
									<div>
										<div className="flex flex-col gap-2.5 md:gap-5 w-full ">
											<Drawer.Title className="flex flex-row justify-between items-center">
												<span className="text-[20px] lg:text-[24px] font-bold">
													Add Payment Method
												</span>
											</Drawer.Title>
											<AddPaymentMethod
												setStage={setStage}
											/>
										</div>
									</div>
								)}
						</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	);
};

export default DrawerComponent;
