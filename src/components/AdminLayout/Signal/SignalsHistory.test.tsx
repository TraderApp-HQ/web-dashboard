import React from "react";
import { render, screen } from "@testing-library/react";
import { useSignalHistory } from "~/apis/handlers/assets/hooks";
import SignalsHistory from "~/components/AdminLayout/Signal/SignalsHistory";
import { signalData as mockSignalData } from "~/components/AdminLayout/Signal/SignalData";
import type { PaginationProps } from "~/components/interfaces";
import { usePathname } from "next/navigation";

const signalData = mockSignalData.map((signal) => ({
	...signal,
	baseAssetName: signal.baseAsset.name,
	quoteCurrencyName: signal.quoteCurrency.name,
}));

jest.mock("~/apis/handlers/assets/hooks");

jest.mock("~/components/Pagination", () => {
	const MockPagination = ({
		currentPage,
		totalPages,
		totalRecord,
		rowsPerPage,
		setRowsPerPage,
		onNext,
		onPrev,
	}: PaginationProps) => (
		<div data-testid="mock-pagination">
			<button
				data-testid="mock-prev-btn"
				onClick={() => onPrev()}
				disabled={currentPage <= 1}
			>
				Prev
			</button>
			<button
				data-testid="mock-next-btn"
				onClick={() => onNext()}
				disabled={currentPage >= totalPages}
			>
				Next
			</button>
			<select
				data-testid="mock-rows-select"
				value={rowsPerPage}
				onChange={(e) => setRowsPerPage(Number(e.target.value))}
			>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
			</select>
			<span data-testid="mock-pagination-props">
				{JSON.stringify({ currentPage, totalPages, totalRecord, rowsPerPage })}
			</span>
		</div>
	);
	return {
		__esModule: true,
		default: MockPagination,
		ExamplePagination: () => <div data-testid="mock-example-pagination">Example</div>,
	};
});

jest.mock("next/navigation", () => {
	const actual = jest.requireActual("next/navigation");
	return {
		...actual,
		usePathname: jest.fn(),
	};
});

const mockUseSignalHistory = useSignalHistory as jest.MockedFunction<typeof useSignalHistory>;

describe("SignalsHistory Component", () => {
	beforeEach(() => {
		mockUseSignalHistory.mockReset();
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});
		(usePathname as jest.Mock).mockReturnValue("/admin/signal-management/history");
	});

	afterEach(() => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: window.innerWidth,
		});
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
			paginationData: {
				page: 1,
				totalPages: 1,
				totalRecords: 2,
				startAfterDoc: "",
			},
			handleSetCurrentPage: () => {},
			setRowsPerPage: () => {},
			rowsPerPage: 10,
		});

		render(<SignalsHistory />);
		expect(screen.getByPlaceholderText(/Search for asset name/i)).toBeInTheDocument();
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
			paginationData: {
				page: 1,
				totalPages: 1,
				totalRecords: 2,
				startAfterDoc: "",
			},
			handleSetCurrentPage: () => {},
			setRowsPerPage: () => {},
			rowsPerPage: 10,
		});

		render(<SignalsHistory />);
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
			paginationData: {
				page: 1,
				totalPages: 1,
				totalRecords: 2,
				startAfterDoc: "",
			},
			handleSetCurrentPage: () => {},
			setRowsPerPage: () => {},
			rowsPerPage: 10,
		});

		render(<SignalsHistory />);
		expect(screen.queryByTestId("table-loader")).not.toBeInTheDocument();
		expect(screen.queryByTestId("table-data")).not.toBeInTheDocument();
		const emptySignal = screen.queryByTestId("empty-signal");
		expect(emptySignal).toBeInTheDocument();
		expect(emptySignal).toHaveTextContent(/No Signal Available please try later/i);
	});
});
