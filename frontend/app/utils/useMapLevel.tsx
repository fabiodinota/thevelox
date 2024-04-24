import { useState } from "react";

const useMapLevel = () => {
	const minMax = {
		min: 0,
		max: 2,
	};

	const [level, setLevel] = useState(0);
	const [slideDirection, setSlideDirection] = useState("right");

	const xInitial = slideDirection === "right" ? -50 : 50;
	const xExit = slideDirection === "right" ? 50 : -50;

	const decrease = () => {
		setSlideDirection("left");
		if (level > minMax.min) {
			setLevel((prevLevel) => prevLevel - 1);
		} else {
			setLevel(minMax.max);
		}
	};

	console.log("level", level);
	const increase = () => {
		setSlideDirection("right");
		if (level < minMax.max) {
			setLevel((prevLevel) => prevLevel + 1);
		} else {
			setLevel(minMax.min);
		}
	};

	return { decrease, increase, level, slideDirection, xInitial, xExit };
};

export default useMapLevel;
