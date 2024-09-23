import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TextArea from ".";

describe("TextArea Component", () => {
	it("renders the TextArea with a label and placeholder", () => {
		render(
			<TextArea
				label="Description"
				placeholder="Enter description"
				value=""
				onChange={() => {}}
			/>,
		);

		// Check if label is rendered
		expect(screen.getByText("Description")).toBeInTheDocument();

		// Check if textarea is rendered with the placeholder
		const textarea = screen.getByPlaceholderText("Enter description");
		expect(textarea).toBeInTheDocument();
	});

	it("calls onChange when text is entered", () => {
		const mockOnChange = jest.fn();
		render(
			<TextArea
				label="Description"
				placeholder="Enter description"
				value=""
				onChange={mockOnChange}
			/>,
		);

		// Simulate user typing in the textarea
		const textarea = screen.getByPlaceholderText("Enter description");
		fireEvent.change(textarea, { target: { value: "Test input" } });

		// Verify that onChange is called with the correct value
		expect(mockOnChange).toHaveBeenCalledWith("Test input");
	});

	it("displays the correct value in the textarea", () => {
		render(
			<TextArea
				label="Description"
				placeholder="Enter description"
				value="Initial value"
				onChange={() => {}}
			/>,
		);

		// Check if the textarea has the correct initial value
		const textarea = screen.getByDisplayValue("Initial value");
		expect(textarea).toBeInTheDocument();
	});
});
