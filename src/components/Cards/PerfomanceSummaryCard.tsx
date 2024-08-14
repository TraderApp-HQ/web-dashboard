import React from "react";
import Card from "~/components/AccountLayout/Card";
import { ISignalPerformance } from "../common/DataTable/config";
interface IPerformanceSummaryCardProps {
	data: ISignalPerformance;
}

const PerformanceSummaryCard: React.FC<IPerformanceSummaryCardProps> = ({ data }) => {
	return (
		<Card className="w-12/12 md:w-[40%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] px-3 py-7">
			<div className="flex-col justify-center items-start space-y-6 ml-0 sm:ml-3">
				<h3 className="text-neutral-700 text-sm font-semibold leading-tight">
					{data.label}
				</h3>
				<div className="flex justify-between items-center gap-14 md:gap-16 pr-8">
					<div className="flex items-center gap-2">
						<img
							src={data.asset.logo}
							alt={data.asset.name}
							className="w-6 h-6 relative"
						/>
						<span className="text-slate-900 text-base font-semibold leading-none">
							{data.asset.name}
						</span>
					</div>
					<div className="flex justify-start items-center">
						<img
							src="/images/percentageIncrease.png"
							alt="Signal Percentage"
							className="p-1.5"
						/>
						<span className="text-emerald-700 text-base font-normal">
							{data.percentage ?? "10"}%
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default PerformanceSummaryCard;
