import React from "react";

interface BackBtnIconProps {
	onClick?: () => void;
}

export default function BackBtnIcon({ onClick }: BackBtnIconProps) {
	return (
		<svg
			onClick={onClick}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{ cursor: onClick ? "pointer" : "default" }} // Optional: change cursor if onClick is provided
		>
			<path
				d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z"
				fill="black"
			/>
		</svg>
	);
}
