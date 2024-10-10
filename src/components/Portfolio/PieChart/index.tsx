import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface DataEntry {
	name: string;
	value: number;
}

interface ChartProps {
	data: DataEntry[];
	colors: string[];
}

const Chart: React.FC<ChartProps> = ({ data, colors }) => {
	return (
		<PieChart width={300} height={400}>
			<Pie
				data={data}
				cx={120}
				cy={200}
				innerRadius={60}
				outerRadius={80}
				fill="#8884d8"
				// paddingAngle={5}
				dataKey="value"
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
				))}
			</Pie>
		</PieChart>
	);
};

export default Chart;
