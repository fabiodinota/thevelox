"use client";

import Image from "next/image";
import Link from "next/link";

import { easeOut, motion } from "framer-motion";

import { HeroQuickBook } from "./components/HeroQuickBook";
import CorePrinciplesSection from "./components/CorePrinciplesSection";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import HeroBackground from "@/public/hero_background.png";

export default function Home() {
    const customease = [0.05, 0.58, 0.57, 0.96]
	return (
		<div>
            <div className="w-full min-h-[600px] h-[600px] sm:h-[650px] md:h-[50vh] max-h-[700px] relative flex justify-center items-center flex-col px-5 xl:px-10">
                {/* <motion.h1
                     initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0.1 }} 
                    className='relative top-[230px] sm:top-[200px] md:top-[250px] xl:top-[230px] text-[10vw] sm:text-[60px] md:text-[70px] text-left max-w-[1400px] w-full font-bold text-white leading-snug whitespace-pre-wrap'
                >
                    Book the{" "}
                    <br className="md:hidden block" /> 
                    best & <br className="hidden md:block" />
                    cheapest <br className="md:hidden block" />
                    tickets around!
                </motion.h1> */}
                <HeroQuickBook className="relative top-[250px] sm:top-[220px] md:top-[270px] xl:top-[250px] shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]" />
                <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0 }}  className="w-full min-h-[600px] h-[600px] sm:h-[650px] md:h-[50vh] max-h-[700px] xl:rounded-b-[75px] overflow-hidden absolute top-0 left-0 -z-10">
                    <div className="w-full h-full bg-hero-gradient relative top-0 left-0 z-50"></div>
                    <Image 
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 80vw, 60vw" 
                        src={HeroBackground} 
                        priority 
                        fill 
                        className="object-cover object-bottom" 
                        alt="background_hero" 
                    />
                </motion.div>
            </div>
            <div className="w-full h-[300px]"></div>
            <div className="flex flex-col justify-center items-center py-10 px-5 md:px-10">

                <section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-5">
                    <motion.h1 
                    initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0.3 }} 
                    className="text-foreground text-[28px] sm:text-[32px] md:text-[40px] font-bold w-full text-left">The Velox, Electricity In Its Veins.</motion.h1>
                    <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0.4 }} className="rounded-[20px] bg-secondary w-full aspect-video grid place-content-center">
                        <span className="text-[24px] font-bold opacity-50">Video</span>
                    </motion.div>
                    <Link className='bg-gradient text-white hover:text-white/70 duration-150 rounded-xl max-w-[400px] w-full h-[60px] grid place-content-center ' href='/app'>
                        <span className="text-[16px] md:text-[18px] font-medium">Launch App</span>
                    </Link>
                </section>

                <section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-10 lg:gap-5 mt-[100px]">
                    <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-5 lg:gap-10">
                        <div 
                            data-aos="fade-right"
                            data-aos-duration="600"
                            data-aos-once="true"
                            data-ease="ease-out" 
                            className="w-full flex flex-col gap-2"
                        >
                            <h1 className="text-foreground text-[22px] sm:text-[26px] md:text-[32px] font-bold w-full text-left">The best transport solution to date.</h1>
                            <p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur. Habitasse rhoncus quam augue a nam odio massa turpis. Ultrices eleifend sapien turpis auctor augue ut. Iaculis non sit porttitor at dui tellus. Nulla facilisis magna feugiat volutpat.
                            </p>
                        </div>
                        <div 
                            data-aos="fade-left"
                            data-aos-duration="600"
                            data-aos-once="true"
                            data-ease="ease-out" 
                            className="rounded-[20px] bg-secondary w-full aspect-video grid place-content-center"
                        >
                            <span className="text-[24px] font-bold opacity-50">Placeholder Image</span>
                        </div>
                    </div>
                    <div className="w-full flex flex-col-reverse lg:flex-row justify-center items-center gap-5 lg:gap-10">
                        <div 
                            data-aos="fade-right"
                            data-aos-duration="600"
                            data-aos-once="true"
                            data-ease="ease-out" 
                            className="rounded-[20px] bg-secondary w-full aspect-video grid place-content-center"
                        >
                            <span className="text-[24px] font-bold opacity-50">Placeholder Image</span>
                        </div>
                        <div 
                            data-aos="fade-left"
                            data-aos-duration="600"
                            data-aos-once="true"
                            data-ease="ease-out" 
                            className="w-full flex flex-col gap-2"
                        >
                            <h1 className="text-foreground text-[22px] sm:text-[26px] md:text-[32px] font-bold w-full text-left">Next-Generation Public Transport Booking App</h1>
                            <p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur. Habitasse rhoncus quam augue a nam odio massa turpis. Ultrices eleifend sapien turpis auctor augue ut. Iaculis non sit porttitor at dui tellus. Nulla facilisis magna feugiat volutpat.
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
                    <Accordion defaultValue="item-1" className="w-full gap-10" type="single">
                        <AccordionItem  
                            data-aos="fade-up"
                            data-aos-duration="600"
                            data-aos-once="true"
                            data-ease="ease-out"
                            className="py-2" 
                            value="item-1"
                        >
                            <AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">How do I download your app?</AccordionTrigger>
                            <AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
                                Click on the three dots in the top right corner of your screen. Scroll down and somewhere at the bottom it should say either “Install App” or “Add to Home”, click that and the install will begin.
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
                            <AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">Can I refund my ticket?</AccordionTrigger>
                            <AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
                                Lorem ipsum dolor sit amet consectetur. Habitasse rhoncus quam augue a nam odio massa turpis. Ultrices eleifend sapien turpis auctor augue ut.
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
                            <AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">Do you require any identification?</AccordionTrigger>
                            <AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
                                Lorem ipsum dolor sit amet consectetur. Habitasse rhoncus quam augue a nam odio massa turpis. Ultrices eleifend sapien turpis auctor augue ut.
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
                            <AccordionTrigger className="text-[18px] md:text-[20px] font-medium leading-relaxed text-left">Do you store any payment information?</AccordionTrigger>
                            <AccordionContent className="text-[16px] md:text-[18px] font-normal leading-relaxed text-left">
                                Lorem ipsum dolor sit amet consectetur. Habitasse rhoncus quam augue a nam odio massa turpis. Ultrices eleifend sapien turpis auctor augue ut.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>
            </div>
		</div>
	);
}
