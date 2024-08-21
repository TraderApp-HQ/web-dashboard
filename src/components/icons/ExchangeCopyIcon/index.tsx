import React from "react";

interface IProps {
	color?: string;
}

const ExchangeCopyIcon: React.FC<IProps> = ({ color = "#1836B2" }) => {
	return (
		<svg
			width="24"
			height="25"
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14 7.5C14 6.568 14 6.102 13.848 5.735C13.7475 5.49218 13.6001 5.27155 13.4143 5.08572C13.2284 4.8999 13.0078 4.75251 12.765 4.652C12.398 4.5 11.932 4.5 11 4.5H8C6.114 4.5 5.172 4.5 4.586 5.086C4 5.672 4 6.614 4 8.5V11.5C4 12.432 4 12.898 4.152 13.265C4.25251 13.5078 4.3999 13.7284 4.58572 13.9143C4.77155 14.1001 4.99218 14.2475 5.235 14.348C5.602 14.5 6.068 14.5 7 14.5"
				stroke={color}
				stroke-width="1.5"
			/>
			<path
				d="M18 10.5H12C10.8954 10.5 10 11.3954 10 12.5V18.5C10 19.6046 10.8954 20.5 12 20.5H18C19.1046 20.5 20 19.6046 20 18.5V12.5C20 11.3954 19.1046 10.5 18 10.5Z"
				stroke={color}
				stroke-width="1.5"
			/>
		</svg>
	);
};

export default ExchangeCopyIcon;
