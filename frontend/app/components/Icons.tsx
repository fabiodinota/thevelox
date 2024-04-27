interface IconProps {
	fill?: string;
	className?: string;
}

export const xIcon = ({ fill, className }: IconProps) => (
	<svg
		className={"scale-[1.2] flex-shrink-0 " + className}
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.2 12L0 10.8L4.8 6L0 1.2L1.2 0L6 4.8L10.8 0L12 1.2L7.2 6L12 10.8L10.8 12L6 7.2L1.2 12Z"
			className={`fill-${fill}`}
		/>
	</svg>
);

export const checkIcon = (
	<svg
		className="scale-[1.2] flex-shrink-0"
		width="12"
		height="12"
		viewBox="0 0 12 10"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 9.69981L0 5.69981L1.4 4.29981L4 6.89981L10.6 0.299805L12 1.6998L4 9.69981Z"
			fill="#00B252"
		/>
	</svg>
);

export const IconGradient = () => (
	<>
		<defs>
			<linearGradient id="myGradient" gradientTransform="rotate(45)">
				<stop offset="0%" stopColor="rgba(228, 43, 43, 1)" />
				<stop offset="81%" stopColor="rgba(244, 126, 82, 1)" />
			</linearGradient>
		</defs>
	</>
);

export const AccountCircleIcon = (active: boolean) => (
	<svg
		width="22"
		height="22"
		viewBox="0 0 22 22"
		className="w-6 h-6 xl:w-7 xl:h-7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{active && <IconGradient />}
		<path
			d="M4.07936 17.128C5.06357 16.3976 6.13574 15.8209 7.29586 15.3978C8.45597 14.9747 9.69069 14.7632 11 14.7632C12.3093 14.7632 13.544 14.9747 14.7041 15.3978C15.8643 15.8209 16.9364 16.3976 17.9206 17.128C18.6406 16.3367 19.211 15.4208 19.6319 14.3802C20.0528 13.3396 20.2632 12.2128 20.2632 11C20.2632 8.43333 19.361 6.2478 17.5566 4.4434C15.7522 2.63901 13.5667 1.73682 11 1.73682C8.43333 1.73682 6.24779 2.63901 4.4434 4.4434C2.63901 6.2478 1.73682 8.43333 1.73682 11C1.73682 12.2128 1.94725 13.3396 2.3681 14.3802C2.78896 15.4208 3.35938 16.3367 4.07936 17.128ZM11.0003 13.0263C9.94317 13.0263 9.05162 12.6634 8.32572 11.9378C7.59981 11.2121 7.23686 10.3207 7.23686 9.26349C7.23686 8.20631 7.5997 7.31477 8.32537 6.58886C9.05106 5.86295 9.94249 5.5 10.9997 5.5C12.0568 5.5 12.9484 5.86284 13.6743 6.58851C14.4002 7.3142 14.7631 8.20563 14.7631 9.26279C14.7631 10.32 14.4003 11.2115 13.6746 11.9374C12.9489 12.6633 12.0575 13.0263 11.0003 13.0263ZM11 22C9.47246 22 8.03957 21.7127 6.70133 21.1382C5.36307 20.5637 4.19887 19.7814 3.20871 18.7913C2.21857 17.8011 1.43626 16.6369 0.861765 15.2987C0.287255 13.9604 0 12.5275 0 11C0 9.47246 0.287255 8.03957 0.861765 6.70133C1.43626 5.36307 2.21857 4.19887 3.20871 3.20871C4.19887 2.21857 5.36307 1.43626 6.70133 0.861766C8.03957 0.287256 9.47246 0 11 0C12.5275 0 13.9604 0.287256 15.2987 0.861766C16.6369 1.43626 17.8011 2.21857 18.7913 3.20871C19.7814 4.19887 20.5637 5.36307 21.1382 6.70133C21.7127 8.03957 22 9.47246 22 11C22 12.5275 21.7127 13.9604 21.1382 15.2987C20.5637 16.6369 19.7814 17.8011 18.7913 18.7913C17.8011 19.7814 16.6369 20.5637 15.2987 21.1382C13.9604 21.7127 12.5275 22 11 22ZM11 20.2632C12.0451 20.2632 13.0527 20.0951 14.0228 19.7588C14.9929 19.4226 15.8543 18.9524 16.6069 18.3482C15.8543 17.7663 15.004 17.3128 14.0562 16.9877C13.1083 16.6625 12.0896 16.5 11 16.5C9.91038 16.5 8.88979 16.6607 7.93823 16.9821C6.98667 17.3035 6.13829 17.7588 5.39308 18.3482C6.14572 18.9524 7.0071 19.4226 7.97722 19.7588C8.94733 20.0951 9.95492 20.2632 11 20.2632ZM11 11.2895C11.576 11.2895 12.0577 11.0958 12.4452 10.7083C12.8326 10.3208 13.0263 9.83912 13.0263 9.26314C13.0263 8.68716 12.8326 8.20544 12.4452 7.81797C12.0577 7.43052 11.576 7.23679 11 7.23679C10.424 7.23679 9.9423 7.43052 9.55483 7.81797C9.16737 8.20544 8.97365 8.68716 8.97365 9.26314C8.97365 9.83912 9.16737 10.3208 9.55483 10.7083C9.9423 11.0958 10.424 11.2895 11 11.2895Z"
			className={`${
				active ? "fill-[url(#myGradient)]" : "fill-foreground"
			}`}
		/>
	</svg>
);

export const TicketIcon = (active: boolean) => (
	<svg
		width="25"
		height="19"
		viewBox="0 0 25 19"
		className="w-6 h-6 xl:w-7 xl:h-7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{active && <IconGradient />}
		<path
			d="M2.61642 19C1.98849 19 1.45094 18.7758 1.00378 18.3274C0.556598 17.879 0.333008 17.3399 0.333008 16.7102V13.2392C0.333008 13.0313 0.392524 12.847 0.511556 12.6862C0.630588 12.5254 0.789693 12.4158 0.988873 12.3574C1.54273 12.0991 1.99294 11.7157 2.33951 11.2071C2.68606 10.6984 2.85933 10.1292 2.85933 9.49949C2.85933 8.86975 2.68606 8.30072 2.33951 7.7924C1.99294 7.28411 1.54273 6.90086 0.988873 6.64264C0.789693 6.58419 0.630588 6.47458 0.511556 6.31382C0.392524 6.15303 0.333008 5.96871 0.333008 5.76085V2.28976C0.333008 1.66008 0.556598 1.12104 1.00378 0.672635C1.45094 0.224212 1.98849 0 2.61642 0H22.0496C22.6775 0 23.2151 0.224212 23.6622 0.672635C24.1094 1.12104 24.333 1.66008 24.333 2.28976V5.76085C24.333 5.96871 24.2735 6.15303 24.1545 6.31382C24.0354 6.47458 23.8763 6.58419 23.6771 6.64264C23.1233 6.90086 22.6731 7.28429 22.3265 7.79294C21.98 8.30157 21.8067 8.87076 21.8067 9.50051C21.8067 10.1303 21.98 10.6993 22.3265 11.2076C22.6731 11.7159 23.1233 12.0991 23.6771 12.3574C23.8763 12.4158 24.0354 12.5254 24.1545 12.6862C24.2735 12.847 24.333 13.0313 24.333 13.2392V16.7102C24.333 17.3399 24.1094 17.879 23.6622 18.3274C23.2151 18.7758 22.6775 19 22.0496 19H2.61642ZM2.61642 17.1H22.0496C22.163 17.1 22.2561 17.0635 22.329 16.9904C22.4019 16.9173 22.4383 16.8239 22.4383 16.7102V13.87C21.6593 13.4056 21.0436 12.7881 20.5909 12.0175C20.1383 11.247 19.912 10.4078 19.912 9.5C19.912 8.59222 20.1383 7.75305 20.5909 6.98249C21.0436 6.21193 21.6593 5.59443 22.4383 5.12999V2.28976C22.4383 2.17608 22.4019 2.08269 22.329 2.0096C22.2561 1.93652 22.163 1.89998 22.0496 1.89998H2.61642C2.50306 1.89998 2.40993 1.93652 2.33704 2.0096C2.26416 2.08269 2.22772 2.17608 2.22772 2.28976V5.12999C3.00667 5.59443 3.62246 6.21193 4.07509 6.98249C4.52772 7.75305 4.75404 8.59222 4.75404 9.5C4.75404 10.4078 4.52772 11.247 4.07509 12.0175C3.62246 12.7881 3.00667 13.4056 2.22772 13.87V16.7102C2.22772 16.8239 2.26416 16.9173 2.33704 16.9904C2.40993 17.0635 2.50306 17.1 2.61642 17.1ZM12.3334 15.3949C12.602 15.3949 12.8269 15.3038 13.0083 15.1216C13.1897 14.9395 13.2803 14.7137 13.2803 14.4445C13.2803 14.1752 13.1895 13.9496 13.0079 13.7677C12.8262 13.5858 12.6011 13.4949 12.3326 13.4949C12.064 13.4949 11.8391 13.586 11.6577 13.7681C11.4764 13.9503 11.3857 14.176 11.3857 14.4453C11.3857 14.7146 11.4765 14.9402 11.6581 15.1221C11.8398 15.3039 12.0649 15.3949 12.3334 15.3949ZM12.3334 10.45C12.602 10.45 12.8269 10.3589 13.0083 10.1768C13.1897 9.99458 13.2803 9.76886 13.2803 9.49959C13.2803 9.23029 13.1895 9.00471 13.0079 8.82284C12.8262 8.64097 12.6011 8.55003 12.3326 8.55003C12.064 8.55003 11.8391 8.6411 11.6577 8.82325C11.4764 9.00542 11.3857 9.23114 11.3857 9.50041C11.3857 9.76971 11.4765 9.99529 11.6581 10.1772C11.8398 10.359 12.0649 10.45 12.3334 10.45ZM12.3334 5.50511C12.602 5.50511 12.8269 5.41403 13.0083 5.23186C13.1897 5.04969 13.2803 4.82397 13.2803 4.5547C13.2803 4.28542 13.1895 4.05984 13.0079 3.87794C12.8262 3.69607 12.6011 3.60514 12.3326 3.60514C12.064 3.60514 11.8391 3.69622 11.6577 3.87839C11.4764 4.06054 11.3857 4.28626 11.3857 4.55555C11.3857 4.82482 11.4765 5.05041 11.6581 5.2323C11.8398 5.41417 12.0649 5.50511 12.3334 5.50511Z"
			className={`${
				active ? "fill-[url(#myGradient)]" : "fill-foreground"
			}`}
		/>
	</svg>
);

export const HomeIcon = (active: boolean) => (
	<svg
		width="20"
		height="22"
		viewBox="0 0 20 22"
		className="w-6 h-6 xl:w-7 xl:h-7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{active && <IconGradient />}
		<path
			d="M1.99997 19.993H6.46155V13.2514C6.46155 12.9088 6.57704 12.6216 6.80802 12.3898C7.039 12.158 7.32522 12.0421 7.66669 12.0421H12.3333C12.6748 12.0421 12.961 12.158 13.192 12.3898C13.423 12.6216 13.5384 12.9088 13.5384 13.2514V19.993H18V8.15671C18 8.0881 17.9851 8.02591 17.9552 7.97016C17.9252 7.91441 17.8846 7.86509 17.8334 7.82221L10.2436 2.09704C10.1752 2.03701 10.094 2.00699 10 2.00699C9.90598 2.00699 9.82478 2.03701 9.7564 2.09704L2.16664 7.82221C2.11537 7.86509 2.07477 7.91441 2.04484 7.97016C2.01493 8.02591 1.99997 8.0881 1.99997 8.15671V19.993ZM0 19.993V8.15671C0 7.77375 0.0853669 7.41095 0.256101 7.06831C0.426835 6.72566 0.662835 6.44349 0.964103 6.22178L8.55386 0.483759C8.97504 0.161252 9.4564 0 9.99793 0C10.5395 0 11.0222 0.161252 11.4461 0.483759L19.0359 6.22178C19.3372 6.44349 19.5732 6.72566 19.7439 7.06831C19.9146 7.41095 20 7.77375 20 8.15671V19.993C20 20.5402 19.803 21.0115 19.409 21.4069C19.015 21.8023 18.5453 22 18 22H12.7436C12.4022 22 12.1159 21.8841 11.8849 21.6523C11.654 21.4205 11.5385 21.1333 11.5385 20.7906V14.0491H8.46153V20.7906C8.46153 21.1333 8.34604 21.4205 8.11506 21.6523C7.88406 21.8841 7.59784 22 7.25639 22H1.99997C1.45468 22 0.985036 21.8023 0.591035 21.4069C0.197011 21.0115 0 20.5402 0 19.993Z"
			className={`${
				active ? "fill-[url(#myGradient)]" : "fill-foreground"
			}`}
		/>
	</svg>
);

export const SearchIcon = (active: boolean) => (
	<svg
		width="23"
		height="22"
		viewBox="0 0 23 22"
		className="w-6 h-6 xl:w-7 xl:h-7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{active && <IconGradient />}
		<path
			d="M21.9927 21.3257C21.6203 21.6981 21.0166 21.6981 20.6442 21.3257L13.2813 13.9628C12.6415 14.4911 11.9057 14.9045 11.0739 15.2031C10.2421 15.5017 9.38166 15.651 8.49248 15.651C6.30535 15.651 4.45432 14.8937 2.93939 13.3792C1.42446 11.8646 0.666992 10.0141 0.666992 7.8275C0.666992 5.64093 1.42427 3.78969 2.93881 2.2738C4.45336 0.757934 6.30392 0 8.49049 0C10.677 0 12.5283 0.757467 14.0442 2.2724C15.5601 3.78733 16.318 5.63836 16.318 7.82549C16.318 8.73928 16.1646 9.61206 15.8578 10.4438C15.551 11.2756 15.1417 11.9991 14.6298 12.6143L21.9927 19.9772C22.3651 20.3496 22.3651 20.9534 21.9927 21.3257ZM8.49248 13.7316C10.1413 13.7316 11.5378 13.1594 12.6821 12.0151C13.8264 10.8708 14.3986 9.47427 14.3986 7.82549C14.3986 6.1767 13.8264 4.78016 12.6821 3.63586C11.5378 2.49156 10.1413 1.91941 8.49248 1.91941C6.8437 1.91941 5.44715 2.49156 4.30285 3.63586C3.15857 4.78016 2.58643 6.1767 2.58643 7.82549C2.58643 9.47427 3.15857 10.8708 4.30285 12.0151C5.44715 13.1594 6.8437 13.7316 8.49248 13.7316Z"
			className={`${
				active ? "fill-[url(#myGradient)]" : "fill-foreground"
			}`}
		/>
	</svg>
);

export const ArrowIcon = (active: boolean, className: string) => (
	<svg
		width="14"
		height="22"
		viewBox="0 0 14 22"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 1.5L2.76316 10.275C2.34816 10.6693 2.34816 11.3307 2.76316 11.725L12 20.5"
			className="stroke-foreground"
			strokeWidth="3"
			strokeLinecap="round"
		/>
	</svg>
);

export const Line11Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73076 0 12.8 0H51.2C58.2692 0 64 5.73076 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#E31937"
		/>
		<path
			d="M19.04 46.72V25.12H18.88L11.8 29.8V22.7L19.04 17.86H27.52V46.72H19.04Z"
			className="fill-background"
		/>
		<path
			d="M40.2 46.72V25.12H40.04L32.96 29.8V22.7L40.2 17.86H48.68V46.72H40.2Z"
			className="fill-background"
		/>
	</svg>
);

export const Line12Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73075 0 12.8 0H51.2C58.2692 0 64 5.73075 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#F7941D"
		/>
		<path
			d="M16.48 46.72V25.12H16.32L9.24 29.8V22.7L16.48 17.86H24.96V46.72H16.48Z"
			className="fill-background"
		/>
		<path
			d="M30.58 46.72V40.94L40.82 32.46C42.0067 31.4867 42.8933 30.6733 43.48 30.02C44.08 29.3533 44.48 28.7667 44.68 28.26C44.8933 27.74 45 27.2133 45 26.68V26.64C45 26.04 44.8533 25.5133 44.56 25.06C44.28 24.6067 43.8867 24.2533 43.38 24C42.8733 23.7333 42.2867 23.6 41.62 23.6C40.86 23.6 40.2 23.7467 39.64 24.04C39.0933 24.3333 38.6667 24.7467 38.36 25.28C38.0533 25.8 37.8733 26.4067 37.82 27.1L37.8 27.36H30.08V27.16C30.08 25.2 30.5667 23.4867 31.54 22.02C32.5133 20.54 33.8667 19.3933 35.6 18.58C37.3333 17.7533 39.34 17.34 41.62 17.34C43.9533 17.34 45.98 17.7067 47.7 18.44C49.4333 19.16 50.7733 20.18 51.72 21.5C52.68 22.8067 53.16 24.3467 53.16 26.12V26.16C53.16 27.44 52.94 28.58 52.5 29.58C52.06 30.58 51.36 31.5733 50.4 32.56C49.4533 33.5467 48.2067 34.6667 46.66 35.92L40.82 40.32H37.88H53.5V46.72H30.58Z"
			className="fill-background"
		/>
	</svg>
);

export const Line13Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73076 0 12.8 0H51.2C58.2692 0 64 5.73076 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#FFD200"
		/>
		<path
			d="M16.48 46.72V25.12H16.32L9.24 29.8V22.7L16.48 17.86H24.96V46.72H16.48Z"
			className="fill-background"
		/>
		<path
			d="M42.32 47.24C39.9467 47.24 37.8667 46.8667 36.08 46.12C34.3067 45.3733 32.9 44.3333 31.86 43C30.82 41.6533 30.2267 40.08 30.08 38.28L30.06 38.02H38.14L38.18 38.26C38.26 38.6867 38.4733 39.0867 38.82 39.46C39.1667 39.82 39.6333 40.1133 40.22 40.34C40.8067 40.5533 41.5 40.66 42.3 40.66C43.1 40.66 43.7867 40.54 44.36 40.3C44.9333 40.0467 45.3733 39.7067 45.68 39.28C45.9867 38.84 46.14 38.34 46.14 37.78V37.74C46.14 36.7533 45.7533 36.0067 44.98 35.5C44.2067 34.98 43.0867 34.72 41.62 34.72H38.64V29.14H41.62C42.5 29.14 43.2467 29.0267 43.86 28.8C44.4733 28.5733 44.94 28.2467 45.26 27.82C45.5933 27.38 45.76 26.8667 45.76 26.28V26.24C45.76 25.68 45.62 25.2 45.34 24.8C45.06 24.3867 44.6533 24.0733 44.12 23.86C43.6 23.6333 42.98 23.52 42.26 23.52C41.5133 23.52 40.86 23.6333 40.3 23.86C39.7533 24.0867 39.32 24.4 39 24.8C38.68 25.2 38.4867 25.66 38.42 26.18L38.4 26.36H30.76L30.78 26.06C30.9 24.2867 31.44 22.7533 32.4 21.46C33.3733 20.1533 34.7 19.14 36.38 18.42C38.06 17.7 40.02 17.34 42.26 17.34C44.5667 17.34 46.5667 17.66 48.26 18.3C49.9533 18.9267 51.26 19.82 52.18 20.98C53.1 22.1267 53.56 23.4867 53.56 25.06V25.1C53.56 26.3133 53.2867 27.3733 52.74 28.28C52.1933 29.1733 51.4667 29.9 50.56 30.46C49.6667 31.02 48.6933 31.4067 47.64 31.62V31.78C49.8267 32.0067 51.56 32.6867 52.84 33.82C54.12 34.9533 54.76 36.4533 54.76 38.32V38.36C54.76 40.1867 54.2533 41.7667 53.24 43.1C52.24 44.42 50.8133 45.44 48.96 46.16C47.1067 46.88 44.8933 47.24 42.32 47.24Z"
			className="fill-background"
		/>
	</svg>
);

export const Line14Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73076 0 12.8 0H51.2C58.2692 0 64 5.73076 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#00A94F"
		/>
		<path
			d="M16.48 46.72V25.12H16.32L9.24 29.8V22.7L16.48 17.86H24.96V46.72H16.48Z"
			className="fill-background"
		/>
		<path
			d="M44.36 46.72V42.14H30.16V35.32C30.8533 34.16 31.5467 33 32.24 31.84C32.9467 30.6667 33.6467 29.5 34.34 28.34C35.0467 27.18 35.7467 26.02 36.44 24.86C37.1467 23.6867 37.8467 22.52 38.54 21.36C39.2467 20.1867 39.9467 19.02 40.64 17.86H52.36V35.64H55.9V42.14H52.36V46.72H44.36ZM37.1 35.98H44.6V23.52H44.44C43.9467 24.3333 43.4533 25.1467 42.96 25.96C42.48 26.7733 41.9933 27.5867 41.5 28.4C41.02 29.2133 40.5333 30.0333 40.04 30.86C39.5467 31.6733 39.0533 32.4867 38.56 33.3C38.08 34.1133 37.5933 34.9267 37.1 35.74V35.98Z"
			className="fill-background"
		/>
	</svg>
);

export const Line15Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73076 0 12.8 0H51.2C58.2692 0 64 5.73076 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#0076C0"
		/>
		<path
			d="M16.48 46.72V25.12H16.32L9.24 29.8V22.7L16.48 17.86H24.96V46.72H16.48Z"
			className="fill-background"
		/>
		<path
			d="M42.82 47.24C40.4733 47.24 38.44 46.8533 36.72 46.08C35 45.2933 33.6533 44.2333 32.68 42.9C31.72 41.5667 31.1933 40.0733 31.1 38.42L31.08 38.06H38.7L38.74 38.18C38.9133 38.6733 39.1867 39.12 39.56 39.52C39.9333 39.92 40.3933 40.24 40.94 40.48C41.5 40.72 42.1267 40.84 42.82 40.84C43.62 40.84 44.3267 40.68 44.94 40.36C45.5533 40.0267 46.0333 39.5667 46.38 38.98C46.74 38.3933 46.92 37.72 46.92 36.96V36.92C46.92 36.16 46.74 35.4933 46.38 34.92C46.0333 34.3467 45.5467 33.9 44.92 33.58C44.3067 33.26 43.6 33.1 42.8 33.1C42.3067 33.1 41.8467 33.1667 41.42 33.3C40.9933 33.42 40.6067 33.5867 40.26 33.8C39.9533 34 39.68 34.2333 39.44 34.5C39.2 34.7533 39.0067 35.02 38.86 35.3H31.54L32.7 17.86H53V24.26H39.34L38.9 30.82H39.06C39.42 30.1667 39.9067 29.6 40.52 29.12C41.1467 28.6267 41.88 28.24 42.72 27.96C43.5733 27.68 44.5067 27.54 45.52 27.54C47.3333 27.54 48.94 27.94 50.34 28.74C51.74 29.5267 52.84 30.6133 53.64 32C54.4533 33.3867 54.86 34.9733 54.86 36.76V36.8C54.86 38.8933 54.3533 40.7267 53.34 42.3C52.34 43.86 50.9333 45.0733 49.12 45.94C47.32 46.8067 45.22 47.24 42.82 47.24Z"
			className="fill-background"
		/>
	</svg>
);

export const Line16Icon = (className: string) => (
	<svg
		width="64"
		height="64"
		viewBox="0 0 64 64"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M0 12.8C0 5.73075 5.73076 0 12.8 0H51.2C58.2692 0 64 5.73076 64 12.8V51.2C64 58.2692 58.2692 64 51.2 64H12.8C5.73075 64 0 58.2692 0 51.2V12.8Z"
			fill="#A1A2A1"
		/>
		<path
			d="M16.2 46.66V25.06H16.04L8.96 29.74V22.64L16.2 17.8H24.68V46.66H16.2Z"
			className="fill-background"
		/>
		<path
			d="M43.14 47.18C40.98 47.18 39.08 46.82 37.44 46.1C35.8133 45.38 34.4467 44.36 33.34 43.04C32.2333 41.7067 31.4 40.1267 30.84 38.3C30.28 36.46 30 34.4333 30 32.22V32.18C30 29.1133 30.5267 26.4667 31.58 24.24C32.6467 22.0133 34.1533 20.3 36.1 19.1C38.0467 17.8867 40.3467 17.28 43 17.28C45.0933 17.28 46.98 17.6533 48.66 18.4C50.34 19.1333 51.7133 20.1333 52.78 21.4C53.86 22.6667 54.5267 24.0867 54.78 25.66L54.8 25.78H46.54L46.48 25.66C46.2933 25.2867 46.04 24.9533 45.72 24.66C45.4 24.3667 45.0133 24.1333 44.56 23.96C44.12 23.7733 43.6 23.68 43 23.68C41.9867 23.68 41.1333 23.9733 40.44 24.56C39.7467 25.1467 39.2067 25.96 38.82 27C38.4467 28.04 38.2067 29.2533 38.1 30.64C38.0867 30.8933 38.0733 31.16 38.06 31.44C38.06 31.7067 38.06 31.9733 38.06 32.24L39.02 37.1C39.02 37.8067 39.1933 38.44 39.54 39C39.9 39.5467 40.38 39.98 40.98 40.3C41.5933 40.62 42.2733 40.78 43.02 40.78C43.7533 40.78 44.42 40.62 45.02 40.3C45.6333 39.98 46.12 39.5467 46.48 39C46.8533 38.44 47.04 37.82 47.04 37.14V37.1C47.04 36.3533 46.86 35.7 46.5 35.14C46.14 34.5667 45.66 34.1267 45.06 33.82C44.4733 33.5 43.8133 33.34 43.08 33.34C42.32 33.34 41.6333 33.5 41.02 33.82C40.4067 34.1267 39.92 34.56 39.56 35.12C39.2 35.68 39.02 36.3267 39.02 37.06V37.1L38.06 32.24L38.22 32.22C38.5933 31.2867 39.1333 30.4733 39.84 29.78C40.56 29.0867 41.4333 28.5467 42.46 28.16C43.4867 27.7733 44.6467 27.58 45.94 27.58C47.8333 27.58 49.4667 27.9733 50.84 28.76C52.2133 29.5467 53.2733 30.6333 54.02 32.02C54.78 33.3933 55.16 34.9733 55.16 36.76V36.8C55.16 38.84 54.64 40.64 53.6 42.2C52.56 43.76 51.1333 44.98 49.32 45.86C47.5067 46.74 45.4467 47.18 43.14 47.18Z"
			className="fill-background"
		/>
	</svg>
);

export const LineArrowIcon = (className: string) => (
	<svg
		width="16"
		height="11"
		viewBox="0 0 16 11"
		className={className}
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12.8 6.25227H1.43848C1.22566 6.25227 1.04746 6.18048 0.903876 6.0369C0.760276 5.89332 0.688477 5.71512 0.688477 5.5023C0.688477 5.28948 0.760276 5.11128 0.903876 4.9677C1.04746 4.82412 1.22566 4.75232 1.43848 4.75232H12.8L9.50768 1.45997C9.35896 1.31126 9.28557 1.13722 9.2875 0.937873C9.28942 0.738523 9.36281 0.561282 9.50768 0.406149C9.66281 0.251032 9.84101 0.170907 10.0423 0.165774C10.2436 0.160641 10.4218 0.235641 10.5769 0.390774L15.0557 4.86962C15.1493 4.96321 15.2153 5.06192 15.2538 5.16577C15.2923 5.26961 15.3115 5.38178 15.3115 5.5023C15.3115 5.62282 15.2923 5.73499 15.2538 5.83882C15.2153 5.94267 15.1493 6.04139 15.0557 6.13497L10.5769 10.6138C10.4282 10.7625 10.2516 10.8359 10.0471 10.834C9.84262 10.8321 9.66281 10.7536 9.50768 10.5984C9.36281 10.4433 9.28781 10.2677 9.28268 10.0715C9.27756 9.87537 9.35256 9.69974 9.50768 9.54462L12.8 6.25227Z"
			className="fill-foreground"
		/>
	</svg>
);
