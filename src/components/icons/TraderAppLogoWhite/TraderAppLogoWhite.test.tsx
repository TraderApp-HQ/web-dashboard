import React from "react";
import { render } from "@testing-library/react";
import TraderAppLogoWhite from ".";

describe("TraderAppLogoWhite", () => {
	it("renders with default props", () => {
		render(<TraderAppLogoWhite />);

		const svgElement = document.querySelector("svg");
		expect(svgElement).toBeInTheDocument();
		expect(svgElement).toHaveAttribute("width", "149");
		expect(svgElement).toHaveAttribute("height", "32");
		expect(svgElement).toHaveAttribute("viewBox", "0 0 149 32");
	});

	it("renders with custom width and height", () => {
		render(<TraderAppLogoWhite width={220} height={48} />);

		const svgElement = document.querySelector("svg");
		expect(svgElement).toHaveAttribute("width", "220");
		expect(svgElement).toHaveAttribute("height", "48");
		// viewBox should stay the same regardless of width/height
		expect(svgElement).toHaveAttribute("viewBox", "0 0 149 32");
	});

	it("renders with percentage-based dimensions", () => {
		render(<TraderAppLogoWhite width="100%" height="100%" />);

		const svgElement = document.querySelector("svg");
		expect(svgElement).toHaveAttribute("width", "100%");
		expect(svgElement).toHaveAttribute("height", "100%");
	});

	it("applies custom className", () => {
		render(<TraderAppLogoWhite className="custom-logo-class" />);

		const svgElement = document.querySelector("svg");
		expect(svgElement).toHaveClass("custom-logo-class");
	});

	it("combines all custom props correctly", () => {
		render(<TraderAppLogoWhite width={300} height={60} className="test-logo large-logo" />);

		const svgElement = document.querySelector("svg");
		expect(svgElement).toHaveAttribute("width", "300");
		expect(svgElement).toHaveAttribute("height", "60");
		expect(svgElement).toHaveClass("test-logo");
		expect(svgElement).toHaveClass("large-logo");
	});

	it("maintains SVG content regardless of size changes", () => {
		render(<TraderAppLogoWhite width={500} height={100} />);

		// Verify some of the inner content exists
		const pathElements = document.querySelectorAll("path");
		expect(pathElements.length).toBeGreaterThan(0);

		const rectElement = document.querySelector("rect");
		expect(rectElement).toBeInTheDocument();
		expect(rectElement).toHaveAttribute("fill", "#FFFFFF");
	});
});
