import React from "react";

interface TrainTimeProps {
	initialTime: string;
	stations: string[];
	numberOfTrains?: number;
}

export function generateTrainTimes({
	initialTime,
	stations,
	numberOfTrains = 3,
}: TrainTimeProps) {
	let paths = [];
	let initialDeparture = new Date(initialTime);

	for (let trainIndex = 0; trainIndex < numberOfTrains; trainIndex++) {
		let startDelay = Math.floor(Math.random() * 6) + 5; // Delay between 5 to 10 minutes
		let currentTime = new Date(
			initialDeparture.getTime() + startDelay * 60000
		);
		let pathTimes = [];

		for (let station of stations) {
			let travelTime = Math.floor(Math.random() * 2) + 1; // Travel time between 1 to 2 minutes
			currentTime = new Date(currentTime.getTime() + travelTime * 60000);
			pathTimes.push(currentTime.toISOString());
		}

		paths.push(pathTimes); // Collect times for one complete path across all stations

		// IMPORTANT: Update the initial departure time for the next train to be after the last station time
		let nextTrainDelay = Math.floor(Math.random() * 11) + 5; // Delay for next train between 5 to 15 minutes
		initialDeparture = new Date(
			currentTime.getTime() + nextTrainDelay * 60000
		);
	}

	return paths;
}
