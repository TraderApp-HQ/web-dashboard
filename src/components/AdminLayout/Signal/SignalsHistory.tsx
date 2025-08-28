import SearchForm from "~/components/AccountLayout/SearchForm";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import clsx from "clsx";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import FilterDropdown from "~/components/AccountLayout/FilterDropdown";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import TableLoader from "~/components/Loaders/TableLoader";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import { useSignalHistory } from "~/apis/handlers/assets/hooks";
import data from "~/pages/account/signals/data.json";
import ComponentError from "~/components/Error/ComponentError";

function SignalsHistory() {
	const {
		isLoading,
		isError,
		isSuccess,
		signalHistory,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		paginationData,
		rowsPerPage,
		setRowsPerPage,
		handleSetCurrentPage,
	} = useSignalHistory();
	// const { term: urlTerm } = useParams<{ term?: string }>();

	const [asset, setAsset] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	// const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");
	// const [rows, setRows] = useState<number>(10);

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
	const { page, totalPages, totalRecords } = paginationData;

	const paginationProps = {
		currentPage: page,
		totalPages,
		rowsPerPage,
		totalRecord: totalRecords,
		setRowsPerPage: setRowsPerPage,
		onNext: () => handleSetCurrentPage(paginationData.page + 1),
		onPrev: () => handleSetCurrentPage(paginationData.page - 1),
	};

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

			{isLoading ? (
				<>
					<div className="hidden md:block">
						<TableLoader />
					</div>
					<div className="md:hidden">
						<MobileTableLoader />
					</div>
				</>
			) : !isLoading && isError ? (
				<section className="pb-3 rounded-2xl">
					<ComponentError />
				</section>
			) : !isLoading && isSuccess && signalHistory.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<div className="mt-2 mb-8">
					<div className="hidden md:block overflow-x-auto">
						{isSuccess && signalsTableBody && (
							<DataTable
								tHead={signalsTableHead}
								tBody={signalsTableBody}
								tableStyles="bg-white px-10"
								tableHeadStyles="bg-[#F3F4F6]"
								tableHeadItemStyles="text-center"
								showPagination={true}
								paginationProps={paginationProps}
								paginationStyles="bg-[#F3F4F6] rounded-b-2xl py-2 px-4"
							/>
						)}
					</div>
					<div className="md:hidden relative">
						{isSuccess && (
							<DataTableMobile
								data={signalsMobileTableBody}
								showPagination={true}
								paginationProps={paginationProps}
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default SignalsHistory;
