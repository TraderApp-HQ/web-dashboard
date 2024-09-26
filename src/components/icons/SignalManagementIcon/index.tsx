import React from "react";

interface IProps {
	color?: string;
}

const SignalManagementIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M22.5 12.8602H18.5L15.5 21.8602L9.5 3.86023L6.5 12.8602H2.5"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default SignalManagementIcon;
