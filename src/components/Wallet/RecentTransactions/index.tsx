import { useEffect, useState } from "react";
import { DataTable, DataTableMobile } from "~/components/common/DataTable";
import data from "~/data/wallet/data.json";
import { IRecentTransactions } from "~/lib/types";
import {
	recentTransactionsDataTableMobileSelector,
	recentTransactionsDataTableSelector,
} from "~/selectors/wallets";
import EmptyTransaction from "../EmptyTransaction";

export default function RecentTransactions() {
	// Pagination
	const transactionsResult = data;
	const totalDocs = transactionsResult?.transactions.length;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = useState<number>(totalDocs > 10 ? 10 : totalDocs);
	const [tableData, setTableData] = useState<IRecentTransactions[]>([]);
	const paginationData = {
		currentPage,
		totalPages: Math.ceil(totalDocs / rowsPerPage),
		totalRecord: totalDocs,
		rowsPerPage,
		setRowsPerPage: (rows: number) => {
			if (rows !== rowsPerPage) {
				setRowsPerPage(rows);
				setCurrentPage(1); // Resets current page back to 1 anytime rowsPerPage is changed
			}
		},
		onNext: () => setCurrentPage((prev) => prev + 1),
		onPrev: () => setCurrentPage((prev) => prev - 1),
	};

	// Selectors
	const { tableHead, tableBody } = recentTransactionsDataTableSelector(tableData);
	const dataMobile = recentTransactionsDataTableMobileSelector(tableData);

	useEffect(() => {
		const start = rowsPerPage * (currentPage - 1);
		const end = start + rowsPerPage;
		setTableData(transactionsResult?.transactions.slice(start, end));
	}, [currentPage, rowsPerPage]);

	return (
		<section className="space-y-5">
			<h4 className="text-textColor text-base font-semibold leading-7">
				Recent Transactions
			</h4>
			{transactionsResult?.transactions.length === 0 ? (
				<EmptyTransaction />
			) : (
				<section className="mt-2 mb-8">
					<section className="hidden md:block py-4 px-8 bg-white rounded-2xl relative overflow-x-auto">
						<DataTable
							tHead={tableHead}
							tBody={tableBody}
							tableHeadItemStyles="text-left"
							showPagination
							paginationProps={paginationData}
						/>
					</section>
					<section className="md:hidden relative">
						<DataTableMobile
							data={dataMobile}
							showPagination
							paginationProps={paginationData}
						/>
					</section>
				</section>
			)}
		</section>
	);
}
