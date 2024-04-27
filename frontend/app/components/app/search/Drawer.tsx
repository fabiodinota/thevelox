import React, { useState } from "react";
import { Drawer } from "vaul";
import { ArrowIcon } from "../../Icons";
import RippleButton from "../../RippleButton";
import useGetLevelIcon from "@/app/utils/useGetLevelIcon";
import Ticket from "./Ticket";
import { ISearchReqData } from "@/app/types/types";

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
			{searching && !isLg && (
				<Drawer.Trigger>
					<div
						onClick={() => {
							setSnap(isLg ? 0.4 : "540px");
						}}
						className={`relative ${
							snap === 0
								? "left-5 opacity-100"
								: "left-[560px] opacity-0"
						} duration-300  top-1/2 -translate-y-1/2  z-50 px-2.5`}
					>
						{ArrowIcon(false, "rotate-180")}
					</div>
				</Drawer.Trigger>
			)}
			<Drawer.Portal>
				<Drawer.Content
					className={`flex flex-col rounded-t-[30px] lg:rounded-r-[30px] focus-visible:!outline-none max-h-[100%] h-full ${
						isLg
							? snap === 1
								? "max-h-full w-full"
								: snap === 0.4
								? "max-h-[40%] w-full"
								: "max-h-[140px] w-full"
							: `w-[540px] !pt-[310px]`
					} py-[40px] lg:py-5 duration-300 bg-background fixed right-0 top-0 z-[90] shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]`}
				>
					<div className="absolute left-1/2 -translate-x-1/2 top-5 w-12 h-1 block lg:hidden flex-shrink-0 rounded-full bg-zinc-300" />
					<div className="p-5 pt-0 rounded-t-[20px]  flex-1 w-full h-full overflow-scroll pb-20 noscrollbar">
						<div className="w-full overflow-hidden rounded-[20px]">
							<div className="flex flex-row gap-2.5 w-full">
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
							<div>
								<div className="flex flex-col gap-5 w-full mt-5">
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
														handleGetLevelIcon={useGetLevelIcon(
															level,
															"w-7 h-7"
														)}
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
							</div>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
};

export default DrawerComponent;
