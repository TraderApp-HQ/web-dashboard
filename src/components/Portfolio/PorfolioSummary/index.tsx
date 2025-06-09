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
		<Card className="border-2 border-[#D1D7F0] p-5 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-2 xl:gap-5 lg:h-80">
			<div className="w-full lg:w-[30%] flex items-center justify-center">
				<Chart data={chartData} colors={colors} />
			</div>
			<div className="text-center lg:text-left text-nowrap">
				<div className="flex flex-nowrap gap-1.5">
					<p className="font-bold text-[13px]">Profit</p>
					<p className="font-medium text-sm text-[green]"> + 00%(00.00 USDT)</p>
					<p className="font-normal text-sm text-[#414141]">≈$00.00</p>
				</div>
				<div className="flex flex-nowrap gap-1">
					<p className="font-bold text-sm">Capital</p>
					<p className="font-medium text-sm">0000.00</p>
					<p className="font-medium text-sm">USDT</p>
					<p className="font-normal text-sm text-[#414141]">≈ $000.00</p>
				</div>
				<p className="font-semibold text-sm text-[#414141] mt-2">
					No asset in your portfolio
				</p>
			</div>
		</Card>
	);
};

export default PortfolioSummary;
