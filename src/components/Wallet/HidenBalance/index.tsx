import { clsx } from "clsx";

const HiddenBalances = ({
	className,
	iconBgColor,
}: {
	className?: string;
	iconBgColor?: string;
}) => {
	return (
		<div className={clsx("flex space-x-1", className)}>
			<span
				className={clsx(
					"h-2 w-2 rounded-full",
					iconBgColor ? `bg-[${iconBgColor}]` : "bg-gray-600",
				)}
			></span>
			<span
				className={clsx(
					"h-2 w-2 rounded-full",
					iconBgColor ? `bg-[${iconBgColor}]` : "bg-gray-600",
				)}
			></span>
			<span
				className={clsx(
					"h-2 w-2 rounded-full",
					iconBgColor ? `bg-[${iconBgColor}]` : "bg-gray-600",
				)}
			></span>
			<span
				className={clsx(
					"h-2 w-2 rounded-full",
					iconBgColor ? `bg-[${iconBgColor}]` : "bg-gray-600",
				)}
			></span>
		</div>
	);
};

export default HiddenBalances;
