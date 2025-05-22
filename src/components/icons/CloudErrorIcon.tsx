import { SVGProps } from "react";

const CloudErrorIcon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		width="1.5em"
		height="1.5em"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		stroke="currentColor"
		color="red"
		{...props}
	>
		<path
			d="M7.5 19H6.5A4.5 4.5 0 0 1 6.5 10h.5a6.5 6.5 0 0 1 12.5-1.63A5.5 5.5 0 0 1 18.5 19h-3"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M13.5 15.5L10.5 18.5M10.5 15.5L13.5 18.5"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default CloudErrorIcon;
