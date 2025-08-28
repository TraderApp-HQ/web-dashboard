import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import useAssets from "~/hooks/useAssets";
import { useCreateSignal } from "~/hooks/useCreateSignal";
import useCurrencies from "~/hooks/useCurrencies";
import useSupportedTradingPlatforms from "~/hooks/useSupportedTradingPlatforms";
import CreateSignal from "~/pages/admin/signal-management/create-signal";
import useGetAssetCurrentPrice from "~/hooks/useAssetCurrentPrice";
// import { signalData } from "../../components/AdminLayout/Signal/SignalData";

// Mocking hooks and dependencies
jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));
jest.mock("~/hooks/useCreateSignal");
jest.mock("~/hooks/useAssets");
jest.mock("~/hooks/useCurrencies");
jest.mock("~/hooks/useSupportedTradingPlatforms");
jest.mock("~/hooks/useAssetCurrentPrice");

describe("CreateSignal Component", () => {
	const mockPush = jest.fn();
	const mockMutate = jest.fn();

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
		(useCreateSignal as jest.Mock).mockReturnValue({
			mutate: mockMutate,
			isError: false,
			isPending: false,
			isSuccess: false,
			data: null,
		});
		(useAssets as jest.Mock).mockReturnValue({
			data: [
				{
					id: "52",
					name: "XRP",
					symbol: "XRP",
					logo: "/logo1.png",
				},
			],
			isSuccess: true,
			isLoading: false,
		});
		(useCurrencies as jest.Mock).mockReturnValue({
			data: [{ id: 2, name: "Tether", logo: "/logo2.png" }],
			isSuccess: true,
			isLoading: false,
		});
		(useSupportedTradingPlatforms as jest.Mock).mockReturnValue({
			data: [{ _id: 3, name: "Binance", logo: "/logo3.png" }],
			isSuccess: true,
			isLoading: false,
		});
		(useGetAssetCurrentPrice as jest.Mock).mockReturnValue({
			data: { price: 1234.5678 },
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
			refetch: jest.fn(),
		});
	});

	beforeAll(() => {
		process.env.NEXT_PUBLIC_USERS_SERVICE_API_URL = "http://localhost:8081";
		process.env.NEXT_PUBLIC_ASSETS_SERVICE_API_URL = "http://localhost:8080";
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders the CreateSignal form correctly", () => {
		render(<CreateSignal />);

		// Check that the form fields are rendered
		expect(screen.getByText("Select Asset Pair")).toBeInTheDocument();
		expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Base Asset/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Quote Currency/i)).toBeInTheDocument();
		// expect(screen.getByLabelText(/Timeframe\/ Candles/i)).toBeInTheDocument();
		// expect(screen.getByLabelText(/Risk Level/i)).toBeInTheDocument();
		// expect(screen.getByLabelText(/Entry Price/i)).toBeInTheDocument();

		// Check that the buttons are rendered correctly
		// expect(screen.getByRole("button", { name: /Reset all signal/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled(); // Ensure disabled state

		// Simulate assets fetching and check for dynamic elements
		expect(screen.getByTestId("XRP")).toBeInTheDocument();
		expect(screen.getByTestId("Tether")).toBeInTheDocument();

		// Check for supported exchanges
		const supportedExchanges = screen.getByTestId("checkbox-data");
		expect(supportedExchanges).toHaveTextContent("Binance");
	});

	// it("displays success message on successful signal creation", async () => {
	// 	(useCreateSignal as jest.Mock).mockReturnValue({
	// 		mutate: mockMutate,
	// 		isError: false,
	// 		isPending: false,
	// 		isSuccess: true,
	// 		data: signalData,
	// 	});

	// 	render(<CreateSignal />);

	// 	// Simulate a successful mutation
	// 	const res = await waitFor(() => screen.getByTestId("message-modal"));
	// 	// Check the content inside the message modal
	// 	expect(res).toHaveTextContent("You have successfully created a new signal");
	// });

	it("displays error message on error signal creation", async () => {
		(useCreateSignal as jest.Mock).mockReturnValue({
			mutate: mockMutate,
			isError: true,
			isPending: false,
			error: { message: "Create Signal Error" },
			isSuccess: false,
			data: null,
		});

		render(<CreateSignal />);

		// Simulate a successful mutation
		const res = await waitFor(() => screen.getByTestId("toast-message"));
		// Check the content inside the message modal
		expect(res).toHaveTextContent("Create Signal Error");
	});
});
