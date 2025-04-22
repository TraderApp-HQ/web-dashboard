import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSignalHistory } from "~/apis/handlers/assets/hooks";
import SignalsHistory from "~/components/AdminLayout/Signal/SignalsHistory";
import {
	signalsHistoryDataTableMobileSelector,
	signalsHistoryDataTableSelector,
} from "~/selectors/signals";
import { format } from "date-fns";
import { signalData as mockSignalData } from "~/components/AdminLayout/Signal/SignalData";
import type { PaginationProps } from "~/components/interfaces";

const signalData = mockSignalData.map((signal) => ({
	...signal,
	assetName: signal.asset.name,
	baseCurrencyName: signal.baseCurrency.name,
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

const mockUseSignalHistory = useSignalHistory as jest.MockedFunction<typeof useSignalHistory>;
function generateLargeSignalData(count: number) {
	return Array.from({ length: count }, (_, i) => ({
		...signalData[0],
		id: `signal-${i}`,
		asset: { ...signalData[0].asset, name: `Asset${i}` },
		baseCurrency: { ...signalData[0].baseCurrency, name: `Base${i}` },
		createdAt: `2024-08-13T14:44:05.${(100 + i).toString().padStart(3, "0")}Z`,
		endedAt: `2024-08-13T14:44:05.${(200 + i).toString().padStart(3, "0")}Z`,
		maxGain: i,
	}));
}

describe("SignalsHistory Table and Pagination Integration", () => {
	beforeEach(() => {
		mockUseSignalHistory.mockReset();
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: 1024,
		});
	});

	afterEach(() => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			configurable: true,
			value: window.innerWidth,
		});
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

		await waitFor(() => {
			signalData.slice(0, 10).forEach((signal) => {
				expect(tableData).toHaveTextContent(signal.asset.name);
				expect(tableData).toHaveTextContent(signal.maxGain.toString());
				expect(tableData).toHaveTextContent(format(signal.createdAt, "dd MMM h:mm a"));
				expect(tableData).toHaveTextContent(format(signal.endedAt, "dd MMM h:mm a"));
			});
		});
	});

	test("renders mocked Pagination component with correct initial props", () => {
		const totalRecords = signalData.length;
		const initialRowsPerPage = 10;
		const totalPages = Math.ceil(totalRecords / initialRowsPerPage);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: signalData,
			signalsTableHead: [],
			signalsTableBody: { tBodyRows: [] },
			signalsMobileTableBody: [],
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		const mockPaginations = screen.getAllByTestId("mock-pagination");
		expect(mockPaginations.length).toBe(2);

		const propsElement = screen.getAllByTestId("mock-pagination-props")[0];
		const props = JSON.parse(propsElement.textContent || "{}");

		expect(props).toEqual({
			currentPage: 1,
			totalPages: totalPages,
			totalRecord: totalRecords,
			rowsPerPage: initialRowsPerPage,
		});

		if (totalPages > 1) {
			expect(screen.getAllByTestId("mock-prev-btn")[0]).toBeDisabled();
			expect(screen.getAllByTestId("mock-next-btn")[0]).toBeEnabled();
		} else {
			expect(screen.getAllByTestId("mock-prev-btn")[0]).toBeDisabled();
			expect(screen.getAllByTestId("mock-next-btn")[0]).toBeDisabled();
		}
	});

	test("updates currentPage state when mock Pagination 'onNext' is triggered", async () => {
		const totalRecords = 25;
		const initialRowsPerPage = 10;
		const largeSignalData = generateLargeSignalData(totalRecords);
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(largeSignalData);
		const dataMobile = signalsHistoryDataTableMobileSelector(largeSignalData);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: largeSignalData,
			signalsTableHead: tableHead,
			signalsTableBody: tableBody,
			signalsMobileTableBody: dataMobile,
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		const nextButton = screen.getAllByTestId("mock-next-btn")[0];
		const prevButton = screen.getAllByTestId("mock-prev-btn")[0];

		expect(prevButton).toBeDisabled();

		fireEvent.click(nextButton);

		await waitFor(() => {
			expect(prevButton).toBeEnabled();
		});

		const propsElement = screen.getAllByTestId("mock-pagination-props")[0];
		const props = JSON.parse(propsElement.textContent || "{}");
		expect(props.currentPage).toBe(2);
		expect(props.rowsPerPage).toBe(initialRowsPerPage);
		expect(props.totalRecord).toBe(totalRecords);
		expect(props.totalPages).toBe(Math.ceil(totalRecords / initialRowsPerPage));
		if (props.currentPage < props.totalPages) {
			expect(nextButton).toBeEnabled();
		} else {
			expect(nextButton).toBeDisabled();
		}
	});

	test("updates currentPage state when mock Pagination 'onPrev' is triggered", async () => {
		const totalRecords = 25;
		const initialRowsPerPage = 10;
		const largeSignalData = generateLargeSignalData(totalRecords);
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(largeSignalData);
		const dataMobile = signalsHistoryDataTableMobileSelector(largeSignalData);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: largeSignalData,
			signalsTableHead: tableHead,
			signalsTableBody: tableBody,
			signalsMobileTableBody: dataMobile,
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		const nextButton = screen.getAllByTestId("mock-next-btn")[0];
		const prevButton = screen.getAllByTestId("mock-prev-btn")[0];

		fireEvent.click(nextButton);
		await waitFor(() => {
			expect(prevButton).toBeEnabled();
		});

		fireEvent.click(prevButton);

		await waitFor(() => {
			expect(prevButton).toBeDisabled();
		});

		const propsElement = screen.getAllByTestId("mock-pagination-props")[0];
		const props = JSON.parse(propsElement.textContent || "{}");
		expect(props.currentPage).toBe(1);
		expect(props.rowsPerPage).toBe(initialRowsPerPage);
		expect(props.totalRecord).toBe(totalRecords);
		expect(props.totalPages).toBe(Math.ceil(totalRecords / initialRowsPerPage));
		expect(nextButton).toBeEnabled();
	});

	test("updates rowsPerPage state and resets currentPage when mock Pagination 'setRowsPerPage' is triggered", async () => {
		const totalRecords = 25;
		const newRowsPerPage = 20;
		const largeSignalData = generateLargeSignalData(totalRecords);
		const { tableHead, tableBody } = signalsHistoryDataTableSelector(largeSignalData);
		const dataMobile = signalsHistoryDataTableMobileSelector(largeSignalData);

		mockUseSignalHistory.mockReturnValue({
			isLoading: false,
			isSuccess: true,
			signalHistory: largeSignalData,
			signalsTableHead: tableHead,
			signalsTableBody: tableBody,
			signalsMobileTableBody: dataMobile,
			isError: false,
			error: null,
		});

		render(<SignalsHistory />);

		const nextButton = screen.getAllByTestId("mock-next-btn")[0];
		const prevButton = screen.getAllByTestId("mock-prev-btn")[0];
		const rowsSelect = screen.getAllByTestId("mock-rows-select")[0];

		fireEvent.click(nextButton);
		await waitFor(() => {
			expect(prevButton).toBeEnabled();
		});
		expect(
			JSON.parse(screen.getAllByTestId("mock-pagination-props")[0].textContent || "{}")
				.currentPage,
		).toBe(2);

		fireEvent.change(rowsSelect, { target: { value: newRowsPerPage.toString() } });

		await waitFor(() => {
			expect(rowsSelect).toHaveValue(newRowsPerPage.toString());
			expect(prevButton).toBeDisabled();
		});

		const propsElement = screen.getAllByTestId("mock-pagination-props")[0];
		const props = JSON.parse(propsElement.textContent || "{}");
		expect(props.rowsPerPage).toBe(newRowsPerPage);
		expect(props.currentPage).toBe(1);
		expect(props.totalRecord).toBe(totalRecords);
		const expectedTotalPages = Math.ceil(totalRecords / newRowsPerPage);
		expect(props.totalPages).toBe(expectedTotalPages);
	});
});
