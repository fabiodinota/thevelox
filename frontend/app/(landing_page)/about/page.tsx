"use client";

import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";

const page = () => {
	const firstRef = useRef(null);
	const secondRef = useRef(null);
	const thirdRef = useRef(null);

	const first = useScroll({
		target: firstRef,
		offset: ["50% 50%", "20% 20%"],
	});
	const second = useScroll({
		target: secondRef,
		offset: ["50% 50%", "20% 20%"],
	});
	const third = useScroll({
		target: thirdRef,
		offset: ["50% 50%", "20% 20%"],
	});

	return (
		<div className="flex justify-center items-center w-full px-5 xl:px-10 flex-col py-10">
			<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-10 lg:gap-5 mt-[120px] xl:mt-[100px]">
				<div className="w-full flex flex-col-reverse xl:flex-row justify-center items-center gap-5 xl:gap-10">
					<div
						data-aos="fade-down"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						data-aos-delay="100"
						className="rounded-[20px] overflow-hidden bg-secondary w-full aspect-video grid place-content-center"
					>
						<img
							src="https://storage.thevelox.co/booking.png"
							alt="Thumbnail"
							className="w-full h-full object-cover aspect-video"
						/>
					</div>
					<div
						data-aos="fade-down"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						data-aos-delay="100"
						className="w-full flex flex-col gap-2"
					>
						<h1 className="text-foreground text-[28px] sm:text-[32px] md:text-[42px] font-bold w-full text-left">
							Next-Generation Public Transport Booking App
						</h1>
						<p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
							Our next-generation booking app for The Velox
							transforms the way you travel by integrating
							cutting-edge technology with user-friendly design.
							The app allows for seamless ticket purchasing,
							real-time updates, and customizable travel
							notifications, making it indispensable for daily
							commuters and occasional visitors alike. With
							features designed to enhance user experience and
							streamline public transport logistics, our app
							ensures that booking a ride on The Velox is as
							effortless as it is reliable.
						</p>
					</div>
				</div>
			</section>
			<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-10 mt-[100px]">
				<h1
					data-aos="fade-down"
					data-aos-duration="600"
					data-aos-once="true"
					data-aos-easing="ease-out"
					data-aos-delay="200"
					className="text-foreground text-[28px] sm:text-[32px] md:text-[40px] font-bold w-full text-left"
				>
					How we came to be
				</h1>
				<div className="w-full flex flex-col gap-10 justify-center items-start">
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						data-aos-delay="400"
						ref={firstRef}
					>
						<span className="text-gradient text-[24px] md:text-[36px] font-medium leading-tight">
							2020
						</span>
						<h3 className="text-[20px] md:text-[28px] font-bold">
							Climate Crisis Recognition
						</h3>
						<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
							The year 2020 marked a turning point as devastating
							climate events underscored the critical need for
							sustainable practices. Governments and industries
							acknowledged the imperative shift required to
							protect our planet.
						</p>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						data-aos-delay="500"
						className="relative h-32 w-1 grid place-content-center"
					>
						<motion.div
							style={{
								scaleY: first.scrollYProgress,
								originY: "top",
							}}
							className="absolute top-0 left-[50%] w-[2px] h-full bg-[#E94537] rotate-180 opacity-100 z-10 block"
						></motion.div>
						<div className="absolute top-0 left-[50%] w-[2px] h-full bg-foreground opacity-30 z-0 block"></div>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						ref={secondRef}
					>
						<span className="text-gradient text-[24px] md:text-[36px] font-medium leading-tight">
							2021
						</span>
						<h3 className="text-[20px] md:text-[28px] font-bold">
							Sustainable Transit R&D{" "}
						</h3>
						<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
							In response to the escalating environmental crisis,
							2021 saw the launch of intensive research and
							development in sustainable transportation. This
							global collaboration aimed to dramatically decrease
							carbon emissions and enhance efficiency.
						</p>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						className="relative h-32 w-1 grid place-content-center"
					>
						<motion.div
							style={{
								scaleY: second.scrollYProgress,
								originY: "top",
							}}
							className="absolute top-0 left-[50%] w-[2px] h-full bg-[#E94537] rotate-180 opacity-100 z-10 block"
						></motion.div>
						<div className="absolute top-0 left-[50%] w-[2px] h-full bg-foreground opacity-30 z-0 block"></div>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						ref={thirdRef}
					>
						<span className="text-gradient text-[24px] md:text-[36px] font-medium leading-tight">
							2023
						</span>
						<h3 className="text-[20px] md:text-[28px] font-bold">
							Birth Of New Atlantis
						</h3>
						<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
							October 2023 witnessed the groundbreaking
							inauguration of New Atlantis, an underwater city
							designed for complete sustainability. This project
							integrated the latest technologies with
							environmental science to create a blueprint for
							future urban living.
						</p>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
						className="relative h-32 w-1 grid place-content-center"
					>
						<motion.div
							style={{
								scaleY: third.scrollYProgress,
								originY: "top",
							}}
							className="absolute top-0 left-[50%] w-[2px] h-full bg-[#E94537] rotate-180 opacity-100 z-10 block"
						></motion.div>
						<div className="absolute top-0 left-[50%] w-[2px] h-full bg-foreground opacity-30 z-0 block"></div>
					</div>
					<div
						data-aos="fade-up"
						data-aos-duration="600"
						data-aos-once="true"
						data-aos-easing="ease-out"
					>
						<span className="text-gradient text-[24px] md:text-[36px] font-medium leading-tight">
							2024
						</span>
						<h3 className="text-[20px] md:text-[28px] font-bold">
							Mass Construction Sustainable Trains
						</h3>
						<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
							Infrastructure The construction of New Atlantis’s
							eco-friendly infrastructure began in 2024, focusing
							on carbon-neutral trains powered by renewable
							energies. This initiative set new standards in
							sustainable urban development.
						</p>
					</div>
				</div>
			</section>
			<section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-10 mt-[100px]">
				<h1
					data-aos="fade-down"
					data-aos-duration="600"
					data-aos-once="true"
					data-aos-easing="ease-out"
					className="text-foreground text-[28px] sm:text-[32px] md:text-[40px] font-bold w-full text-left"
				>
					Our Core Principles
				</h1>
				<div className="w-full h-full grid place-content-center grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4">
					<div className="bg-secondary rounded-xl overflow-hidden w-full h-full flex flex-col justify-center items-start px-5 md:px-10">
						<div
							data-aos="fade-down"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-easing="ease-out"
							className="relative z-10 flex flex-col gap-5 sm:gap-10 h-full max-w-full xl:max-w-[700px] py-5 md:py-10 justify-center items-start"
						>
							<svg
								className="flex-shrink-0 w-[100px] sm:w-[184px] h-[100px] sm:h-[134px]"
								width="184"
								height="134"
								viewBox="0 0 184 134"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M104.501 79.4997C97.5562 79.4997 91.6534 77.0691 86.7923 72.208C81.9312 67.3469 79.5006 61.4441 79.5006 54.4997C79.5006 47.5552 81.9312 41.6525 86.7923 36.7913C91.6534 31.9302 97.5562 29.4997 104.501 29.4997C111.445 29.4997 117.348 31.9302 122.209 36.7913C127.07 41.6525 129.501 47.5552 129.501 54.4997C129.501 61.4441 127.07 67.3469 122.209 72.208C117.348 77.0691 111.445 79.4997 104.501 79.4997ZM37.834 108.666C34.3965 108.666 31.4538 107.442 29.0059 104.994C26.5579 102.547 25.334 99.6038 25.334 96.1663V12.833C25.334 9.39551 26.5579 6.4528 29.0059 4.00488C31.4538 1.55697 34.3965 0.333008 37.834 0.333008H171.167C174.605 0.333008 177.548 1.55697 179.995 4.00488C182.443 6.4528 183.667 9.39551 183.667 12.833V96.1663C183.667 99.6038 182.443 102.547 179.995 104.994C177.548 107.442 174.605 108.666 171.167 108.666H37.834ZM58.5856 94.1681C58.6773 95.2689 59.5627 96.1663 60.6673 96.1663H148.334C149.439 96.1663 150.324 95.2689 150.416 94.1681C150.83 89.1986 152.816 84.9341 156.376 81.3747C159.935 77.8152 164.2 75.8286 169.169 75.4147C170.27 75.323 171.167 74.4376 171.167 73.333V35.6663C171.167 34.5618 170.27 33.6763 169.169 33.5847C164.2 33.1708 159.935 31.1841 156.376 27.6247C152.816 24.0652 150.83 19.8008 150.416 14.8312C150.324 13.7305 149.439 12.833 148.334 12.833H60.6673C59.5627 12.833 58.6773 13.7305 58.5856 14.8312C58.1717 19.8008 56.1851 24.0652 52.6256 27.6247C49.0662 31.1841 44.8017 33.1708 39.8322 33.5847C38.7315 33.6763 37.834 34.5618 37.834 35.6663V73.333C37.834 74.4376 38.7315 75.323 39.8322 75.4147C44.8017 75.8286 49.0662 77.8152 52.6256 81.3747C56.1851 84.9341 58.1717 89.1986 58.5856 94.1681ZM158.667 131.666C158.667 132.771 157.772 133.666 156.667 133.666H12.834C9.39648 133.666 6.45378 132.442 4.00586 129.994C1.55794 127.547 0.333984 124.604 0.333984 121.166V27.333C0.333984 26.2284 1.22941 25.333 2.33398 25.333H10.834C11.9386 25.333 12.834 26.2284 12.834 27.333V119.166C12.834 120.271 13.7294 121.166 14.834 121.166H156.667C157.772 121.166 158.667 122.062 158.667 123.166V131.666Z"
									fill="url(#paint0_linear_239_467)"
								/>
								<defs>
									<linearGradient
										id="paint0_linear_239_467"
										x1="23.2689"
										y1="184.784"
										x2="243.071"
										y2="49.5941"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#E42B2B" />
										<stop
											offset="0.17"
											stopColor="#E42F2C"
										/>
										<stop
											offset="0.35"
											stopColor="#E73B32"
										/>
										<stop
											offset="0.53"
											stopColor="#EB503C"
										/>
										<stop
											offset="0.71"
											stopColor="#F06D4A"
										/>
										<stop
											offset="0.8"
											stopColor="#F47E52"
										/>
									</linearGradient>
								</defs>
							</svg>
							<div className="flex flex-col gap-1 w-full">
								<h1 className="text-[20px] md:text-[28px] font-bold leading-relaxed">
									1. Affordability
								</h1>
								<p className="text-[16px] md:text-[18px] font-light leading-relaxed">
									In New Atlantis, The Velox ensures that
									transportation is economical and inclusive
									for all its residents. Offering low-cost
									fares, it allows everyone to explore the
									city without financial burden. This
									affordability strategy ensures that mobility
									within our underwater city remains
									accessible to every resident and visitor.
								</p>
							</div>
						</div>
					</div>
					<div className="bg-secondary rounded-xl overflow-hidden w-full h-full flex flex-col justify-center items-start px-5 md:px-10">
						<div
							data-aos="fade-down"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-easing="ease-out"
							className="relative z-10 flex flex-col gap-5 sm:gap-10 max-w-full xl:max-w-[700px] py-5 md:py-10 justify-center items-start"
						>
							<svg
								className="flex-shrink-0  w-[100px] sm:w-[184px] h-[100px] sm:h-[174px]"
								width="184"
								height="174"
								viewBox="0 0 184 174"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M65.7332 173.737C64.798 174.17 63.6869 173.821 63.1668 172.931L48.701 148.187C48.4144 147.697 47.9329 147.351 47.3766 147.237L18.5874 141.327C17.5716 141.118 16.8837 140.168 17.0028 139.138L20.2336 111.201C20.2976 110.648 20.1279 110.093 19.7654 109.67L1.45464 88.3074C0.810472 87.5559 0.812933 86.4462 1.46043 85.6975L19.759 64.5399C20.1254 64.1162 20.2974 63.5582 20.233 63.0018L17.0028 35.0704C16.8837 34.0403 17.5716 33.09 18.5874 32.8815L47.3727 26.9719C47.9312 26.8572 48.4143 26.5096 48.7004 26.0164L63.169 1.07714C63.6874 0.183527 64.8012 -0.16817 65.7388 0.265653L91.1608 12.0281C91.6936 12.2746 92.3077 12.2746 92.8405 12.0281L118.272 0.261287C119.206 -0.170704 120.315 0.176056 120.836 1.06295L135.509 26.0262C135.796 26.5136 136.275 26.857 136.828 26.9714L165.417 32.8796C166.431 33.0893 167.118 34.0389 166.999 35.068L163.768 63.0018C163.704 63.5582 163.876 64.1162 164.242 64.5399L182.541 85.6975C183.188 86.4462 183.191 87.5559 182.547 88.3074L164.236 109.67C163.873 110.093 163.704 110.648 163.768 111.201L166.999 139.14C167.118 140.169 166.431 141.119 165.417 141.329L136.825 147.238C136.273 147.352 135.795 147.693 135.509 148.177L120.838 172.945C120.315 173.828 119.209 174.172 118.277 173.741L92.8405 161.972C92.3077 161.725 91.6936 161.725 91.1608 161.972L65.7332 173.737ZM68.7832 156.719C69.3234 157.491 70.3288 157.781 71.197 157.416L91.2359 148.988C91.7255 148.782 92.2769 148.78 92.7685 148.981L113.407 157.424C114.286 157.783 115.297 157.475 115.826 156.686L128.451 137.843C128.724 137.434 129.139 137.141 129.615 137.019L151.585 131.385C152.543 131.14 153.177 130.231 153.078 129.247L150.838 107.034C150.782 106.481 150.959 105.929 151.327 105.512L166.474 88.3075C167.134 87.5581 167.14 86.4367 166.488 85.6803L151.312 68.0678C150.954 67.6521 150.782 67.1075 150.837 66.5615L153.075 44.364C153.176 43.368 152.524 42.4512 151.551 42.2182L129.621 36.97C129.141 36.8552 128.721 36.567 128.44 36.1608L115.421 17.2917C114.884 16.5143 113.877 16.2181 113.005 16.5814L92.7629 25.0157C92.2747 25.2191 91.7259 25.2209 91.2364 25.0207L70.5944 16.5762C69.7152 16.2166 68.7044 16.5249 68.1756 17.3141L55.561 36.1419C55.2811 36.5597 54.8541 36.8567 54.365 36.9737L32.4504 42.2182C31.4769 42.4512 30.8256 43.368 30.926 44.364L33.1644 66.5615C33.2195 67.1075 33.0478 67.6521 32.6896 68.0678L17.5128 85.6803C16.861 86.4367 16.867 87.558 17.5268 88.3075L32.6756 105.514C33.0424 105.93 33.2195 106.48 33.1648 107.033L30.9228 129.639C30.8242 130.634 31.4753 131.548 32.4476 131.781L54.3878 137.032C54.8632 137.146 55.2804 137.429 55.5607 137.83L68.7832 156.719ZM81.6344 113.31C82.4138 114.084 83.6714 114.085 84.4515 113.312L128.839 69.3148C129.652 68.5091 129.624 67.1868 128.778 66.416L122.362 60.5704C121.576 59.8537 120.366 59.8784 119.609 60.6267L84.4859 95.3639C83.6922 96.1489 82.4095 96.1322 81.6365 95.3267L64.6488 77.6237C63.8788 76.8213 62.6021 76.8011 61.8072 77.5788L55.1179 84.1226C54.3202 84.903 54.3155 86.1852 55.1074 86.9715L81.6344 113.31Z"
									fill="white"
								/>
								<path
									d="M65.7332 173.737C64.798 174.17 63.6869 173.821 63.1668 172.931L48.701 148.187C48.4144 147.697 47.9329 147.351 47.3766 147.237L18.5874 141.327C17.5716 141.118 16.8837 140.168 17.0028 139.138L20.2336 111.201C20.2976 110.648 20.1279 110.093 19.7654 109.67L1.45464 88.3074C0.810472 87.5559 0.812933 86.4462 1.46043 85.6975L19.759 64.5399C20.1254 64.1162 20.2974 63.5582 20.233 63.0018L17.0028 35.0704C16.8837 34.0403 17.5716 33.09 18.5874 32.8815L47.3727 26.9719C47.9312 26.8572 48.4143 26.5096 48.7004 26.0164L63.169 1.07714C63.6874 0.183527 64.8012 -0.16817 65.7388 0.265653L91.1608 12.0281C91.6936 12.2746 92.3077 12.2746 92.8405 12.0281L118.272 0.261287C119.206 -0.170704 120.315 0.176056 120.836 1.06295L135.509 26.0262C135.796 26.5136 136.275 26.857 136.828 26.9714L165.417 32.8796C166.431 33.0893 167.118 34.0389 166.999 35.068L163.768 63.0018C163.704 63.5582 163.876 64.1162 164.242 64.5399L182.541 85.6975C183.188 86.4462 183.191 87.5559 182.547 88.3074L164.236 109.67C163.873 110.093 163.704 110.648 163.768 111.201L166.999 139.14C167.118 140.169 166.431 141.119 165.417 141.329L136.825 147.238C136.273 147.352 135.795 147.693 135.509 148.177L120.838 172.945C120.315 173.828 119.209 174.172 118.277 173.741L92.8405 161.972C92.3077 161.725 91.6936 161.725 91.1608 161.972L65.7332 173.737ZM68.7832 156.719C69.3234 157.491 70.3288 157.781 71.197 157.416L91.2359 148.988C91.7255 148.782 92.2769 148.78 92.7685 148.981L113.407 157.424C114.286 157.783 115.297 157.475 115.826 156.686L128.451 137.843C128.724 137.434 129.139 137.141 129.615 137.019L151.585 131.385C152.543 131.14 153.177 130.231 153.078 129.247L150.838 107.034C150.782 106.481 150.959 105.929 151.327 105.512L166.474 88.3075C167.134 87.5581 167.14 86.4367 166.488 85.6803L151.312 68.0678C150.954 67.6521 150.782 67.1075 150.837 66.5615L153.075 44.364C153.176 43.368 152.524 42.4512 151.551 42.2182L129.621 36.97C129.141 36.8552 128.721 36.567 128.44 36.1608L115.421 17.2917C114.884 16.5143 113.877 16.2181 113.005 16.5814L92.7629 25.0157C92.2747 25.2191 91.7259 25.2209 91.2364 25.0207L70.5944 16.5762C69.7152 16.2166 68.7044 16.5249 68.1756 17.3141L55.561 36.1419C55.2811 36.5597 54.8541 36.8567 54.365 36.9737L32.4504 42.2182C31.4769 42.4512 30.8256 43.368 30.926 44.364L33.1644 66.5615C33.2195 67.1075 33.0478 67.6521 32.6896 68.0678L17.5128 85.6803C16.861 86.4367 16.867 87.558 17.5268 88.3075L32.6756 105.514C33.0424 105.93 33.2195 106.48 33.1648 107.033L30.9228 129.639C30.8242 130.634 31.4753 131.548 32.4476 131.781L54.3878 137.032C54.8632 137.146 55.2804 137.429 55.5607 137.83L68.7832 156.719ZM81.6344 113.31C82.4138 114.084 83.6714 114.085 84.4515 113.312L128.839 69.3148C129.652 68.5091 129.624 67.1868 128.778 66.416L122.362 60.5704C121.576 59.8537 120.366 59.8784 119.609 60.6267L84.4859 95.3639C83.6922 96.1489 82.4095 96.1322 81.6365 95.3267L64.6488 77.6237C63.8788 76.8213 62.6021 76.8011 61.8072 77.5788L55.1179 84.1226C54.3202 84.903 54.3155 86.1852 55.1074 86.9715L81.6344 113.31Z"
									fill="url(#paint0_linear_239_470)"
								/>
								<defs>
									<linearGradient
										id="paint0_linear_239_470"
										x1="23.2689"
										y1="241.592"
										x2="271.672"
										y2="125.188"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#E42B2B" />
										<stop
											offset="0.17"
											stopColor="#E42F2C"
										/>
										<stop
											offset="0.35"
											stopColor="#E73B32"
										/>
										<stop
											offset="0.53"
											stopColor="#EB503C"
										/>
										<stop
											offset="0.71"
											stopColor="#F06D4A"
										/>
										<stop
											offset="0.8"
											stopColor="#F47E52"
										/>
									</linearGradient>
								</defs>
							</svg>
							<div className="flex flex-col gap-1 w-full">
								<h1 className="text-[24px] md:text-[28px] font-bold leading-relaxed">
									2. Reliability
								</h1>
								<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
									The Velox is engineered for flawless
									operation under the unique environmental
									conditions of an underwater city. With a
									commitment to punctuality, it provides
									dependable transportation services across
									all districts of New Atlantis. Residents can
									rely on The Velox for consistent and timely
									travel throughout the city.
								</p>
							</div>
						</div>
					</div>

					<div className="bg-secondary rounded-xl overflow-hidden w-full h-full flex flex-col justify-center items-start px-5 md:px-10">
						<div
							data-aos="fade-down"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-easing="ease-out"
							className="relative z-10 flex flex-col gap-5 sm:gap-10 max-w-full xl:max-w-[700px] py-5 md:py-10 justify-center items-start"
						>
							<svg
								className="flex-shrink-0  w-[100px] sm:w-[163px] h-[100px] sm:h-[168px]"
								width="163"
								height="168"
								viewBox="0 0 163 168"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M29.1667 31.0827C25 31.0827 21.4236 29.5896 18.4375 26.6035C15.4514 23.6174 13.9583 20.041 13.9583 15.8744C13.9583 11.7077 15.4514 8.13129 18.4375 5.14518C21.4236 2.15907 25 0.666016 29.1667 0.666016C33.3333 0.666016 36.9097 2.15907 39.8958 5.14518C42.8819 8.13129 44.375 11.7077 44.375 15.8744C44.375 20.041 42.8819 23.6174 39.8958 26.6035C36.9097 29.5896 33.3333 31.0827 29.1667 31.0827ZM18.6667 167.333C17.5621 167.333 16.6667 166.437 16.6667 165.333V110.999C16.6667 109.895 15.7712 108.999 14.6667 108.999H2C0.895431 108.999 0 108.104 0 106.999V56.291C0 52.8188 1.21528 49.8674 3.64583 47.4369C6.07639 45.0063 9.02778 43.791 12.5 43.791H45.8333C49.3056 43.791 52.2569 45.0063 54.6875 47.4369C57.1181 49.8674 58.3333 52.8188 58.3333 56.291V80.828C58.3333 81.5064 57.9877 82.1362 57.4262 82.5169C50.7534 87.0403 45.2572 93.09 40.9375 100.666C36.4236 108.583 34.1667 117.194 34.1667 126.499C34.1667 132.055 34.9306 137.159 36.4583 141.812C37.9103 146.234 39.5505 149.997 41.3788 153.102C41.5649 153.418 41.6667 153.777 41.6667 154.144V165.333C41.6667 166.437 40.7712 167.333 39.6667 167.333H18.6667ZM87.5 167.333C76.25 167.333 66.632 163.374 58.6458 155.458C50.6597 147.541 46.6667 137.888 46.6667 126.499C46.6667 118.166 49.2708 110.145 54.4792 102.437C59.2429 95.3866 65.9528 90.5148 74.6088 87.8215C75.8538 87.4342 77.0833 88.3908 77.0833 89.6947V99.4439C77.0833 100.299 76.5359 101.053 75.7413 101.37C70.6915 103.384 66.7292 106.691 63.8542 111.291C60.7292 116.291 59.1667 121.36 59.1667 126.499C59.1667 134.416 61.9097 141.117 67.3958 146.604C72.882 152.09 79.5833 154.833 87.5 154.833C95.8333 154.833 102.813 151.569 108.438 145.041C113.578 139.076 115.731 132.009 114.899 123.84C114.773 122.61 115.708 121.499 116.944 121.499H125.366C126.354 121.499 127.199 122.221 127.31 123.203C128.572 134.326 125.336 144.348 117.604 153.27C109.479 162.645 99.4445 167.333 87.5 167.333ZM154.567 148.327C153.652 148.931 152.423 148.686 151.809 147.779L130.387 116.128C130.015 115.579 129.394 115.249 128.73 115.249H85.3333C84.2288 115.249 83.3333 114.354 83.3333 113.249V54.7494C83.3333 53.6448 84.2288 52.7494 85.3333 52.7494H93.8333C94.9379 52.7494 95.8333 53.6448 95.8333 54.7494V100.749C95.8333 101.854 96.7288 102.749 97.8333 102.749H135.803C136.473 102.749 137.098 103.084 137.469 103.642L162.222 140.87C162.835 141.792 162.583 143.037 161.658 143.646L154.567 148.327Z"
									fill="white"
								/>
								<path
									d="M29.1667 31.0827C25 31.0827 21.4236 29.5896 18.4375 26.6035C15.4514 23.6174 13.9583 20.041 13.9583 15.8744C13.9583 11.7077 15.4514 8.13129 18.4375 5.14518C21.4236 2.15907 25 0.666016 29.1667 0.666016C33.3333 0.666016 36.9097 2.15907 39.8958 5.14518C42.8819 8.13129 44.375 11.7077 44.375 15.8744C44.375 20.041 42.8819 23.6174 39.8958 26.6035C36.9097 29.5896 33.3333 31.0827 29.1667 31.0827ZM18.6667 167.333C17.5621 167.333 16.6667 166.437 16.6667 165.333V110.999C16.6667 109.895 15.7712 108.999 14.6667 108.999H2C0.895431 108.999 0 108.104 0 106.999V56.291C0 52.8188 1.21528 49.8674 3.64583 47.4369C6.07639 45.0063 9.02778 43.791 12.5 43.791H45.8333C49.3056 43.791 52.2569 45.0063 54.6875 47.4369C57.1181 49.8674 58.3333 52.8188 58.3333 56.291V80.828C58.3333 81.5064 57.9877 82.1362 57.4262 82.5169C50.7534 87.0403 45.2572 93.09 40.9375 100.666C36.4236 108.583 34.1667 117.194 34.1667 126.499C34.1667 132.055 34.9306 137.159 36.4583 141.812C37.9103 146.234 39.5505 149.997 41.3788 153.102C41.5649 153.418 41.6667 153.777 41.6667 154.144V165.333C41.6667 166.437 40.7712 167.333 39.6667 167.333H18.6667ZM87.5 167.333C76.25 167.333 66.632 163.374 58.6458 155.458C50.6597 147.541 46.6667 137.888 46.6667 126.499C46.6667 118.166 49.2708 110.145 54.4792 102.437C59.2429 95.3866 65.9528 90.5148 74.6088 87.8215C75.8538 87.4342 77.0833 88.3908 77.0833 89.6947V99.4439C77.0833 100.299 76.5359 101.053 75.7413 101.37C70.6915 103.384 66.7292 106.691 63.8542 111.291C60.7292 116.291 59.1667 121.36 59.1667 126.499C59.1667 134.416 61.9097 141.117 67.3958 146.604C72.882 152.09 79.5833 154.833 87.5 154.833C95.8333 154.833 102.813 151.569 108.438 145.041C113.578 139.076 115.731 132.009 114.899 123.84C114.773 122.61 115.708 121.499 116.944 121.499H125.366C126.354 121.499 127.199 122.221 127.31 123.203C128.572 134.326 125.336 144.348 117.604 153.27C109.479 162.645 99.4445 167.333 87.5 167.333ZM154.567 148.327C153.652 148.931 152.423 148.686 151.809 147.779L130.387 116.128C130.015 115.579 129.394 115.249 128.73 115.249H85.3333C84.2288 115.249 83.3333 114.354 83.3333 113.249V54.7494C83.3333 53.6448 84.2288 52.7494 85.3333 52.7494H93.8333C94.9379 52.7494 95.8333 53.6448 95.8333 54.7494V100.749C95.8333 101.854 96.7288 102.749 97.8333 102.749H135.803C136.473 102.749 137.098 103.084 137.469 103.642L162.222 140.87C162.835 141.792 162.583 143.037 161.658 143.646L154.567 148.327Z"
									fill="url(#paint0_linear_239_498)"
								/>
								<defs>
									<linearGradient
										id="paint0_linear_239_498"
										x1="20.4329"
										y1="231.23"
										x2="246.83"
										y2="131.985"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#E42B2B" />
										<stop
											offset="0.17"
											stopColor="#E42F2C"
										/>
										<stop
											offset="0.35"
											stopColor="#E73B32"
										/>
										<stop
											offset="0.53"
											stopColor="#EB503C"
										/>
										<stop
											offset="0.71"
											stopColor="#F06D4A"
										/>
										<stop
											offset="0.8"
											stopColor="#F47E52"
										/>
									</linearGradient>
								</defs>
							</svg>
							<div className="flex flex-col gap-1 w-full">
								<h1 className="text-[24px] md:text-[28px] font-bold leading-relaxed">
									3. Accessibility
								</h1>
								<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
									The Velox is designed with accessibility at
									its core, catering to the needs of all
									individuals including the elderly and
									disabled. Features like easy access ramps,
									priority seating, and intuitive service
									interfaces ensure that everyone can navigate
									New Atlantis with ease. This approach makes
									city-wide mobility smooth and hassle-free
									for every community member.
								</p>
							</div>
						</div>
					</div>

					<div className="bg-secondary rounded-xl overflow-hidden w-full h-full flex flex-col justify-center items-start px-5 md:px-10">
						<div
							data-aos="fade-down"
							data-aos-duration="600"
							data-aos-once="true"
							data-aos-easing="ease-out"
							className="relative z-10 flex flex-col gap-5 sm:gap-10 max-w-full xl:max-w-[700px] py-5 md:py-10 justify-center items-start"
						>
							<svg
								className="flex-shrink-0  w-[100px] sm:w-[141px] h-[100px] sm:h-[143px]"
								width="141"
								height="143"
								viewBox="0 0 141 143"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19.375 122.542C13.3203 116.292 8.57743 109.07 5.14646 100.875C1.71549 92.6808 0 84.278 0 75.6669C0 65.528 1.77083 56.2572 5.3125 47.8544C8.85417 39.4516 14.1667 31.7085 21.25 24.6252C26.1111 19.7641 32.1528 15.6669 39.375 12.3336C46.5972 9.00022 55.1042 6.39605 64.8958 4.52105C74.6875 2.64605 85.7639 1.46549 98.125 0.979384C110.011 0.511948 123.182 0.718729 137.636 1.59973C138.633 1.66046 139.43 2.4503 139.501 3.44602C140.515 17.7693 140.855 30.9054 140.521 42.8544C140.174 55.2849 139.062 66.4481 137.187 76.344C135.312 86.2398 132.674 94.89 129.271 102.295C125.868 109.699 121.667 115.893 116.667 120.875C109.583 127.959 101.944 133.306 93.75 136.917C85.5555 140.528 76.8056 142.334 67.5 142.334C57.9167 142.334 49.1319 140.702 41.1458 137.438C33.1597 134.174 25.9028 129.209 19.375 122.542ZM41.1475 121.21C40.9543 122.012 41.28 122.852 41.9802 123.289C45.1838 125.287 48.8293 126.844 52.9167 127.959C57.5 129.209 62.3558 129.834 67.484 129.834C74.8558 129.834 82.0139 128.306 88.9583 125.25C95.9028 122.195 102.222 117.75 107.917 111.917C111.667 108.167 114.861 103.271 117.5 97.2294C120.139 91.1877 122.292 84.0349 123.958 75.771C125.625 67.5072 126.736 58.1669 127.292 47.7502C127.819 37.8557 127.846 27.0213 127.371 15.247C127.329 14.1943 126.472 13.3574 125.418 13.3383C113.114 13.1152 102.037 13.3011 92.1875 13.8961C81.8403 14.5211 72.7083 15.6669 64.7917 17.3335C56.875 19.0002 50.0694 21.1183 44.375 23.6877C38.6806 26.2572 34.0278 29.4169 30.4167 33.1669C24.5833 39.1391 20.1389 45.4586 17.0833 52.1252C14.0278 58.7919 12.5 65.5974 12.5 72.5419C12.5 79.2085 13.9236 86.1877 16.7708 93.4794C19.1923 99.6806 22.0908 104.852 25.4666 108.994C26.3291 110.052 27.9628 109.843 28.6303 108.652C35.7147 96.0131 44.0879 84.6012 53.75 74.4169C59.2887 68.5788 65.0088 63.4063 70.9105 58.8993C72.8137 57.4458 74.722 59.9064 73.0976 61.666C66.931 68.3455 61.5929 75.3389 57.0833 82.646C49.8145 94.4242 44.5026 107.279 41.1475 121.21Z"
									fill="white"
								/>
								<path
									d="M19.375 122.542C13.3203 116.292 8.57743 109.07 5.14646 100.875C1.71549 92.6808 0 84.278 0 75.6669C0 65.528 1.77083 56.2572 5.3125 47.8544C8.85417 39.4516 14.1667 31.7085 21.25 24.6252C26.1111 19.7641 32.1528 15.6669 39.375 12.3336C46.5972 9.00022 55.1042 6.39605 64.8958 4.52105C74.6875 2.64605 85.7639 1.46549 98.125 0.979384C110.011 0.511948 123.182 0.718729 137.636 1.59973C138.633 1.66046 139.43 2.4503 139.501 3.44602C140.515 17.7693 140.855 30.9054 140.521 42.8544C140.174 55.2849 139.062 66.4481 137.187 76.344C135.312 86.2398 132.674 94.89 129.271 102.295C125.868 109.699 121.667 115.893 116.667 120.875C109.583 127.959 101.944 133.306 93.75 136.917C85.5555 140.528 76.8056 142.334 67.5 142.334C57.9167 142.334 49.1319 140.702 41.1458 137.438C33.1597 134.174 25.9028 129.209 19.375 122.542ZM41.1475 121.21C40.9543 122.012 41.28 122.852 41.9802 123.289C45.1838 125.287 48.8293 126.844 52.9167 127.959C57.5 129.209 62.3558 129.834 67.484 129.834C74.8558 129.834 82.0139 128.306 88.9583 125.25C95.9028 122.195 102.222 117.75 107.917 111.917C111.667 108.167 114.861 103.271 117.5 97.2294C120.139 91.1877 122.292 84.0349 123.958 75.771C125.625 67.5072 126.736 58.1669 127.292 47.7502C127.819 37.8557 127.846 27.0213 127.371 15.247C127.329 14.1943 126.472 13.3574 125.418 13.3383C113.114 13.1152 102.037 13.3011 92.1875 13.8961C81.8403 14.5211 72.7083 15.6669 64.7917 17.3335C56.875 19.0002 50.0694 21.1183 44.375 23.6877C38.6806 26.2572 34.0278 29.4169 30.4167 33.1669C24.5833 39.1391 20.1389 45.4586 17.0833 52.1252C14.0278 58.7919 12.5 65.5974 12.5 72.5419C12.5 79.2085 13.9236 86.1877 16.7708 93.4794C19.1923 99.6806 22.0908 104.852 25.4666 108.994C26.3291 110.052 27.9628 109.843 28.6303 108.652C35.7147 96.0131 44.0879 84.6012 53.75 74.4169C59.2887 68.5788 65.0088 63.4063 70.9105 58.8993C72.8137 57.4458 74.722 59.9064 73.0976 61.666C66.931 68.3455 61.5929 75.3389 57.0833 82.646C49.8145 94.4242 44.5026 107.279 41.1475 121.21Z"
									fill="url(#paint0_linear_239_508)"
								/>
								<defs>
									<linearGradient
										id="paint0_linear_239_508"
										x1="17.5946"
										y1="196.62"
										x2="211.689"
										y2="110.383"
										gradientUnits="userSpaceOnUse"
									>
										<stop stopColor="#E42B2B" />
										<stop
											offset="0.17"
											stopColor="#E42F2C"
										/>
										<stop
											offset="0.35"
											stopColor="#E73B32"
										/>
										<stop
											offset="0.53"
											stopColor="#EB503C"
										/>
										<stop
											offset="0.71"
											stopColor="#F06D4A"
										/>
										<stop
											offset="0.8"
											stopColor="#F47E52"
										/>
									</linearGradient>
								</defs>
							</svg>
							<div className="flex flex-col gap-1 w-full">
								<h1 className="text-[24px] md:text-[28px] font-bold leading-relaxed">
									4. Sustainability
								</h1>
								<p className="text-[16px] md:text-[18px] font-normal leading-relaxed">
									Sustainability drives every aspect of The
									Velox, aligning with New Atlantis’
									commitment to environmental stewardship. As
									a carbon-neutral service, it utilizes green
									technologies and practices to minimize
									ecological impact. The Velox sets a standard
									in sustainable public transportation,
									preserving the integrity of our underwater
									environment.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default page;
