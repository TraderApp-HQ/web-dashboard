import React from "react";

interface IProps {
	color?: string;
}

const PortfolioIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.5003 2.52686C5.90033 2.52686 2.16699 6.26019 2.16699 10.8602C2.16699 15.4602 5.90033 19.1935 10.5003 19.1935C15.1003 19.1935 18.8337 15.4602 18.8337 10.8602"
				stroke={color}
				strokeWidth="1.5"
				stroke-miterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.833 2.52686L11.9997 9.36019M11.333 6.00186V10.0269H15.358"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default PortfolioIcon;
