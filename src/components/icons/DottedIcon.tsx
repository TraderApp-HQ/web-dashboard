import React from "react";

interface DottedIconProps {
	orientation?: "vertical" | "horizontal";
}

const DottedIcon: React.FC<DottedIconProps> = ({ orientation = "vertical" }) => {
	if (orientation === "horizontal") {
		return (
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12Z"
					fill="#98A2B3"
					stroke="#98A2B3"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
					fill="#98A2B3"
					stroke="#98A2B3"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M21 12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12C19 11.4477 19.4477 11 20 11C20.5523 11 21 11.4477 21 12Z"
					fill="#98A2B3"
					stroke="#98A2B3"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}
	return (
		<svg
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.4998 11.6392C10.9601 11.6392 11.3332 11.2661 11.3332 10.8058C11.3332 10.3456 10.9601 9.97249 10.4998 9.97249C10.0396 9.97249 9.6665 10.3456 9.6665 10.8058C9.6665 11.2661 10.0396 11.6392 10.4998 11.6392Z"
				stroke="#98A2B3"
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.4998 5.80583C10.9601 5.80583 11.3332 5.43273 11.3332 4.97249C11.3332 4.51226 10.9601 4.13916 10.4998 4.13916C10.0396 4.13916 9.6665 4.51226 9.6665 4.97249C9.6665 5.43273 10.0396 5.80583 10.4998 5.80583Z"
				stroke="#98A2B3"
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.4998 17.4725C10.9601 17.4725 11.3332 17.0994 11.3332 16.6392C11.3332 16.1789 10.9601 15.8058 10.4998 15.8058C10.0396 15.8058 9.6665 16.1789 9.6665 16.6392C9.6665 17.0994 10.0396 17.4725 10.4998 17.4725Z"
				stroke="#98A2B3"
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default DottedIcon;
