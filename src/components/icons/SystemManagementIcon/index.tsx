import React from "react";

interface IProps {
	color?: string;
}

const SystemManagementIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M20.5 14.8602H4.5C3.39543 14.8602 2.5 15.7557 2.5 16.8602V20.8602C2.5 21.9648 3.39543 22.8602 4.5 22.8602H20.5C21.6046 22.8602 22.5 21.9648 22.5 20.8602V16.8602C22.5 15.7557 21.6046 14.8602 20.5 14.8602Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 18.8602H6.51"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M20.5 2.86023H4.5C3.39543 2.86023 2.5 3.75566 2.5 4.86023V8.86023C2.5 9.9648 3.39543 10.8602 4.5 10.8602H20.5C21.6046 10.8602 22.5 9.9648 22.5 8.86023V4.86023C22.5 3.75566 21.6046 2.86023 20.5 2.86023Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 6.86023H6.51"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default SystemManagementIcon;
