import Line from "../Line";
import StepCard from "../StepCard";
import Polygon from "../Polygon";

/**
 * Renders a MobileTableLoader component.
 * @returns The rendered MobileTableLoader component.
 */
const MobileTableLoader: React.FC = () => {
	return [1, 2, 3].map((key) => (
		<div
			className="rounded-lg space-y-10 bg-white py-5 px-[19px] border border-[#EDEDED]"
			key={key}
		>
			<div className="flex flex-col w-[25%] -mt-3">
				<StepCard className="w-full" />
				<Line width="sm" height="sm" className="ml-9 -mt-2" />
			</div>
			<div className="flex justify-between">
				<div className="flex flex-col gap-7 w-[55%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[6px]" />
					<Polygon size="sm" variant="rounded" className="w-full h-[6px]" />
				</div>
				<div className="flex flex-col gap-7 w-[30%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[6px]" />
					<Polygon size="sm" variant="rounded" className="w-full h-[6px]" />
				</div>
			</div>
			<div className="flex justify-between">
				<div className="w-[35%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[6px] -mt-1.5" />
				</div>
				<div className="w-[50%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[12px] -mt-2" />
				</div>
			</div>
			<div className="flex justify-between">
				<div className="w-[25%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[6px]" />
				</div>
				<div className="w-[29%]">
					<Polygon size="sm" variant="rounded" className="w-full h-[20px] -mt-2" />
				</div>
			</div>
		</div>
	));
};

export default MobileTableLoader;
