import type { TradeHistoryData } from "~/lib/types";
import data from "~/data/wallet/data.json";
import EmptyTransaction from "~/components/Wallet/EmptyTransaction";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import {
	tradeHistoryDataTableMobileSelector,
	tradeHistoryDataTableSelector,
} from "~/selectors/portfolio";
import React from "react";
import { NestedTradeCenterLayout } from "..";

const TradeHistory = () => {
	const res = data;
	const items: TradeHistoryData[] = res.tradeHistories;

	//  Paginaion configurations
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

	// Signal data pagination
	const paginatedData = items;

	const totalRecord = paginatedData.length; // Example total rows
	const totalPages = Math.ceil(totalRecord / rowsPerPage);

	// Calculate the rows to display
	const startIndex = (currentPage - 1) * rowsPerPage;

	//===================================================================
	// paginatedActiveSignal is the data to be displayed on the current page
	const paginatedItems = paginatedData.slice(startIndex, startIndex + rowsPerPage);
	//===================================================================

	React.useEffect(() => {
		// Reset to the first page when rowsPerPage changes
		setCurrentPage(1);
	}, [rowsPerPage]);

	const { tableHead, tableBody } = tradeHistoryDataTableSelector(
		paginatedItems ?? [] /** items */,
	);
	const dataMobile = tradeHistoryDataTableMobileSelector(paginatedItems /** items */);

	return (
		<div>
			<div className="my-6">
				<h2 className="flex-none text-[#08123B] font-bold py-3">Open Trades</h2>

				{items.length === 0 ? (
					<EmptyTransaction />
				) : (
					<div>
						<div className="mt-2 mb-8">
							<div className="hidden md:block md:overflow-hidden overflow-x-auto p-8 bg-white rounded-2xl relative">
								<DataTable
									hasActions={false}
									tHead={tableHead}
									tBody={tableBody}
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
							</div>
							<div className="md:hidden">
								<DataTableMobile
									hasActions={false}
									data={dataMobile}
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
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

TradeHistory.getLayout = (page: React.ReactElement) => (
	<NestedTradeCenterLayout>{page}</NestedTradeCenterLayout>
);
export default TradeHistory;
