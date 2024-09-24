import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSignalHistory } from "~/apis/handlers/assets/hooks";
import SignalsHistory from "./SignalsHistory";
import {
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
} from "~/selectors/signals";
import { format } from "date-fns";
import { signalData } from "./SignalData";

// Mock the useSignalHistory hook
jest.mock("~/apis/handlers/assets/hooks");

// Mock implementation of useSignalHistory
const mockUseSignalHistory = useSignalHistory as jest.MockedFunction<typeof useSignalHistory>;

describe("SignalsHistory Component", () => {
	beforeEach(() => {
		// Reset mock state before each test
		mockUseSignalHistory.mockReset();
	});

	test("renders SignalsHistory without crashing", () => {
		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: signalData,
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
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(signalData);
		const dataMobile = signalsHistoryDataTableMobileSelector(signalData);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: signalData,
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
			signalData.forEach((signal) => {
				expect(tableData).toHaveTextContent(signal.asset.name);
				expect(tableData).toHaveTextContent(signal.maxGain.toString());
				expect(tableData).toHaveTextContent(format(signal.createdAt, "dd MMM h:mm a"));
				expect(tableData).toHaveTextContent(format(signal.endedAt, "dd MMM h:mm a"));
			});
		});
	});

	test("pagination works correctly", () => {
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(signalData);
		const dataMobile = signalsHistoryDataTableMobileSelector(signalData);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: signalData,
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
