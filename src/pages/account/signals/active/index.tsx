import clsx from "clsx";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import Button from "~/components/AccountLayout/Button";
import Date from "~/components/AccountLayout/Date";
import DropdownMenu, { DropdownMenuItem } from "~/components/AccountLayout/DropdownMenu";
import SearchForm from "~/components/AccountLayout/SearchForm";
import Select from "~/components/AccountLayout/Select";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import PerformanceSummaryCard from "~/components/Cards/PerfomanceSummaryCard";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import Pagination from "~/components/Pagination";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { IActiveSignalCardProps } from "~/components/common/DataTable/config";
import { NestedSignalsLayout } from "../";
import data from "../data.json";

const ActiveSignals = () => {
	// const { term: urlTerm } = useParams<{ term?: string }>();

	const [asset, setAsset] = useState<string>("");
	const [createdAt, setCreatedAt] = useState<string>("");
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [time, setTime] = useState<string>("");
	// const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");

	const {
		isLoading,
		isSuccess,
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		performanceSummary,
	} = useFetchActiveSignals({});
	const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSelectedDate(event.target.value);
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log("asset::::::::::::::::::", asset);
		console.log("createdAt::::::::::::::::::", createdAt);
		console.log("selectedDate::::::::::::::::::", selectedDate);
		console.log("time::::::::::::::::::", time);
	};

	const handleSearch = async () => {
		// console.log("searchterm::::::::::::::::::", searchterm);
	};

	//  Paginaion configurations
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
	const totalRecord = activeSignals.length; // Example total rows
	const totalPages = Math.ceil(totalRecord / rowsPerPage);

	// Calculate the rows to display
	// const startIndex = (currentPage - 1) * rowsPerPage;

	//===================================================================
	// paginatedActiveSignal is the data to be displayed on the current page
	// const paginatedActiveSignal = paginatedData.slice(startIndex, startIndex + rowsPerPage);
	//===================================================================

	React.useEffect(() => {
		// Reset to the first page when rowsPerPage changes
		setCurrentPage(1);
	}, [rowsPerPage]);

	return (
		<>
			<ActiveSignalCard summary={performanceSummary} isLoading={isLoading} />
			<div className={clsx("flex justify-between", activeSignals.length === 0 ? "mt-0" : "")}>
				<SearchForm
					// onChange={(e) => setSearchTerm(e.target.value)}
					onChange={(e) => {
						console.log(e);
					}}
					aria-label="search asset"
					placeHolder="Search for asset name, status, etc..."
					onSubmit={handleSearch}
				/>

				<DropdownMenu
					className="w-[256px]"
					subClass=""
					btnClass="mt-7 px-4 py-2 bg-gray-100 rounded-lg border"
					trigger={
						<>
							<div className="text-sky-900 text-base font-normal leading-snug">
								Filter
							</div>
							{/* <DropdownIcon /> */}
						</>
					}
					position="left"
				>
					<DropdownMenuItem className="flex flex-col gap-y-2">
						<form onSubmit={onSubmit} method="post">
							<Select
								name="assets"
								label="Assets"
								options={data.assets}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setAsset(e.target.value)}
								selected={{ value: asset }}
							/>
							<Select
								name="createdAt"
								label="CreatedAt"
								options={data.createdAtList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setCreatedAt(e.target.value)}
								selected={{ value: createdAt }}
							/>
							<Date
								label="Date"
								name="selectedDate"
								value={selectedDate}
								onChange={handleDateChange}
								required
							/>
							<Select
								name="time"
								label="Time"
								options={data.timeList}
								classNames={{
									input: "cursor-pointer",
								}}
								onChange={(e) => setTime(e.target.value)}
								selected={{ value: time }}
							/>
							<Button type="submit" onClick={() => {}} fluid className="mt-2">
								Search
							</Button>
						</form>
					</DropdownMenuItem>
				</DropdownMenu>
			</div>

			{!isLoading && activeSignals.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<div className="pb-8 rounded-2xl">
					<h3 className="font-bold text-base text-[#08123B]">
						All Active Signal ({activeSignals.length})
					</h3>
					<div className="mt-2 mb-8">
						<div className="hidden md:block p-10 bg-white rounded-2xl relative overflow-x-auto">
							{isLoading && <TableLoader />}
							{isSuccess && signalsTableBody && (
								<DataTable tHead={signalsTableHead} tBody={signalsTableBody} />
							)}
						</div>
						<div className="md:hidden relative">
							{isLoading && <MobileTableLoader />}
							{isSuccess && <DataTableMobile data={signalsMobileTableBody} />}
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
const ActiveSignalCard: React.FC<IActiveSignalCardProps> = ({ summary, isLoading }) => {
	return (
		<div>
			{isLoading ? (
				<PerformanceSummaryCardLoader />
			) : (
				<div className="flex flex-col md:flex-row gap-2">
					<PerformanceSummaryCard data={summary?.bestSignal} label="best performer" />
					<PerformanceSummaryCard data={summary?.worstSignal} label="worst performer" />
				</div>
			)}
		</div>
	);
};

ActiveSignals.getLayout = (page: React.ReactElement) => (
	<NestedSignalsLayout>{page}</NestedSignalsLayout>
);

export default ActiveSignals;
