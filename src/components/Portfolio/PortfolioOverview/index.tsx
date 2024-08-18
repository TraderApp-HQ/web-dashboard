import ChartOverview from "~/components/Chart/ChartOverview";
import PortfolioAllocation from "~/components/Chart/PortfolioAllocation";

const PortfolioOverview = () => {
	return (
		<div className="my-6">
			<h2 className="text-[#08123B] font-bold py-3">Portfolio</h2>
			<div className="flex flex-col lg:flex-row justify-start lg:space-x-6">
				<ChartOverview />
				<PortfolioAllocation />
			</div>
		</div>
	);
};

export default PortfolioOverview;
