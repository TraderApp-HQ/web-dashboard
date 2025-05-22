import React from "react";

interface IProps {
	color?: string;
}

const TaskCenterIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
		>
			<path
				d="M8 16.6102V3.11023L9.5 3.86023L11 3.11023L12.4972 3.86023L14.0145 3.11023L15.5 3.86023L16.9902 3.11023L18.4869 3.86023L20 3.11023L21.5005 3.86023L23 3.11023V13.6102"
				stroke={color}
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
			<path
				d="M23 13.6102V18.8602C23 19.8548 22.6049 20.8086 21.9017 21.5119C21.1984 22.2151 20.2446 22.6102 19.25 22.6102M19.25 22.6102C18.2555 22.6102 17.3016 22.2151 16.5984 21.5119C15.8951 20.8086 15.5 19.8548 15.5 18.8602V16.6102H2.75003C2.65129 16.6094 2.55337 16.6282 2.46198 16.6655C2.37059 16.7029 2.28757 16.7581 2.21775 16.8279C2.14793 16.8978 2.09272 16.9808 2.05534 17.0722C2.01796 17.1636 1.99915 17.2615 2.00003 17.3602C2.00003 20.3602 2.31597 22.6102 5.75003 22.6102H19.25Z"
				stroke={color}
				stroke-width="1.5"
				stroke-linejoin="round"
			/>
			<path
				d="M11 7.61023H20M14 11.3602H20"
				stroke={color}
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

export default TaskCenterIcon;
