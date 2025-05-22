import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import EmptyExchange from "~/components/AccountLayout/TradeCenter/EmptyExchange";

// Mock the next/router module
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

describe("EmptyExchange Component", () => {
	let mockPush: jest.Mock;

	beforeEach(() => {
		mockPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
	});

	it("should render the component with the correct text and icon", () => {
		render(<EmptyExchange />);

		// Check for the presence of the icon (the SVG)
		const svgIcon = screen.getByTestId("trade-center-icon");
		expect(svgIcon).toBeInTheDocument();

		// Verify some of its attributes
		expect(svgIcon).toHaveAttribute("width", "50");
		expect(svgIcon).toHaveAttribute("height", "50");

		// Check for the correct headings and texts
		expect(screen.getByText("Not connected")).toBeInTheDocument();
		expect(screen.getByText("You don’t have any connected account")).toBeInTheDocument();

		// Check for the presence of the button
		expect(screen.getByText("Connect new trading account")).toBeInTheDocument();
	});

	it("should navigate to 'exchanges/connect' when the button is clicked", () => {
		render(<EmptyExchange />);

		const button = screen.getByText("Connect new trading account");
		fireEvent.click(button);

		// Assert that the router push method was called with the correct route
		expect(mockPush).toHaveBeenCalledWith("/account/trade-center/trading-accounts/connect");
	});
});
