"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export type Station = {
	name: string;
	level: number;
	label: string;
};

const useStationData = () => {
	const [stations, setStations] = useState<Station[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchStations = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/map/getDestinations`
			);
			setStations(
				response.data.destinations.map((station: Station) => ({
					label: `${station.name}, Level ${station.level}`,
					name: station.name,
					level: station.level,
				}))
			);
			setError(null);
		} catch (err: any) {
			setError(err);
			setStations([]);
		} finally {
			setLoading(false);
		}
	};

	// Automatically fetch stations on mount if needed
	useEffect(() => {
		if (stations.length === 0) {
			fetchStations();
		}
	}, []);

	return { stations, loading, error, fetchStations };
};

export default useStationData;
