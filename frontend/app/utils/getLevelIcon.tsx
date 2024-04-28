import React from "react";
import {
	Line11Icon,
	Line12Icon,
	Line13Icon,
	Line14Icon,
	Line15Icon,
	Line16Icon,
} from "../components/Icons";

const getLevelIcon = (level: number, className: string) => {
	switch (level) {
		case 11:
			return Line11Icon(className);
		case 12:
			return Line12Icon(className);
		case 13:
			return Line13Icon(className);
		case 14:
			return Line14Icon(className);
		case 15:
			return Line15Icon(className);
		case 16:
			return Line16Icon(className);
		default:
			return Line11Icon(className);
	}
};

export default getLevelIcon;
