import clsx from "clsx";
import Polygon from "../Polygon";
import Line from "../Line";

type StepCardProps = {
	style?: "bordered" | "filled" | "clear";
	opacity?: "open" | "closed";
	direction?: "rtl" | "ltr";
	className?: string;
};

const stepCardStyleMapping = {
	bordered: "border-2 border-skeleton",
	filled: "bg-skeleton/50",
	clear: "",
};

const directionMapping = {
	rtl: "flex-row-reverse",
	ltr: "flex-row",
};

/**
 * StepCard component represents a card used for displaying steps in a process.
 *
 * @component
 * @param {string} style - The style of the StepCard. Default value is "clear".
 * @param {string} direction - The direction of the StepCard. Default value is "ltr".
 * @param {number} opacity - The opacity of the StepCard.
 * @param {string} className - Additional CSS class names for the StepCard.
 * @returns {JSX.Element} StepCard component.
 */
const StepCard: React.FC<StepCardProps> = ({
	style = "clear",
	direction = "ltr",
	opacity = "closed",
	className = "",
}) => {
	const styleClass = stepCardStyleMapping[style];
	const directionClass = directionMapping[direction];
	return (
		<div
			className={clsx(
				`flex flex-wrap items-center justify-start gap-1 w-[200px] rounded-lg`,
				directionClass,
				styleClass,
				className,
			)}
		>
			<Polygon size="sm" variant="circle" opacity={opacity} />
			<Line width="full" height="sm" className="flex-1" />
		</div>
	);
};

export default StepCard;
