import React from "react";
import { render } from "@testing-library/react";
import Chart from "~/components/Portfolio/PieChart";

// Sample data and colors for testing
const mockData = [
	{ name: "Group A", value: 400 },
	{ name: "Group B", value: 300 },
	{ name: "Group C", value: 300 },
	{ name: "Group D", value: 200 },
];

const mockColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

describe("Chart Component", () => {
	it("renders correctly with given data and colors", () => {
		// Render the Chart component with mock data and colors
		const { container } = render(<Chart data={mockData} colors={mockColors} />);

		// Check if the PieChart component exists
		expect(container.querySelector("svg")).toBeInTheDocument();

		// Check if the correct number of <path> elements (Pie slices) are rendered
		const pieSlices = container.querySelectorAll("path");
		expect(pieSlices.length).toBe(mockData.length);

		// Check if the colors are applied correctly
		pieSlices.forEach((slice, index) => {
			expect(slice).toHaveAttribute("fill", mockColors[index % mockColors.length]);
		});
	});
});
