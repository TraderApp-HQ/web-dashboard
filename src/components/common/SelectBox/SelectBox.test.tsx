import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import type { ISelectBoxOption } from "~/components/interfaces";
import SelectBox from ".";

const mockOptions: ISelectBoxOption[] = [
	{ displayText: "Option 1", value: "option1" },
	{ displayText: "Option 2", value: "option2" },
	{ displayText: "Option 3", value: "option3" },
];

describe("SelectBox Component", () => {
	test("renders SelectBox with placeholder text", () => {
		render(<SelectBox options={mockOptions} placeholder="Select an option" />);
		const placeholder = screen.getByText("Select an option");
		expect(placeholder).toBeInTheDocument();
	});

	test("opens dropdown when clicked", () => {
		render(<SelectBox options={mockOptions} />);
		const selectBox = screen.getByText("Select option");
		fireEvent.click(selectBox);
		const dropdown = screen.getByRole("listbox");
		expect(dropdown).toBeInTheDocument();
	});

	test("renders options correctly", () => {
		render(<SelectBox options={mockOptions} />);
		const selectBox = screen.getByText("Select option");
		fireEvent.click(selectBox);
		mockOptions.forEach((option) => {
			expect(screen.getByText(option.displayText)).toBeInTheDocument();
		});
	});

	test("selects an option", () => {
		const mockSetOption = jest.fn();
		render(
			<SelectBox
				options={mockOptions}
				placeholder="Select an option"
				setOption={mockSetOption}
			/>,
		);
		const selectBox = screen.getByText("Select an option");
		fireEvent.click(selectBox);
		const option = screen.getByText("Option 2");
		fireEvent.click(option);
		expect(screen.getByText("Option 2")).toBeInTheDocument();
		expect(mockSetOption).toHaveBeenCalledWith(mockOptions[1]);
	});

	test("filters options based on search term", () => {
		render(<SelectBox options={mockOptions} isSearchable={true} />);
		const selectBox = screen.getByText("Select option");
		fireEvent.click(selectBox);
		const input = screen.getByPlaceholderText("Search option");
		fireEvent.change(input, { target: { value: "Option 2" } });
		expect(screen.getByText("Option 2")).toBeInTheDocument();
		expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
		expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
	});

	test("closes dropdown when clicking outside", () => {
		render(<SelectBox options={mockOptions} />);
		const selectBox = screen.getByText("Select option");
		fireEvent.click(selectBox);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
		fireEvent.mouseDown(document);
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
	});

	test("clears value if clear prop is passed", () => {
		render(<SelectBox options={mockOptions} option={mockOptions[0]} clear={true} />);
		const selectBox = screen.getByText("Select option");
		expect(selectBox).toBeInTheDocument();
	});

	test("shows value if clear prop is not passed", () => {
		render(<SelectBox options={mockOptions} option={mockOptions[0]} />);
		const selectBoxWithValue = screen.getByText(mockOptions[0].displayText);
		expect(selectBoxWithValue).toBeInTheDocument();
	});

	test("initializes with the provided option", () => {
		render(<SelectBox options={mockOptions} option={mockOptions[1]} />);
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	test("doesn't call setOption when the same option is provided", () => {
		const mockSetOption = jest.fn();
		// initial render
		const { rerender } = render(
			<SelectBox options={mockOptions} option={mockOptions[1]} setOption={mockSetOption} />,
		);

		// Called once on initial mount
		expect(mockSetOption).toHaveBeenCalledTimes(1);

		// rerender with same option
		rerender(
			<SelectBox options={mockOptions} option={mockOptions[1]} setOption={mockSetOption} />,
		);

		// Note: This checks the cumulative number of calls across both renders.
		// The mock function retains its call history, so this ensures setOption was not called again on rerender.
		expect(mockSetOption).toHaveBeenCalledTimes(1);
	});

	test("calls setOption when a different option is provided", () => {
		const mockSetOption = jest.fn();
		const { rerender } = render(
			<SelectBox options={mockOptions} option={mockOptions[0]} setOption={mockSetOption} />,
		);

		expect(mockSetOption).toHaveBeenCalledTimes(1);

		rerender(
			<SelectBox options={mockOptions} option={mockOptions[1]} setOption={mockSetOption} />,
		);

		expect(mockSetOption).toHaveBeenCalledTimes(2);
		expect(mockSetOption).toHaveBeenCalledWith(mockOptions[1]);
	});
});
