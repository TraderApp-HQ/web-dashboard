import React from "react";

interface RightArrowIconProps {
	color?: string;
}

const RightArrowIcon: React.FC<RightArrowIconProps> = ({ color = "#08123B" }) => {
	return (
		<svg
			width="21"
			height="20"
			viewBox="0 0 21 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8 15L13 10L8 5"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default RightArrowIcon;
