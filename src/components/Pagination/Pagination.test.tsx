import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from ".";

describe("Pagination Component", () => {
	const mockOnNext = jest.fn();
	const mockOnPrev = jest.fn();
	const mockSetRowsPerPage = jest.fn();

	beforeEach(() => {
		mockOnNext.mockClear();
		mockOnPrev.mockClear();
		mockSetRowsPerPage.mockClear();
	});

	it("renders correctly on the first page", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		expect(screen.getByText("1 - 10 of 95")).toBeInTheDocument();
		expect(screen.getByTestId("prev-btn")).toBeDisabled();
		expect(screen.getByTestId("next-btn")).toBeEnabled();
		expect(screen.getByText("Items per page:")).toBeInTheDocument();
		const selectBoxValue = screen.getByText("10");
		expect(selectBoxValue).toBeInTheDocument();
		expect(selectBoxValue.closest('div[class*="cursor-pointer"]')).toBeInTheDocument();
	});

	it("renders correctly on a middle page", () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		expect(screen.getByText("41 - 50 of 95")).toBeInTheDocument();
		expect(screen.getByTestId("prev-btn")).toBeEnabled();
		expect(screen.getByTestId("next-btn")).toBeEnabled();
	});

	it("renders correctly on the last page", () => {
		render(
			<Pagination
				currentPage={10}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		expect(screen.getByText("91 - 95 of 95")).toBeInTheDocument();
		expect(screen.getByTestId("prev-btn")).toBeEnabled();
		expect(screen.getByTestId("next-btn")).toBeDisabled();
	});

	it("calls onNext when the next button is clicked", () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		fireEvent.click(screen.getByTestId("next-btn"));
		expect(mockOnNext).toHaveBeenCalledTimes(1);
		expect(mockOnNext).toHaveBeenCalled();
	});

	it("does not call onNext when on the last page", () => {
		render(
			<Pagination
				currentPage={10}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		fireEvent.click(screen.getByTestId("next-btn"));
		expect(mockOnNext).not.toHaveBeenCalled();
	});

	it("calls onPrev when the previous button is clicked", () => {
		render(
			<Pagination
				currentPage={5}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		fireEvent.click(screen.getByTestId("prev-btn"));
		expect(mockOnPrev).toHaveBeenCalledTimes(1);
		expect(mockOnPrev).toHaveBeenCalled();
	});

	it("does not call onPrev when on the first page", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		fireEvent.click(screen.getByTestId("prev-btn"));
		expect(mockOnPrev).not.toHaveBeenCalled();
	});

	it("calculates and displays rowsPerPage options correctly", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={20}
				totalRecord={150}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		const selectBoxButtonTrigger = screen
			.getByText("10")
			.closest('div[class*="cursor-pointer"]');
		expect(selectBoxButtonTrigger).toBeInTheDocument();
		if (!selectBoxButtonTrigger) throw new Error("SelectBox trigger not found");
		fireEvent.click(selectBoxButtonTrigger);
		const listbox = screen.getByRole("listbox");
		expect(within(listbox).getByText("5")).toBeInTheDocument();
		expect(within(listbox).getByText("10")).toBeInTheDocument();
		expect(within(listbox).getByText("20")).toBeInTheDocument();
		expect(within(listbox).getByText("40")).toBeInTheDocument();
		expect(within(listbox).getByText("80")).toBeInTheDocument();
		expect(within(listbox).getByText("160")).toBeInTheDocument();
	});

	it("calls setRowsPerPage when a new option is selected", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={10}
				totalRecord={95}
				rowsPerPage={10}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		const selectBoxButtonTrigger = screen
			.getByText("10")
			.closest('div[class*="cursor-pointer"]');
		expect(selectBoxButtonTrigger).toBeInTheDocument();
		if (!selectBoxButtonTrigger) throw new Error("SelectBox trigger not found");
		fireEvent.click(selectBoxButtonTrigger);
		const listbox = screen.getByRole("listbox");
		fireEvent.click(within(listbox).getByText("20"));
		expect(mockSetRowsPerPage).toHaveBeenCalledTimes(1);
		expect(mockSetRowsPerPage).toHaveBeenCalledWith(20);
	});

	it("handles totalRecord less than default rowsPerPage", () => {
		render(
			<Pagination
				currentPage={1}
				totalPages={1}
				totalRecord={3}
				rowsPerPage={5}
				setRowsPerPage={mockSetRowsPerPage}
				onNext={mockOnNext}
				onPrev={mockOnPrev}
			/>,
		);
		expect(screen.getByText("1 - 3 of 3")).toBeInTheDocument();
		expect(screen.getByTestId("prev-btn")).toBeDisabled();
		expect(screen.getByTestId("next-btn")).toBeDisabled();
		const selectBoxButtonTrigger = screen
			.getByText("5")
			.closest('div[class*="cursor-pointer"]');
		expect(selectBoxButtonTrigger).toBeInTheDocument();
		if (!selectBoxButtonTrigger) throw new Error("SelectBox trigger not found");
		fireEvent.click(selectBoxButtonTrigger);
		const listbox = screen.getByRole("listbox");
		expect(within(listbox).getByText("5")).toBeInTheDocument();
		expect(within(listbox).queryByText("10")).not.toBeInTheDocument();
	});
});
