import Link from "next/link";
import React, { MouseEventHandler } from "react";

interface RippleButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	style: "gradient" | "outlined" | "nofill";
	className?: string;
	[x: string]: any;
	asLink?: boolean;
	href?: string;
	rippleColor?: string;
	speed?: "fast" | "medium" | "slow";
}
const RippleButton = ({
	children,
	onClick = () => {},
	style,
	className,
	asLink = false,
	href = "/",
	rippleColor = "rgba(255, 255, 255, 0.15)",
	speed = "slow",
	...props
}: RippleButtonProps) => {
	function createRipple(
		event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
	) {
		const button = event.currentTarget;

		// Get the bounding rectangle of the button
		const rect = button.getBoundingClientRect();

		const circle = document.createElement("span");
		const diameter = Math.max(rect.width, rect.height); // Use the button's client dimensions
		const radius = diameter / 2;

		// Calculate the position of the ripple effect within the button
		circle.style.width = circle.style.height = `${diameter}px`;
		circle.style.left = `${event.clientX - rect.left - radius}px`;
		circle.style.top = `${event.clientY - rect.top - radius}px`;
		circle.classList.add("ripple");
		circle.classList.add(speed);
		circle.style.backgroundColor = rippleColor;

		const ripple = button.getElementsByClassName("ripple")[0];
		if (ripple) {
			ripple.remove();
		}

		button.appendChild(circle);
	}
	if (!asLink) {
		return (
			<button
				className={"rippleButton" + " " + style + " " + className}
				onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
					createRipple(event);
					onClick();
				}}
				{...props}
			>
				{children}
			</button>
		);
	} else {
		return (
			<Link
				href={href}
				className={"rippleButton" + " " + style + " " + className}
				onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
					createRipple(event);
					onClick();
				}}
				{...props}
			>
				{children}
			</Link>
		);
	}
};

export default RippleButton;
