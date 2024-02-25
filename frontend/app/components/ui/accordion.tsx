"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <svg className="h-5 w-5 shrink-0 transition-transform duration-200" width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.706129 2.23211C0.315605 1.84158 0.315606 1.20842 0.70613 0.817893L1.06692 0.457107C1.45744 0.0665826 2.09061 0.0665826 2.48113 0.457107L9.29192 7.26789C9.68244 7.65842 10.3156 7.65842 10.7061 7.26789L17.5169 0.457108C17.9074 0.0665833 18.5406 0.0665824 18.9311 0.457107L19.2919 0.817893C19.6824 1.20842 19.6824 1.84158 19.2919 2.23211L10.7061 10.8179C10.3156 11.2084 9.68244 11.2084 9.29192 10.8179L0.706129 2.23211Z" fill="white"/>
        <path d="M0.706129 2.23211C0.315605 1.84158 0.315606 1.20842 0.70613 0.817893L1.06692 0.457107C1.45744 0.0665826 2.09061 0.0665826 2.48113 0.457107L9.29192 7.26789C9.68244 7.65842 10.3156 7.65842 10.7061 7.26789L17.5169 0.457108C17.9074 0.0665833 18.5406 0.0665824 18.9311 0.457107L19.2919 0.817893C19.6824 1.20842 19.6824 1.84158 19.2919 2.23211L10.7061 10.8179C10.3156 11.2084 9.68244 11.2084 9.29192 10.8179L0.706129 2.23211Z" fill="url(#paint0_linear_239_697)"/>
        <defs>
        <linearGradient id="paint0_linear_239_697" x1="-7.66865" y1="1.22305" x2="-2.87671" y2="19.4188" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E42B2B"/>
        <stop offset="0.17" stopColor="#E42F2C"/>
        <stop offset="0.35" stopColor="#E73B32"/>
        <stop offset="0.53" stopColor="#EB503C"/>
        <stop offset="0.71" stopColor="#F06D4A"/>
        <stop offset="0.8" stopColor="#F47E52"/>
        </linearGradient>
        </defs>
        </svg>

    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
