import React from "react";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { useFetch } from "~/hooks/useFetch";
import { AssetsService } from "~/apis/handlers/assets";
import SignalDetail from ".";

// Mock necessary modules
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

jest.mock("~/hooks/useFetch", () => ({
	useFetch: jest.fn(),
}));

jest.mock("~/apis/handlers/assets", () => ({
	AssetsService: jest.fn().mockImplementation(() => ({
		getSignal: jest.fn(),
	})),
}));

describe("SignalDetail component", () => {
	const mockSignal = {
		asset: { name: "Bitcoin", symbol: "BTC", logo: "/btc-logo.png", marketCap: 5000000 },
		status: "active",
		currentChange: 5,
		targetProfits: [{ id: "1", value: 0.1 }],
		stopLoss: { price: 40000 },
		candlestick: "1H",
		createdAt: "2023-09-01",
		maxGain: 10,
		risk: "low",
		entryPrice: 45000,
		tradeNote: "This is a test note",
	};

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			query: { id: "test-id" },
			asPath: "/account/signals/active/test-id",
			pathname: "/account/signals/active",
			push: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders loading state", () => {
		// Mock loading state
		(useFetch as jest.Mock).mockReturnValue({
			data: null,
			isLoading: true,
			isSuccess: false,
		});

		render(<SignalDetail>Test Child</SignalDetail>);

		// Ensure loading text is rendered
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
	});

	it("renders signal details when fetch is successful", () => {
		// Mock successful fetch state
		(useFetch as jest.Mock).mockReturnValue({
			data: mockSignal,
			isLoading: false,
			isSuccess: true,
		});

		render(<SignalDetail>Test Child</SignalDetail>);

		// Ensure the signal details are rendered
		expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
		expect(screen.getByText(/BTC/i)).toBeInTheDocument();
		expect(screen.getByText(/5%/i)).toBeInTheDocument();
		expect(screen.getByText(/40000/i)).toBeInTheDocument();
		expect(screen.getByText(/This is a test note/i)).toBeInTheDocument();
	});

	it("calls fetchSignal with the correct ID", () => {
		const getSignalMock = jest.fn();

		// Mock AssetsService and useFetch
		(AssetsService as jest.Mock).mockReturnValue({
			getSignal: getSignalMock,
		});

		// Mock useFetch to invoke the queryFn (fetchSignal)
		(useFetch as jest.Mock).mockImplementation(({ queryFn }) => {
			queryFn(); // Manually invoke the fetch function
			return {
				data: mockSignal,
				isLoading: false,
				isSuccess: true,
			};
		});

		render(<SignalDetail>Test Child</SignalDetail>);

		// Ensure getSignal was called with the correct ID
		expect(getSignalMock).toHaveBeenCalledWith("test-id");
	});

	it("navigates back when back button is clicked", () => {
		const pushMock = jest.fn();

		(useRouter as jest.Mock).mockReturnValue({
			query: { id: "test-id" },
			asPath: "/account/signals/active/test-id",
			pathname: "/account/signals/active",
			push: pushMock,
		});

		// Mocking useFetch to prevent undefined destructuring
		(useFetch as jest.Mock).mockReturnValue({
			data: mockSignal,
			isLoading: false,
			isSuccess: true,
		});

		render(<SignalDetail>Test Child</SignalDetail>);

		// Find and click the back button
		screen.getByRole("button", { name: /back/i }).click();

		// Ensure the router push function is called to navigate back
		expect(pushMock).toHaveBeenCalledWith("/account/signals/active/");
	});
});
