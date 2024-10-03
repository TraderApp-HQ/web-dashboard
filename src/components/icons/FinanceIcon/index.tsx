import React from "react";

interface IProps {
	color?: string;
}

const FinanceIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12.4612 17.377V14.749"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M21.5895 12.338L21.5605 12.359C19.1385 13.851 15.9405 14.752 12.4565 14.752C8.97252 14.752 5.78352 13.851 3.36252 12.359L3.33252 12.338"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.25024 14.2109C3.25024 8.05893 5.55324 6.00793 12.4612 6.00793C19.3702 6.00793 21.6722 8.05893 21.6722 14.2109C21.6722 20.3629 19.3702 22.4139 12.4612 22.4139C5.55324 22.4139 3.25024 20.3629 3.25024 14.2109Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M15.7239 6.22955V5.59955C15.7239 4.33555 14.8009 3.31055 13.6639 3.31055H11.2589C10.1219 3.31055 9.19885 4.33555 9.19885 5.59955V6.22955"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default FinanceIcon;
