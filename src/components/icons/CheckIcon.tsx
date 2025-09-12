import { SVGAttributes } from "react";

function CheckIcon(props: SVGAttributes<SVGElement>) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 21"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			className="rounded-full"
		>
			<circle cx="10" cy="10.5" r="9.5" fill="#22C55E" stroke="#fff" />
			<path
				d="M14.6667 7L8.25004 13.4167L5.33337 10.5"
				stroke="#fff"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
export default CheckIcon;
