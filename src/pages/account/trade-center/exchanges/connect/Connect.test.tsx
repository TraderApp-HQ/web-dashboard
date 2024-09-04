import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ExchangeConnection from "."; // Ensure this is the correct path to your component
import useExchanges from "~/hooks/useExchanges"; // Adjust the import based on the actual path
import { useRouter } from "next/router";

// Mock the next/router module
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

// Mock the useExchanges hook
jest.mock("~/hooks/useExchanges");

describe("ExchangeConnection Page - Get all exchanges", () => {
	let mockPush: jest.Mock;

	beforeEach(() => {
		mockPush = jest.fn();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
		jest.clearAllMocks();
	});

	test("calls useExchanges and displays exchange data", async () => {
		// Mocked response data
		const mockExchanges = [
			{
				_id: "1",
				name: "Kucoin",
				logo: "/images/btc_round.png",
				isConnected: true,
			},
			{
				_id: "2",
				name: "Binance",
				logo: "/images/binance_round.png",
				isConnected: true,
			},
		];

		// Set up the mock implementation of useExchanges
		(useExchanges as jest.Mock).mockReturnValue({
			data: mockExchanges,
			isSuccess: true,
			isLoading: false,
			error: null,
		});

		// Render the page
		render(<ExchangeConnection />);

		// Check if useExchanges was called
		expect(useExchanges).toHaveBeenCalledTimes(2);

		// Wait for the exchange data to be rendered in the DOM
		await waitFor(() => {
			// Check that the exchange names are in the document
			expect(screen.getByTestId("Binance")).toBeInTheDocument();
			expect(screen.getByTestId("Kucoin")).toBeInTheDocument();
		});
	});

	test("handles network error", async () => {
		// Mock the useExchanges hook to return an error
		(useExchanges as jest.Mock).mockReturnValue({
			data: null,
			isError: true,
			error: { name: "Network Error", message: "Failed to load exchanges" },
		});

		// Render the page
		render(<ExchangeConnection />);

		// Wait for error handling to occur
		await waitFor(() => {
			expect(screen.getByText(/Failed to load exchanges/i)).toBeInTheDocument();
		});
	});
});
