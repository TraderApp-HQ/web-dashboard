import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MyExchangeCard from ".";

describe("MyExchangeCard", () => {
	const defaultProps = {
		_id: "1",
		logo: "/path/to/logo.png",
		name: "Exchange Name",
		isConnected: true,
	};

	it("renders the component with correct elements", () => {
		render(<MyExchangeCard {...defaultProps} />);

		// Check if logo and name(alt value) are rendered
		expect(screen.getByAltText("Exchange Name")).toBeInTheDocument();
		expect(screen.getByText("Exchange Name")).toBeInTheDocument();

		// Check if the dropdown menu is rendered
		expect(screen.getByRole("button")).toBeInTheDocument(); // Assuming DropdownMenu trigger is a button

		// Check if the connection status is rendered correctly
		expect(screen.getByText("Connected")).toBeInTheDocument();
	});

	it("displays the correct connection status", () => {
		// Test when isConnected is true
		render(<MyExchangeCard {...defaultProps} isConnected={true} />);
		expect(screen.getByText("Connected")).toBeInTheDocument();

		// Test when isConnected is false
		render(<MyExchangeCard {...defaultProps} isConnected={false} />);
		expect(screen.getByText("Failed")).toBeInTheDocument();
	});

	it("handles account selection", () => {
		render(<MyExchangeCard {...defaultProps} />);

		// Check if SelectBox is rendered and options are available
		const selectBox = screen.getByText("Future");
		fireEvent.click(selectBox);

		// Click on the second option
		fireEvent.click(screen.getByText("Spot"));
		expect(screen.getByText("Spot")).toBeInTheDocument();
	});

	it("interacts with the dropdown menu", () => {
		render(<MyExchangeCard {...defaultProps} />);

		// Open dropdown menu
		fireEvent.click(screen.getByRole("button")); // Assuming dropdown trigger is a button

		// Check if menu items are rendered
		expect(screen.getByText("Replace API Key")).toBeInTheDocument();
		expect(screen.getByText("Delete")).toBeInTheDocument();
		expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
		expect(screen.getByTestId("replace-icon")).toBeInTheDocument();
	});
});
