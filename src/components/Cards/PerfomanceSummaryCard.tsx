import React from "react";
import Card from "~/components/AccountLayout/Card";
import { ISignalPerformance } from "../common/DataTable/config";
import Image from "next/image";
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
						<Image
							src={data.asset.logo}
							alt={data.asset.name}
							width={24}
							height={24}
							className="w-6 h-6 relative"
						/>
						<span className="text-slate-900 text-base font-semibold leading-none">
							{data.asset.name}
						</span>
					</div>
					{/* TODO: change this to svg icon in a different component */}
					<div className="flex justify-start items-center">
						<Image
							src="/images/percentageIncrease.png"
							alt="Signal Percentage"
							className="p-1.5"
							width={12}
							height={12}
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
