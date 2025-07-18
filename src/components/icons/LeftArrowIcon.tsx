interface LeftArrowIconProps {
	color?: string;
}

export default function LeftArrowIcon({ color = "#0C394B" }: LeftArrowIconProps) {
	return (
		<svg
			width="6"
			height="10"
			viewBox="0 0 6 10"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M5.79971 1.10636C6.42812 0.51287 5.43313 -0.426818 4.80472 0.216126L0.196378 4.51891C-0.0654595 4.7662 -0.0654595 5.21131 0.196378 5.4586L4.80472 9.81084C5.43313 10.4043 6.42812 9.46464 5.79971 8.87115L1.71504 5.01348L5.79971 1.10636Z"
				fill={color}
			/>
		</svg>
	);
}
