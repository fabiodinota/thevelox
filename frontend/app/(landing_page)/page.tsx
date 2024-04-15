"use client";

import Image from "next/image";
import Link from "next/link";

import { easeOut, motion } from "framer-motion";

import { HeroQuickBook } from "../components/HeroQuickBook";
import CorePrinciplesSection from "../components/CorePrinciplesSection";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../components/ui/accordion";
import HeroBackground from "@/public/hero_background.webp";

import dynamic from "next/dynamic";
import { useState } from "react";
import { OnProgressProps } from "react-player/base";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
	const customease = [0.05, 0.58, 0.57, 0.96];

	const [played, setPlayed] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	console.log(played);

	const handlePause = () => {
		if (isPlaying === false) {
			setIsPlaying(true);
		} else if (isPlaying === true) {
			setIsPlaying(false);
		}
	};

	return (
		<div className="overflow-hidden">
			<div className="w-full min-h-[600px] h-[600px] sm:h-[650px] md:h-[50vh] max-h-[700px] relative flex justify-center items-center flex-col px-5 xl:px-10">
				<motion.h1
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, ease: customease, delay: 0.1 }}
					className="relative top-[230px] sm:top-[200px] md:top-[250px] xl:top-[230px] text-[10vw] sm:text-[60px] md:text-[70px] text-left max-w-[1400px] w-full font-bold text-white leading-snug whitespace-pre-wrap z-10"
				>
					Book the <br className="md:hidden block" />
					best & <br className="hidden md:block" />
					cheapest <br className="md:hidden block" />
					tickets around!
				</motion.h1>
				<HeroQuickBook className="relative top-[250px] sm:top-[220px] md:top-[270px] xl:top-[250px] shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07] z-10" />
				<motion.div
					initial={{ y: -100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, ease: customease, delay: 0 }}
					className="w-full min-h-[600px] h-[600px] sm:h-[650px] md:h-[50vh] max-h-[700px] xl:rounded-b-[75px] overflow-hidden absolute top-0 left-0 z-0"
				>
					<div className="w-full h-full bg-hero-gradient relative top-0 left-0 z-50"></div>
					<Image
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 60vw"
						src={"https://storage.thevelox.co/background_hero.webp"}
						priority
						fill
						className="object-cover"
						alt="background_hero"
					/>
				</motion.div>
			</div>
			<div className="w-full h-[250px] md:h-[300px]"></div>
			<div className="flex flex-col justify-center items-center py-10 px-5 md:px-10">
				<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-5">
					<motion.h1
						initial={{ y: -100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.4,
							ease: customease,
							delay: 0.3,
						}}
						className="text-foreground text-[28px] sm:text-[32px] md:text-[40px] font-bold w-full text-left"
					>
						The Velox, Electricity In Its Veins.
					</motion.h1>
					<motion.div
						initial={{ y: -100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.4,
							ease: customease,
							delay: 0.4,
						}}
						className="relative rounded-[20px] overflow-hidden bg-secondary w-full aspect-video grid place-content-center group"
					>
						{/* <div className="absolute z-30 inset-0 h-full w-full flex justify-center items-center ">
                            <motion.div initial={{ scale: 1 }} whileTap={{ scale: 0.7 }} transition={{ duration: 0.2, type: "spring" }} onClick={handlePause} className="opacity-0 group-hover:opacity-100 duration-150">
                                {isPlaying ? (
                                    <svg className="w-7 h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19.0432 26.4013C18.2282 26.4013 17.5264 26.1069 16.9375 25.518C16.3487 24.9292 16.0543 24.2273 16.0543 23.4124V3.48598C16.0543 2.67106 16.3487 1.96918 16.9375 1.38036C17.5264 0.7915 18.2282 0.49707 19.0432 0.49707H23.5266C24.3416 0.49707 25.0434 0.7915 25.6323 1.38036C26.2211 1.96918 26.5156 2.67106 26.5156 3.48598V23.4124C26.5156 24.2273 26.2211 24.9292 25.6323 25.518C25.0434 26.1069 24.3416 26.4013 23.5266 26.4013H19.0432ZM3.60024 26.4013C2.78532 26.4013 2.08344 26.1069 1.49462 25.518C0.905757 24.9292 0.611328 24.2273 0.611328 23.4124V3.48598C0.611328 2.67106 0.905757 1.96918 1.49462 1.38036C2.08344 0.7915 2.78532 0.49707 3.60024 0.49707H8.08373C8.89866 0.49707 9.60053 0.7915 10.1894 1.38036C10.7782 1.96918 11.0726 2.67106 11.0726 3.48598V23.4124C11.0726 24.2273 10.7782 24.9292 10.1894 25.518C9.60053 26.1069 8.89866 26.4013 8.08373 26.4013H3.60024ZM19.0432 23.4124H23.5266V3.48598H19.0432V23.4124ZM3.60024 23.4124H8.08373V3.48598H3.60024V23.4124Z" fill="#1C1B1F"/>
                                    </svg>                                    
                                ) : (
                                    

                                )}
                            </motion.div>
                        </div> */}
						<ReactPlayer
							onProgress={(e) => setPlayed(e.played)}
							playing={isPlaying}
							loop
							url={
								"https://storage.thevelox.co/moodboard_video_fabiodinota.mp4"
							}
							light={
								<img
									src="https://storage.thevelox.co/0067.png"
									alt="Thumbnail"
									className="w-full h-full object-cover aspect-video relative"
								/>
							}
							playIcon={
								<svg
									className="w-7 h-7 relative z-10"
									viewBox="0 0 19 23"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0.9375 20.2272V2.51589C0.9375 1.98964 1.11762 1.5579 1.47785 1.22068C1.83806 0.883454 2.25829 0.714844 2.73855 0.714844C2.89182 0.714844 3.0502 0.736566 3.21369 0.780005C3.37719 0.823445 3.53559 0.888586 3.68889 0.975432L17.6296 9.85026C17.9029 10.0367 18.1079 10.2603 18.2446 10.5208C18.3812 10.7814 18.4496 11.065 18.4496 11.3715C18.4496 11.6781 18.3812 11.9617 18.2446 12.2222C18.1079 12.4828 17.9029 12.7063 17.6296 12.8928L3.68889 21.7676C3.53559 21.8545 3.37719 21.9196 3.21369 21.9631C3.0502 22.0065 2.89182 22.0282 2.73855 22.0282C2.25829 22.0282 1.83806 21.8596 1.47785 21.5224C1.11762 21.1852 0.9375 20.7534 0.9375 20.2272ZM3.92641 18.0469L14.4261 11.3715L3.92641 4.69619V18.0469Z"
										fill="#1C1B1F"
									/>
								</svg>
							}
							controls
							width={"100%"}
							height={"100%"}
							fallback={
								<div className="w-full h-full bg-gray-700 animate-pulse" />
							}
						/>
					</motion.div>
					<Link
						className="bg-gradient text-white hover:text-white/70 duration-150 rounded-xl max-w-[400px] w-full h-[60px] grid place-content-center "
						href="/signup"
					>
						<span className="text-[16px] md:text-[18px] font-medium">
							Launch App
						</span>
					</Link>
				</section>

				<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-10 lg:gap-5 mt-[100px]">
					<div className="w-full flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10">
						<div
							data-aos="fade-right"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-ease="ease-out"
							className="w-full flex flex-col gap-2"
						>
							<h1 className="text-foreground text-[22px] sm:text-[26px] md:text-[32px] font-bold w-full text-left">
								The best transport solution to date.
							</h1>
							<p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
								Lorem ipsum dolor sit amet consectetur.
								Habitasse rhoncus quam augue a nam odio massa
								turpis. Ultrices eleifend sapien turpis auctor
								augue ut. Iaculis non sit porttitor at dui
								tellus. Nulla facilisis magna feugiat volutpat.
							</p>
						</div>
						<div
							data-aos="fade-left"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="rounded-[20px] bg-secondary w-full aspect-video grid place-content-center overflow-hidden"
						>
							<img
								src="https://storage.thevelox.co/0476.png"
								alt="Thumbnail"
								className="w-full h-full object-cover aspect-video"
							/>
						</div>
					</div>
					<div className="w-full flex flex-col-reverse lg:flex-row justify-center items-center gap-5 lg:gap-10">
						<div
							data-aos="fade-right"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="rounded-[20px] bg-secondary w-full aspect-video grid place-content-center overflow-hidden"
						>
							<img
								src="https://storage.thevelox.co/0741.png"
								alt="Thumbnail"
								className="w-full h-full object-cover aspect-video"
							/>
						</div>
						<div
							data-aos="fade-left"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-ease="ease-out"
							className="w-full flex flex-col gap-2"
						>
							<h1 className="text-foreground text-[22px] sm:text-[26px] md:text-[32px] font-bold w-full text-left">
								Next-Generation Public Transport Booking App
							</h1>
							<p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
								Lorem ipsum dolor sit amet consectetur.
								Habitasse rhoncus quam augue a nam odio massa
								turpis. Ultrices eleifend sapien turpis auctor
								augue ut. Iaculis non sit porttitor at dui
								tellus. Nulla facilisis magna feugiat volutpat.
							</p>
						</div>
					</div>
				</section>
				<CorePrinciplesSection />
				<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-0 mt-[100px]">
					<h1
						data-aos="fade-right"
						data-aos-duration="600"
						data-aos-once="true"
						data-ease="ease-out"
						className="text-foreground text-[28px] sm:text-[32px] md:text-[40px] font-bold w-full text-left"
					>
						Frequently Asked Questions
					</h1>
					<Accordion
						defaultValue="item-1"
						className="w-full gap-10"
						type="single"
					>
						<AccordionItem
							data-aos="fade-up"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="py-2"
							value="item-1"
						>
							<AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">
								How do I download your app?
							</AccordionTrigger>
							<AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
								Click on the three dots in the top right corner
								of your screen. Scroll down and somewhere at the
								bottom it should say either “Install App” or
								“Add to Home”, click that and the install will
								begin.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem
							data-aos="fade-up"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="py-2"
							value="item-2"
						>
							<AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">
								Can I refund my ticket?
							</AccordionTrigger>
							<AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
								Lorem ipsum dolor sit amet consectetur.
								Habitasse rhoncus quam augue a nam odio massa
								turpis. Ultrices eleifend sapien turpis auctor
								augue ut.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem
							data-aos="fade-up"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="py-2"
							value="item-3"
						>
							<AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">
								Do you require any identification?
							</AccordionTrigger>
							<AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
								Lorem ipsum dolor sit amet consectetur.
								Habitasse rhoncus quam augue a nam odio massa
								turpis. Ultrices eleifend sapien turpis auctor
								augue ut.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem
							data-aos="fade-up"
							data-aos-duration="600"
							data-aos-once="true"
							data-ease="ease-out"
							className="py-2"
							value="item-4"
						>
							<AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">
								Do you store any payment information?
							</AccordionTrigger>
							<AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
								Lorem ipsum dolor sit amet consectetur.
								Habitasse rhoncus quam augue a nam odio massa
								turpis. Ultrices eleifend sapien turpis auctor
								augue ut.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</section>
			</div>
		</div>
	);
}
