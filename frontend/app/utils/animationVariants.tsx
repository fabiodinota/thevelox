import React from "react";

export const popoverVariant = {
	initial: { opacity: 0, scale: 0.9 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.2, ease: "easeOut" },
	},
	exit: {
		opacity: 0,
		scale: 0.9,
		transition: { duration: 0.2, ease: "easeIn" },
	},
};
