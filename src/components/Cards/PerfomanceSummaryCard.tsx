import React from "react";
import Card from "~/components/AccountLayout/Card";
import { ISignalPerformance } from "../common/DataTable/config";
import Image from "next/image";
interface IPerformanceSummaryCardProps {
	data: ISignalPerformance | undefined;
	label: string;
}

const PerformanceSummaryCard: React.FC<IPerformanceSummaryCardProps> = ({ data, label }) => {
	const imgSrc =
		(data?.maxGain ?? 0) > 0
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
								src={data.logo}
								alt={data.name}
								width={24}
								height={24}
								className="w-6 h-6 relative"
							/>
						)}
						<span className="text-slate-900 text-base font-semibold leading-none">
							{data?.name ?? "--"}
						</span>
					</div>
					{/* TODO: change this to svg icon in a different component */}
					<div className="flex justify-start items-center">
						{data && (
							<Image
								src={imgSrc}
								alt="Signal Percentage direction"
								className="p-1.5"
								width={20}
								height={20}
							/>
						)}
						<span
							className={`text-slate-900 text-base font-normal ${data && data?.maxGain < 0 ? "!text-red-500" : "!text-emerald-700"}`}
						>
							{data?.maxGain ?? "--"}%
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default PerformanceSummaryCard;
