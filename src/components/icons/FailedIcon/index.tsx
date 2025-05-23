import React from "react";

interface IProps {
	color?: string;
}

const FailedIcon: React.FC<IProps> = ({ color = "#E02D3C" }) => {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19.2502 10C19.2502 16.937 16.9372 19.25 10.0002 19.25C3.06324 19.25 0.750244 16.937 0.750244 10C0.750244 3.063 3.06324 0.75 10.0002 0.75C16.9372 0.75 19.2502 3.063 19.2502 10Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.0002 13.895V10"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M10.0045 6.5H9.9955"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default FailedIcon;
