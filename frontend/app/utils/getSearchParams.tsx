import { useRouter, useSearchParams } from "next/navigation";
import { FormSchemaProps, SearchParams, Station } from "../types/types";
import { UseFormSetValue } from "react-hook-form";

interface getSearchParamsProps {
	stations: Station[];
	setSearching: React.Dispatch<React.SetStateAction<boolean>>;
	setStartStation: React.Dispatch<React.SetStateAction<Station>>;
	setEndStation: React.Dispatch<React.SetStateAction<Station>>;
	setValue: UseFormSetValue<FormSchemaProps>;
	setDepartureDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
	handleSearch: (searchParams: SearchParams) => void;
	searchParams: any;
	router: any;
}

export const getSearchParams = ({
	stations,
	setSearching,
	setStartStation,
	setEndStation,
	setValue,
	setDepartureDate,
	handleSearch,
	searchParams,
	router,
}: getSearchParamsProps) => {
	if (
		searchParams.has("startStation") &&
		searchParams.has("endStation") &&
		searchParams.has("departureDate")
	) {
		// Get the search params from the URL
		const startStationParams = searchParams.get("startStation") || "";
		const endStationParams = searchParams.get("endStation") || "";
		const departureDateParams = searchParams.get("departureDate") || "";

		setSearching(true);

		// Check if the stations are in the list of stations
		stations.some((station: Station) => {
			if (station.name === startStationParams) {
				setStartStation({
					name: station.name,
					level: station.level,
					label: station.label,
				});
				setValue("startStation", station.name, {
					shouldValidate: true,
				});
			}
			if (station.name === endStationParams) {
				setEndStation({
					name: station.name,
					level: station.level,
					label: station.label,
				});
				setValue("endStation", station.name, {
					shouldValidate: true,
				});
			}
		});
		// Set the date
		setDepartureDate(new Date(departureDateParams));
		setValue("departureDate", departureDateParams, {
			shouldValidate: true,
		});

		handleSearch({
			startStation: startStationParams,
			endStation: endStationParams,
			departureDate: departureDateParams,
		});
	} else {
		setSearching(false);
		router.push("/app/search");
	}
	return getSearchParams;
};
