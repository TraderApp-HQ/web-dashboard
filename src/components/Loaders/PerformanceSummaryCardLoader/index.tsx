import Line from "../Line";
import Polygon from "../Polygon";

/**
 * Renders a PerformanceSummaryCardLoader component.
 * @returns The rendered PerformanceSummaryCardLoader component.
 */
const PerformanceSummaryCardLoader: React.FC = () => {
	return (
		<div className="flex flex-col md:flex-row gap-7 md:gap-[108px] py-[26px] md:py-[30px] px-[38px] md:px[42px] border rounded-lg w-full md:w-[90%] xl:w-[55%] bg-white">
			<div className="w-[80%] md:w-full">
				<Polygon size="lg" variant="rounded" className="flex-1 w-full h-[40px] mb-2" />
				<Line height="lg" width="lg" />
			</div>
			<div className="w-[80%] md:w-full">
				<Polygon size="lg" variant="rounded" className="flex-1 w-full h-[40px] mb-2" />
				<Line height="lg" width="lg" />
			</div>
		</div>
	);
};

export default PerformanceSummaryCardLoader;
