import React from "react";
import Card from "~/components/AccountLayout/Card";
import { IPerformanceData } from "../common/DataTable/config";
import Image from "next/image";
import { renderPercentageChange } from "~/helpers";
interface IPerformanceSummaryCardProps {
	data: IPerformanceData | undefined;
	label: string;
}

const PerformanceSummaryCard: React.FC<IPerformanceSummaryCardProps> = ({ data, label }) => {
	const imgSrc =
		data && data?.itemMaxGain > 0
			? "/images/percentageIncrease.png"
			: "/images/percentageDecrease.png";

	return (
		<Card className="w-12/12 md:w-[40%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] px-3 py-7">
			<div className="flex-col justify-center items-start space-y-6 ml-0 sm:ml-3">
				<h3 className="text-neutral-700 text-sm font-semibold leading-tight capitalize">
					{label}
				</h3>
				<div className="flex justify-between items-center gap-14 md:gap-16 pr-8">
					<div className="flex items-center gap-2">
						{data && (
							<Image
								src={data.itemLogo}
								alt={data.itemName}
								width={24}
								height={24}
								className="w-6 h-6 relative"
							/>
						)}
						<span className="text-slate-900 text-base font-semibold leading-none">
							{data?.itemName ?? "--"}
						</span>
					</div>

					{/* TODO: change this to svg icon in a different component */}
					{renderPercentageChange({ currentChange: data?.itemMaxGain, imgSrc })}
				</div>
			</div>
		</Card>
	);
};

export default PerformanceSummaryCard;
