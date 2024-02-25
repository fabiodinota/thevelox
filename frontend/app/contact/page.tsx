import React from 'react'
import { HeroQuickBook } from '../components/HeroQuickBook'

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center py-10 px-5 md:px-10">
        <section className="max-w-[1400px] w-full flex flex-col justify-center items-center gap-5">
            <h1 
            className="text-foreground text-[32px] sm:text-[38px] md:text-[48px] font-bold w-full text-left leading-none mt-[100px]">Contact Us</h1>
            <p className="text-foreground text-[16px] md:text-[18px] font-normal leading-relaxed">
                Please contact us with any questions you might have for us. We’re happy to help in any way we can. If you’re having difficulties using the form below, email us at: <a href="mailto:contact@thevelox.co" className="text-gradient">contact@thevelox.co</a>
                <br />
                <br />
                We will always try to reply in a timely manner but please be patient as our customer support staff might be busy.
            </p>
{/*             <HeroQuickBook className="relative mt-5 shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]" />
 */}        </section>
    </div>
  )
}

export default page