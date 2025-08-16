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
			{activeSignals.filter((signal) => signal.status === SignalStatus.ACTIVE).length >=
				2 && (
				<ActiveSignalCard
					summary={performanceSummary}
					isLoading={isLoading}
					isSuccess={isSuccess}
					isError={isError}
				/>
			)}

			{!isLoading && isError ? (
				<section className="pb-3 rounded-2xl space-y-2">
					<h3 className="font-bold text-base text-[#08123B]">All Active Signal</h3>
					<ComponentError />
				</section>
			) : !isLoading && isSuccess && activeSignals.length === 0 ? (
				<SignalsEmptyState />
			) : (
				<section className="pb-6 rounded-2xl">
					<h3 className="font-bold text-base text-[#08123B]">
						All Active Signal ({activeSignals.length})
					</h3>
					<section className="mt-2 mb-8">
						<section className="hidden md:block p-10 bg-white rounded-2xl relative overflow-x-auto">
							{isLoading && <TableLoader />}
							{isSuccess && signalsTableBody && (
								<DataTable
									tableStyles="mb-4"
									tHead={signalsTableHead}
									tBody={signalsTableBody}
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
						<section className="md:hidden relative">
							{isLoading && <MobileTableLoader />}
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
