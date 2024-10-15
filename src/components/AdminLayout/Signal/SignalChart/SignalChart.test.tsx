import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { AssetsService } from "~/apis/handlers/assets";
import { useFetch } from "~/hooks/useFetch";
import SignalChart from ".";

// Mock next/router
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

// Mock the AssetsService and useFetch hook
jest.mock("~/apis/handlers/assets", () => ({
	AssetsService: jest.fn().mockImplementation(() => ({
		getSignal: jest.fn(),
	})),
}));

jest.mock("~/hooks/useFetch", () => ({
	useFetch: jest.fn(),
}));

describe("SignalChart component", () => {
	beforeEach(() => {
		// Mock router query
		(useRouter as jest.Mock).mockReturnValue({
			query: { id: "test-id" },
		});
	});

	it("should render loading state", () => {
		// Mock useFetch to return loading state
		(useFetch as jest.Mock).mockReturnValue({
			data: null,
			isLoading: true,
			isSuccess: false,
		});

		render(<SignalChart />);

		// Expect loading message to be in the document
		expect(screen.getByText("loading...")).toBeInTheDocument();
	});

	it("should render signal image when data is successfully fetched", () => {
		const imageUrl = "https://test.com/test-chart.png";
		// Mock signal data and success state
		(useFetch as jest.Mock).mockReturnValue({
			data: {
				chartUrl: imageUrl,
			},
			isLoading: false,
			isSuccess: true,
		});

		render(<SignalChart />);

		const imageElement = screen.getByAltText("signal chart");
		expect(imageElement).toBeInTheDocument();
		expect(imageElement).toHaveAttribute("src");
		expect(imageElement.getAttribute("src")).toContain(encodeURIComponent(imageUrl));
	});

	it("should call the correct fetch function with the signal ID", () => {
		const getSignalMock = jest.fn();

		// Mock AssetsService.getSignal method
		(AssetsService as jest.Mock).mockImplementation(() => ({
			getSignal: getSignalMock,
		}));

		// Mock useFetch to invoke the queryFn (fetchSignal)
		(useFetch as jest.Mock).mockImplementation(({ queryFn }) => {
			queryFn(); // Manually invoke the fetch function
			return {
				data: null,
				isLoading: true,
				isSuccess: false,
			};
		});

		render(<SignalChart />);

		// Ensure the getSignal function was called with the correct ID
		expect(getSignalMock).toHaveBeenCalledWith("test-id");
	});
});
