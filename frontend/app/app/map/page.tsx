"use client";

import React, { useEffect, useState } from "react";
import { Map } from "../Map";
import axios from "axios";
import useQuickBookStore from "../../state/state";

type ISearchReqData = {
	startStation: string;
	endStation: string;
	lines: string[];
	path: string[];
};

const page = () => {
	const [startStation, setStartStation] = useState<string>("");
	const [endStation, setEndStation] = useState<string>("");

	const [searching, setSearching] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const [searchReqData, setSearchReqData] = useState<ISearchReqData | {}>({});

    const quickBook = useQuickBookStore(state => ({
        from: state.from,
        to: state.to,
        departureDate: state.departureDate,
        passengers: state.passengers,
        searching: state.searching,
    }));

	// Custom function to validate and set searchReqData
	const updateSearchReqData = (data: ISearchReqData | {}) => {
		// Validate data before updating
		if (
			Object.keys(data).length === 0 ||
			["startStation", "endStation", "lines", "path"].every(
				(key) => key in data
			)
		) {
			setSearchReqData(data);
		} else {
			console.error("Invalid data structure for searchReqData");
		}
	};

	useEffect(() => {
		const searchData = JSON.parse(
			localStorage.getItem("searchReqData") || "{}"
		);

		if (searchData && Object.keys(searchData).length > 0) {
			setSearching(true);
		}

		updateSearchReqData(searchData);
		setStartStation(searchData.startStation || "");
		setEndStation(searchData.endStation || "");
	}, []);

	const handleSearchValidation = () => {
		if (startStation === "" || endStation === "") {
			setError("Please enter both start and end stations");
			return;
		} else if (startStation === endStation) {
			setError("Start and end stations cannot be the same");
			return;
		} else {
			return;
		}
	};

	const handleSearch = async () => {
		setSearching(true);

		await axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/map/search?startStation=${startStation}&endStation=${endStation}`,
				{ withCredentials: true }
			)
			.then((res) => {
				console.log("Res: ", res);

				console.log("Data: ", {
					startStation,
					endStation,
					lines: res.data?.lines || [],
					path: res.data?.path || [],
				});
				updateSearchReqData({
					startStation,
					endStation,
					lines: res.data?.lines || [],
					path: res.data?.path || [],
				});
			})
			.catch((err) => {
				console.log("Err: ", err);
			});
	};

    useEffect(() => {
        if (quickBook.searching) {
            const start = quickBook.from.split(",")[0];
            const end = quickBook.to.split(",")[0];
            console.log("Start:", start, "End:", end);
            setStartStation(start);
            setEndStation(end);

            handleSearch();
        }
    }, []);



	const handleGoBackToMap = () => {
		setSearching(false);
		localStorage.removeItem("searchReqData");
		updateSearchReqData({}); // Reset to empty object
	};

	// If needed, store searchReqData in localStorage when it changes
	useEffect(() => {
		if (searching) {
			localStorage.setItem(
				"searchReqData",
				JSON.stringify(searchReqData)
			);
		}
	}, [searchReqData, searching]);

	return (
		<div className="w-screen h-screen overflow-hidden relative">
			<div
				style={{ backdropFilter: "blur(16px)" }}
				className="absolute left-1/2 -translate-x-1/2 bottom-5 z-[9999] backdrop-bl bg-white/20 flex justify-center items-center border border-gray-100 px-[10px] w-[90%] max-w-[900px] h-[80px] rounded-xl"
			>
				<input
					onChange={(e) => setStartStation(e.target.value)}
					value={startStation}
					placeholder="Start Station"
					className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
				/>
				{/* destination station input */}
				{/* destination station input */}
				<input
					onChange={(e) => setEndStation(e.target.value)}
					value={endStation}
					placeholder="Destination Station"
					className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
				/>
				{/* search button */}
				<button
					onClick={searching ? handleGoBackToMap : handleSearch}
					className="w-full h-[50px] bg-blue-500 text-white rounded-xl"
				>
					{searching ? (
						<div className="w-full h-full bg-white/30 rounded-xl flex justify-center items-center gap-5">
							Go back
							<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
						</div>
					) : (
						"Search"
					)}
				</button>
				{error && <p className="text-red-500">{error}</p>}
			</div>
			<Map searching={searching} searchRequestData={searchReqData} />
		</div>
	);
};

export default page;
