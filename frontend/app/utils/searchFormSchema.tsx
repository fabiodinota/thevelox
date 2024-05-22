import React from "react";
import { z } from "zod";

type Station = {
	name: string;
	level: number | undefined;
	label: string;
};

interface FormSchemaProps {
	stations: Station[];
	startStation: Station;
	endStation: Station;
}

const searchFormSchema = ({
	stations,
	startStation,
	endStation,
}: FormSchemaProps) => {
	const FormSchema = z.object({
		startStation: z
			.string({ required_error: "Set a starting station" })
			.min(1, { message: "Set a departure station" })
			.refine(
				(value) => stations.some((station) => station.name === value),
				{
					message: "Enter a valid station",
				}
			)
			.refine((value) => value !== endStation.name, {
				message: "Start and end stations can't be the same",
			}),
		endStation: z
			.string({ required_error: "Set a destination station" })
			.min(1, { message: "Set a destination station" })
			.refine(
				(value) => stations.some((station) => station.name === value),
				{
					message: "Enter a valid station",
				}
			)
			.refine((value) => value !== startStation.name, {
				message: "Start and end stations can't be the same",
			}),
		departureDate: z
			.string({ required_error: "Set a departure date" })
			.min(1, { message: "Set a departure date" })
			.refine((value) => new Date(value) > new Date(new Date()), {
				message: "The departure date must be in the future",
			}),
	});
	return FormSchema;
};

export default searchFormSchema;
