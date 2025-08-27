import React, { useState, useEffect } from "react";
import Card from "~/components/AccountLayout/Card";
import { PieChart, Pie, Cell } from "recharts";
// import Chart from "../PieChart";

interface DataEntry {
	name: string;
	value: number;
}

interface ChartProps {
	chartData: DataEntry[];
	colors: string[];
}

const PortfolioSummary: React.FC<ChartProps> = ({ chartData, colors }) => {
	const [dimensions] = useState({
		width: 600,
		height: 300,
	});
	const [dimensionsPaddingX, setDimensionsPaddingX] = useState(150);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 350) {
				setDimensionsPaddingX(130);
			} else if (width < 400) {
				setDimensionsPaddingX(150);
			} else if (width < 450) {
				setDimensionsPaddingX(180);
			} else if (width < 500) {
				setDimensionsPaddingX(190);
			} else if (width < 550) {
				setDimensionsPaddingX(210);
			} else if (width < 600) {
				setDimensionsPaddingX(240);
			} else if (width < 650) {
				setDimensionsPaddingX(260);
			} else if (width < 700) {
				setDimensionsPaddingX(280);
			} else if (width < 768) {
				setDimensionsPaddingX(330);
			} else if (width < 800) {
				setDimensionsPaddingX(220);
			} else if (width < 900) {
				setDimensionsPaddingX(260);
			} else if (width < 950) {
				setDimensionsPaddingX(280);
			} else if (width < 1024) {
				setDimensionsPaddingX(300);
			} else if (width < 1150) {
				setDimensionsPaddingX(165);
			} else if (width < 1250) {
				setDimensionsPaddingX(185);
			} else if (width < 1360) {
				setDimensionsPaddingX(200);
			} else if (width < 1450) {
				setDimensionsPaddingX(220);
			} else if (width < 1536) {
				setDimensionsPaddingX(240);
			} else {
				setDimensionsPaddingX(120);
			}
		};

		// Initial call
		handleResize();

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		// <Card className="border-2 border-[#D1D7F0] p-5 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-2 xl:gap-5">
		<Card className="2xl:flex 2xl:items-center 2xl:gap-1 h-full">
			<div className="2xl:w-[40%]">
				<PieChart width={dimensions.width} height={dimensions.height}>
					<Pie
						data={chartData}
						cx={dimensionsPaddingX}
						// cy={100}
						innerRadius={dimensions.width * 0.1}
						outerRadius={dimensions.width * 0.15}
						fill="#8884d8"
						// paddingAngle={5}
						dataKey="value"
					>
						{chartData.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
						))}
					</Pie>
				</PieChart>
			</div>
			<div className="flex flex-col items-center justify-center mt-4 2xl:mt-0 w-full">
				<div className="flex items-center justify-center flex-nowrap gap-1.5">
					<p className="font-bold text-[13px]">Profit</p>
					<p className="font-medium text-sm text-[green]"> + 00%(00.00 USDT)</p>
					<p className="font-normal text-sm text-[#414141]">≈ $00.00</p>
				</div>
				<div className="flex items-center justify-center flex-nowrap gap-1">
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
