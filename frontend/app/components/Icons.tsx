export const xIcon = (
	<svg
		className="scale-[1.2] flex-shrink-0"
		width="12"
		height="12"
		viewBox="0 0 12 12"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M1.2 12L0 10.8L4.8 6L0 1.2L1.2 0L6 4.8L10.8 0L12 1.2L7.2 6L12 10.8L10.8 12L6 7.2L1.2 12Z"
			fill="#E31937"
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

<svg
	width="25"
	height="19"
	viewBox="0 0 25 19"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M2.61642 19C1.98849 19 1.45094 18.7758 1.00378 18.3274C0.556598 17.879 0.333008 17.3399 0.333008 16.7102V13.2392C0.333008 13.0313 0.392524 12.847 0.511556 12.6862C0.630588 12.5254 0.789693 12.4158 0.988873 12.3574C1.54273 12.0991 1.99294 11.7157 2.33951 11.2071C2.68606 10.6984 2.85933 10.1292 2.85933 9.49949C2.85933 8.86975 2.68606 8.30072 2.33951 7.7924C1.99294 7.28411 1.54273 6.90086 0.988873 6.64264C0.789693 6.58419 0.630588 6.47458 0.511556 6.31382C0.392524 6.15303 0.333008 5.96871 0.333008 5.76085V2.28976C0.333008 1.66008 0.556598 1.12104 1.00378 0.672635C1.45094 0.224212 1.98849 0 2.61642 0H22.0496C22.6775 0 23.2151 0.224212 23.6622 0.672635C24.1094 1.12104 24.333 1.66008 24.333 2.28976V5.76085C24.333 5.96871 24.2735 6.15303 24.1545 6.31382C24.0354 6.47458 23.8763 6.58419 23.6771 6.64264C23.1233 6.90086 22.6731 7.28429 22.3265 7.79294C21.98 8.30157 21.8067 8.87076 21.8067 9.50051C21.8067 10.1303 21.98 10.6993 22.3265 11.2076C22.6731 11.7159 23.1233 12.0991 23.6771 12.3574C23.8763 12.4158 24.0354 12.5254 24.1545 12.6862C24.2735 12.847 24.333 13.0313 24.333 13.2392V16.7102C24.333 17.3399 24.1094 17.879 23.6622 18.3274C23.2151 18.7758 22.6775 19 22.0496 19H2.61642ZM2.61642 17.1H22.0496C22.163 17.1 22.2561 17.0635 22.329 16.9904C22.4019 16.9173 22.4383 16.8239 22.4383 16.7102V13.87C21.6593 13.4056 21.0436 12.7881 20.5909 12.0175C20.1383 11.247 19.912 10.4078 19.912 9.5C19.912 8.59222 20.1383 7.75305 20.5909 6.98249C21.0436 6.21193 21.6593 5.59443 22.4383 5.12999V2.28976C22.4383 2.17608 22.4019 2.08269 22.329 2.0096C22.2561 1.93652 22.163 1.89998 22.0496 1.89998H2.61642C2.50306 1.89998 2.40993 1.93652 2.33704 2.0096C2.26416 2.08269 2.22772 2.17608 2.22772 2.28976V5.12999C3.00667 5.59443 3.62246 6.21193 4.07509 6.98249C4.52772 7.75305 4.75404 8.59222 4.75404 9.5C4.75404 10.4078 4.52772 11.247 4.07509 12.0175C3.62246 12.7881 3.00667 13.4056 2.22772 13.87V16.7102C2.22772 16.8239 2.26416 16.9173 2.33704 16.9904C2.40993 17.0635 2.50306 17.1 2.61642 17.1ZM12.3334 15.3949C12.602 15.3949 12.8269 15.3038 13.0083 15.1216C13.1897 14.9395 13.2803 14.7137 13.2803 14.4445C13.2803 14.1752 13.1895 13.9496 13.0079 13.7677C12.8262 13.5858 12.6011 13.4949 12.3326 13.4949C12.064 13.4949 11.8391 13.586 11.6577 13.7681C11.4764 13.9503 11.3857 14.176 11.3857 14.4453C11.3857 14.7146 11.4765 14.9402 11.6581 15.1221C11.8398 15.3039 12.0649 15.3949 12.3334 15.3949ZM12.3334 10.45C12.602 10.45 12.8269 10.3589 13.0083 10.1768C13.1897 9.99458 13.2803 9.76886 13.2803 9.49959C13.2803 9.23029 13.1895 9.00471 13.0079 8.82284C12.8262 8.64097 12.6011 8.55003 12.3326 8.55003C12.064 8.55003 11.8391 8.6411 11.6577 8.82325C11.4764 9.00542 11.3857 9.23114 11.3857 9.50041C11.3857 9.76971 11.4765 9.99529 11.6581 10.1772C11.8398 10.359 12.0649 10.45 12.3334 10.45ZM12.3334 5.50511C12.602 5.50511 12.8269 5.41403 13.0083 5.23186C13.1897 5.04969 13.2803 4.82397 13.2803 4.5547C13.2803 4.28542 13.1895 4.05984 13.0079 3.87794C12.8262 3.69607 12.6011 3.60514 12.3326 3.60514C12.064 3.60514 11.8391 3.69622 11.6577 3.87839C11.4764 4.06054 11.3857 4.28626 11.3857 4.55555C11.3857 4.82482 11.4765 5.05041 11.6581 5.2323C11.8398 5.41417 12.0649 5.50511 12.3334 5.50511Z"
		fill="#121212"
	/>
</svg>;

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
