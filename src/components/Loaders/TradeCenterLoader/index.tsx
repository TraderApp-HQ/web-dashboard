import Line from "../Line";
import Polygon from "../Polygon";

const TradeCenterLoader: React.FC = () => {
	return (
		<section className="flex flex-wrap gap-6">
			<section className="bg-white rounded-lg py-3 px-4 flex flex-col gap-3 !min-w-[20rem]">
				<section className="flex items-center gap-2">
					<Polygon variant="circle" size="md" opacity="closed" className="bg-[#EDEDED]" />
					<Line height="lg" width="sm" className="bg-[#EDEDED] !rounded-sm" />
				</section>
				<Line height="lg" width="full" className="bg-[#EDEDED] !h-8 !rounded-sm" />

				<hr />

				<Line
					height="lg"
					width="full"
					className="border-2 border-[#EDEDED] !bg-white !h-10"
				/>
			</section>

			{/* ////////////////////////////////////////////////////// */}

			<section className="bg-white rounded-lg py-3 px-4 flex flex-col gap-3 !min-w-[20rem]">
				<section className="flex items-center gap-2">
					<Polygon variant="circle" size="md" opacity="closed" className="bg-[#EDEDED]" />
					<Line height="lg" width="sm" className="bg-[#EDEDED] !rounded-sm" />
				</section>
				<Line height="lg" width="full" className="bg-[#EDEDED] !h-8 !rounded-sm" />

				<hr />

				<Line
					height="lg"
					width="full"
					className="border-2 border-[#EDEDED] !bg-white !h-10"
				/>
			</section>
		</section>
	);
};

export default TradeCenterLoader;
