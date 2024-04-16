import React from "react";
import { motion } from "framer-motion";

interface AnimatedInputProps {
	id?: string;
	inputValue?: string;
	handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	inputRef?: React.RefObject<HTMLInputElement>;
	placeholder?: string;
	svgIcon?: React.ReactNode;
	active: boolean;
	type?: string;
	tabIndex?: number;
}

const AnimatedInput = ({
	id,
	inputValue,
	handleChange,
	handleFocus,
	handleBlur,
	handleKeyDown,
	inputRef,
	placeholder,
	svgIcon,
	active,
	type,
	tabIndex,
}: AnimatedInputProps) => {
	const [inputType, setType] = React.useState(type);
	const [icon, setIcon] = React.useState(eyeOff);

	const handleToggle = () => {
		if (inputType === "password") {
			setIcon(eye);
			setType("text");
		} else if (inputType === "text") {
			setIcon(eyeOff);
			setType("password");
		}
	};

	return (
		<div
			className="relative w-full"
			onClick={() => {
				inputRef?.current?.focus();
			}}
		>
			<div className="w-full h-[70px] md:h-[80px] relative z-[45] cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
				{svgIcon && (
					<div className="w-12 flex-shrink-0 h-12 grid place-content-center relative">
						{svgIcon}
						<div className="w-full h-full absolute top-0 left-0 bg-accent z-0 rounded-full"></div>
					</div>
				)}
				<div className="flex items-center flex-row w-full relative">
					<label
						htmlFor={id}
						className={`absolute cursor-pointer left-3 text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${
							active
								? "transform -translate-y-5  md:-translate-y-6 text-[13px] md:text-[15px]"
								: "text-[16px] md:text-lg"
						}`}
					>
						{placeholder}
					</label>
					<input
						ref={inputRef}
						type={inputType}
						id={id}
						tabIndex={tabIndex}
						value={inputValue}
						onChange={handleChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onKeyDown={handleKeyDown}
						autoComplete="new-password"
						autoCapitalize="off"
						autoCorrect="off"
						role="presentation"
						className={`w-full bg-secondary pt-4 pl-3 text-[16px] md:text-[18px] font-medium border-none outline-none ${
							type === "email" ? "lowercase" : ""
						}`}
					/>
					{type === "password" && inputValue !== "" && (
						<button
							onClick={handleToggle}
							type="button"
							className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-20 grid place-content-center cursor-pointer text-foreground/50 transition-all duration-200 ease-in-out"
						>
							<motion.div
								initial={{ scale: 1 }}
								whileTap={{ scale: 0.9 }}
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.2, type: "spring" }}
								className="w-full h-full flex justify-center items-center origin-center"
							>
								{icon}
							</motion.div>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AnimatedInput;

const eye = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 16C13.25 16 14.3125 15.5625 15.1875 14.6875C16.0625 13.8125 16.5 12.75 16.5 11.5C16.5 10.25 16.0625 9.1875 15.1875 8.3125C14.3125 7.4375 13.25 7 12 7C10.75 7 9.6875 7.4375 8.8125 8.3125C7.9375 9.1875 7.5 10.25 7.5 11.5C7.5 12.75 7.9375 13.8125 8.8125 14.6875C9.6875 15.5625 10.75 16 12 16ZM12 14.2C11.25 14.2 10.6125 13.9375 10.0875 13.4125C9.5625 12.8875 9.3 12.25 9.3 11.5C9.3 10.75 9.5625 10.1125 10.0875 9.5875C10.6125 9.0625 11.25 8.8 12 8.8C12.75 8.8 13.3875 9.0625 13.9125 9.5875C14.4375 10.1125 14.7 10.75 14.7 11.5C14.7 12.25 14.4375 12.8875 13.9125 13.4125C13.3875 13.9375 12.75 14.2 12 14.2ZM12 19C9.56667 19 7.35 18.3208 5.35 16.9625C3.35 15.6042 1.9 13.7833 1 11.5C1.9 9.21667 3.35 7.39583 5.35 6.0375C7.35 4.67917 9.56667 4 12 4C14.4333 4 16.65 4.67917 18.65 6.0375C20.65 7.39583 22.1 9.21667 23 11.5C22.1 13.7833 20.65 15.6042 18.65 16.9625C16.65 18.3208 14.4333 19 12 19ZM12 17C13.8833 17 15.6125 16.5042 17.1875 15.5125C18.7625 14.5208 19.9667 13.1833 20.8 11.5C19.9667 9.81667 18.7625 8.47917 17.1875 7.4875C15.6125 6.49583 13.8833 6 12 6C10.1167 6 8.3875 6.49583 6.8125 7.4875C5.2375 8.47917 4.03333 9.81667 3.2 11.5C4.03333 13.1833 5.2375 14.5208 6.8125 15.5125C8.3875 16.5042 10.1167 17 12 17Z"
			className="fill-foreground"
		/>
	</svg>
);

const eyeOff = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M16.1 13.5L14.65 12.05C14.8 11.2667 14.575 10.5333 13.975 9.85C13.375 9.16667 12.6 8.9 11.65 9.05L10.2 7.6C10.4833 7.46667 10.7708 7.36667 11.0625 7.3C11.3542 7.23333 11.6667 7.2 12 7.2C13.25 7.2 14.3125 7.6375 15.1875 8.5125C16.0625 9.3875 16.5 10.45 16.5 11.7C16.5 12.0333 16.4667 12.3458 16.4 12.6375C16.3333 12.9292 16.2333 13.2167 16.1 13.5ZM19.3 16.65L17.85 15.25C18.4833 14.7667 19.0458 14.2375 19.5375 13.6625C20.0292 13.0875 20.45 12.4333 20.8 11.7C19.9667 10.0167 18.7708 8.67917 17.2125 7.6875C15.6542 6.69583 13.9167 6.2 12 6.2C11.5167 6.2 11.0417 6.23333 10.575 6.3C10.1083 6.36667 9.65 6.46667 9.2 6.6L7.65 5.05C8.33333 4.76667 9.03333 4.55417 9.75 4.4125C10.4667 4.27083 11.2167 4.2 12 4.2C14.5167 4.2 16.7583 4.89583 18.725 6.2875C20.6917 7.67917 22.1167 9.48333 23 11.7C22.6167 12.6833 22.1125 13.5958 21.4875 14.4375C20.8625 15.2792 20.1333 16.0167 19.3 16.65ZM19.8 22.8L15.6 18.65C15.0167 18.8333 14.4292 18.9708 13.8375 19.0625C13.2458 19.1542 12.6333 19.2 12 19.2C9.48333 19.2 7.24167 18.5042 5.275 17.1125C3.30833 15.7208 1.88333 13.9167 1 11.7C1.35 10.8167 1.79167 9.99583 2.325 9.2375C2.85833 8.47917 3.46667 7.8 4.15 7.2L1.4 4.4L2.8 3L21.2 21.4L19.8 22.8ZM5.55 8.6C5.06667 9.03333 4.625 9.50833 4.225 10.025C3.825 10.5417 3.48333 11.1 3.2 11.7C4.03333 13.3833 5.22917 14.7208 6.7875 15.7125C8.34583 16.7042 10.0833 17.2 12 17.2C12.3333 17.2 12.6583 17.1792 12.975 17.1375C13.2917 17.0958 13.6167 17.05 13.95 17L13.05 16.05C12.8667 16.1 12.6917 16.1375 12.525 16.1625C12.3583 16.1875 12.1833 16.2 12 16.2C10.75 16.2 9.6875 15.7625 8.8125 14.8875C7.9375 14.0125 7.5 12.95 7.5 11.7C7.5 11.5167 7.5125 11.3417 7.5375 11.175C7.5625 11.0083 7.6 10.8333 7.65 10.65L5.55 8.6Z"
			className="fill-foreground"
		/>
	</svg>
);
