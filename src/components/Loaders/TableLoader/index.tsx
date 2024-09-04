import Line from "../Line";
import StepCard from "../StepCard";
import Polygon from "../Polygon";

/**
 * Renders a TableLoader component.
 * @returns The rendered TableLoader component.
 */
const TableLoader: React.FC = () => {
	return (
		<div className="rounded-lg space-y-10">
			<div className="flex gap-10">
				<Line width="full" height="sm" />
				<Line width="full" height="sm" />
				<Line width="full" height="sm" />
				<Line width="full" height="sm" />
				<Line width="full" height="sm" />
			</div>
			{[1, 2, 3, 4].map((key) => (
				<div className="flex gap-10" key={key}>
					<div className="flex flex-col w-full -mt-3">
						<StepCard className="w-full" />
						<Polygon
							size="sm"
							variant="rounded"
							className="w-[40%] h-[8px] ml-9 -mt-2"
						/>
					</div>
					<Line width="full" height="sm" className="mt-1" />
					<Line width="full" height="md" />
					<Line width="full" height="lg" className="-mt-1" />
					<Line width="full" height="sm" />
				</div>
			))}
		</div>
	);
};

export default TableLoader;
