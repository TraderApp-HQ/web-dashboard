import React from "react";
import { useFetchActiveSignals } from "~/apis/handlers/assets/hooks";
import SignalsEmptyState from "~/components/AccountLayout/SignalsEmptyState";
import PerformanceSummaryCard from "~/components/Cards/PerfomanceSummaryCard";
import ComponentError from "~/components/Error/ComponentError";
import MobileTableLoader from "~/components/Loaders/MobileTableLoader";
import PerformanceSummaryCardLoader from "~/components/Loaders/PerformanceSummaryCardLoader";
import TableLoader from "~/components/Loaders/TableLoader";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import { IActiveSignalCardProps } from "~/components/common/DataTable/config";
import { NestedSignalsLayout } from "../";
import { SignalStatus } from "~/apis/handlers/assets/enums";

const ActiveSignals = () => {
	// const { term: urlTerm } = useParams<{ term?: string }>();
	// const [searchterm, setSearchTerm] = useState<string>(urlTerm ?? "");

	const {
		isLoading,
		isError,
		isSuccess,
		activeSignals,
		signalsTableHead,
		signalsTableBody,
		signalsMobileTableBody,
		performanceSummary,
	} = useFetchActiveSignals({});

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
		<section className="space-y-5">
			{activeSignals.filter(
				(signal) =>
					signal.status === SignalStatus.ACTIVE ||
					(signal.status === SignalStatus.PAUSED && signal.isSignalTriggered),
			).length >= 2 && (
				<ActiveSignalCard
					summary={performanceSummary}
					isLoading={isLoading}
					isSuccess={isSuccess}
					isError={isError}
				/>
			)}

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
			) : !isLoading && isSuccess && activeSignals.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<section className="mt-2 mb-8">
					<section className="hidden md:block overflow-x-auto">
						{isSuccess && signalsTableBody && (
							<DataTable
								tHead={signalsTableHead}
								tBody={signalsTableBody}
								tableStyles="bg-white px-10"
								tableHeadStyles="bg-[#F3F4F6]"
								tableHeadItemStyles="text-center"
								showPagination={true}
								paginationProps={{
									currentPage,
									totalPages,
									rowsPerPage,
									totalRecord,
									setRowsPerPage,
									onNext: () => setCurrentPage((prev) => prev + 1),
									onPrev: () => setCurrentPage((prev) => prev - 1),
								}}
								paginationStyles="bg-[#F3F4F6] rounded-b-2xl py-2 px-4"
							/>
						)}
					</section>
					<section className="md:hidden relative">
						{isSuccess && (
							<DataTableMobile
								data={signalsMobileTableBody}
								showPagination={true}
								paginationProps={{
									currentPage,
									totalPages,
									rowsPerPage,
									totalRecord,
									setRowsPerPage,
									onNext: () => setCurrentPage((prev) => prev + 1),
									onPrev: () => setCurrentPage((prev) => prev - 1),
								}}
							/>
						)}
					</section>
				</section>
			)}
		</section>
	);
};
const ActiveSignalCard: React.FC<IActiveSignalCardProps> = ({
	summary,
	isLoading,
	isError,
	isSuccess,
}) => {
	return (
		<section>
			{isLoading ? (
				<PerformanceSummaryCardLoader />
			) : !isLoading && isError ? (
				<ComponentError />
			) : (
				!isLoading &&
				isSuccess && (
					<section className="flex flex-col md:flex-row gap-4">
						<PerformanceSummaryCard data={summary?.bestSignal} label="best performer" />
						<PerformanceSummaryCard
							data={summary?.worstSignal}
							label="worst performer"
						/>
					</section>
				)
			)}
		</section>
	);
};

ActiveSignals.getLayout = (page: React.ReactElement) => (
	<NestedSignalsLayout>{page}</NestedSignalsLayout>
);

export default ActiveSignals;
