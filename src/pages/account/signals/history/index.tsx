import SearchForm from "~/components/AccountLayout/SearchForm";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import data from "../data.json";
import FilterDropdown from "~/components/AccountLayout/FilterDropdown";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
// import {
// 	signalsHistoryDataTableMobileSelector,
// 	signalsHistoryDataTableSelector,
// } from "~/selectors/signals";
import Pagination from "~/components/Pagination";
import { NestedSignalsLayout } from "../";
import { useFetchSignalHistory } from "~/apis/handlers/signals/hooks/history";

const SignalsHistory = () => {
	// const signalHistory: SignalHistoryItem[] = data.signalHistory;

	// const { term: urlTerm } = useParams<{ term?: string }>();

	const [asset, setAsset] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	// const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");

	const {
		isLoading,
		isSuccess,
		signalHistory,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
	} = useFetchSignalHistory({});

	const onStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStartDate(event.target.value);
	};

	const onEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEndDate(event.target.value);
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("asset::::::::::::::::::", asset);
		console.log("createdAt::::::::::::::::::", startDate);
		console.log("selectedDate::::::::::::::::::", endDate);
	};

	const handleSearch = () => {
		// console.log("searchterm::::::::::::::::::", searchterm);
	};

	//  Paginaion configurations
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

	// Signal data pagination
	const paginatedData = signalHistory;

	const totalRecord = paginatedData.length; // Example total rows
	const totalPages = Math.ceil(totalRecord / rowsPerPage);

	// Calculate the rows to display
	// const startIndex = (currentPage - 1) * rowsPerPage;

	//===================================================================
	// paginatedSignalHistory is the data to be displayed on the current page
	// const paginatedSignalHistory = paginatedData.slice(startIndex, startIndex + rowsPerPage);
	//===================================================================

	React.useEffect(() => {
		// Reset to the first page when rowsPerPage changes
		setCurrentPage(1);
	}, [rowsPerPage]);

	// const { tableHead, tableBody } = signalsHistoryDataTableSelector(
	// 	paginatedSignalHistory /** signalHistory **/,
	// );
	// const dataMobile = signalsHistoryDataTableMobileSelector(
	// 	paginatedSignalHistory /** signalHistory **/,
	// );

	return (
		<>
			<div className={clsx("flex justify-between", signalHistory.length === 0 ? "mt-0" : "")}>
				<SearchForm
					// onChange={(e) => setSearchTerm(e.target.value)}
					onChange={(e) => {
						console.log(e.target.value);
					}}
					aria-label="search asset"
					placeHolder="Search for asset name, status, etc..."
					onSubmit={handleSearch}
				/>
				<FilterDropdown
					value={asset}
					setValue={setAsset}
					startDate={startDate}
					endDate={endDate}
					onStartDateChange={onStartDateChange}
					onEndDateChange={onEndDateChange}
					onSubmit={onSubmit}
					options={data.assets}
				/>
			</div>
			{signalHistory.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<div className="pb-8 rounded-2xl">
					<h3 className="font-semibold text-base text-[#08123B]">Resent Transaction</h3>
					<div className="mt-4 mb-8">
						<div className="hidden md:block overflow-x-auto p-2 bg-white rounded-2xl relative">
							{isLoading && <div>Loading...</div>}
							{isSuccess && signalsTableBody && (
								<DataTable
									tHead={signalsTableHead}
									tBody={signalsTableBody}
									hasActions={false}
								/>
							)}
						</div>
						<div className="md:hidden">
							{isLoading && <div>Loading...</div>}
							{isSuccess && signalsMobileTableBody && (
								<DataTableMobile data={signalsMobileTableBody} hasActions={false} />
							)}
						</div>
					</div>
					<div className="bg-white p-4 w-1/2 ml-auto">
						{/* pagination component goes here */}
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							rowsPerPage={rowsPerPage}
							totalRecord={totalRecord}
							setRowsPerPage={setRowsPerPage}
							onNext={setCurrentPage}
							onPrev={setCurrentPage}
						/>
					</div>
				</div>
			)}
		</>
	);
};

SignalsHistory.getLayout = (page: React.ReactElement) => (
	<NestedSignalsLayout>{page}</NestedSignalsLayout>
);
export default SignalsHistory;
