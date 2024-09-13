import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSignalHistory } from "~/apis/handlers/assets/hooks";
import SignalsHistory from "./SignalsHistory";
import { Candlestick, SignalRisk, SignalStatus } from "~/apis/handlers/assets/enums";
import {
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
} from "~/selectors/signals";
import { format } from "date-fns";

// Mock the useSignalHistory hook
jest.mock("~/apis/handlers/assets/hooks");

// Mock implementation of useSignalHistory
const mockUseSignalHistory = useSignalHistory as jest.MockedFunction<typeof useSignalHistory>;
const signalHistory = [
	{
		id: "66bb7135e59f0544faca48fa",
		targetProfits: [
			{
				price: 200,
				percent: 1,
				isReached: false,
			},
			{
				price: 300,
				percent: 2,
				isReached: false,
			},
		],
		stopLoss: {
			price: 1000,
			percent: 1,
			isReached: false,
		},
		entryPrice: 8000,
		tradeNote: "first signal",
		candlestick: Candlestick.oneHour,
		risk: SignalRisk.low,
		isSignalTradable: true,
		chartUrl:
			"https://aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com/charts/f9b98a21-d47a-45e2-9c19-6c9ab48c1c0a.png",
		status: SignalStatus.INACTIVE,
		createdAt: "2024-08-13T14:44:05.376Z",
		endedAt: "2024-08-13T14:44:05.376Z",
		maxGain: 0,
		asset: {
			id: "52",
			name: "XRP",
			symbol: "XRP",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		baseCurrency: {
			id: "52",
			name: "XRP",
			symbol: "XRP",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		supportedExchanges: [
			{
				_id: "270",
				name: "Binance",
				logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
			},
		],
	},
	{
		id: "66bb7135e59f0544faca48fb",
		targetProfits: [
			{
				price: 400,
				percent: 1,
				isReached: false,
			},
			{
				price: 500,
				percent: 2,
				isReached: false,
			},
		],
		stopLoss: {
			price: 5000,
			percent: 1,
			isReached: false,
		},
		entryPrice: 8000,
		tradeNote: "second signal",
		candlestick: Candlestick.oneHour,
		risk: SignalRisk.low,
		isSignalTradable: true,
		chartUrl:
			"https://aws-s3-dev-assets-service.s3.eu-west-1.amazonaws.com/charts/f9b98a21-d47a-45e2-9c19-6c9ab48c1c0a.png",
		status: SignalStatus.INACTIVE,
		createdAt: "2024-08-13T14:44:05.376Z",
		endedAt: "2024-08-13T14:44:05.376Z",
		maxGain: 0,
		asset: {
			id: "52",
			name: "BTC",
			symbol: "BTC",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		baseCurrency: {
			id: "52",
			name: "BTC",
			symbol: "BTC",
			logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
		},
		supportedExchanges: [
			{
				_id: "270",
				name: "Binance",
				logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png",
			},
		],
	},
];

describe("SignalsHistory Component", () => {
	beforeEach(() => {
		// Reset mock state before each test
		mockUseSignalHistory.mockReset();
	});

	test("renders SignalsHistory without crashing", () => {
		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory,
			signalsTableHead: [],
			signalsTableBody: undefined,
			signalsMobileTableBody: [],
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);
		expect(screen.getByPlaceholderText(/Search for asset name/i)).toBeInTheDocument();
		expect(screen.getByText(/Resent Transaction/i)).toBeInTheDocument();
	});

	test("shows TableLoader when loading", () => {
		mockUseSignalHistory.mockReturnValue({
			isLoading: true,
			isSuccess: false,
			signalHistory: [],
			signalsTableHead: [],
			signalsTableBody: undefined,
			signalsMobileTableBody: [],
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);
		// Assuming there's a test ID for loaders
		expect(screen.getByTestId("table-loader")).toBeInTheDocument();
		expect(screen.queryByTestId("table-data")).not.toBeInTheDocument();
	});

	test("renders empty state when no signal history and not loading", () => {
		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: [],
			signalsTableHead: [],
			signalsTableBody: undefined,
			signalsMobileTableBody: [],
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
		expect(screen.queryByTestId("table-data")).not.toBeInTheDocument();
		const emptySignal = screen.queryByTestId("empty-signal");
		expect(emptySignal).toBeInTheDocument();
		expect(emptySignal).toHaveTextContent(/No Signal Available please try later/i);
	});

	test("renders DataTable and DataTableMobile when signal history exists", async () => {
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(signalHistory);
		const dataMobile = signalsHistoryDataTableMobileSelector(signalHistory);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory,
			signalsTableHead: tableHead,
			signalsTableBody: tableBody,
			signalsMobileTableBody: dataMobile,
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
		expect(screen.queryByTestId("empty-signal")).not.toBeInTheDocument();
		const tableData = screen.queryByTestId("table-data");
		const tableDataMobile = screen.queryByTestId("table-data-mobile");
		expect(tableData).toBeInTheDocument();
		expect(tableDataMobile).toBeInTheDocument();

		// Wait for data to be rendered
		await waitFor(() => {
			signalHistory.forEach((signal) => {
				expect(tableData).toHaveTextContent(signal.asset.name);
				expect(tableData).toHaveTextContent(signal.risk);
				expect(tableData).toHaveTextContent(
					format(signal.createdAt as string, "do MMMM yyyy"),
				);
				expect(tableData).toHaveTextContent(
					format(signal.endedAt as string, "do MMMM yyyy"),
				);
			});
		});
	});

	test("pagination works correctly", () => {
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(signalHistory);
		const dataMobile = signalsHistoryDataTableMobileSelector(signalHistory);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory,
			signalsTableHead: tableHead,
			signalsTableBody: tableBody,
			signalsMobileTableBody: dataMobile,
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		// Test initial pagination state
		const paginationData = screen.queryByTestId("pagination-data");
		expect(paginationData).toBeInTheDocument();

		expect(paginationData).toHaveTextContent("1"); // Current page
		expect(paginationData).toHaveTextContent("2"); // Total pages

		// check next/previous button state
		expect(screen.queryByTestId("next-btn")).toBeDisabled();
		expect(screen.queryByTestId("prev-btn")).toBeDisabled();
	});
});
