import { SVGAttributes } from "react";

function CheckIcon(props: SVGAttributes<SVGElement>) {
	return (
		<svg
			width="20"
			height="21"
			viewBox="0 0 20 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect x="0.5" y="1" width="19" height="19" rx="5.5" fill="#F9F5FF" />
			<rect x="0.5" y="1" width="19" height="19" rx="5.5" stroke="#1836B2" />
			<path
				d="M14.6667 7L8.25004 13.4167L5.33337 10.5"
				stroke="#1836B2"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
export default CheckIcon;
