import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from ".";

describe("Checkbox Component", () => {
	const mockOnChange = jest.fn();

	it("renders the checkbox with the label and no image", () => {
		render(<Checkbox label="Test Label" checked={false} onChange={mockOnChange} />);

		// Check if the label is rendered
		expect(screen.getByText("Test Label")).toBeInTheDocument();

		// Check if the checkbox is initially unchecked
		const checkboxElement = screen.getByTestId("checkbox-border");
		expect(checkboxElement).toHaveClass("border-gray-300 bg-white");
	});

	it("renders the checkbox with an image", () => {
		const imageUrl = "/test-image.png";
		render(
			<Checkbox
				label="Image Checkbox"
				checked={false}
				onChange={mockOnChange}
				imageUrl={imageUrl}
			/>,
		);

		// Check if the image is rendered
		const imageElement = screen.getByAltText("Image Checkbox");
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute("src");
		expect(imageElement.getAttribute("src")).toContain(encodeURIComponent(imageUrl));
	});

	it("calls the onChange handler when the checkbox is clicked", () => {
		render(<Checkbox label="Clickable Checkbox" checked={false} onChange={mockOnChange} />);

		// Simulate a click on the checkbox
		const checkboxElement = screen.getByTestId("checkbox-data");
		fireEvent.click(checkboxElement);

		// Check if the onChange handler was called
		expect(mockOnChange).toHaveBeenCalled();
	});

	it("applies the correct styles when the checkbox is checked", () => {
		render(<Checkbox label="Checked Checkbox" checked={true} onChange={mockOnChange} />);

		// Check if the checkbox is rendered with the correct styles for checked state
		const checkboxElement = screen.getByTestId("checkbox-border");
		expect(checkboxElement).toHaveClass("bg-blue-500 border-blue-500");
	});

	it("applies the correct styles when the checkbox is unchecked", () => {
		render(<Checkbox label="Unchecked Checkbox" checked={false} onChange={mockOnChange} />);

		// Check if the checkbox is rendered with the correct styles for unchecked state
		const checkboxElement = screen.getByTestId("checkbox-border");
		expect(checkboxElement).toHaveClass("bg-white border-gray-300");
	});
});
