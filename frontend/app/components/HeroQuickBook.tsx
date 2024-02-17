"use client";

import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePickerDemo } from "./package/time-picker-demo";
import CustomAutocomplete from "./Autocomplete";
import useQuickBookStore from "../state/state";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "../context/sessionContext";

type Station = {
	name: string;
	level: number;
};

type QuickBookState = {
	from: string;
	to: string;
	departureDate: string;
	passengers: number;
};

export function HeroQuickBook() {
    const { isAuthenticated } = useSession();

	const [stations, setStations] = useState<Station[]>([]);
	const [date, setDate] = useState<Date | undefined>(
		new Date(new Date())
	);

	const {
        setQuickBook,
		clear,
	} = useQuickBookStore();

	const FormSchema = z.object({
		from: z.string().min(1, { message: "Set a departure station" })
            .refine((value) => stations.some(station => `${station.name}, Level ${station.level}` === value), {
            message: "Enter a valid station",
            }),
        to: z.string().min(1, { message: "Set a destination station" })
            .refine((value) => stations.some(station => `${station.name}, Level ${station.level}` === value), {
            message: "Enter a valid station",
        }),
        departureDate: z.string().min(1, { message: "Set a departure station" }).default(format(new Date(), "yyyy-MM-dd'T'HH:mm")),
        passengers: z.number().min(1, { message: "Set the number of passengers" }).default(1),
	});

	const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

	const handleQuickBook = async (data: z.infer<typeof FormSchema>) => {
		clear();

        setQuickBook({
            from: data.from,
            to: data.to,
            departureDate: data.departureDate,
            passengers: data.passengers,
            searching: true,
        })
	};

	const handleGetStations = async () => {
		if (stations.length === 0) {
			await axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/map/getDestinations`, {
					withCredentials: true,
				})
				.then((res) => {
					setStations(res.data.destinations);
				})
				.catch((err) => {
					console.log("Err: ", err);
					if (err.response.status === 401) {
						console.log("Unauthorized");
					}
				});
		}
	};

	useEffect(() => {
		handleGetStations();
	}, []);

    const onSubmit = handleSubmit(async (data) => {
        // Your submission logic, using data from the form
        console.log("Form Data: ", data);
        handleQuickBook(data);
        // Note: Since you're using Zod for validation, data is already validated here
      });

      const handleDateChange = (newDate: Date | undefined) => {
        if (!newDate) return; // Exit if no date is selected
    
        if (date) {
            // Preserve the time part from the existing date state
            const hours = date.getHours();
            const minutes = date.getMinutes();
            newDate.setHours(hours, minutes);
        }
    
        setDate(newDate); // Set the new date with preserved time
    
        // Format the date as needed, e.g., to ISO string or custom format
        const formattedDate = format(newDate, "yyyy-MM-dd'T'HH:mm:ss");
        
        // Update React Hook Form state
        setValue('departureDate', formattedDate, { shouldValidate: true });
    };
    

    const handleTimeChange = (time: Date | undefined) => {
        if (!time) return; // Exit if no time is selected
    
        const updatedDate = date ? new Date(date) : new Date();
        updatedDate.setHours(time.getHours(), time.getMinutes());
    
        setDate(updatedDate); // Set the new date with the updated time
    
        // Format the updated date with the new time for the form
        const formattedDate = format(updatedDate, "yyyy-MM-dd'T'HH:mm:ss");
    
        // Update React Hook Form state
        setValue('departureDate', formattedDate, { shouldValidate: true });
    };
    
	return (
		<>
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <h1>Quick Book</h1>
                <CustomAutocomplete
                    id="from"
                    placeholder="From"
                    suggestions={stations.map(station => `${station.name}, Level ${station.level}`)} // Assuming stations is an array of objects
                    onSelectionChange={(value) => setValue("from", value, { shouldValidate: true })}
                />
                {errors.from && <span className="text-red-500">{errors.from.message}</span>}
				<CustomAutocomplete
                    id="to"
                    placeholder="to"
                    suggestions={stations.map(station => `${station.name}, Level ${station.level}`)} // Assuming stations is an array of object'
                    onSelectionChange={(value) => setValue("to", value, { shouldValidate: true })}
                />
                {errors.to && <span className="text-red-500">{errors.to.message}</span>}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"outline"}
							className={cn(
								"w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5 text-left font-normal text-[16px] justify-start",
								!date && "text-muted-foreground"
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? (
								format(date, "PP HH:mm")
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateChange}
							initialFocus
						/>
						<div className="p-3 border-t border-border">
							<TimePickerDemo setDate={handleTimeChange} date={date} />
						</div>
					</PopoverContent>
				</Popover>
                {errors.departureDate && <span className="text-red-500">{errors.departureDate.message}</span>}
				<input
					onChange={(e) => setValue("passengers", parseInt(e.target.value))}
					type="number"
                    id="passengers"
                    min={1}
                    max={4}
                    defaultValue={1}
					placeholder="Passengers"
					className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
				/>
                {errors.passengers && <span className="text-red-500">{errors.passengers.message}</span>}
				<button
					disabled={!isAuthenticated}
					type="submit"
					className="rounded-lg bg-red-500 py-3 disabled:opacity-50"
				>
					Submit
				</button>
			</form>
		</>
	);
}
