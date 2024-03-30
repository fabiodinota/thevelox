"use client"

import React from 'react'
import { HeroQuickBook } from '../../components/HeroQuickBook'
import { ContactForm } from '../../components/ContactForm'
import { motion } from 'framer-motion'

const page = () => {
    const customease = [0.05, 0.58, 0.57, 0.96]

  return (
    <div className="flex flex-col justify-center items-center py-10 px-5 md:px-10">
        <section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-5">
            <motion.h1 
             initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0.2 }} 
            className="text-foreground text-[32px] sm:text-[38px] md:text-[48px] font-bold w-full text-left leading-none mt-[120px] xl:mt-[100px]">Contact Us</motion.h1>
            <motion.p initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: customease, delay: 0.1 }} className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
                Please contact us with any questions you might have for us. We’re happy to help in any way we can. If you’re having difficulties using the form below, email us at: <a href="mailto:contact@thevelox.co?subject=Customer Inquiry from thevelox.co&body=Hi, " className="text-gradient">contact@thevelox.co</a>
                <br />
                <br />
                We will always try to reply in a timely manner but please be patient as our customer support staff might be busy.
            </motion.p>
            <ContactForm className='shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]' />
       </section>
    </div>
  )
}

export default page