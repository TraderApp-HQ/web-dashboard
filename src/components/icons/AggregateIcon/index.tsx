import React from "react";

interface IProps {
	color?: string;
}

const AggregateIcon: React.FC<IProps> = ({ color = "#414141" }) => {
	return (
		<svg
			width="25"
			height="25"
			viewBox="0 0 25 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M7.41711 15.7141L10.4101 11.8251L13.8241 14.5051L16.7531 10.7251"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.1671 3.21024C21.2291 3.21024 22.0891 4.07024 22.0891 5.13224C22.0891 6.19324 21.2291 7.05424 20.1671 7.05424C19.1051 7.05424 18.2451 6.19324 18.2451 5.13224C18.2451 4.07024 19.1051 3.21024 20.1671 3.21024Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M21.2555 10.1292C21.3885 11.0242 21.4495 12.0322 21.4495 13.1632C21.4495 20.1012 19.1375 22.4132 12.1995 22.4132C5.26246 22.4132 2.94946 20.1012 2.94946 13.1632C2.94946 6.22624 5.26246 3.91324 12.1995 3.91324C13.3095 3.91324 14.3005 3.97224 15.1825 4.10024"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default AggregateIcon;
