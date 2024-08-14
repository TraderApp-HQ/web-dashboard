import Line from "../Line";
import Polygon from "../Polygon";
import StepCard from "../StepCard";

/**
 * Renders a card component.
 * @returns The rendered card component.
 */
const Card: React.FC = () => {
	return (
		<div className="border rounded-lg space-y-2 p-2">
			<StepCard />
			<Line width="lg" height="sm" />

			<div className="flex items-center justify-between gap-1 p-3 flex-wrap border border-skeleton rounded-lg">
				<Polygon size="sm" variant="rounded" opacity="open" />
				<Polygon size="sm" variant="rounded" />
				<Polygon size="sm" variant="rounded" />
				<Polygon size="sm" variant="rounded" className="flex-1" />
			</div>
		</div>
	);
};

export default Card;
