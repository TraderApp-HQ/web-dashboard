import React from "react";

interface IProps {
	color?: string;
}

const TransferIcon: React.FC<IProps> = ({ color = "#808080" }) => {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4.1665 3.3335L1.6665 5.8335M1.6665 5.8335L4.1665 8.3335M1.6665 5.8335H18.3332M15.8332 11.6668L18.3332 14.1668M18.3332 14.1668L15.8332 16.6668M18.3332 14.1668H1.6665"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default TransferIcon;
