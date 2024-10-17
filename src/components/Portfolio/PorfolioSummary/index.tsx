import React from "react";
import Card from "~/components/AccountLayout/Card";
import Chart from "../PieChart";

interface DataEntry {
	name: string;
	value: number;
}

interface ChartProps {
	chartData: DataEntry[];
	colors: string[];
}

const PortfolioSummary: React.FC<ChartProps> = ({ chartData, colors }) => {
	return (
		<Card>
			<div className="flex flex-col lg:flex-row items-center lg:h-60">
				<div className="w-[75%] sm:w-[35%] md:w-[37%] lg:w-[30%]">
					<Chart data={chartData} colors={colors} />
				</div>
				<div className="text-center lg:text-start my-10">
					<div className="flex flex-col items-center lg:items-start justify-center sm:justify-start lg:flex-row gap-2 lg:gap-4">
						<div className="flex gap-1 mb-2 lg:mb-0">
							<p className="font-bold text-sm">Capital</p>
							<p className="font-medium text-sm">0000.00</p>
							<p className="font-medium text-[10px] mt-1">USDT</p>
							<p className="font-normal text-sm">≈ $000.00</p>
						</div>
						<div className="flex gap-1.5">
							<p className="font-bold text-[13px]">Profit</p>
							<p className="font-medium text-sm text-[green]"> + 00%(00.00 USDT)</p>
							<p className="font-normal text-sm">≈$00.00</p>
						</div>
					</div>
					<p className="relative lg:left-32 font-extrabold text-base mt-2">
						No asset in your portfolio
					</p>
				</div>
			</div>
		</Card>
	);
};

export default PortfolioSummary;
