import React from "react";

interface IProps {
	color?: string;
}

const SignalsIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="20"
			height="21"
			viewBox="0 0 20 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M18.3337 10.8602H15.0003L12.5003 18.3602L7.50033 3.36023L5.00033 10.8602H1.66699"
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default SignalsIcon;
