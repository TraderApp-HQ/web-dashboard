import React from "react";

interface IProps {
	color?: string;
}

const LogoutIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M13.833 15.0269L17.9997 10.8603L13.833 6.6936"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18 10.8604H8"
				stroke="#414141"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8 18.3604H4.66667C4.22464 18.3604 3.80072 18.1848 3.48816 17.8722C3.17559 17.5596 3 17.1357 3 16.6937V5.02702C3 4.58499 3.17559 4.16107 3.48816 3.84851C3.80072 3.53595 4.22464 3.36035 4.66667 3.36035H8"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default LogoutIcon;
